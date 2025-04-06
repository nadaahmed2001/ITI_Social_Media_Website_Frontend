import axios from "axios";

// Axios instance with base URL
const API_BASE_URL= "http://127.0.0.1:8000/api/";


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});


const api2 = axios.create({
  baseURL: "http://127.0.0.1:8000/",
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

<<<<<<< HEAD
// API functions
=======


api2.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// API functions for Posts app
>>>>>>> 4da5ce689a110240501aa0425ed1334380d0a5e5
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



//------------------------------- API Functions for supervisor (batches app) -------------------------------
// Fetch Programs for Supervisor's Department
export const fetchPrograms = async () => {
  try {
    const response = await api.get("supervisor/programs/");  // Use the 'api' instance here
    console.log("from api.js in fetchPrograms", response.data);  // Debugging
    return response.data;  // Return program data
  } catch (error) {
    console.error('Failed to fetch programs:', error);
    throw error;
  }
};

// Fetch Tracks for the Selected Program
export const fetchTracksForProgram = async (programId) => {
  try {
    const response = await api.get("supervisor/tracks/", { params: { program_id: programId } });  // Use 'api' instance and updated URL
    return response.data;  // Return track data
  } catch (error) {
    console.error('Failed to fetch tracks:', error);
    throw error;
  }
};

// Fetch Batches for the Selected Track
export const fetchBatches = async (trackId) => {
  try {
    const response = await api.get("supervisor/batches/", { params: { track_id: trackId } });  // Use 'api' instance and updated URL
    return response.data;  // Return batch data
  } catch (error) {
    console.error('Failed to fetch batches:', error);
    throw error;
  }
};

// Create a New Batch
export const createBatch = async (name, program_id, track_id) => {
  try {
    const response = await api.post("supervisor/batches/",  { name, program_id, track_id });  // Use 'api' instance and updated URL
    return response.data;  // Return newly created batch data
  } catch (error) {
    console.error('Failed to create batch:', error);
    throw error;
  }
};

// Upload CSV File for Batch
export const uploadBatchCSV = async (batchId, file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("batch_id", batchId);

    try {
        const response = await api.post(`/upload-national-id/`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to upload CSV:", error);
        throw error;
    }
};


//--------------------Chat API functions--------------------
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

export const fetchUser = () => api2.get("users/account/");


export default api;

