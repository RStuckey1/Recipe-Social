import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Container,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { QUERY_RECIPE } from '../utils/queries';

const SingleRecipe = () => {
  const { recipeId } = useParams();
  const { loading, data, error } = useQuery(QUERY_RECIPE, {
    variables: { recipeId },
  });

  if (loading) {
    return (
      <Stack alignItems="center" spacing={2} sx={{ py: 10 }}>
        <CircularProgress />
        <Typography color="text.secondary">Opening the recipe…</Typography>
      </Stack>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Alert severity="error">We couldn’t load this recipe. Please try again.</Alert>
      </Container>
    );
  }

  const recipe = data?.recipe;
  if (!recipe) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Alert severity="info">This recipe could not be found.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, sm: 5, md: 7 } }}>
      <Paper
        variant="outlined"
        sx={{
          overflow: 'hidden',
          borderColor: '#e5e3d9',
          borderRadius: { xs: 3, sm: 4 },
          backgroundColor: '#fffefa',
        }}
      >
        <Box
          sx={{
            px: { xs: 2.5, sm: 5 },
            py: { xs: 3, sm: 5 },
            color: '#fffdf8',
            background:
              'radial-gradient(circle at 90% 15%, rgba(240,184,121,0.28), transparent 28%), linear-gradient(120deg, #253d32, #3e684e)',
          }}
        >
          <Typography
            variant="overline"
            sx={{ color: '#f0b879', fontWeight: 700, letterSpacing: '0.13em' }}
          >
            From the community cookbook
          </Typography>
          <Typography
            component="h1"
            variant="h2"
            sx={{
              mt: 1,
              fontFamily: 'Georgia, serif',
              fontSize: { xs: '2rem', sm: '2.75rem' },
              fontWeight: 700,
              lineHeight: 1.15,
              overflowWrap: 'anywhere',
            }}
          >
            {recipe.recipeName}
          </Typography>
          <Typography sx={{ mt: 1.5, color: 'rgba(255,253,248,0.82)' }}>
            Shared by {recipe.recipeAuthor?.username || 'A Gastro Book cook'}
          </Typography>
          <Typography sx={{ mt: 0.5, color: 'rgba(255,253,248,0.82)' }}>
            Serves {recipe.servingSize}
          </Typography>
        </Box>

        <Box sx={{ p: { xs: 2.5, sm: 5 } }}>
          <Typography variant="body1" sx={{ fontSize: '1.05rem', lineHeight: 1.8 }}>
            {recipe.recipeDescription}
          </Typography>
          {recipe.tags?.length > 0 && (
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 2 }}>
              {recipe.tags.map((tag: string) => (
                <Chip key={tag} label={tag} size="small" variant="outlined" />
              ))}
            </Stack>
          )}

          <Divider sx={{ my: { xs: 3, sm: 4 } }} />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '0.8fr 1.2fr' },
              gap: { xs: 3, md: 5 },
            }}
          >
            <Box>
              <Typography
                component="h2"
                variant="h5"
                sx={{ mb: 1.5, fontFamily: 'Georgia, serif', fontWeight: 700 }}
              >
                Ingredients
              </Typography>
              <List disablePadding>
                {recipe.ingredients.map((ingredient: string, index: number) => (
                  <ListItem key={`${ingredient}-${index}`} disableGutters sx={{ py: 0.75 }}>
                    <ListItemText
                      primary={ingredient}
                      primaryTypographyProps={{ color: 'text.secondary' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>

            <Box>
              <Typography
                component="h2"
                variant="h5"
                sx={{ mb: 1.5, fontFamily: 'Georgia, serif', fontWeight: 700 }}
              >
                Method
              </Typography>
              <List disablePadding>
                {recipe.instructions.map((instruction: string, index: number) => (
                  <ListItem key={`${instruction}-${index}`} disableGutters sx={{ py: 0.75 }}>
                    <ListItemText
                      primary={
                        <Stack direction="row" spacing={1.5} alignItems="flex-start">
                          <Typography
                            component="span"
                            sx={{ color: 'primary.main', fontWeight: 700, minWidth: 24 }}
                          >
                            {index + 1}.
                          </Typography>
                          <Typography component="span" sx={{ lineHeight: 1.65 }}>
                            {instruction}
                          </Typography>
                        </Stack>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default SingleRecipe;
