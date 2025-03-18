import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';

function App() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh" // Make the Box take the full height of the viewport
    >
      <Container>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          ITI Social Media App
        </Typography>
        <Box textAlign="center">
          <Button variant="contained" color="primary">
            Click Me
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default App;