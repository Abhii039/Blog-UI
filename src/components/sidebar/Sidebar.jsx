import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Box, 
  Typography, 
  Paper, 
  Stack,
  Divider,
  Chip
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  Pinterest,
  GitHub,
  LocalOffer as CategoryIcon
} from '@mui/icons-material';

export default function Sidebar() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://blog-api-na5i.onrender.com/api/categories");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json(); // Parse the JSON response
        setCategories(data);
      } catch (err) {
        setError("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    navigate(`/?cat=${category.toLowerCase()}`, { replace: true });
  };

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3, 
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 2,
        backdropFilter: 'blur(10px)'
      }}
    >
      <Stack spacing={3}>
        {/* Categories */}
        <Box>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              mb: 2,
              color: '#2c3e50',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <CategoryIcon /> CATEGORIES
          </Typography>
          {loading ? (
            <Typography>Loading categories...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <Stack 
              direction="row" 
              spacing={1} 
              flexWrap="wrap" 
              useFlexGap 
              sx={{ gap: 1 }}
            >
              {categories.map((cat) => (
                <Chip 
                  key={cat._id}
                  label={cat.name}
                  onClick={() => handleCategoryClick(cat.name)}
                  clickable
                  sx={{
                    background: 'linear-gradient(45deg, #2c3e50 30%, #3498db 90%)',
                    color: 'white',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </Stack>
          )}
        </Box>

        <Divider />

        {/* Social Links */}
        <Box>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              mb: 2,
              color: '#2c3e50'
            }}
          >
            FOLLOW US
          </Typography>
          <Stack 
            direction="row" 
            spacing={2} 
            justifyContent="center"
          >
            {[
              { icon: <Facebook />, color: '#1877f2', url: '#' },
              { icon: <Twitter />, color: '#1da1f2', url: '#' },
              { icon: <Instagram />, color: '#e4405f', url: '#' },
              { icon: <Pinterest />, color: '#bd081c', url: '#' },
              { icon: <GitHub />, color: '#333', url: '#' }
            ].map((social, index) => (
              <Box 
                key={index}
                component="a"
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'text.secondary',
                  transition: 'all 0.2s',
                  '&:hover': {
                    color: social.color,
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                {social.icon}
              </Box>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}
