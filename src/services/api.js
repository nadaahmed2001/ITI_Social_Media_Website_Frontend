import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Ensure credentials like cookies are sent
});

// Automatically set Authorization header before each request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token"); // Retrieve token from local storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Ensure the token is set (only if not already set)
if (!localStorage.getItem("access_token")) {
  localStorage.setItem(
    "access_token",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzNjkzODAyLCJpYXQiOjE3NDM2MDc0MDIsImp0aSI6ImZlMmRkYzYxZGQ4MjQzNzJiNzVhNTczNWNhMzg4NzhhIiwidXNlcl9pZCI6MTV9.06FWx8OmBKqp-KV0HiUYopZ9wXU7KB9wETeJJy7JKlY",
  );
}

// API functions
export const fetchPosts = () => api.get("/posts/");
export const createPost = (data) => api.post("/posts/", data);

export const likePost = (postId, reactionType) =>
  api.post(`/posts/${postId}/react/`, { reaction_type: reactionType });


// export const fetchComments = (postId) => api.get(`/posts/${postId}/comment/`);
// export const fetchComments = (postId) => api.get(`/posts/${postId}/comments/`);
export const fetchComments = (postId) => api.get(`/posts/${postId}/comments/`);
export const addComment = (postId, data) =>
  api.post(`/posts/${postId}/comment/`, data);
export const fetchNotifications = () => api.get("/notifications/");
export const markNotificationAsRead = (notificationId) =>
  api.patch(`/notifications/${notificationId}/mark-as-read/`);
export const markAllNotificationsAsRead = () =>
  api.patch("/notifications/mark-all-as-read/");
// Function to edit a post
export const editPost = (postId, updatedContent) => {
  return api.put(`${API_URL}/posts/${postId}/`, updatedContent);
};

// Function to delete a post
export const deletePost = (postId) => {
  return api.delete(`${API_URL}/posts/${postId}/`);
};

export default api;
