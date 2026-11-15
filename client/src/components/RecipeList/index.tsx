import { Box, Card, CardActionArea, CardContent, Chip, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

interface RecipeSummary {
  _id: string;
  recipeName: string;
  recipeAuthor: {
    _id: string;
    username: string;
  };
  servingSize: string;
  tags?: string[];
}

interface RecipeListProps {
  recipes: RecipeSummary[];
}

const RecipeList = ({ recipes }: RecipeListProps) => (
  <Box
    component="section"
    aria-label="All recipes"
    sx={{
      display: 'grid',
      gridTemplateColumns: {
        xs: '1fr',
        sm: 'repeat(2, minmax(0, 1fr))',
        lg: 'repeat(3, minmax(0, 1fr))',
      },
      gap: { xs: 2, sm: 2.5 },
      width: '100%',
    }}
  >
    {recipes.map((recipe) => (
      <Card
        key={recipe._id}
        variant="outlined"
        sx={{
          height: '100%',
          borderColor: '#e5e3d9',
          borderRadius: 3,
          backgroundColor: '#fffefa',
          transition: 'transform 160ms ease, box-shadow 160ms ease',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 12px 28px rgba(37, 61, 50, 0.1)',
          },
        }}
      >
        <CardActionArea
          component={Link}
          to={`/recipe/${recipe._id}`}
          sx={{ height: '100%', alignItems: 'stretch' }}
        >
          <CardContent sx={{ p: { xs: 2.25, sm: 2.75 } }}>
            <Stack spacing={1.25}>
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  color: '#253d32',
                  fontFamily: 'Georgia, serif',
                  fontWeight: 700,
                  lineHeight: 1.25,
                  overflowWrap: 'anywhere',
                }}
              >
                {recipe.recipeName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                By {recipe.recipeAuthor?.username || 'Gastro Book cook'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#47594b' }}>
                Serves {recipe.servingSize}
              </Typography>
              {recipe.tags && recipe.tags.length > 0 && (
                <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                  {recipe.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" variant="outlined" />
                  ))}
                </Stack>
              )}
              <Typography
                variant="body2"
                sx={{ pt: 0.5, color: '#3e684e', fontWeight: 700 }}
              >
                View recipe →
              </Typography>
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>
    ))}
  </Box>
);

export default RecipeList;
