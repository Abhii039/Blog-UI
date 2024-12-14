import React from 'react';
import Post from '../post/Post';
import { Box, Grid, Typography, Fade } from '@mui/material';

export default function Posts({ posts }) {
  if (!posts.length) {
    return (
      <Box 
        sx={{ 
          textAlign: 'center', 
          py: 8,
          background: 'rgba(255,255,255,0.8)',
          borderRadius: 2,
          backdropFilter: 'blur(10px)'
        }}
      >
        <Typography variant="h5" color="text.secondary">
          No posts found
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {posts.map((post, index) => (
        <Grid item xs={12} key={post._id || index}>
          <Fade in timeout={500 + index * 100}>
            <Box>
              <Post post={post} />
            </Box>
          </Fade>
        </Grid>
      ))}
    </Grid>
  );
}
