import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Context } from "../../context/Context";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Header from "../../components/header/Header";
import Posts from "../../components/posts/Posts";
import Sidebar from "../../components/sidebar/Sidebar";
import SearchBar from "../../components/searchBar/SearchBar";
import Login from "../login/Login";
import { 
  Container, 
  Stack, 
  Box, 
  Typography, 
  CircularProgress,
  Paper,
  Fade,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const { search } = useLocation();
  const { user } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("/api/posts" + search);
        const sortedPosts = res.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPosts(sortedPosts);
        setSearchResults(null); // Reset search results when category changes
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [search]);

  // Handler for search results
  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  // Determine which posts to display
  const displayPosts = searchResults || posts;

  if (!user) {
    return <Login />;
  }

  return (
    <Fade in timeout={800}>
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      }}>
     
        
        {/* Hero Section */}
        <Box 
          sx={{ 
            background: 'linear-gradient(45deg, #2c3e50 30%, #3498db 90%)',
            color: 'white',
            py: { xs: 6, md: 10 },
            mb: 4
          }}
        >
          <Container maxWidth="lg">
            <Typography 
              variant="h2" 
              component="h1"
              sx={{
                fontWeight: 800,
                textAlign: 'center',
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                mb: 2
              }}
            >
              Blog Space
            </Typography>
            <Typography 
              variant="h5"
              sx={{
                textAlign: 'center',
                fontWeight: 300,
                color: 'rgba(255,255,255,0.9)',
                maxWidth: '800px',
                mx: 'auto',
                px: 2
              }}
            >
              Discover stories, ideas, and expertise from our community
            </Typography>
          </Container>
        </Box>

        {/* Search Bar Section */}
        <Container maxWidth="lg" sx={{ mb: 4 }}>
          <SearchBar onSearchResults={handleSearchResults} />
        </Container>

        <Container maxWidth="lg" sx={{ pb: 8 }}>
          {loading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              minHeight: '50vh'
            }}>
              <CircularProgress />
            </Box>
          ) : (
            <Stack 
              direction={{ xs: 'column', md: 'row' }} 
              spacing={4}
            >
              <Box 
                sx={{ 
                  flex: { xs: '1', md: '2' },
                  transition: 'all 0.3s ease',
                }}
              >
                <Posts posts={displayPosts} />
              </Box>
              
              {!isMobile && (
                <>
                  <Divider orientation="vertical" flexItem />
                  <Box sx={{ 
                    flex: '1',
                    position: 'sticky',
                    top: 20,
                    alignSelf: 'flex-start'
                  }}>
                    <Sidebar />
                  </Box>
                </>
              )}
            </Stack>
          )}
        </Container>
      </Box>
    </Fade>
  );
}
