import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { Context } from "../../context/Context";
import { 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Box, 
  Paper,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  LockOpen as LockOpenIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Google as GoogleIcon,
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Lock as LockIcon
} from '@mui/icons-material';

export default function Login() {
  const navigate = useNavigate();
  const { dispatch } = useContext(Context);
  
  // Form states
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  // Toggle password visibility
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Form validation
  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('Username is required');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    dispatch({ type: "LOGIN_START" });

    try {


      const res = await axios.post("/api/auth/login", formData);
      
      console.log("Response received:", res.data);

      if (res.data.user && res.data.token) {
        localStorage.setItem("user", JSON.stringify(res.data));
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
        navigate("/");
      } else {
        throw new Error("Invalid response format");
      }
      
    } catch (err) {
      console.error("Login error details:", {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        url: err.config?.url
      });
      
      setError(
        err.response?.data?.message || 
        'Invalid username or password. Please try again.'
      );
      dispatch({ type: "LOGIN_FAILURE" });
    } finally {
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
      }}>
        {/* Left Side - Welcome Back Message */}
        <Box sx={{
          flex: 1,
          p: 4,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          color: 'white',
        }}>
          <LockOpenIcon sx={{ fontSize: 50, mb: 3 }} />
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Welcome Back!
          </Typography>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Ready to share your next story?
          </Typography>
          <Typography variant="body1">
            Sign in to continue your writing journey and connect with your readers.
            Your audience awaits!
          </Typography>
        </Box>

        {/* Right Side - Login Form */}
        <Box sx={{
          flex: 1,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          bgcolor: 'background.paper',
        }}>
          <Typography variant="h4" textAlign="center" gutterBottom>
            Sign In
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              name="username"
              label="Username"
              variant="outlined"
              margin="normal"
              value={formData.username}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
              disabled={loading}
              error={Boolean(error && error.includes('Username'))}
            />
            <TextField
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              margin="normal"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              disabled={loading}
              error={Boolean(error && error.includes('Password'))}
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
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
                'Sign In'
              )}
            </Button>
          </form>


          <Typography textAlign="center" color="text.secondary">
            Don't have an account?{' '}
            <Link to="/register" style={{ 
              color: '#2196F3', 
              textDecoration: 'none',
              fontWeight: 'bold'
            }}>
              Register
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
