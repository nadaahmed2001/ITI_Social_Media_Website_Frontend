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
localStorage.setItem("access_token",  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzNjQ3MzYwLCJpYXQiOjE3NDM1NjA5NjAsImp0aSI6ImZjNDU0NTYwOWFmOTQyNWI5OGJjYTFkNTJhNjI2OGI4IiwidXNlcl9pZCI6MTV9.WHghD1k0v_u5r_sWc0MV8-sSA0Fb2JkOtgl8e58gT4U");

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

// ======================================================================================================================================

const API_BASE_URL =  'http://localhost:8000/'; // Adjust if needed

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

// === Profile ===
export const getAccount = () => apiClient.get('/users/account/');
export const updateAccount = (profileData) => apiClient.put('/users/account/', profileData);
export const updateProfilePicture = (formData) => apiClient.put('/users/account/', formData); // Send FormData
export const getPublicProfile = (profileId) => apiClient.get(`/users/profiles/${profileId}/`);

// === Credentials ===
// !! Placeholder: Implement backend endpoints first !!
export const changeEmail = (data) => apiClient.post('/users/change-email/', data);
export const changePassword = (data) => apiClient.post('/users/change-password/', data);

// === Skills ===
export const getSkills = () => apiClient.get('/users/skills/'); // Gets skills for logged-in user
export const addSkill = (skillData) => apiClient.post('/users/skills/', skillData);
export const updateSkill = (skillId, skillData) => apiClient.put(`/users/skills/${skillId}/`, skillData);
export const deleteSkill = (skillId) => apiClient.delete(`/users/skills/${skillId}/`);

// === Projects ===
// Assuming backend supports filtering by owner profile ID
// export const getMyProjects = (profileId) => apiClient.get(`/api/projects/?owner=${profileId}`);

export const getAllProjects = () => apiClient.get('/api/projects/'); // Fetches ALL projects
export const getProject = (projectId) => apiClient.get(`/api/projects/${projectId}/`);
export const addProject = (projectData) => apiClient.post('/api/projects/', projectData);
export const updateProject = (projectId, projectData) => apiClient.put(`/api/projects/${projectId}/`, projectData);
export const deleteProject = (projectId) => apiClient.delete(`/api/projects/${projectId}/`);
export const getAllTags = () => apiClient.get('/api/projects/tags/'); // For tag input suggestions
export const addTagToProject = (projectId, tagId) => apiClient.post(`/api/projects/${projectId}/tags/`, { tag_id: tagId });
export const removeTagFromProject = (projectId, tagId) => apiClient.delete(`/api/projects/${projectId}/tags/`, { data: { tag_id: tagId } }); // DELETE request might need data in body

// === Contributors ===
export const getContributors = (projectId) => apiClient.get(`/api/projects/${projectId}/contributors/`);
export const addContributor = (projectId, username) => apiClient.post(`/api/projects/${projectId}/contributors/`, { username });
export const removeContributor = (projectId, username) => apiClient.delete(`/api/projects/${projectId}/contributors/`, { data: { username } }); // DELETE request might need data in body



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

