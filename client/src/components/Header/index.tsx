import { type MouseEvent } from 'react';
import Auth from '../../utils/auth';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';

import logo from '../../assets/logo_final.png';

const Header = () => {
  const navigate = useNavigate();

  const logout = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    Auth.logout();
  };

  return (
    <AppBar
      component="header"
      position="static"
      elevation={0}
      sx={{
        backgroundColor: '#253d32',
        color: '#fffdf8',
        borderBottom: '1px solid rgba(255,255,255,0.12)',
      }}
    >
      <Toolbar
        sx={{
          width: '100%',
          maxWidth: 1280,
          minHeight: { xs: 76, sm: 88 },
          mx: 'auto',
          px: { xs: 2, sm: 3 },
          py: 1.5,
          gap: { xs: 1.5, md: 3 },
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        <Box
          component={Link}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1, sm: 1.5 },
            color: 'inherit',
            textDecoration: 'none',
            minWidth: 0,
            flex: '1 1 270px',
          }}
        >
          <Box
            component="img"
            src={logo}
            alt=""
            sx={{
              width: { xs: 48, sm: 60 },
              height: { xs: 48, sm: 60 },
              objectFit: 'contain',
              flexShrink: 0,
              borderRadius: 2,
            }}
          />
          <Box sx={{ minWidth: 0 }}>
            <Typography
              component="span"
              sx={{
                display: 'block',
                fontFamily: 'Georgia, serif',
                fontSize: { xs: '1.35rem', sm: '1.65rem' },
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
              }}
            >
              Gastro Book
            </Typography>
            <Typography
              component="span"
              sx={{
                display: { xs: 'none', sm: 'block' },
                mt: 0.5,
                color: 'rgba(255,253,248,0.72)',
                fontSize: '0.82rem',
              }}
            >
              Your kitchen, beautifully organized.
            </Typography>
          </Box>
        </Box>

        <Box
          component="nav"
          aria-label="Main navigation"
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: { xs: 'center', sm: 'flex-end' },
            gap: 1,
            flex: '1 1 280px',
          }}
        >
          {Auth.loggedIn() ? (
            <>
              <Button
                component={Link}
                to="/"
                color="inherit"
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Browse recipes
              </Button>
              <Button
                onClick={() => navigate('/profile')}
                color="inherit"
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                My recipes
              </Button>
              <Button
                onClick={() => navigate('/profile', { state: { openAddRecipe: true } })}
                variant="contained"
                sx={{
                  px: 2,
                  borderRadius: 99,
                  color: '#253d32',
                  backgroundColor: '#f0b879',
                  textTransform: 'none',
                  fontWeight: 700,
                  '&:hover': { backgroundColor: '#f5c995' },
                }}
              >
                Add a recipe
              </Button>
              <Button
                onClick={logout}
                color="inherit"
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button
                component={Link}
                to="/login"
                color="inherit"
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Log in
              </Button>
              <Button
                component={Link}
                to="/signup"
                variant="contained"
                sx={{
                  px: 2.25,
                  borderRadius: 99,
                  color: '#253d32',
                  backgroundColor: '#f0b879',
                  textTransform: 'none',
                  fontWeight: 700,
                  '&:hover': { backgroundColor: '#f5c995' },
                }}
              >
                Sign up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
