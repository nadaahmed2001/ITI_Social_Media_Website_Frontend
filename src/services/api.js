import axios from "axios";
const API_URL = "http://127.0.0.1:8000/api"

const api = axios.create({

  baseURL: API_URL,
  headers: {

    "Content-Type": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzODU5NjU4LCJpYXQiOjE3NDM3NzMyNTgsImp0aSI6IjFkZWY3MjNhOTRjMDQxOTk4MTRmNzU2ODRmNzY4MWFlIiwidXNlcl9pZCI6Mn0.XQExm_TKbZWP0Af4n8cCyW8Avb4F_ZzqYJ90jALlCT8"
  }

});



// API functions

// Fetch all posts
export const fetchPosts = () => api.get("/posts/");

// Create a new post
export const createPost = (data) => api.post("/posts/", data);

// Fetch comments for a post
export const fetchComments = (postId) => api.get(`/posts/${postId}/comments/`);

// Add a comment to a post
export const addComment = (postId, data) => api.post(`/posts/${postId}/comment/`, data);

// Fetch all notifications
export const fetchNotifications = () => api.get("/notifications/");

// Mark a specific notification as read
export const markNotificationAsRead = (notificationId) =>
  api.patch(`/notifications/${notificationId}/mark-as-read/`);

// Mark all notifications as read
export const markAllNotificationsAsRead = () =>
  api.patch("/notifications/mark-all-as-read/");

// Edit a post
export const editPost = (postId, updatedContent) => 
  api.put(`/posts/${postId}/`, updatedContent);

// Delete a post
export const deletePost = (postId) => 
  api.delete(`/posts/${postId}/`);

// Like a post
export const likePost = async (postId, reactionType) => {
  try {
    const response = await api.post(`/posts/${postId}/react/${reactionType}/`);
    return response.data;
  } catch (error) {
    console.error("Error liking post:", error.response?.data || error);
    throw error;
  }
};


// Fetch reactions for a specific post
export const fetchReactionsForPost = async (postId) => {
  try {
    const response = await api.get(`/posts/${postId}/reactions/`);
    return response.data; // Ensure this returns an array of reactions
  } catch (error) {
    console.error("API Error:", error.response?.data || error);
    return []; // Return empty array on error
  }
};

// Remove reaction from a post
export const removePostReaction = async (postId) => {
  try {
    const response = await api.post(`/posts/${postId}/react/remove/`);
    return response.data;
  } catch (error) {
    console.error("Error removing reaction:", error.response?.data || error);
    throw error;
  }
};

export default api;
