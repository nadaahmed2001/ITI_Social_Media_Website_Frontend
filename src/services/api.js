import axios from "axios";
const API_URL = "http://127.0.0.1:8000/api"

const api = axios.create({

  baseURL: API_URL,
  headers: {

    "Content-Type": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzOTMxMDUzLCJpYXQiOjE3NDM4NDQ2NTMsImp0aSI6ImIwMzEzOWFhZDY5ZTRmMzZiNjNkMjZmYzNhNTc5N2Q1IiwidXNlcl9pZCI6Mn0.qxYK-P397B-qxMMQjicmU0QdtgSQcqGoU6xbOuCWbX4"
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
// Edit a comment
export const editComment = (postId,commentId, updatedContent) => 
  api.put(`/posts/comment/edit/${postId}/${commentId}/`, updatedContent);

// Delete a comment
export const deleteComment = (postId, commentId) => 
  api.delete(`/posts/comment/delete/${postId}/${commentId}/`, {
    data: { confirmation: true },
  });
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// ✅ Add a reaction to a comment
export const likeComment = async (commentId, reactionType) => {
  try {
    const response = await api.post(`/comment/${commentId}/react/${reactionType}/`);
    return response.data;
  } catch (error) {
    console.error("Error reacting to comment:", error.response?.data || error);
    throw error;
  }
};

// ✅ Fetch all reactions for a comment
export const fetchReactionsForComment = async (commentId) => {
  try {
    const response = await api.get(`/comment/${commentId}/reactions/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching comment reactions:", error.response?.data || error);
    return [];
  }
};

// ❌ FIX: You had `postId` as a parameter and wrong URL/method
// ✅ Remove a reaction from a comment
export const removeCommentReaction = async (commentId) => {
  try {
    const response = await api.post(`/comment/${commentId}/react/remove/`);
    return response.data;
  } catch (error) {
    console.error("Error removing comment reaction:", error.response?.data || error);
    throw error;
  }
};


export default api;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// import axios from "axios";
// const API_URL = "http://127.0.0.1:8000/api"

// const api = axios.create({

//   baseURL: API_URL,
//   headers: {

//     "Content-Type": "application/json",
//     "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzODc1Njc1LCJpYXQiOjE3NDM3ODkyNzUsImp0aSI6ImFmYzhjOGIwOGFkNjQwMzFiOTMwZDg3MmIxM2ZjZDIzIiwidXNlcl9pZCI6Mn0.X8s-Irsm8UMzbaigfyag2QRzP41nPpO92Yt5fscUmwc"
//   }

// });



// // API functions

// // Fetch all posts
// export const fetchPosts = () => api.get("/posts/");

// // Create a new post
// export const createPost = (data) => api.post("/posts/", data);

// // Fetch comments for a post
// export const fetchComments = (postId) => api.get(`/posts/${postId}/comments/`);

// // Add a comment to a post
// export const addComment = (postId, data) => api.post(`/posts/${postId}/comment/`, data);

// // Fetch all notifications
// export const fetchNotifications = () => api.get("/notifications/");

// // Mark a specific notification as read
// export const markNotificationAsRead = (notificationId) =>
//   api.patch(`/notifications/${notificationId}/mark-as-read/`);

// // Mark all notifications as read
// export const markAllNotificationsAsRead = () =>
//   api.patch("/notifications/mark-all-as-read/");

// // Edit a post
// export const editPost = (postId, updatedContent) => 
//   api.put(`/posts/${postId}/`, updatedContent);

// // Delete a post
// export const deletePost = (postId) => 
//   api.delete(`/posts/${postId}/`);
// // Edit a comment
// export const editComment = (postId,commentId, updatedContent) => 
//   api.put(`/posts/comment/edit/${postId}/${commentId}/`, updatedContent);

// // Delete a comment
// export const deleteComment = (postId, commentId) => 
//   api.delete(`/posts/comment/delete/${postId}/${commentId}/`, {
//     data: { confirmation: true },
//   });
// // Like a post
// export const likePost = async (postId, reactionType) => {
//   try {
//     const response = await api.post(`/posts/${postId}/react/${reactionType}/`);
//     return response.data;
//   } catch (error) {
//     console.error("Error liking post:", error.response?.data || error);
//     throw error;
//   }
// };


// // Fetch reactions for a specific post
// export const fetchReactionsForPost = async (postId) => {
//   try {
//     const response = await api.get(`/posts/${postId}/reactions/`);
//     return response.data; // Ensure this returns an array of reactions
//   } catch (error) {
//     console.error("API Error:", error.response?.data || error);
//     return []; // Return empty array on error
//   }
// };

// // Remove reaction from a post
// export const removePostReaction = async (postId) => {
//   try {
//     const response = await api.post(`/posts/${postId}/react/remove/`);
//     return response.data;
//   } catch (error) {
//     console.error("Error removing reaction:", error.response?.data || error);
//     throw error;
//   }
// };
// export default api;
