import { useContext, useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Context } from "../../context/Context";
import axios from "axios";
import { 
  Container, 
  Box, 
  Typography, 
  Paper,
  Chip,
  Stack,
  IconButton,
  Divider,
  Button,
  CircularProgress,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon
} from '@mui/icons-material';

export default function Single() {
  const location = useLocation();
  const path = location.pathname.split("/")[2];
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useContext(Context);
  const PF = "/api/images/";
  const [isFavorite, setIsFavorite] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await axios.get("/api/posts/" + path);
        setPost(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getPost();
  }, [path]);

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const userRes = await axios.get(`/api/users/${user.user._id}`);
        setIsFavorite(userRes.data.favorites.includes(post._id));
      } catch (err) {
        console.error(err);
      }
    };
    if (user && post._id) {
      checkFavorite();
    }
  }, [post._id, user]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        const allCategories = response.data;
      
        // Check if post.categories is defined and is an array
        if (Array.isArray(post.categories)) {
          // Filter categories based on the IDs in post.categories
          const postCategories = allCategories.filter(cat => post.categories.includes(cat._id));
       
          setCategories(postCategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [post.categories]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`/api/posts/${post._id}`, {
          data: { username: user.user.username },
        });
        window.location.replace("/");
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleFavorite = async () => {
    try {
      await axios.post(`/api/users/${user.user._id}/favorites`, {
        postId: post._id
      });
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '80vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper 
        elevation={3}
        sx={{
          overflow: 'hidden',
          borderRadius: 2,
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(10px)'
        }}
      >
        {post.photo && (
          <Box 
            sx={{
              width: '100%',
              height: { xs: '300px', md: '500px' },
              position: 'relative'
            }}
          >
            <img
              src={post.photo}
              alt={post.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </Box>
        )}

        <Box sx={{ p: { xs: 3, md: 5 } }}>
          <Stack spacing={3}>
            {/* Title and Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography 
                variant="h3" 
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: '#2c3e50',
                  fontSize: { xs: '2rem', md: '2.5rem' }
                }}
              >
                {post.title}
              </Typography>

              {post.username === user?.user?.username && (
                <Stack direction="row" spacing={1}>
                  <IconButton 
                    component={Link} 
                    to={`/write?edit=${post._id}`}
                    sx={{ color: '#3498db' }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    onClick={handleDelete}
                    sx={{ color: '#e74c3c' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              )}
            </Box>

            {/* Meta Information */}
            <Stack 
              direction="row" 
              spacing={3} 
              alignItems="center"
              divider={<Divider orientation="vertical" flexItem />}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <PersonIcon sx={{ color: '#7f8c8d' }} />
                <Typography color="text.secondary">
                  {post.username}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <AccessTimeIcon sx={{ color: '#7f8c8d' }} />
                <Typography color="text.secondary">
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>
              </Stack>
            </Stack>

            {/* Categories */}
            {categories.length > 0 && (
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {categories.map((category) => (
                  <Chip
                    key={category._id}
                    label={category.name}
                    size="small"
                    sx={{ 
                      background: 'linear-gradient(45deg, #2c3e50 30%, #3498db 90%)',
                      color: 'white',
                      my: 0.5
                    }}
                  />
                ))}
              </Stack>
            )}

            <Divider />

            {/* Content */}
            <Typography 
              variant="body1"
              sx={{
                color: '#2c3e50',
                lineHeight: 1.8,
                fontSize: '1.1rem'
              }}
            >
              {post.desc}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
                <IconButton 
                  onClick={handleFavorite}
                  sx={{ 
                    color: isFavorite ? '#e74c3c' : 'inherit',
                    '&:hover': { color: '#e74c3c' }
                  }}
                >
                  {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
              </Tooltip>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}
