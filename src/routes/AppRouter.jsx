import React from "react";
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

const AppRouter = () => {
  return (
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
        <Route path="/chat/*" element={<ChatPage />} />
        {/* Notifications */}
        <Route path="/notifications" element={<NotificationsPage />} />
        {/* Posts */}
        <Route path="/posts/create" element={<CreatePost />} />
        {/* Chat Routes */}
        <Route path="/messagesList/group/:id" element={<MessagesList isGroupChat={true} />} />
        <Route path="/messagesList/private/:id" element={<MessagesList isGroupChat={false} />} />
        {/* Profile Components */}
        <Route path="/profiles/followbutton" element={<FollowButton />} />
        <Route path="/profiles/userprofile" element={<UserProfile />} />
        {/* Search Components */}
        <Route path="/search/filters" element={<SearchFilters />} />
        {/* Default Route (Redirects to Dashboard or Login) */}
        <Route path="*" element={<AuthPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
