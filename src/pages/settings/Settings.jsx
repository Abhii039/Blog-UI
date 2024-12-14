import { useContext, useState, useEffect } from "react";
import { Context } from "../../context/Context";
import axios from "axios";
import { 
  Container, 
  Paper, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Avatar,
  Stack,
  Alert,
  CircularProgress,
  Divider,
  IconButton
} from '@mui/material';
import { PhotoCamera, Delete as DeleteIcon } from '@mui/icons-material';

export default function Settings() {
  const [file, setFile] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, dispatch } = useContext(Context);
  const PF = "https://blog-api-na5i.onrender.com/api/images/";

  useEffect(() => {
    if (user?.user) {
      setUsername(user.user.username || "");
      setEmail(user.user.email || "");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    dispatch({ type: "UPDATE_START" });

    try {
      const updatedUser = {
        userId: user.user._id,
        username,
        email,
        ...(password && { password }),
        favorites: user.user.favorites || []
      };

      if (file) {
        const data = new FormData();
        const filename = Date.now() + file.name;
        data.append("name", filename);
        data.append("file", file);
        updatedUser.profilePic = filename;
        
        try {
          await axios.post("https://blog-api-na5i.onrender.com/api/upload", data);
        } catch (err) {
          setError("Failed to upload profile picture");
          setLoading(false);
          return;
        }
      }

      const res = await axios.put("https://blog-api-na5i.onrender.com/api/users/" + user.user._id, updatedUser);
      setSuccess(true);
      dispatch({ type: "UPDATE_SUCCESS", payload: { ...user, user: res.data }});
    } catch (err) {
      dispatch({ type: "UPDATE_FAILURE" });
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        await axios.delete(`https://blog-api-na5i.onrender.com/api/users/${user.user._id}`);
        dispatch({ type: "LOGOUT" });
        window.location.replace("/");
      } catch (err) {
        setError("Failed to delete account");
      }
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper 
        elevation={3}
        sx={{
          p: 4,
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: 2
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{
            fontWeight: 600,
            color: '#2c3e50',
            textAlign: 'center',
            mb: 4
          }}
        >
          Account Settings
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3} alignItems="center">
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={file ? URL.createObjectURL(file) : PF + user?.user?.profilePic}
                sx={{ 
                  width: 120, 
                  height: 120,
                  border: '4px solid white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
              <input
                type="file"
                id="fileInput"
                style={{ display: 'none' }}
                onChange={(e) => setFile(e.target.files[0])}
                accept="image/*"
              />
              <label htmlFor="fileInput">
                <IconButton 
                  component="span"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: 'white',
                    '&:hover': { backgroundColor: '#f5f5f5' }
                  }}
                >
                  <PhotoCamera />
                </IconButton>
              </label>
            </Box>

            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              fullWidth
              label="New Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
            />

            {error && (
              <Alert severity="error" sx={{ width: '100%' }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ width: '100%' }}>
                Profile updated successfully!
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.5,
                px: 4,
                background: 'linear-gradient(45deg, #2c3e50 30%, #3498db 90%)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1a2634 30%, #2980b9 90%)'
                }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Update Profile"}
            </Button>

            <Divider sx={{ width: '100%', my: 2 }} />

            <Button
              onClick={handleDelete}
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              sx={{ mt: 2 }}
            >
              Delete Account
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}