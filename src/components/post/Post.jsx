import React from "react";
import { Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box, 
  Chip, 
  Stack,
  CardActionArea 
} from '@mui/material';
import { 
  AccessTime as AccessTimeIcon,
  LocalOffer as LocalOfferIcon 
} from '@mui/icons-material';

export default function Post({ post }) {
  const PF = "https://blog-api-na5i.onrender.com/images/";

  return (
    <Card 
      sx={{ 
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
        }
      }}
    >
      <CardActionArea 
        component={Link} 
        to={`/post/${post._id}`}
        sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' }
        }}
      >
        {post.photo && (
          <CardMedia
            component="img"
            sx={{
              width: { xs: '100%', sm: 280 },
              height: { xs: 200, sm: 280 },
              objectFit: 'cover'
            }}
            image={post.photo}
            alt={post.title}
          />
        )}
        
        <CardContent sx={{ flex: 1, p: 3 }}>
          <Stack spacing={2}>
            {/* Categories */}
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {post.categories.map((category, index) => (
                <Chip
                  key={index}
                  icon={<LocalOfferIcon />}
                  label={category.name}
                  size="small"
                  sx={{ 
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    color: 'white',
                    my: 0.5
                  }}
                />
              ))}
            </Stack>

            {/* Title */}
            <Typography 
              variant="h5" 
              component="h2"
              sx={{ 
                fontWeight: 600,
                color: '#1a237e',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {post.title}
            </Typography>

            {/* Description */}
            <Typography 
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {post.desc}
            </Typography>

            {/* Date */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                color: 'text.secondary',
                mt: 'auto'
              }}
            >
              <AccessTimeIcon sx={{ fontSize: 20, mr: 1 }} />
              <Typography variant="body2">
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
