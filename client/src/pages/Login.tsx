import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../utils/mutations';
import Auth from '../utils/auth';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container, TextField, Button, Typography, Card, CardContent, Alert } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3e684e',
    },
    secondary: {
      main: '#c66b3d',
    },
    background: {
      default: '#f7f5ef',
      paper: '#fffefa',
    },
    error: {
      main: '#a43e32',
    },
    text: {
      primary: '#26372e',
      secondary: '#68756b',
    },
  },
});

const Login = () => {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [login, { error, data }] = useMutation(LOGIN);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const { data } = await login({
        variables: { ...formState },
      });
      Auth.login(data.login.token);
    } catch (e) {
      console.error(e);
    }
    setFormState({
      email: '',
      password: '',
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm" sx={{ py: { xs: 4, sm: 7 }, minHeight: '70vh' }}>
        <Card
          variant="outlined"
          sx={{ overflow: 'hidden', borderColor: '#e5e3d9', borderRadius: 3 }}
        >
          <Typography
            variant="h4"
            component="div"
            sx={{
              backgroundColor: '#253d32',
              color: '#fffdf8',
              px: 3,
              py: 2.5,
              fontFamily: 'Georgia, serif',
              fontWeight: 700,
            }}
            align="center"
          >
            Welcome back
          </Typography>
          <CardContent>
            <Typography color="text.secondary" align="center" sx={{ mb: 2 }}>
              Log in to find your saved recipes.
            </Typography>
            {data ? (
              <Typography variant="body1" align="center">
                Success! Enjoy using the <Link to="/">GastroBook</Link>.
              </Typography>
            ) : (
              <form onSubmit={handleFormSubmit}>
                <TextField
                  label="Your email"
                  variant="outlined"
                  name="email"
                  type="email"
                  fullWidth
                  margin="normal"
                  value={formState.email}
                  onChange={handleChange}
                  required
                />
                <TextField
                  label="Password"
                  variant="outlined"
                  name="password"
                  type="password"
                  fullWidth
                  margin="normal"
                  value={formState.password}
                  onChange={handleChange}
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2, py: 1.25, borderRadius: 99, textTransform: 'none' }}
                >
                  Log in
                </Button>
              </form>
            )}

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error.message}
              </Alert>
            )}
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2.5 }}>
              New to Gastro Book? <Link to="/signup">Create an account</Link>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
