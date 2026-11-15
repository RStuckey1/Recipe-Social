import { Alert, Button, Container, Paper, Typography } from '@mui/material';
import { Link, useRouteError } from 'react-router-dom';

interface RouteError {
  statusText?: string;
  message?: string;
}

export default function ErrorPage() {
  const error = useRouteError() as RouteError;

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 5, sm: 8 } }}>
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 3, sm: 5 },
          textAlign: 'center',
          borderColor: '#e5e3d9',
          borderRadius: 4,
          backgroundColor: '#fffefa',
        }}
      >
        <Typography
          component="h1"
          variant="h3"
          sx={{ mb: 1, color: '#253d32', fontFamily: 'Georgia, serif', fontWeight: 700 }}
        >
          A little kitchen detour
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          We couldn’t find the page you were looking for.
        </Typography>
        {(error.statusText || error.message) && (
          <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
            {error.statusText || error.message}
          </Alert>
        )}
        <Button component={Link} to="/" variant="contained" sx={{ borderRadius: 99, px: 3 }}>
          Back to recipes
        </Button>
      </Paper>
    </Container>
  );
}
