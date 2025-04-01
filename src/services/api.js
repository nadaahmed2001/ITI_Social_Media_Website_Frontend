import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzNTc0MTk5LCJpYXQiOjE3NDM0ODc3OTksImp0aSI6ImVhYjlkNTIzNWFmOTQ5OWM5ZDk5NWM2MzUxYzI1MDg2IiwidXNlcl9pZCI6MTV9.mrQjaiqsLu8m9OhztZS8ajCfcTyW5LtU6t37V8aI9MA"
  }
});

// Chat API functions
export const fetchUserChats = () => api.get("/chat/user_chats/");
export const fetchGroupChats = () => api.get("/chat/groups/"); // Fetch all group chats

export const fetchGroupMessages = (groupId) => api.get(`/chat/groups/${groupId}/messages/`);
export const fetchPrivateMessages = (receiverId) => api.get(`/chat/messages/${receiverId}/`);
export const sendGroupMessage = (groupId, content) => api.post(`/chat/groups/${groupId}/messages/`, { content });
export const sendPrivateMessage = (receiverId, content) => api.post(`/chat/messages/${receiverId}/`, { content });
export const fetchPrivateChatUsers = () => api.get("/chat/private_chat_users/");

// Other API functions
export const fetchPosts = () => api.get("/posts/");
export const createPost = (data) => api.post("/posts/", data);
export const likePost = (postId, reactionType) => api.post(`/posts/${postId}/react/`, { reaction_type: reactionType });
export const fetchComments = (postId) => api.get(`/posts/${postId}/comment/`);
export const addComment = (postId, data) => api.post(`/posts/${postId}/comment/`, data);

export const fetchNotifications = () => api.get("/notifications/");
export const markNotificationAsRead = (notificationId) => api.patch(`/notifications/${notificationId}/mark-as-read/`);
export const markAllNotificationsAsRead = () => api.patch(`/notifications/mark-all-as-read/`);

export default api;