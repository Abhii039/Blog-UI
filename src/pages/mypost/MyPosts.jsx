import React, { useEffect, useState, useContext } from "react";
import { Context } from "../../context/Context";
import { Container, Box, Typography, CircularProgress, Stack } from "@mui/material";
import Posts from "../../components/posts/Posts";

export default function MyPosts() {
  const { user } = useContext(Context);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!user) return; // Ensure user is logged in
      try {
        const response = await fetch("https://blog-api-na5i.onrender.com/api/posts/userPosts", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: user.user.username, // Send the username in the request body
          }),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json(); // Parse the JSON response
        setUserPosts(data);
      } catch (err) {
        console.error("Failed to fetch user posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserPosts();
  }, [user]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
        My Posts
      </Typography>
      {userPosts.length === 0 ? (
        <Typography variant="body1">You have no posts yet.</Typography>
      ) : (
        <Stack spacing={4}>
          <Posts posts={userPosts} />
        </Stack>
      )}
    </Container>
  );
}
