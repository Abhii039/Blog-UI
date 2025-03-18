// Admin.js

import React, { useEffect, useState } from "react";
import "./admin.css"; // Importing CSS file
import { Link } from "react-router-dom";

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

  const allUser = users.map((user) => (
    <div key={user._id} className="user">
      <img src={PF + user.profilePic} alt="" className="img" />
      <div className="user-details">
        <div className="username">
          <Link to={`/?user=${user.username}`} className="link">
            <b>{user.username}</b>
          </Link>
        </div>
        <div>{new Date(user.createdAt).toDateString()}</div>
        <button className="delete-btn" onClick={() => handleDeleteUser(user._id)}>
          Delete
        </button>
      </div>
    </div>
  ));

  return (
    <div className="admin">
      {allUser.length === 0 ? (
        <h4><b>No User</b></h4>
      ) : (
        allUser
      )}
    </div>
  );
}
