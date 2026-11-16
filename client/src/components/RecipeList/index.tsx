import { Link } from 'react-router-dom';
import RestaurantMenuOutlinedIcon from '@mui/icons-material/RestaurantMenuOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import RecipeSocialActions from '../RecipeSocialActions';

export interface RecipeSummary {
  _id: string;
  recipeName: string;
  recipeAuthor?: { _id: string; username: string };
  recipeDescription?: string;
  servingSize: string;
  tags?: string[];
  imageUrl?: string;
  voteCount?: number;
  hasVoted?: boolean;
}

interface RecipeListProps {
  recipes: RecipeSummary[];
}

const RecipeList = ({ recipes }: RecipeListProps) => {
  if (!recipes.length) {
    return (
      <div className="empty-state">
        <span className="empty-state-icon"><RestaurantMenuOutlinedIcon /></span>
        <h3>No recipes just yet</h3>
        <p>Be the first to share something delicious with the community.</p>
        <Link className="button button-primary" to="/profile">Add the first recipe</Link>
      </div>
    );
  }

  return (
    <div className="recipe-grid">
      {recipes.map((recipe) => (
        <article className="recipe-card" key={recipe._id}>
          <Link className="recipe-card-image" to={`/recipe/${recipe._id}`} aria-label={`View ${recipe.recipeName}`}>
            {recipe.imageUrl ? (
              <img src={recipe.imageUrl} alt={recipe.recipeName} loading="lazy" />
            ) : (
              <span className="image-placeholder"><RestaurantMenuOutlinedIcon /></span>
            )}
            {recipe.tags?.[0] && <span className="image-tag">{recipe.tags[0]}</span>}
          </Link>
          <div className="recipe-card-content">
            <div className="recipe-card-byline">
              <span className="avatar">{recipe.recipeAuthor?.username?.charAt(0).toUpperCase() || 'G'}</span>
              <span>by <strong>{recipe.recipeAuthor?.username || 'Gastro Book cook'}</strong></span>
            </div>
            <Link className="recipe-card-title" to={`/recipe/${recipe._id}`}>{recipe.recipeName}</Link>
            {recipe.recipeDescription && <p className="recipe-card-description">{recipe.recipeDescription}</p>}
            <div className="recipe-card-meta">
              <span><AccessTimeOutlinedIcon fontSize="inherit" /> {recipe.servingSize || 'A shared favorite'}</span>
            </div>
            {recipe.tags && recipe.tags.length > 1 && (
              <div className="tag-row">
                {recipe.tags.slice(1, 3).map((tag) => <span className="recipe-tag" key={tag}>{tag}</span>)}
              </div>
            )}
            <RecipeSocialActions
              recipeId={recipe._id}
              voteCount={recipe.voteCount || 0}
              hasVoted={Boolean(recipe.hasVoted)}
            />
          </div>
        </article>
      ))}
    </div>
  );
};

export default RecipeList;
