import { useState, useEffect, useContext } from 'react';
import { Context } from "../../context/Context";
import axios from 'axios';
import { 
  Container, 
  Typography, 
  Box, 
  CircularProgress,
  Paper,
  Stack
} from '@mui/material';
import Posts from "../../components/posts/Posts";

export default function Favorites() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(Context);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await axios.get(`https://blog-api-na5i.onrender.com/api/users/${user.user._id}/favorites`);
        setPosts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [user]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

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
        <Typography 
          variant="h4" 
          sx={{ 
            mb: 4, 
            fontWeight: 700,
            color: '#2c3e50',
            textAlign: 'center'
          }}
        >
          Your Favorite Posts
        </Typography>
        
        {posts.length === 0 ? (
          <Typography 
            variant="body1" 
            textAlign="center" 
            color="text.secondary"
          >
            You haven't added any posts to your favorites yet.
          </Typography>
        ) : (
          <Posts posts={posts} />
        )}
      </Paper>
    </Container>
  );
} 