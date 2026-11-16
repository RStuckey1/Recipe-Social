import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { Dialog } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RestaurantMenuOutlinedIcon from '@mui/icons-material/RestaurantMenuOutlined';
import { ADD_RECIPE, REMOVE_RECIPE } from '../utils/mutations';
import { GET_ME } from '../utils/queries';
import Auth from '../utils/auth';

interface RecipeForm {
  recipeName: string;
  recipeDescription: string;
  servingSize: string;
  ingredients: string;
  instructions: string;
  tags: string;
  imageUrl: string;
}

const emptyForm: RecipeForm = {
  recipeName: '',
  recipeDescription: '',
  servingSize: '',
  ingredients: '',
  instructions: '',
  tags: '',
  imageUrl: '',
};

const imageFileToDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onerror = () => reject(new Error('The image could not be read.'));
  reader.onload = () => {
    if (typeof reader.result !== 'string') {
      reject(new Error('The selected image is not valid.'));
      return;
    }

    const image = new Image();
    image.onerror = () => reject(new Error('The selected image could not be opened.'));
    image.onload = () => {
      const maxDimension = 1200;
      const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext('2d');
      if (!context) {
        reject(new Error('Your browser could not process this image.'));
        return;
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.82));
    };
    image.src = reader.result;
  };
  reader.readAsDataURL(file);
});

const splitItems = (value: string) => value.split(/[\n,]/).map((item) => item.trim()).filter(Boolean);

const Profile = () => {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<RecipeForm>(emptyForm);
  const [formError, setFormError] = useState('');
  const { loading, error, data } = useQuery(GET_ME, { skip: !Auth.loggedIn() });
  const [addRecipe, { loading: adding }] = useMutation(ADD_RECIPE, {
    refetchQueries: [{ query: GET_ME }],
  });
  const [removeRecipe] = useMutation(REMOVE_RECIPE, {
    refetchQueries: [{ query: GET_ME }],
  });
  const user = data?.me;

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFormError('');
    try {
      const imageUrl = await imageFileToDataUrl(file);
      setForm((current) => ({ ...current, imageUrl }));
    } catch (imageError) {
      setFormError(imageError instanceof Error ? imageError.message : 'The image could not be added.');
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');
    try {
      await addRecipe({
        variables: {
          input: {
            recipeName: form.recipeName.trim(),
            recipeDescription: form.recipeDescription.trim(),
            servingSize: form.servingSize.trim(),
            ingredients: splitItems(form.ingredients),
            instructions: splitItems(form.instructions),
            tags: splitItems(form.tags),
            imageUrl: form.imageUrl,
          },
        },
      });
      setForm(emptyForm);
      setDialogOpen(false);
    } catch (submitError) {
      setFormError(submitError instanceof Error ? submitError.message : 'Your recipe could not be saved.');
    }
  };

  const handleDelete = async (recipeId: string) => {
    try {
      await removeRecipe({ variables: { recipeId } });
    } catch (removeError) {
      setFormError(removeError instanceof Error ? removeError.message : 'The recipe could not be deleted.');
    }
  };

  if (!Auth.loggedIn()) {
    return (
      <main className="profile-page">
        <div className="profile-empty">
          <h2>Your kitchen is waiting</h2>
          <p>Log in to manage your recipes and share something with the community.</p>
          <button className="button button-primary" type="button" onClick={() => navigate('/login')}>Log in</button>
        </div>
      </main>
    );
  }
  if (loading) return <main className="profile-page"><div className="loading-state">Loading your kitchen...</div></main>;
  if (error) return <main className="profile-page"><div className="empty-state"><h3>Your recipes couldn’t load</h3><p>{error.message}</p></div></main>;

  const recipes = user?.recipes || [];

  return (
    <main className="profile-page">
      <section className="profile-heading">
        <div>
          <span className="eyebrow">Your personal cookbook</span>
          <h1>Welcome to your kitchen, {user?.username}.</h1>
          <p>Keep your favorites close and share a little inspiration with the community.</p>
        </div>
        <button className="button button-primary" type="button" onClick={() => { setFormError(''); setDialogOpen(true); }}>
          <AddIcon fontSize="small" /> Add a recipe
        </button>
      </section>

      <div className="section-heading">
        <div><h2>Your recipes</h2><p>{recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'} in your cookbook</p></div>
      </div>
      {recipes.length ? (
        <div className="profile-list">
          {recipes.map((recipe: {
            _id: string;
            recipeName: string;
            recipeDescription?: string;
            imageUrl?: string;
          }) => (
            <article className="profile-recipe" key={recipe._id}>
              <div className="profile-recipe-image">
                {recipe.imageUrl ? <img src={recipe.imageUrl} alt="" /> : <RestaurantMenuOutlinedIcon />}
              </div>
              <div>
                <h3>{recipe.recipeName}</h3>
                <p>{recipe.recipeDescription || 'A recipe from your kitchen'}</p>
              </div>
              <div className="profile-recipe-actions">
                <button className="text-button" type="button" onClick={() => navigate(`/recipe/${recipe._id}`)}>View recipe</button>
                <button className="text-button danger" type="button" onClick={() => handleDelete(recipe._id)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="profile-empty">
          <h2>Your cookbook starts here</h2>
          <p>Add your first recipe, then share it with cooks across the community.</p>
          <button className="button button-primary" type="button" onClick={() => setDialogOpen(true)}>Add your first recipe</button>
        </div>
      )}
      {formError && !dialogOpen && <p className="form-error" role="alert">{formError}</p>}

      <Dialog className="recipe-dialog" open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <form className="recipe-form" onSubmit={handleSubmit}>
          <h2>Share a recipe</h2>
          <p>Pass along something delicious from your kitchen.</p>
          <label>Recipe name
            <input required value={form.recipeName} onChange={(event) => setForm({ ...form, recipeName: event.target.value })} placeholder="Sunday tomato pasta" />
          </label>
          <label>A little about it
            <textarea required value={form.recipeDescription} onChange={(event) => setForm({ ...form, recipeDescription: event.target.value })} placeholder="The story or flavor that makes it special..." />
          </label>
          <label>Servings
            <input required value={form.servingSize} onChange={(event) => setForm({ ...form, servingSize: event.target.value })} placeholder="Serves 4" />
          </label>
          <label>Ingredients <span>Separate items with commas or new lines.</span>
            <textarea required value={form.ingredients} onChange={(event) => setForm({ ...form, ingredients: event.target.value })} placeholder={'2 tbsp olive oil\n3 cloves garlic'} />
          </label>
          <label>Instructions <span>Put each step on a new line.</span>
            <textarea required value={form.instructions} onChange={(event) => setForm({ ...form, instructions: event.target.value })} placeholder="Warm the olive oil..." />
          </label>
          <label>Tags <span>Optional: weeknight, vegetarian, dessert...</span>
            <input value={form.tags} onChange={(event) => setForm({ ...form, tags: event.target.value })} placeholder="Weeknight, vegetarian" />
          </label>
          <label>Add a food photo <span>Optional — a photo makes your recipe shine.</span>
            <div className="upload-control">
              <div className="upload-preview">
                {form.imageUrl ? <img src={form.imageUrl} alt="Recipe preview" /> : <RestaurantMenuOutlinedIcon />}
              </div>
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </div>
          </label>
          {formError && <div className="form-error" role="alert">{formError}</div>}
          <div className="dialog-actions">
            <button className="text-button" type="button" onClick={() => setDialogOpen(false)}>Cancel</button>
            <button className="button button-primary" type="submit" disabled={adding}>{adding ? 'Sharing...' : 'Share recipe'}</button>
          </div>
        </form>
      </Dialog>
    </main>
  );
};

export default Profile;
