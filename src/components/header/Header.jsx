import React from 'react';
import { Link } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Container,
  Button,
  Stack
} from '@mui/material';
import { 
  Create as CreateIcon,
  Home as HomeIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import SearchBar from '../searchBar/SearchBar';

export default function Header() {
  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
          {/* Left Navigation */}
          <Stack direction="row" spacing={2}>
            <Button variant="text" color="inherit" component={Link} to="/">
              <HomeIcon />
            </Button>
            <Button variant="text" color="inherit" component={Link} to="/create">
              <CreateIcon />
            </Button>
            <Button variant="text" color="inherit" component={Link} to="/settings">
              <SettingsIcon />
            </Button>
          </Stack>

          {/* Centered Logo/Brand */}
          <Box sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Typography 
                variant="h5" 
                component="div"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #2c3e50 30%, #3498db 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  whiteSpace: 'nowrap'
                }}
              >
                Blog Space
              </Typography>
            </Link>
          </Box>

          {/* Search Bar */}
       
        </Toolbar>
      </Container>
    </AppBar>
  );
}
