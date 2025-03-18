import { useContext, useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Context } from "../../context/Context";
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
import { jsPDF } from "jspdf";
import Comment from '../../components/comment/Comment';

export default function Single() {
  const location = useLocation();
  const path = location.pathname.split("/")[2];
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useContext(Context);
  const [isFavorite, setIsFavorite] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await fetch(`https://blog-api-na5i.onrender.com/api/posts/${path}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json(); // Parse the JSON response
        setPost(data);
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
        const userRes = await fetch(`https://blog-api-na5i.onrender.com/api/users/${user.user._id}`);
        if (!userRes.ok) {
          throw new Error("Network response was not ok");
        }
        const userData = await userRes.json(); // Parse the JSON response
        setIsFavorite(userData.favorites.includes(post._id));
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
        const response = await fetch("https://blog-api-na5i.onrender.com/api/categories");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const allCategories = await response.json(); // Parse the JSON response
      
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
        const response = await fetch(`https://blog-api-na5i.onrender.com/api/posts/${post._id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: user.user.username }),
        });
        if (!response.ok) {
          throw new Error("Failed to delete post");
        }
        window.location.replace("/");
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleFavorite = async () => {
    try {
      const response = await fetch(`https://blog-api-na5i.onrender.com/api/users/${user.user._id}/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId: post._id }),
      });
      if (!response.ok) {
        throw new Error("Failed to update favorites");
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadPDF = async () => {
    const doc = new jsPDF();
    
    // Set heading color to blue
    doc.setTextColor(52, 152, 219); // RGB for blue color
    doc.setFontSize(24);
    
    // Add heading "BlogSpace" centered
    const heading = "BlogSpace";
    const headingWidth = doc.getTextWidth(heading);
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.text(heading, (pageWidth - headingWidth) / 2, 10); // Center the heading
    
    // Reset color for title
    doc.setTextColor(0); // Reset to black for the title
    doc.setFontSize(20);
    doc.text(post.title, 10, 20); // Add title
    
    // Add image
    if (post.photo) {
      const imgData = await getImageData(`${post.photo}`);
      doc.addImage(imgData, 'JPEG', 10, 30, 180, 100); // Add image with specified dimensions
    }

    // Add description
    doc.setFontSize(12);
    doc.text(post.desc, 10, 140); // Add description
    
    // Save the PDF with the post title
    doc.save(`${post.title}.pdf`);
  };

  const getImageData = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous"; // Set CORS attribute
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imgData = canvas.toDataURL('image/jpeg');
        resolve(imgData);
      };
      img.onerror = (error) => reject(error);
    });
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

              {(post.username === user?.user?.username || user?.user?.username === "admin") && (
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
            <Button
              variant="contained"
              onClick={handleDownloadPDF}
              sx={{ mb: 2, backgroundColor: '#3498db', color: 'white' }}
            >
              Download PDF
            </Button>

            {/* Add Comment Component */}
            <Divider sx={{ my: 3 }} />
            <Comment postId={post._id} />
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}