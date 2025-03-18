import { useState, useEffect, useRef } from 'react';
import { 
  Paper, 
  InputBase, 
  IconButton, 
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Popper,
  Grow,
  ClickAwayListener,
  CircularProgress
} from '@mui/material';
import { 
  Search as SearchIcon,
  Clear as ClearIcon 
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

export default function SearchBar({ onSearchResults }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  // Debounce function to prevent too many API calls
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  // Search function
  const performSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      onSearchResults(null);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`https://blog-api-na5i.onrender.com/api/posts/search?q=${query}`);
      const res = await response.json(); // Parse the JSON response
      console.log("Search results:", res); // Debug log
      setSearchResults(res);
      onSearchResults(res);
    } catch (err) {
      console.error("Search failed:", err);
      setSearchResults([]);
      onSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search
  const debouncedSearch = useRef(
    debounce((query) => performSearch(query), 300)
  ).current;

  // Handle input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      setShowResults(true);
      debouncedSearch(query);
    } else {
      handleClearSearch();
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
    onSearchResults(null); // Reset to show all posts
  };

  return (
    <Box sx={{ position: 'relative', width: { xs: '100%', sm: 400 }, mx: 'auto' }}>
      <Paper
        ref={searchRef}
        component="form"
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
          border: '1px solid rgba(0,0,0,0.1)',
        }}
        onSubmit={(e) => e.preventDefault()}
      >
        <SearchIcon sx={{ ml: 1, color: 'text.secondary' }} />
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search posts..."
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => setShowResults(true)}
        />
        {searchQuery && (
          <IconButton 
            size="small" 
            onClick={handleClearSearch}
            sx={{ color: 'text.secondary' }}
          >
            <ClearIcon />
          </IconButton>
        )}
      </Paper>

      {isLoading && (
        <Box sx={{ 
          position: 'absolute', 
          top: '100%', 
          left: 0, 
          right: 0,
          mt: 1,
          display: 'flex',
          justifyContent: 'center'
        }}>
          <CircularProgress size={24} />
        </Box>
      )}

      <Popper
        open={showResults && searchResults.length > 0}
        anchorEl={searchRef.current}
        placement="bottom-start"
        transition
        style={{ width: searchRef.current?.offsetWidth, zIndex: 1300 }}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper 
              sx={{ 
                mt: 1, 
                maxHeight: 400, 
                overflow: 'auto',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                border: '1px solid rgba(0,0,0,0.1)',
              }}
            >
              <ClickAwayListener onClickAway={() => setShowResults(false)}>
                <List>
                  {searchResults.map((post) => (
                    <ListItem 
                      key={post._id} 
                      component={Link}
                      to={`/post/${post._id}`}
                      sx={{
                        textDecoration: 'none',
                        color: 'inherit',
                        '&:hover': {
                          backgroundColor: 'rgba(0,0,0,0.04)'
                        }
                      }}
                    >
                      <ListItemText
                        primary={post.title}
                        secondary={post.desc}
                      />
                    </ListItem>
                  ))}
                </List>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  );
} 