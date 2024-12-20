import { useState, useContext, useEffect } from "react";
import "./write.css";
import axios from "axios";
import { Context } from "../../context/Context";
import { 
  Container, 
  TextField, 
  Button, 
  Box, 
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import { AddPhotoAlternate as AddPhotoIcon } from '@mui/icons-material';
import { useLocation } from "react-router-dom"; // Import useLocation to get the query parameters

export default function Write() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useContext(Context);
  const location = useLocation(); // Get the current location
  const postId = new URLSearchParams(location.search).get("edit"); // Extract post ID from query parameters

  // Fetch post data if in edit mode
  useEffect(() => {
    const fetchPostData = async () => {
      if (postId) {
        try {
          const response = await axios.get(`https://blog-api-na5i.onrender.com/api/posts/${postId}`);
          const post = response.data;
          setTitle(post.title);
          setDesc(post.desc);
          setCategory(post.categories[0]); // Assuming categories is an array
          // You may want to fetch the image if needed
        } catch (err) {
          console.error("Error fetching post data:", err);
          setError("Failed to fetch post data");
        }
      }
    };

    fetchPostData();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let categoryResponse;
      var newCategoryResponse;
      if (category.trim()) {
        // Check if the category already exists
        const existingCategories = await axios.get("https://blog-api-na5i.onrender.com/api/categories");
        const existingCategory = existingCategories.data.find(cat => cat.name.toLowerCase() === category.toLowerCase());

        if (existingCategory) {
          // Use existing category ID
          categoryResponse = existingCategory;
        } else {
          // Create a new category
           newCategoryResponse = await axios.post("https://blog-api-na5i.onrender.com/api/categories", {
            name:  category.toLowerCase().trim(),
          });
          categoryResponse = newCategoryResponse.data;
        }
      }
        console.log("Response==",categoryResponse.name)
      // Prepare the new post object
      const newPost = {
        username: user?.user?.username,
        title,
        desc,
        categories: categoryResponse ? [categoryResponse.name] : [], // Use ID of the category
      };

      if (file) {
        const data = new FormData();
        const filename = Date.now() + file.name;
        data.append("name", filename);
        data.append("file", file);
        newPost.photo = filename; // Add photo filename to the post object

        // Upload the file
        await axios.post("https://blog-api-na5i.onrender.com/api/upload", data);
      }

      // Create or update the post
      let response;
      if (postId) {
        // Update existing post
        response = await axios.put(`https://blog-api-na5i.onrender.com/api/posts/${postId}`, newPost);
      } else {
        // Create new post
        response = await axios.post("https://blog-api-na5i.onrender.com/api/posts", newPost);
      }
      var Id = response.data._id;
      window.location.replace("/post/" + Id); // Redirect to the new or updated post
    } catch (err) {
      console.log("Error:", err); // Log the error
      setError(err.response?.data?.message || "Failed to create or update post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper 
        elevation={3}
        sx={{
          p: 4,
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(10px)'
        }}
      >
        {file && (
          <Box 
            sx={{
              width: '100%',
              height: '300px',
              overflow: 'hidden',
              borderRadius: 2,
              mb: 4
            }}
          >
            <img
              src={URL.createObjectURL(file)}
              alt="Post"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </Box>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="fileInput">
              <Button
                component="span"
                variant="outlined"
                startIcon={<AddPhotoIcon />}
                sx={{ mb: 2 }}
              >
                Add Image
              </Button>
            </label>
          </Box>

          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 3 }}
            required
          />

          <TextField
            fullWidth
            label="Category"
            variant="outlined"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            sx={{ mb: 3 }}
            required
          />

          <TextField
            fullWidth
            label="Tell your story..."
            multiline
            rows={8}
            variant="outlined"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            sx={{ mb: 3 }}
            required
          />

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              color: 'white',
              py: 1.5,
              px: 4
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Publish'
            )}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}