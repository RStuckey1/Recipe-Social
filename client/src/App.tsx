import './App.css';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Outlet } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Header from './components/Header/index';
import Footer from './components/Footer/index';
import { Box } from '@mui/material';

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
    text: {
      primary: '#26372e',
      secondary: '#68756b',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
    button: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
});

// Construct our main GraphQL API endpoint
const httpLink = createHttpLink({
  uri: '/graphql',
});

// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('id_token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            backgroundColor: 'background.default',
            color: 'text.primary',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Header />
          <Box component="main" sx={{ flex: 1, width: '100%' }}>
            <Outlet />
          </Box>
          <Footer />
        </Box>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
