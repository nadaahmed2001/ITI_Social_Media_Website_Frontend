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

// Automatically attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// API functions for Posts app
export const fetchPosts = () => api.get("/posts/");
export const createPost = (data) => api.post("/posts/", data);
export const fetchComments = (postId) => api.get(`/posts/${postId}/comments/`);
export const addComment = (postId, data) => api.post(`/posts/${postId}/comment/`, data);
export const fetchNotifications = () => api.get("/notifications/");
export const markNotificationAsRead = (notificationId) =>
  api.patch(`/notifications/${notificationId}/mark-as-read/`);
export const markAllNotificationsAsRead = () =>
  api.patch("/notifications/mark-all-as-read/");
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


export default api;
