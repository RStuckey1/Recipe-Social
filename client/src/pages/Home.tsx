import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AddIcon from '@mui/icons-material/Add';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import { QUERY_RECIPES } from '../utils/queries';
import RecipeList, { type RecipeSummary } from '../components/RecipeList';
import Auth from '../utils/auth';

const Home = () => {
  const { loading, error, data } = useQuery(QUERY_RECIPES);
  const recipes: RecipeSummary[] = data?.recipes || [];
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('All recipes');

  const tags = useMemo(() => {
    const uniqueTags = Array.from(new Set(recipes.flatMap((recipe) => recipe.tags || [])));
    return ['All recipes', ...uniqueTags.slice(0, 5)];
  }, [recipes]);
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = `${recipe.recipeName} ${recipe.recipeDescription || ''} ${recipe.recipeAuthor?.username || ''} ${(recipe.tags || []).join(' ')}`
      .toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (activeTag === 'All recipes' || recipe.tags?.includes(activeTag));
  });

  return (
    <main className="home-page">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><AutoAwesomeOutlinedIcon fontSize="small" /> A little inspiration for your table</span>
          <h1>Good food is<br /><em>better shared.</em></h1>
          <p>Discover the recipes people love, and share the ones that make your kitchen feel like home.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#community-recipes">Explore recipes</a>
            <Link className="button button-quiet" to={Auth.loggedIn() ? '/profile' : '/signup'}>
              <AddIcon fontSize="small" /> Share a recipe
            </Link>
          </div>
          <div className="hero-note"><span className="hero-note-dots">● ● ●</span> Made by home cooks, for home cooks</div>
        </div>
        <div className="hero-art" aria-label="Illustration of a colorful meal">
          <div className="hero-art-sun" />
          <div className="hero-art-circle">
            <div className="hero-art-food"><span>🍋</span><span>🥑</span><span>🍅</span><span>🌿</span><span>🥕</span></div>
          </div>
          <div className="hero-art-label">A table full of stories <span>↗</span></div>
        </div>
      </section>

      <section className="community-section" id="community-recipes">
        <div className="section-heading">
          <div>
            <span className="eyebrow">From our community</span>
            <h2>Find your next favorite</h2>
            <p>Fresh ideas and well-loved classics, shared by cooks like you.</p>
          </div>
          <div className="recipe-count">{recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'} to explore</div>
        </div>
        <div className="recipe-tools">
          <label className="search-field">
            <SearchOutlinedIcon />
            <input
              type="search"
              placeholder="Search recipes, cooks, ingredients..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search recipes"
            />
          </label>
          <div className="filter-row" aria-label="Filter by category">
            {tags.map((tag) => (
              <button
                type="button"
                key={tag}
                className={`filter-chip${activeTag === tag ? ' active' : ''}`}
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <div className="loading-state"><span className="loading-dot" /> Gathering something delicious...</div>
        ) : error ? (
          <div className="empty-state"><h3>We couldn’t load the recipes</h3><p>{error.message}</p></div>
        ) : (
          <RecipeList recipes={filteredRecipes} />
        )}
      </section>
    </main>
  );
};

export default Home;
