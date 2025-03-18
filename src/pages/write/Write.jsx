import { useState, useContext, useEffect } from "react";
import "./write.css";
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
  const [previewUrl, setPreviewUrl] = useState(null);
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
          const response = await fetch(`https://blog-api-na5i.onrender.com/api/posts/${postId}`);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const post = await response.json(); // Parse the JSON response
          setTitle(post.title);
          setDesc(post.desc);
          setCategory(post.categories[0]);
          setFile(post.photo); // Assuming categories is an array
        } catch (err) {
          console.error("Error fetching post data:", err);
          setError("Failed to fetch post data");
        }
      }
    };

    fetchPostData();
  }, [postId]);

  // Add this useEffect to handle file preview
  useEffect(() => {
    if (file && typeof file === 'object') {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Free memory when component unmounts or file changes
      return () => URL.revokeObjectURL(objectUrl);
    } else if (typeof file === 'string') {
      // If file is a URL string (in edit mode)
      setPreviewUrl(file);
    }
  }, [file]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let categoryResponse;
      var newCategoryResponse;
      if (category.trim()) {
        // Check if the category already exists
        const existingCategoriesResponse = await fetch("https://blog-api-na5i.onrender.com/api/categories");
        if (!existingCategoriesResponse.ok) {
          throw new Error("Network response was not ok");
        }
        const existingCategories = await existingCategoriesResponse.json(); // Parse the JSON response
        const existingCategory = existingCategories.find(cat => cat.name.toLowerCase() === category.toLowerCase());

        if (existingCategory) {
          // Use existing category ID
          categoryResponse = existingCategory;
        } else {
          // Create a new category
          newCategoryResponse = await fetch("https://blog-api-na5i.onrender.com/api/categories", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: category.toLowerCase().trim() }),
          });
          if (!newCategoryResponse.ok) {
            throw new Error("Failed to create new category");
          }
          categoryResponse = await newCategoryResponse.json(); // Parse the JSON response
        }
      }
      console.log("Response==", categoryResponse.name);

      // Prepare the new post object
      const newPost = {
        username: user?.user?.username,
        title,
        desc,
        categories: categoryResponse ? [categoryResponse.name] : [], // Use ID of the category
      };

      if (file) {
        const data = new FormData();
        data.append("image", file);
  
        try {
          const uploadResponse = await fetch("https://blog-api-na5i.onrender.com/api/upload", {
            method: 'POST',
            body: data,
          });
          if (!uploadResponse.ok) {
            throw new Error("File upload failed");
          }
          const uploadData = await uploadResponse.json(); // Parse the JSON response
          newPost.photo = uploadData.imageUrl; // Save the file ID from MongoDB
        } catch (uploadErr) {
          console.error("File upload error:", uploadErr); // Log the error message in more detail
          console.error("Response error:", uploadErr.response?.data); 
          throw new Error("File upload failed. Please try again.");
        }
      }

      // Create or update the post
      let response;
      if (postId) {
        // Update existing post
        response = await fetch(`https://blog-api-na5i.onrender.com/api/posts/${postId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newPost),
        });
      } else {
        // Create new post
        response = await fetch("https://blog-api-na5i.onrender.com/api/posts", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newPost),
        });
      }
      if (!response.ok) {
        throw new Error("Failed to create or update post");
      }
      const postData = await response.json(); // Parse the JSON response
      var Id = postData._id;
      window.location.replace("/post/" + Id); // Redirect to the new or updated post
    } catch (err) {
      console.log("Error:", err); // Log the error
      setError(err.message || "Failed to create or update post");
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
        {(file || previewUrl) && (
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
              src={previewUrl}
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
              onChange={(e) => {setFile(e.target.files[0]);}}
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