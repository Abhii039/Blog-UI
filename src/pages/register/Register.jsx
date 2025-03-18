import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Box, 
  Paper,
  Divider,
  IconButton,
  CircularProgress
} from '@mui/material';
import { 
  Create as CreateIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Google as GoogleIcon 
} from '@mui/icons-material';

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex
    return regex.test(email);
  };

  const validatePassword = (password) => {
    // Check for minimum length and at least one number and one letter
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/; // At least 6 characters, one letter and one number
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setEmailError("");
    setPasswordError("");
    setLoading(true);

    // Validate email and password
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 6 characters long and contain at least one letter and one number.");
      return;
    }

    try {
      const response = await fetch("https://blog-api-na5i.onrender.com/api/auth/register", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const res = await response.json();
      
      if (res) {
        window.location.replace("/login");
      }
    } catch (err) {
      console.log(err);
      setError("Registration failed. Please try again.");
    }finally{
      setLoading(false);
    }
  };

    
  return (
    <Container maxWidth="lg" sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      py: 4
    }}>
      <Paper elevation={3} sx={{
        display: 'flex',
        borderRadius: 4,
        overflow: 'hidden',
        width: '100%',
        maxWidth: 1000,
        minHeight: 600,
        position: 'relative',
      }}>
        {/* Left Side - Welcome Message */}
        <Box sx={{
          flex: 1,
          p: 4,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          color: 'white',
        }}>
          <CreateIcon sx={{ fontSize: 50, mb: 3 }} />
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Welcome to BlogSpace
          </Typography>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Join our community of writers and readers
          </Typography>
          <Typography variant="body1">
            Share your stories, ideas, and perspectives with readers worldwide.
            Start your blogging journey today!
          </Typography>
        </Box>

        {/* Right Side - Registration Form */}
        <Box sx={{
          flex: 1,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          bgcolor: 'background.paper',
        }}>
          <Typography variant="h4" textAlign="center" gutterBottom>
            Create Account
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              margin="normal"
              onChange={(e) => setUsername(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              onChange={(e) => setEmail(e.target.value)}
              error={!!emailError}
              helperText={emailError}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              onChange={(e) => setPassword(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
              sx={{ mb: 3 }}
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              size="large"
              sx={{
                borderRadius: 2,
                py: 1.5,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
                }
              }}
            >
               {loading ? (
                              <CircularProgress size={24} color="inherit" />
                            ) : (
                              'Sign Up'
                            )}
            </Button>
          </form>

          <Typography textAlign="center" color="text.secondary" sx={{ mt: 3 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ 
              color: '#2196F3', 
              textDecoration: 'none',
              fontWeight: 'bold'
            }}>
              Login
            </Link>
          </Typography>

          {error && (
            <Typography 
              color="error" 
              textAlign="center" 
              sx={{ mt: 2 }}
            >
              {error}
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
}