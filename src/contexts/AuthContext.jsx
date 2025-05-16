// src/contexts/AuthContext.js (Adjust path if needed)
import React, { createContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { getAccount } from "../services/api"; // Adjust path if needed
// Assuming you have an axios instance for authenticated requests
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // State for the raw JWT token string
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("access_token") || null // Prioritize localStorage
    || sessionStorage.getItem("access_token") || null // Fallback to sessionStorage
  );

  // State for the full user object (fetched from API)
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for initial auth check/fetch
  const navigate = useNavigate(); // Hook for navigation

  
  const updateUserState = useCallback((newData) => {
    setUser(prevUser => {
      if (!prevUser) return null; // Cannot update if no user exists

      // Create a deep copy to avoid direct state mutation issues, especially with nested objects
      let updatedUser = JSON.parse(JSON.stringify(prevUser));

      // Merge new data - Handle potential nesting (e.g., profile picture)
      for (const key in newData) {
          if (key === 'profile_picture') {
              // Assuming profile data might be nested or direct
              if (updatedUser.profile) { // If profile object exists
                  updatedUser.profile = { ...updatedUser.profile, profile_picture: newData.profile_picture };
              } else { // If profile_picture is directly on user object
                  updatedUser.profile_picture = newData.profile_picture;
              }
          } else if (key === 'username' && updatedUser.profile) {
              // Update username on both user and profile if structure requires it
              updatedUser.username = newData.username;
              updatedUser.profile.username = newData.username;
          } else if (updatedUser.profile && key in updatedUser.profile) {
              // Handle other fields potentially nested in profile
               updatedUser.profile[key] = newData[key];
          }
           else {
              // Handle fields directly on the user object
              updatedUser[key] = newData[key];
          }
      }

      console.log("AuthContext: Updating user state with merged data", updatedUser);
      return updatedUser;
    });
  }, []); // No dependencies needed if it only relies on setUser

  /**
   * Handles login: Stores token, sets authTokens state,
   * which triggers useEffect to fetch full user data.
   * @param {string} accessToken - The JWT access token.
   * @param {string|null} refreshToken - Optional refresh token.
   * @param {boolean} rememberMe - Whether to use localStorage (true) or sessionStorage (false).
   */
  const loginUser = useCallback((accessToken, refreshToken = null, rememberMe = false) => {
    console.log("AuthContext: loginUser called");
    if (rememberMe) {
        localStorage.setItem("access_token", accessToken);
        if (refreshToken) localStorage.setItem("refresh_token", refreshToken);
        sessionStorage.removeItem('access_token'); // Clear session storage
        sessionStorage.removeItem('refresh_token');
    } else {
        sessionStorage.setItem("access_token", accessToken);
        if (refreshToken) sessionStorage.setItem("refresh_token", refreshToken);
        localStorage.removeItem('access_token'); // Clear local storage
        localStorage.removeItem('refresh_token');
    }
    // Update the Axios instance default header immediately
    api.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
    setAuthTokens(accessToken); // Update state, triggering useEffect to fetch user data
    // Navigation will happen inside useEffect after user data is fetched successfully
  }, []); // No navigate dependency needed here

  /**
   * Handles logout: Clears tokens, user state, and redirects.
   */
  const logoutUser = useCallback(() => {
    console.log("AuthContext: Logging out");
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    delete api.defaults.headers['Authorization']; // Clear default header
    navigate('/login'); // Redirect to login
  }, [navigate]); // Add navigate dependency

  /**
   * Effect to fetch user details when authTokens change or on initial load.
   */
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (authTokens) {
        // console.log("AuthContext: Token found, fetching user details...");
        // Ensure the token is set in the instance header *before* the request
        api.defaults.headers['Authorization'] = `Bearer ${authTokens}`;
        try {
          const response = await getAccount(); // Call API
          setUser(response.data); // Set user state with API data
          // console.log("AuthContext: User details fetched successfully:", response.data);
          // Only navigate if we just logged in (user was previously null)
          // This prevents redirecting on every token refresh if user was already set
          if (user === null) {
            //  console.log("AuthContext: Navigating to /Home after initial fetch.");
             navigate('/Home'); // Navigate after user data is successfully fetched
          }
        } catch (error) {
          console.error("AuthContext: Failed to fetch user account data:", error.response?.status, error.response?.data || error.message);
          // If fetching fails (e.g., 401 due to invalid/expired token), log out
          logoutUser();
        } finally {
          setLoading(false);
        }
      } else {
        // No token, ensure user is null and finish loading
        console.log("AuthContext: No token found.");
        setUser(null);
        setLoading(false);
      }
    };

    fetchUserDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authTokens]); // **Only depend on authTokens**. Do NOT add 'user' or 'navigate' or 'logoutUser' here.

  // Context value includes user, loading state, login/logout functions, and the new updateUserState
  const contextData = {
    user,
    setUser, // Expose setUser if needed for direct manipulation (use with caution)
    authTokens, // Expose tokens if needed elsewhere (e.g., for manual refresh triggers)
    loginUser,
    logoutUser,
    loading,
    updateUserState // <-- Expose the update function
  };

  return (
    <AuthContext.Provider value={contextData}>
      {/* Conditionally render children only when loading is false */}
      {!loading ? children : (
          // Optional: Render a full-page loading indicator here
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              {/* Replace with your preferred loading component */}
              <div>Loading Application...</div>
          </div>
      )}
    </AuthContext.Provider>
  );
};

export default AuthContext;
