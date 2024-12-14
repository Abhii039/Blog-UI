import React from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Paper, 
  Stack, 
  Avatar 
} from '@mui/material';

export default function AboutPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper 
        elevation={3}
        sx={{
          p: 4,
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: 2,
          backdropFilter: 'blur(10px)'
        }}
      >
        <Stack spacing={4} alignItems="center">
          <Avatar 
            src="https://i.pinimg.com/236x/1e/3f/58/1e3f587572a7a7b20bbf1828595a1786--holiday-party-themes-holiday-gift-guide.jpg"
            alt="About Us"
            sx={{
              width: 120,
              height: 120,
              border: '4px solid white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          />

          <Typography 
            variant="h3" 
            component="h1"
            sx={{
              fontWeight: 700,
              color: '#2c3e50',
              textAlign: 'center',
              mb: 2
            }}
          >
            About Us
          </Typography>

          <Typography 
            variant="body1" 
            sx={{
              color: '#555',
              lineHeight: 1.8,
              textAlign: 'center',
              maxWidth: '800px'
            }}
          >
            Welcome to our blogging website! We are a passionate team of writers dedicated to bringing you engaging and informative content on a variety of topics. Our mission is to provide valuable insights, tips, and inspiration to our readers, helping them navigate through different aspects of life.
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
}
