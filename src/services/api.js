import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzOTY4NjU4LCJpYXQiOjE3NDM4ODIyNTgsImp0aSI6IjNmZDEzN2RhMTVkNTRjZGE5ZTM3MGY2YjAxMTRmNmE3IiwidXNlcl9pZCI6NH0.attP3etscne7JkqU2zPSv-4t5VVpXeFiZum69LM90BY"
  }
});


const api2 = axios.create({
  baseURL: "http://127.0.0.1:8000/",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzOTY4NjU4LCJpYXQiOjE3NDM4ODIyNTgsImp0aSI6IjNmZDEzN2RhMTVkNTRjZGE5ZTM3MGY2YjAxMTRmNmE3IiwidXNlcl9pZCI6NH0.attP3etscne7JkqU2zPSv-4t5VVpXeFiZum69LM90BY"
  }
});
// Chat API functions
export const fetchPrivateChatUsers = () => api.get("/chat/private_chat_users/");
export const fetchGroupChats = () => api.get("/chat/groups/"); // Fetch all group chats

export const fetchGroupMessages = (groupId) => api.get(`/chat/groups/${groupId}/messages/`);
export const fetchPrivateMessages = (receiverId) => api.get(`/chat/messages/${receiverId}/`);

export const sendGroupMessage = (groupId, content) => api.post(`/chat/groups/${groupId}/messages/`, { content });
export const sendPrivateMessage = (receiverId, message) => api.post(`/chat/messages/${receiverId}/`, { message });

// New API functions
export const clearGroupChat = (groupId) => api.delete(`/chat/group-chats/${groupId}/clear/`);
export const clearPrivateChat = (receiverId) => api.delete(`/chat/private-chats/${receiverId}/clear/`);
export const editMessage = async (messageId, newContent) => {
    try {
        // Corrected endpoint for editing private messages
        const response = await api.put(`/chat/messages/${messageId}/edit/`, { content: newContent });
        return response;
    } catch (error) {
        console.error("Error editing message:", error);
        throw error;
    }
};
export const editGroupChat = async (groupId, messageId, newContent) => {
    try {
        // Corrected endpoint for editing group chat messages
        const response = await api.put(`/chat/groups/${groupId}/messages/${messageId}/edit/`, { content: newContent });
        return response;
    } catch (error) {
        console.error("Error editing group chat message:", error);
        throw error;
    }
};

export const deleteMessage = async (messageId, isGroupChat, groupId = null) => {
    try {
        // Determine the correct URL based on whether it's a group chat or private chat
        const url = isGroupChat
            ? `/chat/groups/${groupId}/messages/${messageId}/delete/` // Group chat endpoint
            : `/chat/messages/${messageId}/delete/`; // Private chat endpoint

        // Make the DELETE request
        const response = await api.delete(url);
        return response;
    } catch (error) {
        console.error("Error deleting message:", error);
        throw error;
    }
};

export const clearGroupMessages = async (groupId) => {
    const response = await api.delete(`/chat/group-chats/${groupId}/clear/`); // Corrected endpoint
    return response.data;
};

export const clearPrivateMessages = async (receiverId) => {
    const response = await api.delete(`/chat/private-chats/${receiverId}/clear/`); // Corrected endpoint
    return response.data;
};

// Other API functions




export const fetchPosts = () => api.get("/posts/");
export const createPost = (data) => api.post("/posts/", data);
export const likePost = (postId, reactionType) => api.post(`/posts/${postId}/react/`, { reaction_type: reactionType });
export const fetchComments = (postId) => api.get(`/posts/${postId}/comment/`);
export const addComment = (postId, data) => api.post(`/posts/${postId}/comment/`, data);

export const fetchNotifications = () => api.get("/notifications/");
export const markNotificationAsRead = (notificationId) => api.patch(`/notifications/${notificationId}/mark-as-read/`);
export const markAllNotificationsAsRead = () => api.patch(`/notifications/mark-all-as-read/`);

export const fetchUser = () => api2.get("users/account/");


export default api;