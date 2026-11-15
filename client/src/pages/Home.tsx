import { useQuery } from '@apollo/client';
import { Box, CircularProgress, Container, Paper, Stack, Typography } from '@mui/material';
import { QUERY_RECIPES } from '../utils/queries';
import RecipeList from '../components/RecipeList';

const Home = () => {
  const { loading, data, error } = useQuery(QUERY_RECIPES, {
    fetchPolicy: 'network-only',
  });

  const recipes = data?.recipes || [];

  return (
    <Box component="section" sx={{ backgroundColor: '#f7f5ef' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Paper
          elevation={0}
          sx={{
            mb: { xs: 4, md: 6 },
            p: { xs: 3, sm: 4, md: 5 },
            overflow: 'hidden',
            borderRadius: 4,
            color: '#fffdf8',
            background:
              'radial-gradient(circle at 85% 20%, rgba(240,184,121,0.28), transparent 28%), linear-gradient(120deg, #253d32, #3e684e)',
          }}
        >
          <Typography
            variant="overline"
            sx={{ color: '#f0b879', fontWeight: 700, letterSpacing: '0.14em' }}
          >
            A little inspiration for your next meal
          </Typography>
          <Typography
            component="h1"
            variant="h2"
            sx={{
              mt: 1,
              maxWidth: 720,
              fontFamily: 'Georgia, serif',
              fontSize: { xs: '2.25rem', sm: '3rem', md: '3.5rem' },
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: '-0.035em',
            }}
          >
            Good food starts with a recipe worth keeping.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mt: 2,
              maxWidth: 600,
              color: 'rgba(255,253,248,0.82)',
              fontSize: { xs: '1rem', md: '1.1rem' },
            }}
          >
            Browse the community cookbook and discover something delicious to make today.
          </Typography>
        </Paper>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
          justifyContent="space-between"
          spacing={1}
          sx={{ mb: 2.5 }}
        >
          <Box>
            <Typography
              component="h2"
              variant="h4"
              sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, color: '#253d32' }}
            >
              Community recipes
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Tried, shared, and ready for your table.
            </Typography>
          </Box>
          {!loading && !error && (
            <Typography variant="body2" color="text.secondary">
              {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'}
            </Typography>
          )}
        </Stack>

        {loading ? (
          <Stack alignItems="center" spacing={2} sx={{ py: 8 }}>
            <CircularProgress color="primary" />
            <Typography color="text.secondary">Loading recipes…</Typography>
          </Stack>
        ) : error ? (
          <Paper
            role="alert"
            variant="outlined"
            sx={{ p: 3, borderColor: '#e5c4b8', color: '#8b452f', borderRadius: 3 }}
          >
            We couldn’t load the recipes right now. Please try again in a moment.
          </Paper>
        ) : recipes.length > 0 ? (
          <RecipeList recipes={recipes} />
        ) : (
          <Paper
            variant="outlined"
            sx={{ p: { xs: 3, sm: 5 }, textAlign: 'center', borderRadius: 3 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#253d32' }}>
              The cookbook is waiting for its first recipe.
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Sign in to add a favorite and get things cooking.
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default Home;
