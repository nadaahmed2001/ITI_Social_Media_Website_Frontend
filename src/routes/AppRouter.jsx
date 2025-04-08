import React, {useState, useEffect} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "../pages/AuthPage";
import DashboardPage from "../pages/DashboardPage";
import ProfilePage from "../pages/ProfilePage";
import SearchPage from "../pages/SearchPage";
import ChatPage from "../pages/ChatPage";
import NotificationsPage from "../pages/NotificationsPage";
// Supervisor Pages
import ManageBatches from "../pages/SupervisorDashboard/ManageBatches";
import TrackOverview from "../pages/SupervisorDashboard/TrackOverview";
// Student Pages
import FeedPage from "../pages/StudentDashboard/FeedPage";
import GroupsPage from "../pages/StudentDashboard/GroupsPage";
// Components (Optional - For Direct Rendering in Pages)
import SignUpForm from "../components/auth/SignUpForm";
import LoginForm from "../components/auth/LoginForm";
import CreatePost from "../components/posts/CreatePost";
import ChatSidebar from "../components/chat/ChatSidebar";
import MessagesList from "../components/chat/MessagesList";
import FollowButton from "../components/profiles/FollowButton";
import UserProfile from "../components/profiles/UserProfile";
import SearchFilters from "../components/search/SearchFilters";
import Sidebar from "../components/profiles/Sidebar";
import PostsPage from "../pages/PostsPage";

import { UserProvider } from '../context/UserContext'; // Adjust path
import { getAccount } from '../services/api'; // API function to get logged-in user data (uses token from interceptor)


const AppRouter = () => {

  const [loggedInUser, setLoggedInUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // Loading state for initial auth check
  // ---

  // --- Effect to fetch user data on initial load if token exists ---
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token'); // Check if token exists
      if (token) {
        try {
          console.log("App.js: Found token, attempting to fetch account...");
          const response = await getAccount(); // Fetch user/profile data
          setLoggedInUser(response.data); // Set user data in state
          console.log("App.js: User data set:", response.data);
        } catch (error) {
          // Handle errors (e.g., token expired, network error)
          console.error("App.js: Failed to fetch user account on load:", error);
          localStorage.removeItem('access_token'); // Clear invalid token maybe
          localStorage.removeItem('refresh_token');
          setLoggedInUser(null);
          // Optional: redirect to login?
        }
      } else {
         console.log("App.js: No token found.");
         setLoggedInUser(null); // Ensure user is null if no token
      }
      setAuthLoading(false); // Finished initial auth check
    };

    checkAuth();
  }, []); // Run only once on initial app load

  if (authLoading) {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
            Loading Application... {/* Or a proper spinner */}
        </div>
    );
}



  return (
    <UserProvider user={loggedInUser}>

    <Router>
      <Routes>
        {/* Authentication */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/login" element={<LoginForm />} />
        {/* Dashboards */}
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* Supervisor Routes */}
        <Route path="/supervisor/manage-batches" element={<ManageBatches />} />
        <Route path="/supervisor/track-overview" element={<TrackOverview />} />
        {/* Student Routes */}
        <Route path="/student/feed" element={<FeedPage />} />
        <Route path="/student/groups" element={<GroupsPage />} />
        {/* Profile, Search, and Chat */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/Sidebar" element={<Sidebar />} />
        {/* Notifications */}
        <Route path="/notifications" element={<NotificationsPage />} />
        {/* Posts  */}
        <Route path="/posts/list" element={<PostsPage />} />
        {/* Chat Component Example */}
        <Route path="/chat/sidebar" element={<ChatSidebar />} />
        <Route path="/chat/messagesList" element={<MessagesList />} />
         {/* Profile Components */}
        <Route path="/profiles/followbutton" element={<FollowButton />} />
        <Route path="/profiles/userprofile" element={<UserProfile />} />
        {/* Search Components */}
        <Route path="/search/filters" element={<SearchFilters />} />
        {/* Default Route (Redirects to Dashboard or Login) */}
        <Route path="*" element={<AuthPage />} />
      </Routes>
    </Router>
    </UserProvider>
  );
};

export default AppRouter;
