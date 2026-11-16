import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RestaurantMenuOutlinedIcon from '@mui/icons-material/RestaurantMenuOutlined';
import { QUERY_RECIPE } from '../utils/queries';
import RecipeSocialActions from '../components/RecipeSocialActions';

const SingleRecipe = () => {
  const { recipeId } = useParams();
  const { loading, error, data } = useQuery(QUERY_RECIPE, { variables: { recipeId } });
  const recipe = data?.recipe;

  if (loading) return <main className="recipe-detail"><div className="loading-state">Finding that recipe...</div></main>;
  if (error) return <main className="recipe-detail"><div className="empty-state"><h3>We couldn’t open this recipe</h3><p>{error.message}</p><Link className="button button-primary" to="/">Back to discovery</Link></div></main>;
  if (!recipe) return <main className="recipe-detail"><div className="empty-state"><h3>Recipe not found</h3><p>It may have been removed or the link may be incorrect.</p><Link className="button button-primary" to="/">Explore recipes</Link></div></main>;

  return (
    <main className="recipe-detail">
      <Link className="back-link" to="/"><ArrowBackIcon fontSize="small" /> &nbsp; Back to discovery</Link>
      <section className="detail-hero">
        <div className="detail-hero-copy">
          {recipe.tags?.[0] && <span className="eyebrow">{recipe.tags[0]}</span>}
          <h1>{recipe.recipeName}</h1>
          <p>{recipe.recipeDescription}</p>
          <div className="detail-author">Shared by <strong>{recipe.recipeAuthor?.username || 'RecipeSocial cook'}</strong> · {recipe.servingSize}</div>
        </div>
        <div className="detail-hero-image">
          {recipe.imageUrl ? <img src={recipe.imageUrl} alt={recipe.recipeName} /> : <div className="image-placeholder"><RestaurantMenuOutlinedIcon /></div>}
        </div>
      </section>
      <section className="detail-content">
        <div>
          <h2>What you’ll need</h2>
          <ul className="ingredient-list">
            {recipe.ingredients?.map((ingredient: string, index: number) => <li key={`${ingredient}-${index}`}>{ingredient}</li>)}
          </ul>
          <h2 style={{ marginTop: 32 }}>How to make it</h2>
          <ol className="instruction-list">
            {recipe.instructions?.map((instruction: string, index: number) => <li key={`${instruction}-${index}`}>{instruction}</li>)}
          </ol>
        </div>
        <aside className="detail-aside">
          <h3>Pass it around</h3>
          <p style={{ margin: 0, color: '#748077', fontSize: 12, lineHeight: 1.6 }}>Loved this one? Give it a vote or share it with someone you’d cook for.</p>
          <RecipeSocialActions
            recipeId={recipe._id}
            voteCount={recipe.voteCount || 0}
            hasVoted={Boolean(recipe.hasVoted)}
          />
          {recipe.tags?.length > 0 && (
            <div className="detail-tags">{recipe.tags.map((tag: string) => <span className="recipe-tag" key={tag}>{tag}</span>)}</div>
          )}
        </aside>
      </section>
    </main>
  );
};

export default SingleRecipe;
