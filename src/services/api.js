import axios from "axios";

const API_URL = "https://itisocialmediawebsitebackend-production.up.railway.app/api/";

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
    // --- ADD LOGS HERE ---
    // console.log(`API Interceptor: Requesting ${config.method?.toUpperCase()} ${config.url}`); 
    const token = localStorage.getItem("access_token"); // Ensure 'access_token' is the correct key
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; 
      // console.log("API Interceptor: Token FOUND and attached."); // Log success
    } else {
      console.warn("API Interceptor: Token NOT FOUND in localStorage."); // Log failure
    }
    // --- END LOGS ---
    return config;
  },
  (error) => {
    console.error("API Interceptor: Request setup error", error); // Log errors during request setup
    return Promise.reject(error);
  }
);

// localStorage.setItem("access_token",  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzODUzNjIzLCJpYXQiOjE3NDM3NjcyMjMsImp0aSI6IjdhNTMwYzY3MTA4MjRmMzM4MjE2Mjg2ZmM1MGRjOTE3IiwidXNlcl9pZCI6MTV9.2NGzFRIF56c5Dl_DCSo1s-IRvWqPOiuXMCnflpWOE4Q");

// API functions
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
export const createPost = (data) => api.post("/posts/", data, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
// Fetch comments for a post
export const fetchComments = (postId, page = 1) => { // Accept page, default to 1
  console.log(`API: Fetching comments for post ${postId}, page ${page}`);
  if (typeof page !== 'number' || isNaN(page)) {
    console.error("API ERROR: fetchComments received invalid page number:", page);
    // Return a rejected promise or throw an error to stop the process
    return Promise.reject(new Error(`Invalid page number: ${page}`)); 
  } 
  // Append the page query parameter to the comments endpoint URL
  return api.get(`/posts/${postId}/comments/?page=${page}`); 
};

// Add a comment to a post
export const addComment = (postId, data) => api.post(`/posts/${postId}/comment/`, data);
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
// ======================================================================================================================================
export const fetchNotifications = () => api.get("/notifications/");
export const markNotificationAsRead = (notificationId) =>
  api.patch(`/notifications/${notificationId}/mark-as-read/`);
export const markAllNotificationsAsRead = () =>
  api.patch("/notifications/mark-all-as-read/");




export default api;

// ======================================================================================================================================

const API_BASE_URL =  'https://itisocialmediawebsitebackend-production.up.railway.app/api/'; 

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Interceptor to add Auth Token ---
apiClient.interceptors.request.use(
  (config) => {
    // Assume token is stored in localStorage after login
    const token = localStorage.getItem('access_token'); // Adjust key as needed
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // IMPORTANT: When sending FormData (for file uploads),
    // axios sets the Content-Type automatically. Don't override it here.
    if (config.data instanceof FormData) {
      // Let axios handle the Content-Type for FormData
      delete config.headers['Content-Type'];
    } else {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- API Functions ---

// ========================================================= User Profile ===========================================================
export const getAccount = () => apiClient.get('/users/account/');
export const updateAccountData = (formData) => apiClient.put('/users/account/', formData);
export const updateAccount = (jsonData) => apiClient.put('/users/account/', jsonData);

// export const updateAccount = (profileData) => apiClient.put('/users/account/', profileData);
export const updateProfilePicture = (formData) => apiClient.put('/users/account/', formData); // Send FormData
export const getPublicProfile = (profileId) => apiClient.get(`/users/profiles/${profileId}/`);

// ======================================================= User Credentials ==========================================================
export const changeEmail = (data) => apiClient.post('/users/change-email/', data);
export const changePassword = (data) => apiClient.post('/users/change-password/', data);

// =========================================================== Skills ===============================================================
export const getSkills = () => apiClient.get('/users/skills/'); // Gets skills for logged-in user
export const addSkill = (skillData) => apiClient.post('/users/skills/', skillData);
export const updateSkill = (skillId, skillData) => apiClient.put(`/users/skills/${skillId}/`, skillData);
export const deleteSkill = (skillId) => apiClient.delete(`/users/skills/${skillId}/`);

// =========================================================== Projects =============================================================

export const getAllProjects = () => apiClient.get('/projects/'); // Fetches ALL projects
export const getMyProjects = (profileId) => apiClient.get(`/projects/?owner=${profileId}`);
export const getProject = (projectId) => apiClient.get(`/projects/${projectId}/`);
export const addProject = (projectData) => apiClient.post('/projects/', projectData);
export const updateProject = (projectId, projectData) => apiClient.put(`/projects/${projectId}/`, projectData);
export const deleteProject = (projectId) => apiClient.delete(`/projects/${projectId}/`);
export const getAllTags = () => apiClient.get('/projects/tags/'); // For tag input suggestions
export const addTagToProject = (projectId, tagId) => apiClient.post(`/projects/${projectId}/tags/`, { tag_id: tagId });
export const removeTagFromProject = (projectId, tagId) => apiClient.delete(`/projects/${projectId}/tags/`, { data: { tag_id: tagId } }); // DELETE request might need data in body

// ==================================================== Project Contributors =========================================================
export const getContributors = (projectId) => apiClient.get(`/projects/${projectId}/contributors/`);
export const addContributor = (projectId, username) => apiClient.post(`/projects/${projectId}/contributors/`, { username });
export const removeContributor = (projectId, username) => apiClient.delete(`/projects/${projectId}/contributors/`, { data: { username } }); // DELETE request might need data in body
// export const getMyProjects = (profileId) => apiClient.get(`/projects/?owner=${profileId}`);

export const verifyOtp = (data) => { return apiClient.post('/users/verify-otp/', data);};