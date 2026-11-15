import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { TextField, Button, Card, CardHeader, CardContent, Typography, Box } from '@mui/material';
import { ADD_USER } from '../utils/mutations';
import Auth from '../utils/auth';

const Signup = () => {
  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [addUser, { error, data }] = useMutation(ADD_USER);

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
      const { data } = await addUser({
        variables: { input: { ...formState } },
      });

      Auth.login(data.addUser.token);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '70vh',
        px: 2,
        py: { xs: 4, sm: 7 },
      }}
    >
      <Card
        variant="outlined"
        sx={{
          maxWidth: 500,
          width: '100%',
          overflow: 'hidden',
          borderColor: '#e5e3d9',
          borderRadius: 3,
          backgroundColor: '#fffefa',
        }}
      >
        <CardHeader
          title="Create your account"
          subheader="Start building your personal cookbook."
          sx={{
            backgroundColor: '#253d32',
            color: '#fffdf8',
            textAlign: 'center',
            py: 2.5,
            '& .MuiCardHeader-subheader': { color: 'rgba(255,253,248,0.72)' },
            '& .MuiCardHeader-title': { fontFamily: 'Georgia, serif', fontWeight: 700 },
          }}
        />
        <CardContent>
          {data ? (
            <Typography variant="body1" textAlign="center">
              Success! Now you can enjoy the world of{' '}
              <Link to="/" style={{ color: '#FF964F', textDecoration: 'none' }}>
                GastroBook
              </Link>
            </Typography>
          ) : (
            <form onSubmit={handleFormSubmit}>
              <TextField
                fullWidth
                label="Your Username"
                name="username"
                required
                value={formState.username}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Your Email"
                name="email"
                type="email"
                required
                value={formState.email}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                required
                value={formState.password}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{
                  mt: 2,
                  py: 1.25,
                  borderRadius: 99,
                  textTransform: 'none',
                }}
              >
                Create account
              </Button>
            </form>
          )}

          {error && (
            <Typography role="alert" variant="body2" sx={{ mt: 2, p: 2, color: 'error.main' }}>
              {error.message}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 2.5 }}>
            Already a member? <Link to="/login">Log in</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Signup;
