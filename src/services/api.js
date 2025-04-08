import axios from "axios";

// Base URL for your Django API (ensure trailing slash)
const API_BASE_URL = 'http://127.0.0.1:8000/'; // Use '/api/' if your urls.py includes under /api/

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    // Default headers - Content-Type will be changed by interceptor if needed
    'Content-Type': 'application/json',
    'Accept': 'application/json', // Explicitly accept JSON
  },
});

// --- Interceptor to add Auth Token ---
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token'); // Use the key you store the token with
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // --- REMOVED FormData Content-Type check - Assuming JSON for Widget approach ---
    // If you need FormData for some specific endpoints (like comment attachments later?),
    // you might need to conditionally set Content-Type here or in the specific API function call.
    // For now, assume JSON is default. Axios might still override for FormData automatically if needed.
    config.headers['Content-Type'] = 'application/json'; // Default to JSON

    return config;
  },
  (error) => {
    // Handle global request errors (e.g., redirect on 401)
    if (error.response && error.response.status === 401) {
        console.error("Unauthorized request, redirecting to login...");
        // Optional: Add redirect logic here
        // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


// === Authentication ===
// Assuming your CustomTokenObtainPairView is at /users/login/
export const loginUser = (credentials) => apiClient.post('/users/login/', credentials);
// Assuming your VerifyOTPView is at /users/verify-otp/
export const verifyOtp = (otpData) => apiClient.post('/users/verify-otp/', otpData);
// Assuming SimpleJWT refresh endpoint is used
export const refreshToken = (refreshData) => apiClient.post('/users/token/refresh/', refreshData); // Adjust path if needed
// Assuming you have a separate logout API endpoint to blacklist refresh token
export const logoutUser = (refreshData) => apiClient.post('/users/logout/', refreshData);

// === User Profile & Settings ===
export const getAccount = () => apiClient.get('/users/account/'); // Fetches Profile data
// Sends JSON updates (including image URL or 2FA toggle)
export const updateAccount = (jsonData) => apiClient.put('/users/account/', jsonData);
export const getPublicProfile = (profileId) => apiClient.get(`/users/profiles/${profileId}/`); // Use UUID if profile ID is UUID
export const changeEmail = (data) => apiClient.post('/users/change-email/', data); // Initiates change
export const changePassword = (data) => apiClient.post('/users/change-password/', data);
// Note: Confirmation endpoint /users/confirm-email-change/<token>/ is usually hit by browser redirect, not direct API call

// === Skills ===
export const getSkills = () => apiClient.get('/users/skills/');
export const addSkill = (skillData) => apiClient.post('/users/skills/', skillData);
export const updateSkill = (skillId, skillData) => apiClient.put(`/users/skills/${skillId}/`, skillData);
export const deleteSkill = (skillId) => apiClient.delete(`/users/skills/${skillId}/`);

// === Projects ===
// Corrected: Fetches projects for specific owner using query param
export const getMyProjects = (profileId, page = 1, pageSize = 9) => {
    return apiClient.get(`api/projects/?owner=${profileId}&page=${page}&page_size=${pageSize}`);
};
// Corrected: Fetches single project detail
export const getPost = (postId) => { // Renamed from getProject for clarity in post context
    return apiClient.get(`api/posts/${postId}/`); // Corrected URL for single post
};
export const deletePost = (postId) => apiClient.delete(`api/posts/${postId}/`);

// export const getProject = (projectId) => apiClient.get(`api/projects/${projectId}/`); // Keep if separate project detail needed

// Sends JSON (incl. attachment_urls from Widget, tag_names)
export const addProject = (jsonData) => apiClient.post('api/projects/', jsonData);
// Sends JSON (incl. featured_image URL or tag_names if changed)
export const updateProject = (projectId, jsonData) => apiClient.put(`api/projects/${projectId}/`, jsonData);
export const deleteProject = (projectId) => apiClient.delete(`api/projects/${projectId}/`);

// === Tags ===
export const getAllTags = () => apiClient.get('api/projects/tags/');
// Optional: Keep if using separate tag add/remove endpoints
// export const addTagToProject = ...
// export const removeTagFromProject = ...

// === Project Contributors ===
export const getContributors = (projectId) => apiClient.get(`api/projects/${projectId}/contributors/`);
export const addContributor = (projectId, username) => apiClient.post(`api/projects/${projectId}/contributors/`, { username });
export const removeContributor = (projectId, username) => apiClient.delete(`api/projects/${projectId}/contributors/`, { data: { username } });

// === Posts ===
// Corrected: Fetches list of posts (general feed or filtered)
export const fetchPosts = (authorId = null, page = 1, pageSize = 10) => {
  let url = `api/posts/?page=${page}&page_size=${pageSize}`; // Use posts endpoint
  if (authorId) {
      url += `&author=${authorId}`;
  }
  return apiClient.get(url);
};



// Corrected: Sends JSON including attachment_urls
export const createPost = (jsonData) => apiClient.post('api/posts/', jsonData);
// Corrected: Sends JSON for updates (e.g., body)
export const editPost = (postId, jsonData) => apiClient.patch(`api/posts/${postId}/`, jsonData); // Use PATCH for partial update

// Delete post (URL was correct)
// export const deletePost = (postId) => apiClient.delete(`api/posts/${postId}/`); // Already defined under Projects

// === Comments ===
// Corrected: Fetches comments for a specific post
export const fetchComments = (postId, page = 1, pageSize = 10) => { // Added pagination params
    return apiClient.get(`api/posts/${postId}/comments/?page=${page}&page_size=${pageSize}`);
};
// Corrected: Sends JSON (unless comment attachments added later, then FormData needed)
export const addComment = (postId, jsonData) => {
    // jsonData likely: { comment: "text", post: postId (if needed by serializer) }
    return apiClient.post(`api/posts/${postId}/comment/`, jsonData);
};
// Corrected: Sends JSON with { comment: "new text" }
export const editComment = (postId, commentId, commentData) => {
    return apiClient.put(`api/posts/comment/edit/${postId}/${commentId}/`, commentData);
};
// Corrected: Sends DELETE with confirmation body
export const deleteComment = (postId, commentId) => {
    return apiClient.delete(`api/posts/comment/delete/${postId}/${commentId}/`, {
        data: { confirmation: true }
    });
};



// === Reactions ===
// (Keep existing reaction functions, ensure URLs are relative to baseURL)
export const fetchReactionsForPost = (postId) => apiClient.get(`api/posts/${postId}/reactions/`);
export const fetchReactionsForComment = (commentId) => apiClient.get(`api/posts/comment/${commentId}/reactions/`);
export const likePost = (postId, reactionType) => apiClient.post(`api/posts/${postId}/react/${reactionType}/`);
export const likeComment = (commentId, reactionType) => apiClient.post(`api/posts/comment/${commentId}/react/${reactionType}/`);
export const removePostReaction = (postId) => apiClient.post(`api/posts/${postId}/react/remove/`);
export const removeCommentReaction = (commentId) => apiClient.post(`api/posts/comment/${commentId}/react/remove/`);

// === Notifications ===
export const fetchNotifications = () => apiClient.get("api/notifications/");
export const markNotificationAsRead = (notificationId) => apiClient.patch(`api/notifications/${notificationId}/mark-as-read/`);
export const markAllNotificationsAsRead = () => apiClient.patch("api/notifications/mark-all-as-read/");


// Export the configured instance if needed elsewhere, otherwise just use named exports
export default apiClient;