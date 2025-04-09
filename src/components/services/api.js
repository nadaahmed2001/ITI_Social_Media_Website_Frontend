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


api2.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// ============================================================="Rahma"=========================================================================
// Fetch all posts
export const fetchPosts = (page = 1, pageSize = 10) => {
  return api.get('/posts/', {
    params: {
      page,
      page_size: pageSize
    }
  });
};

// Create a new post
export const createPost = (postData) => {
  const formData = new FormData();
  formData.append('body', postData.body);
  
  // Only append attachment_url if it exists
  if (postData.attachment_url) {
    formData.append('attachment_url', postData.attachment_url);
  }
  
  return api.post('/posts/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};


// Fetch comments for a post
export const fetchComments = (postId) => api.get(`/posts/${postId}/comments/`);

// Add a comment to a post
export const addComment = (postId, commentData) => {
  const formData = new FormData();
  formData.append('comment', commentData.comment);
  if (commentData.attachment_url) {
    formData.append('attachment_url', commentData.attachment_url);
  }
  
  return api.post(`/posts/${postId}/comment/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

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
// fetchReactionsForPost
export const fetchReactionsForPost = async (postId) => {
  try {
    const response = await api.get(`/posts/${postId}/reactions/`);
    return response.data; 
  } catch (error) {
    console.error("API Error:", error.response?.data || error);
    return [];
  }
};
// removePostReaction
export const removePostReaction = async (postId) => {
  try {
    const response = await api.post(`/posts/${postId}/react/remove/`);
    return response.data;
  } catch (error) {
    console.error("Error removing reaction:", error.response?.data || error);
    throw error;
  }
};
// Add a reaction to a comment
export const likeComment = async (commentId, reactionType) => {
  try {
    const response = await api.post(`/posts/comment/${commentId}/react/${reactionType}/`);
    return response.data;
  } catch (error) {
    console.error("Error reacting to comment:", error.response?.data || error);
    throw error;
  }
};
// Fetch reactions for a comment
export const fetchReactionsForComment = async (commentId) => {
  try {
    const response = await api.get(`/posts/comment/${commentId}/reactions/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching comment reactions:", error.response?.data || error);
    return [];
  }
};
// Remove a reaction from a comment
export const removeCommentReaction = async (commentId) => {
  try {
    const response = await api.post(`/posts/comment/${commentId}/react/remove/`);
    return response.data;
  } catch (error) {
    console.error("Error removing comment reaction:", error.response?.data || error);
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


//------------------- Notifications API functions -------------------
export const fetchNotifications = () => api.get("/notifications/");
export const markNotificationAsRead = (notificationId) =>
  api.patch(`/notifications/${notificationId}/mark-as-read/`);
export const markAllNotificationsAsRead = () =>
  api.patch("/notifications/mark-all-as-read/");
export const clearNotification = (notificationId) => 
  api.delete(`/notifications/${notificationId}/`);

export const clearAllNotifications = () => 
  api.delete("/notifications/clear-all/");


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

// ========================================================= User Profile ===========================================================
export const getAccount = () => api2.get('/users/account/');
export const updateAccountData = (formData) => api2.put('/users/account/', formData);
export const updateAccount = (jsonData) => api2.put('/users/account/', jsonData);

// export const updateAccount = (profileData) => api2.put('/users/account/', profileData);
export const updateProfilePicture = (formData) => api2.put('/users/account/', formData); // Send FormData
export const getPublicProfile = (profileId) => api2.get(`/users/profiles/${profileId}/`);

// ======================================================= User Credentials ==========================================================
export const changeEmail = (data) => api2.post('/users/change-email/', data);
export const changePassword = (data) => api2.post('/users/change-password/', data);

// =========================================================== Skills ===============================================================
export const getSkills = () => api2.get('/users/skills/'); // Gets skills for logged-in user
export const addSkill = (skillData) => api2.post('/users/skills/', skillData);
export const updateSkill = (skillId, skillData) => api2.put(`/users/skills/${skillId}/`, skillData);
export const deleteSkill = (skillId) => api2.delete(`/users/skills/${skillId}/`);

// =========================================================== Projects =============================================================

export const getAllProjects = () => api2.get('/api/projects/'); // Fetches ALL projects
export const getMyProjects = (profileId) => api2.get(`/api/projects/?owner=${profileId}`);
export const getProject = (projectId) => api2.get(`/api/projects/${projectId}/`);
export const addProject = (projectData) => api2.post('/api/projects/', projectData);
export const updateProject = (projectId, projectData) => api2.put(`/api/projects/${projectId}/`, projectData);
export const deleteProject = (projectId) => api2.delete(`/api/projects/${projectId}/`);
export const getAllTags = () => api2.get('/api/projects/tags/'); // For tag input suggestions
export const addTagToProject = (projectId, tagId) => api2.post(`/api/projects/${projectId}/tags/`, { tag_id: tagId });
export const removeTagFromProject = (projectId, tagId) => api2.delete(`/api/projects/${projectId}/tags/`, { data: { tag_id: tagId } }); // DELETE request might need data in body

// ==================================================== Project Contributors =========================================================
export const getContributors = (projectId) => api2.get(`/api/projects/${projectId}/contributors/`);
export const addContributor = (projectId, username) => api2.post(`/api/projects/${projectId}/contributors/`, { username });
export const removeContributor = (projectId, username) => api2.delete(`/api/projects/${projectId}/contributors/`, { data: { username } }); // DELETE request might need data in body
// export const getMyProjects = (profileId) => api2.get(`/api/projects/?owner=${profileId}`);

// export const verifyOtp = (data) => { return api2.post('/users/verify-otp/', data);};

export const verifyOtp = (data) => {
  return axios.post('http://127.0.0.1:8000/users/verify-otp/', data, {
    headers: {
      'Content-Type': 'application/json',
    },
    // prevent Axios from auto-including cookies (just in case)
    withCredentials: false,
  });
};


export default api;

