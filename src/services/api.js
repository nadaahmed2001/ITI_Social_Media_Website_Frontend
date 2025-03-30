import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzNDM1MTkxLCJpYXQiOjE3NDMzNDg3OTEsImp0aSI6ImI5YzkzMjVjMDY1YjRhYzNiZjJiNTBlNDgyODZlYjlmIiwidXNlcl9pZCI6MTV9.BxdlzH0VCkxvf41iO7CEmb93Ul03g5Am_-f75FO7Rnw"
  }
});



// API functions
export const fetchPosts = () => api.get("/posts/");
export const createPost = (data) => api.post("/posts/", data);
export const likePost = (postId, reactionType) => api.post(`/posts/${postId}/react/`, { reaction_type: reactionType });
export const fetchComments = (postId) => api.get(`/posts/${postId}/comment/`);
export const addComment = (postId, data) => api.post(`/posts/${postId}/comment/`, data);

export const fetchNotifications = () => api.get("/notifications/");
export const markNotificationAsRead = (notificationId) => api.patch(`/notifications/${notificationId}/mark-as-read/`);
export const markAllNotificationsAsRead = () => api.patch(`/notifications/mark-all-as-read/`);

export default api;
