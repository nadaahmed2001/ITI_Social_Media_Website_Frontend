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
      config.headers.Authorization = `Bearer ${token}`; // Corrected syntax
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
localStorage.setItem("access_token",  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzNjI2MzM3LCJpYXQiOjE3NDM1Mzk5MzcsImp0aSI6ImJjNmVhZjRkMTM1NDRlNTVhZWE5ODBiM2U4ZDNlMTE5IiwidXNlcl9pZCI6MTV9.r6NDnyCC6Vqv9LCxi1xVp78-W-FhWiy0dW4uyaAudIk");

// API functions
export const fetchPosts = () => api.get("/posts/");
export const createPost = (data) => api.post("/posts/", data);
export const likePost = (postId, reactionType) =>
  api.post(`/posts/${postId}/react/`, { reaction_type: reactionType });
export const fetchComments = (postId) => api.get(`/posts/${postId}/comment/`);
export const addComment = (postId, data) =>
  api.post(`/posts/${postId}/comment/`, data);

export const fetchNotifications = () => api.get("/notifications/");
export const markNotificationAsRead = (notificationId) =>
  api.patch(`/notifications/${notificationId}/mark-as-read/`);
export const markAllNotificationsAsRead = () =>
  api.patch("/notifications/mark-all-as-read/");

export default api;

// import axios from "axios";

// const API_URL = "http://127.0.0.1:8000/api"

// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     "Content-Type": "application/json",
//     "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzNTIxNzAxLCJpYXQiOjE3NDM0MzUzMDEsImp0aSI6ImViNzNiN2Q1NTVjYTRmNDJhMWMwYjlhYjU0YzI2ODFkIiwidXNlcl9pZCI6MTV9.PFtalWuxmDoIK9_RjizMhy9nQrICJ-t8T_Z0J7N3Oj4",
//     withCredentials: true,
//   }
// });



// // API functions
// export const fetchPosts = () => api.get("/posts/");
// export const createPost = (data) => api.post("/posts/", data);
// export const likePost = (postId, reactionType) => api.post(`/posts/${postId}/react/`, { reaction_type: reactionType });
// export const fetchComments = (postId) => api.get(`/posts/${postId}/comment/`);
// export const addComment = (postId, data) => api.post(`/posts/${postId}/comment/`, data);

// export const fetchNotifications = () => api.get("/notifications/");
// export const markNotificationAsRead = (notificationId) => api.patch(`/notifications/${notificationId}/mark-as-read/`);
// export const markAllNotificationsAsRead = () => api.patch(`/notifications/mark-all-as-read/`);

// export default api;

