import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import Auth from '../../utils/auth';
import { TOGGLE_RECIPE_VOTE } from '../../utils/mutations';

interface RecipeSocialActionsProps {
  recipeId: string;
  voteCount: number;
  hasVoted: boolean;
}

const RecipeSocialActions = ({ recipeId, voteCount, hasVoted }: RecipeSocialActionsProps) => {
  const [toggleVote, { loading }] = useMutation(TOGGLE_RECIPE_VOTE);
  const [message, setMessage] = useState('');

  const handleVote = async () => {
    if (!Auth.loggedIn()) {
      setMessage('Log in to vote on recipes.');
      return;
    }

    setMessage('');
    try {
      await toggleVote({ variables: { recipeId } });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Your vote could not be saved.');
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/recipe/${recipeId}`;
    setMessage('');
    try {
      if (navigator.share) {
        await navigator.share({ title: 'A recipe from Gastro Book', url });
      } else {
        await navigator.clipboard.writeText(url);
        setMessage('Recipe link copied!');
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      setMessage('Could not share this recipe. Please copy the page link.');
    }
  };

  return (
    <div className="recipe-social">
      <button
        className={`social-button${hasVoted ? ' is-voted' : ''}`}
        type="button"
        onClick={handleVote}
        disabled={loading}
        aria-label={`${hasVoted ? 'Remove your vote from' : 'Vote for'} this recipe`}
      >
        <ThumbUpAltOutlinedIcon fontSize="small" />
        <span>{voteCount} {voteCount === 1 ? 'vote' : 'votes'}</span>
      </button>
      <button className="social-button" type="button" onClick={handleShare} aria-label="Share recipe">
        <ShareOutlinedIcon fontSize="small" />
        <span>Share</span>
      </button>
      {message && (
        <span className="social-message" role="status">
          {!Auth.loggedIn() && message.startsWith('Log in') ? <Link to="/login">{message}</Link> : message}
        </span>
      )}
    </div>
  );
};

export default RecipeSocialActions;
