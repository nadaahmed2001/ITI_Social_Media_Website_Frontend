//api.js
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


export const savePost = async (postId) => {
  try {
    // Use POST method for saving
    const response = await api.post(`/posts/${postId}/save/`);
    return response.data; // Should contain { status: 'saved' or 'already_saved', ... }
  } catch (error) {
    console.error(`Error saving post ${postId}:`, error.response || error);
    throw error;
  }
};

// Function to unsave a post
export const unsavePost = async (postId) => {
  try {
    // Use DELETE method for unsaving
    const response = await api.delete(`/posts/${postId}/save/`);
    return response.data; // Should contain { status: 'unsaved' or 'not_found', ... }
  } catch (error) {
    console.error(`Error unsaving post ${postId}:`, error.response || error);
    throw error;
  }
};


export const fetchSavedPosts = async (page = 1) => { // Add page parameter for pagination
  try {
    // Call the new backend endpoint, include page query parameter
    const response = await api.get(`/posts/saved/?page=${page}`);
    // Assuming paginated response like { count, next, previous, results }
    return response.data;
  } catch (error) {
    console.error("Error fetching saved posts:", error.response || error);
    throw error;
  }
};


export const fetchMyPosts = async (page = 1) => {
  try {
    // Construct the URL with the page query parameter.
    // Ensure '/posts/mine/' matches the actual endpoint defined in your Django urls.py
    const url = `/posts/mine/?page=${page}`;
    console.log(`Calling API: GET ${url}`); // Debug log

    // Make the GET request using your authenticated axios instance
    const response = await api.get(url);

    // Log the successful response data for debugging
    console.log(`Fetched my posts (page ${page}):`, response.data);

    // Return the data received from the backend (expected to be paginated)
    // e.g., { count: ..., next: ..., previous: ..., results: [...] }
    return response.data;

  } catch (error) {
    // Log detailed error information
    console.error(`Error fetching my posts (page ${page}):`, error.response?.data || error.message || error);


    throw error;
  }
};


export const followUser = async (profileId) => {
  // Validate input
  if (!profileId) {
      console.error("followUser called without profileId");
      throw new Error("Profile ID is required to follow.");
  }

  try {
    // Construct the endpoint URL
    const url = `/users/profiles/${profileId}/follow/`;
    console.log(`Calling API: POST ${url}`); // Log the action

    // Make the POST request (backend creates the Follow record)
    const response = await api2.post(url);

    console.log(`Follow response for ${profileId}:`, response.data);
    // Return the response data (e.g., { status: 'followed', message: '...' })
    return response.data;

  } catch (error) {
    // Log detailed error information
    console.error(`Error following profile ${profileId}:`, error.response?.data || error.message || error);
    // Re-throw the error for the calling component (FollowButton) to handle
    throw error;
  }
};

/**
 * Unfollow a user by their profile ID.
 * Sends a DELETE request to the follow/unfollow endpoint.
 * @param {string} profileId - The UUID string of the profile to unfollow.
 * @returns {Promise<object>} Promise resolving to the API response data.
 * @throws Will throw an error if the API call fails or profileId is missing.
 */
export const unfollowUser = async (profileId) => {
  // Validate input
  if (!profileId) {
    console.error("unfollowUser called without profileId");
    throw new Error("Profile ID is required to unfollow.");
  }

  try {
    // Construct the endpoint URL
    const url = `/users/profiles/${profileId}/follow/`;
    console.log(`Calling API: DELETE ${url}`); // Log the action

    // Make the DELETE request (backend deletes the Follow record)
    const response = await api2.delete(url);

    console.log(`Unfollow response for ${profileId}:`, response.data);
     // Return the response data (e.g., { status: 'unfollowed', message: '...' })
    return response.data;

  } catch (error) {
     // Log detailed error information
    console.error(`Error unfollowing profile ${profileId}:`, error.response?.data || error.message || error);
    // Re-throw the error for the calling component (FollowButton) to handle
    throw error;
  }
};


export const getProfileById = async (profileId) => {
  if (!profileId) throw new Error("Profile ID required");
  try {
      const response = await api2.get(`/users/profiles/${profileId}/`);
      return response; // Return the whole response or just response.data
  } catch (error) {
      console.error(`Error fetching profile ${profileId}:`, error.response || error);
      throw error;
  }
};



// Fetch comments for a post
export const fetchComments = (postId, page = 1) => { // Accept page, default to 1
  console.log(`API: Fetching comments for post ${postId}, page ${page}`);
  if (typeof page !== 'number' || isNaN(page)) {
    console.error("API ERROR: fetchComments received invalid page number:", page);
    console.log(page)
    // Return a rejected promise or throw an error to stop the process
    return Promise.reject(new Error(`Invalid page number: ${page}`)); 
  } 
  // Append the page query parameter to the comments endpoint URL
  return api.get(`/posts/${postId}/comments/?page=${page}`); 
};

// Add a comment to a post
export const addComment = (postId, commentData) => {
  const formData = new FormData();
  formData.append('post', postId)
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
    // console.log("from api.js in fetchPrograms", response.data);  // Debugging
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
    // console.log("from api.js, in fetchTracksForProgram", response.data);  // Debugging
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
    const response = await api.post("supervisor/batches/", {
      name,
      program_id,
      track_id
    });

    console.log("Created Batch:", response.data); // Debugging
    return response.data;  // Return the newly created batch data
  } catch (error) {
    console.error('Failed to create batch:', error);
    throw error; // Make sure to propagate error for frontend handling
  }
};

export const uploadBatchCSV = async (batchId, file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("batch_id", batchId);
  console.log("I'm inside uploadBatchCSV function and formData is", formData); // Debugging

  try {
      const response = await api.post(`supervisor/upload-national-id/`, formData, {
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

export const searchProfiles = async (query) => {
  try {
    // Adjust the endpoint '/search/profiles/' if needed
    const response = await api.get(`/search/profiles/?q=${encodeURIComponent(query)}`);
    // Assuming the backend returns data in response.data
    // If it returns an array directly: return response.data;
    // If it returns { results: [...] }: return response.data.results;
    return response.data; // Adjust based on your actual API response structure
  } catch (error) {
    console.error("Error searching profiles:", error.response || error);
    // Re-throw or handle error appropriately
    throw error;
  }
};

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

