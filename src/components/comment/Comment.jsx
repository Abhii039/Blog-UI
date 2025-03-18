import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { Context } from '../../context/Context';
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
  Avatar,
  Paper,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from '@mui/icons-material';

export default function Comment({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const { user } = useContext(Context);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`https://blog-api-na5i.onrender.com/api/comments/${postId}`);
        if (!response.ok) throw new Error('Failed to fetch comments');
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  // Create new comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await fetch('https://blog-api-na5i.onrender.com/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          username: user.user.username,
          postId: postId,
        }),
      });

      if (!response.ok) throw new Error('Failed to create comment');
      const savedComment = await response.json();
      setComments([savedComment, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  // Delete comment
  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      const response = await fetch(`https://blog-api-na5i.onrender.com/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: user.user.username }),
      });

      if (!response.ok) throw new Error('Failed to delete comment');
      setComments(comments.filter(comment => comment._id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  // Edit comment
  const handleEdit = (comment) => {
    setEditingComment(comment);
    setEditContent(comment.content);
    setOpenDialog(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`https://blog-api-na5i.onrender.com/api/comments/${editingComment._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editContent,
          username: user.user.username,
        }),
      });

      if (!response.ok) throw new Error('Failed to update comment');
      const updatedComment = await response.json();
      setComments(comments.map(comment => 
        comment._id === updatedComment._id ? updatedComment : comment
      ));
      setOpenDialog(false);
      setEditingComment(null);
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  // Like/Unlike comment
  const handleLike = async (commentId) => {
    try {
      const response = await fetch(`https://blog-api-na5i.onrender.com/api/comments/${commentId}/like`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.user._id }),
      });

      if (!response.ok) throw new Error('Failed to update like status');
      const updatedComment = await response.json();
      setComments(comments.map(comment => 
        comment._id === commentId ? updatedComment : comment
      ));
    } catch (error) {
      console.error('Error updating like status:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Comments ({comments.length})
      </Typography>

      {/* Comment Form */}
      {user && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <form onSubmit={handleSubmit}>
            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                size="small"
              />
              <Button
                type="submit"
                variant="contained"
                disabled={!newComment.trim()}
                sx={{ backgroundColor: '#3498db' }}
              >
                <SendIcon />
              </Button>
            </Stack>
          </form>
        </Paper>
      )}

      {/* Comments List */}
      <Stack spacing={2}>
        {comments.map((comment) => (
          <Paper key={comment._id} sx={{ p: 2 }}>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Avatar sx={{ bgcolor: '#3498db' }}>
                {comment.username[0].toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {comment.username}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {comment.content}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleLike(comment._id)}
                    sx={{ color: comment.likes.includes(user?.user?._id) ? '#e74c3c' : 'inherit' }}
                  >
                    {comment.likes.includes(user?.user?._id) ? (
                      <FavoriteIcon fontSize="small" />
                    ) : (
                      <FavoriteBorderIcon fontSize="small" />
                    )}
                  </IconButton>
                  <Typography variant="caption" color="text.secondary">
                    {comment.likes.length} likes
                  </Typography>
                  {comment.username === user?.user?.username && (
                    <>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(comment)}
                        sx={{ color: '#3498db' }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(comment._id)}
                        sx={{ color: '#e74c3c' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </>
                  )}
                </Stack>
              </Box>
            </Stack>
          </Paper>
        ))}
      </Stack>

      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Comment</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained" sx={{ backgroundColor: '#3498db' }}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}