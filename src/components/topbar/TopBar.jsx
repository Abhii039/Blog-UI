import { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Context } from "../../context/Context";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Box,
  Container,
  Menu,
  MenuItem,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Facebook,
  Twitter,
  Pinterest,
  Instagram,
} from "@mui/icons-material";

export default function TopBar() {
  const { user, logout } = useContext(Context);
  const PF = "https://blog-api-na5i.onrender.com/images/";
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();

  // Menu states
  const [mobileMenu, setMobileMenu] = useState(null);
  const [userMenu, setUserMenu] = useState(null);

  const handleLogout = () => {
    logout();
    window.location.replace("/");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { label: "HOME", path: "/" },
    { label: "ABOUT", path: "/about" },
    { label: "WRITE", path: "/write" },
    ...(user ? [{ label: "MY POST", path: "/myposts" }] : []),
    ...(user ? [{ label: "FAVORITE", path: "/favorites" }] : []),
    ...(user?.user.username === "admin" ? [{ label: "ADMIN PANEL", path: "/admin" }] : []),
  ];

  

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Mobile Menu */}
          {isMobile && (
            <>
              <IconButton
                color="primary"
                onClick={(e) => setMobileMenu(e.currentTarget)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={mobileMenu}
                open={Boolean(mobileMenu)}
                onClose={() => setMobileMenu(null)}
              >
                {navItems.map((item) => (
                  <MenuItem 
                    key={item.path}
                    component={Link}
                    to={item.path}
                    onClick={() => setMobileMenu(null)}
                    sx={{
                      color: isActive(item.path) ? 'primary.main' : 'text.primary',
                      fontWeight: isActive(item.path) ? 600 : 400
                    }}
                  >
                    {item.label}
                  </MenuItem>
                ))}
                {user && (
                  <MenuItem onClick={handleLogout}>LOGOUT</MenuItem>
                )}
              </Menu>
            </>
          )}

          {/* Social Icons */}
          <Stack 
            direction="row" 
            spacing={1}
            sx={{ 
              display: { xs: 'none', md: 'flex' },
              mr: 3
            }}
          >
            <IconButton color="primary" size="small">
              <Facebook />
            </IconButton>
            <IconButton color="primary" size="small">
              <Twitter />
            </IconButton>
            <IconButton color="primary" size="small">
              <Pinterest />
            </IconButton>
            <IconButton color="primary" size="small" component={Link} to="/">
              <Instagram />
            </IconButton>
          </Stack>

          {/* Desktop Navigation */}
          <Box sx={{ 
            flexGrow: 1, 
            display: { xs: 'none', md: 'flex' },
            justifyContent: 'center'
          }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                sx={{
                  mx: 1,
                  color: isActive(item.path) ? 'primary.main' : 'text.primary',
                  fontWeight: isActive(item.path) ? 600 : 400,
                  '&:hover': {
                    backgroundColor: 'rgba(33, 150, 243, 0.08)'
                  }
                }}
              >
                {item.label}
              </Button>
            ))}
            {user && (
              <Button
                onClick={handleLogout}
                sx={{
                  mx: 1,
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'rgba(33, 150, 243, 0.08)'
                  }
                }}
              >
                LOGOUT
              </Button>
            )}
          </Box>

          {/* User Section */}
          <Box sx={{ flexGrow: 0 }}>
            {user ? (
              <>
                <IconButton
                  onClick={(e) => setUserMenu(e.currentTarget)}
                  sx={{ p: 0 }}
                >
                  <Avatar
                    alt={user.username}
                    src={user.user.profilePic} // Ensure this is correct
                    sx={{ width: 40, height: 40 }}
                  />
                </IconButton>
                <Menu
                  anchorEl={userMenu}
                  open={Boolean(userMenu)}
                  onClose={() => setUserMenu(null)}
                >
                  <MenuItem 
                    component={Link} 
                    to="/settings"
                    onClick={() => setUserMenu(null)}
                  >
                    Profile Settings
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Stack direction="row" spacing={1}>
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  color="primary"
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none'
                  }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  color="primary"
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  }}
                >
                  Register
                </Button>
              </Stack>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}