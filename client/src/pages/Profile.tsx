import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ADD_RECIPE, REMOVE_RECIPE } from '../utils/mutations';
import { GET_ME, GET_USER } from '../utils/queries';
import Auth from '../utils/auth';

interface RecipeDetails {
  recipeName: string;
  recipeDescription: string;
  servingSize: string;
  ingredients: string;
  instructions: string;
  tags: string[];
}

const emptyRecipe: RecipeDetails = {
  recipeName: '',
  recipeDescription: '',
  servingSize: '',
  ingredients: '',
  instructions: '',
  tags: [],
};

const Profile = () => {
  const { username: userParam } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, data } = useQuery(userParam ? GET_USER : GET_ME, {
    variables: { username: userParam },
  });
  const [addRecipe, { loading: addingRecipe, error: addRecipeError }] = useMutation(
    ADD_RECIPE,
    { refetchQueries: [{ query: GET_ME }] }
  );
  const [removeRecipe] = useMutation(REMOVE_RECIPE, {
    refetchQueries: [{ query: GET_ME }],
  });
  const [open, setOpen] = useState(false);
  const [recipeDetails, setRecipeDetails] = useState<RecipeDetails>(emptyRecipe);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (location.state?.openAddRecipe) {
      setOpen(true);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location, navigate]);

  const user = data?.me || data?.user;

  if (Auth.loggedIn() && userParam && Auth.getProfile().data.username === userParam) {
    return <Navigate to="/profile" replace />;
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography color="text.secondary">Loading your recipe book…</Typography>
      </Container>
    );
  }

  if (!user?.username) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Alert severity="info">
          You need to be logged in to view your recipe book. Use the navigation links above
          to sign up or log in.
        </Alert>
      </Container>
    );
  }

  const handleClose = () => {
    if (!addingRecipe) {
      setOpen(false);
      setRecipeDetails(emptyRecipe);
      setValidationError('');
    }
  };

  const handleSubmit = async () => {
    const ingredients = recipeDetails.ingredients
      .split(',')
      .map((ingredient) => ingredient.trim())
      .filter(Boolean);
    const instructions = recipeDetails.instructions
      .split(',')
      .map((instruction) => instruction.trim())
      .filter(Boolean);

    if (
      !recipeDetails.recipeName.trim() ||
      !recipeDetails.recipeDescription.trim() ||
      !recipeDetails.servingSize.trim() ||
      ingredients.length === 0 ||
      instructions.length === 0
    ) {
      setValidationError('Add a name, description, serving size, at least one ingredient, and one instruction.');
      return;
    }

    setValidationError('');
    try {
      await addRecipe({
        variables: {
          input: {
            recipeName: recipeDetails.recipeName.trim(),
            recipeDescription: recipeDetails.recipeDescription.trim(),
            servingSize: recipeDetails.servingSize.trim(),
            ingredients,
            instructions,
            tags: recipeDetails.tags.filter(Boolean),
          },
        },
      });

      setRecipeDetails(emptyRecipe);
      setOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Unable to add recipe', error);
    }
  };

  const handleDelete = async (recipeId: string) => {
    try {
      await removeRecipe({ variables: { recipeId } });
    } catch (error) {
      console.error('Error deleting recipe', error);
    }
  };

  const recipes = user.recipes || [];

  return (
    <Container component="section" maxWidth="lg" sx={{ py: { xs: 4, md: 6 }, minHeight: '70vh' }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography
            variant="overline"
            sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: '0.12em' }}
          >
            Your kitchen collection
          </Typography>
          <Typography
            component="h1"
            variant="h3"
            sx={{
              fontFamily: 'Georgia, serif',
              fontWeight: 700,
              color: '#253d32',
              fontSize: { xs: '2rem', sm: '2.5rem' },
            }}
          >
            {userParam ? `${user.username}'s recipes` : 'My recipe book'}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.75 }}>
            {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'} saved
          </Typography>
        </Box>
        {!userParam && (
          <Button
            variant="contained"
            onClick={() => setOpen(true)}
            sx={{
              alignSelf: { xs: 'flex-start', sm: 'center' },
              borderRadius: 99,
              px: 2.5,
              py: 1.15,
              textTransform: 'none',
              fontWeight: 700,
            }}
          >
            Add a recipe
          </Button>
        )}
      </Stack>

      {recipes.length > 0 ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              lg: 'repeat(3, minmax(0, 1fr))',
            },
            gap: 2.5,
          }}
        >
          {recipes.map((recipe: any) => (
            <Card
              key={recipe._id}
              variant="outlined"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                borderColor: '#e5e3d9',
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ flex: 1 }}>
                <Typography
                  variant="h6"
                  sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, color: '#253d32' }}
                >
                  {recipe.recipeName}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {recipe.recipeDescription}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
                  Serves {recipe.servingSize}
                </Typography>
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2, gap: 1 }}>
                <Button
                  size="small"
                  onClick={() => navigate(`/recipe/${recipe._id}`)}
                  sx={{ textTransform: 'none' }}
                >
                  View recipe
                </Button>
                {!userParam && (
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(recipe._id)}
                    sx={{ textTransform: 'none' }}
                  >
                    Delete
                  </Button>
                )}
              </CardActions>
            </Card>
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            p: { xs: 3, sm: 5 },
            textAlign: 'center',
            border: '1px dashed #c9d2c8',
            borderRadius: 3,
            backgroundColor: '#fffefa',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#253d32' }}>
            Your recipe book is ready.
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Add a favorite recipe and keep it close at hand.
          </Typography>
        </Box>
      )}

      {!userParam && (
        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth
          maxWidth="sm"
          PaperProps={{ sx: { borderRadius: 3, m: { xs: 1.5, sm: 3 } } }}
        >
          <DialogTitle sx={{ pb: 0.5, fontFamily: 'Georgia, serif', fontWeight: 700 }}>
            Add a recipe
          </DialogTitle>
          <DialogContent dividers sx={{ px: { xs: 2, sm: 3 } }}>
            {validationError && (
              <Alert severity="warning" sx={{ mt: 1, mb: 2 }}>
                {validationError}
              </Alert>
            )}
            {addRecipeError && (
              <Alert severity="error" sx={{ mt: 1, mb: 2 }}>
                {addRecipeError.message}
              </Alert>
            )}
            <TextField
              label="Recipe name"
              fullWidth
              required
              margin="normal"
              value={recipeDetails.recipeName}
              onChange={(event) =>
                setRecipeDetails({ ...recipeDetails, recipeName: event.target.value })
              }
            />
            <TextField
              label="Description"
              fullWidth
              required
              multiline
              minRows={2}
              margin="normal"
              value={recipeDetails.recipeDescription}
              onChange={(event) =>
                setRecipeDetails({ ...recipeDetails, recipeDescription: event.target.value })
              }
            />
            <TextField
              label="Serving size"
              fullWidth
              required
              margin="normal"
              value={recipeDetails.servingSize}
              onChange={(event) =>
                setRecipeDetails({ ...recipeDetails, servingSize: event.target.value })
              }
            />
            <TextField
              label="Ingredients"
              helperText="Separate each ingredient with a comma."
              fullWidth
              required
              multiline
              minRows={2}
              margin="normal"
              value={recipeDetails.ingredients}
              onChange={(event) =>
                setRecipeDetails({ ...recipeDetails, ingredients: event.target.value })
              }
            />
            <TextField
              label="Instructions"
              helperText="Separate each step with a comma."
              fullWidth
              required
              multiline
              minRows={3}
              margin="normal"
              value={recipeDetails.instructions}
              onChange={(event) =>
                setRecipeDetails({ ...recipeDetails, instructions: event.target.value })
              }
            />
            <TextField
              label="Tags"
              helperText="Optional; separate tags with commas."
              fullWidth
              margin="normal"
              value={recipeDetails.tags.join(', ')}
              onChange={(event) =>
                setRecipeDetails({
                  ...recipeDetails,
                  tags: event.target.value.split(',').map((tag) => tag.trim()),
                })
              }
            />
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button onClick={handleClose} disabled={addingRecipe} sx={{ textTransform: 'none' }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={addingRecipe}
              sx={{ borderRadius: 99, px: 2.5, textTransform: 'none' }}
            >
              {addingRecipe ? 'Saving…' : 'Save recipe'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default Profile;
