// Admin.js

import React, { useEffect, useState } from "react";
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import "./admin.css"; // Importing CSS file

export default function Admin() {
  const [users, setUsers] = useState([]);
  const PF = "http://localhost:5000/images/";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://blog-api-na5i.onrender.com/api/users/");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json(); // Parse the JSON response
        // Filter out the admin user
        const filteredUsers = data.filter(user => user.username !== "admin");
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`https://blog-api-na5i.onrender.com/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: "admin" }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      window.location.reload(); // Reloading the page after deletion
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>
      <Grid container spacing={3}>
        {users.length === 0 ? (
          <Typography variant="h6" color="text.secondary">
            No Users
          </Typography>
        ) : (
          users.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user._id}>
              <Card>
                <CardMedia
                  component="img"
                  height="100"
                  image={user.profilePic ? user.profilePic : "https://via.placeholder.com/140"}
                  alt={user.username}
                />
                <CardContent>
                  <Typography variant="h6" component="div">
                    <Link to={`/?user=${user.username}`} className="link">
                      {user.username}
                    </Link>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Joined on: {new Date(user.createdAt).toDateString()}
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="error" 
                    onClick={() => handleDeleteUser(user._id)} 
                    sx={{ mt: 2 }}
                  >
                    Delete
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
}
