import React, { useState, useEffect, useContext } from "react"; 
import AuthContext from '../../contexts/AuthContext';       
import { fetchPosts } from "../../services/api";          
import CreatePost from "./CreatePost";                  
import ShowPost from "./ShowPost";                    

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  // --- 1. Add state for error messages ---
  const [error, setError] = useState(null); 
  // --- 2. Get user context ---
  const { user } = useContext(AuthContext); // Get user from context

  useEffect(() => {
    // Reset state before fetching
    setLoading(true);
    setError(null); // Clear previous errors
    setPosts([]);   // Clear previous posts

    console.log("PostList: Attempting fetch. User logged in:", !!user); // Log if user exists in context

    fetchPosts()
      .then((res) => {
        console.log("PostList: API Response Raw:", res); // Log the raw response object

        // --- Improved Data Extraction Logic ---
        // Adjust this based on your ACTUAL API response structure seen in Network tab or Postman
        let extractedPosts = []; 
        if (res.data && Array.isArray(res.data.results)) { // Common DRF pagination
            extractedPosts = res.data.results;
        } else if (Array.isArray(res.data)) { // Direct array response
            extractedPosts = res.data;
        } else if (res.data && Array.isArray(res.data.posts)) { // Custom "posts" key
            extractedPosts = res.data.posts;
        } else {
            console.warn("PostList: Unexpected API response format. Setting posts to empty.", res.data);
        }
        // --- End Data Extraction ---

        console.log("PostList: Extracted Posts:", extractedPosts); // Log what was extracted
        setPosts(extractedPosts);
        
      })
      .catch((err) => {
         // --- 3. Improved Error Handling ---
         console.error("PostList: Fetch posts error object:", err); // Log the full error object
        
        let errorMessage = "Failed to load posts. Please try again later."; // Default
        if (err.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error("Error Response Status:", err.response.status);
            console.error("Error Response Data:", err.response.data);
            if (err.response.status === 403) {
                // Specific message for 403
                errorMessage = "Permission Denied (403). Make sure you are correctly logged in and have permissions to view posts.";
            } else if (err.response.status === 401) {
                errorMessage = "Authentication Failed (401). Please log in again.";
            } else if (err.response.data?.detail) { 
                // Use detailed message from backend if provided
                errorMessage = `Error: ${err.response.data.detail} (${err.response.status})`;
            } else {
                errorMessage = `Server responded with status: ${err.response.status}`;
            }
        } else if (err.request) {
            // The request was made but no response was received
            console.error("Error Request (No Response):", err.request);
            errorMessage = "Could not connect to the server. Please check your network connection.";
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error Setting Up Request:', err.message);
            errorMessage = `An unexpected error occurred: ${err.message}`;
        }
         setError(errorMessage); // Set the specific error message state
         setPosts([]); // Ensure posts are empty on error
         // --- End Improved Error Handling ---
      })
      .finally(() => {
        setLoading(false);
      });
  // Fetch posts when the component mounts (empty dependency array)
  // The API call relies on the interceptor to add the token if available
  }, []); 

  const handleNewPost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  const handleDeletePost = (postId) => {
    setPosts(prevPosts => prevPosts.filter((post) => post.id !== postId));
  }

  return (
    <>
      <div className="feed-container">
        {/* <Sidebar /> */} 
        <div className="main-content">
          {/* Only show CreatePost if user is logged in */}
          {user && <CreatePost onPostCreated={handleNewPost} />} 

          <div className="posts-list mt-6">
            {loading && (
              <p className="loading-message text-center text-gray-500 py-6">Loading posts...</p>
            )}
            
            {/* --- 4. Display Error Message --- */}
            {error && !loading && (
              // Simple error display (style as needed)
              <div className="error-message text-center text-red-600 bg-red-100 border border-red-400 p-4 rounded-md mb-4" role="alert">
                <strong>Error:</strong> {error}
              </div>
            )}
            {/* --- End Display Error Message --- */}

            {!loading && !error && posts.length === 0 && (
              <p className="no-posts-message text-center text-gray-500 py-10">No posts available.</p>
            )}
            {!loading && !error && posts.length > 0 && (
              posts.map((post) => (
                <ShowPost 
                  key={post.id} 
                  postData={post} 
                  onDeletePost={handleDeletePost} 
                   // ShowPost now gets currentUserId from context
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}