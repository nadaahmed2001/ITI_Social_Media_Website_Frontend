import axios from "axios";

// Axios instance with base URL
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Automatically attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API functions
export const fetchPosts = () => api.get("/posts/");
export const createPost = (data) => api.post("/posts/", data);
export const fetchComments = (postId) => api.get(`/posts/${postId}/comments/`);
export const addComment = (postId, data) => api.post(`/posts/${postId}/comment/`, data);
export const fetchNotifications = () => api.get("/notifications/");
export const markNotificationAsRead = (notificationId) =>
  api.patch(`/notifications/${notificationId}/mark-as-read/`);
export const markAllNotificationsAsRead = () =>
  api.patch("/notifications/mark-all-as-read/");
export const clearNotification = (notificationId) => 
  api.delete(`/notifications/${notificationId}/`);

export const clearAllNotifications = () => 
  api.delete("/notifications/clear-all/");
export const editPost = (postId, updatedContent) => 
  api.put(`/posts/${postId}/`, updatedContent);
export const deletePost = (postId) => 
  api.delete(`/posts/${postId}/`);
export const editComment = (postId, commentId, updatedContent) => 
  api.put(`/posts/comment/edit/${postId}/${commentId}/`, updatedContent);
export const deleteComment = (postId, commentId) => 
  api.delete(`/posts/comment/delete/${postId}/${commentId}/`, {
    data: { confirmation: true },
  });

export const likePost = async (postId, reactionType) => {
  try {
    const response = await api.post(`/posts/${postId}/react/${reactionType}/`);
    return response.data;
  } catch (error) {
    console.error("Error liking post:", error.response?.data || error);
    throw error;
  }
};

export const fetchReactionsForPost = async (postId) => {
  try {
    const response = await api.get(`/posts/${postId}/reactions/`);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error);
    return [];
  }
};

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

