import { Box, Container, Link, Typography } from '@mui/material';

const Footer = () => (
  <Box
    component="footer"
    sx={{
      mt: 'auto',
      py: 3,
      backgroundColor: '#253d32',
      color: '#fffdf8',
    }}
  >
    <Container
      maxWidth="lg"
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1.5,
      }}
    >
      <Typography variant="body2" sx={{ color: 'rgba(255,253,248,0.82)' }}>
        Made for the recipes worth keeping.
      </Typography>
      <Typography variant="body2" sx={{ color: 'rgba(255,253,248,0.68)' }}>
        Recipe inspiration from{' '}
        <Link
          href="https://www.bbcgoodfood.com/recipes"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: '#f0b879', textUnderlineOffset: '3px' }}
        >
          BBC Good Food
        </Link>
      </Typography>
    </Container>
  </Box>
);

export default Footer;
