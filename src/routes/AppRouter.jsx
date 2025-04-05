import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "../pages/AuthPage";
// import DashboardPage from "../pages/DashboardPage";
import ProfilePage from "../pages/ProfilePage";
import SearchPage from "../pages/SearchPage";
// import ChatPage from "../pages/ChatPage";
import NotificationsDropdown from "../pages/NotificationsDropdown";
// Supervisor Pages
import ManageBatches from "../pages/SupervisorDashboard/ManageBatches";
import TrackOverview from "../pages/SupervisorDashboard/TrackOverview";
// Student Pages
// import FeedPage from "../pages/StudentDashboard/FeedPage";
import FeedPage from "../pages/FeedPage";
import GroupsPage from "../pages/StudentDashboard/GroupsPage";
// Components (Optional - For Direct Rendering in Pages)
//AppRouter.jsx
import SignUpForm from "../components/auth/SignUpForm";
import LoginForm from "../components/auth/LoginForm";
import ForgotPassword from "../components/auth/ForgotPassword";
import PasswordResetConfirm from "../components/auth/PasswordResetConfirm";
import FollowButton from "../components/profiles/FollowButton";
import UserProfile from "../components/profiles/UserProfile";
import SearchFilters from "../components/search/SearchFilters";
import { AuthProvider } from "../contexts/AuthContext";
import PrivateRoute from './../components/PrivateRoute';
// Posts
import CreatePost from "../components/posts/CreatePost";
import ShowPost from "../components/posts/ShowPost";
import PostList from "../components/posts/PostList";
import DeletePost from "../components/posts/DeletePost";
import EditPost from "../components/posts/EditPost";
import ShowReactionsPost from "../components/posts/ShowReactionsPost";
import ChatSidebar from "../components/chat/ChatSidebar";
import MessagesList from "../components/chat/MessagesList";
import Dashboard from "../pages/SupervisorDashboard/Dashboard";
import BatchPage from "../pages/SupervisorDashboard/BatchPage";
import StudentDashboard  from "../pages/StudentDashboard/Dashboard";

import Aichat from "../components/chat/Aichat";

const AppRouter = () => {
  return (
    <Router>
      <AuthProvider>
      <Routes>
        {/* Authentication */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/login" element={<LoginForm />} />

        <Route path="/feed" element={<FeedPage />} />
        {/* <Route path="/supervisor-dashboard" component={SupervisorDashboard} /> */}

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/password-reset-confirm" element={<PasswordResetConfirm />} />



        {/* Dashboards (Posts and homepage) */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        {/* <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} /> */}



        {/* Supervisor Routes */}
        <Route path="/supervisor/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/batches/:trackId" element={<BatchPage />} />
        {/* <Route path="/supervisor/track-overview" element={<TrackOverview />} /> */}

        
        {/* Student Routes */}
        {/* <Route path="/student/feed" element={<FeedPage />} /> */}
        <Route path="/student/groups" element={<GroupsPage />} />


        {/* Profile, Search, and Chat */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/search" element={<SearchPage />} />
        {/* Notifications */}
        <Route path="/notifications" element={<NotificationsDropdown />} />


        {/* Posts  */}
        <Route path="/posts/create" element={<CreatePost />} />
        <Route path="/posts/show" element={<ShowPost />} />
        <Route path="/posts/delete" element={<DeletePost />} />   
        <Route path="/posts/edit" element={<EditPost />} />
        {/* <Route path="/posts/list" element={<PostList />} /> */}
        <Route path="/dashboard" element={<PrivateRoute><PostList /></PrivateRoute>} />
        <Route path="/posts/show-reactions/:postId" element={<ShowReactionsPost />} />


        {/* Chat Component Example */}
        {/* <Route path="/chat/sidebar" element={<ChatSidebar />} />
        <Route path="/chat/messagesList" element={<MessagesList />} /> */}
         {/* Profile Components */}
        {/* Chat Routes */}
        <Route path="/chat/*" element={<ChatSidebar />} />
        <Route path="/messagesList/group/:id" element={<MessagesList isGroupChat={true} />} />
        <Route path="/messagesList/private/:id" element={<MessagesList isGroupChat={false} />} />
        <Route path="/chat/aiChat" element={<Aichat />} />
        {/* Profile Components */}
        <Route path="/profiles/followbutton" element={<FollowButton />} />
        <Route path="/profiles/userprofile" element={<UserProfile />} />
        {/* Search Components */}
        <Route path="/search/filters" element={<SearchFilters />} />
        {/* Default Route (Redirects to Dashboard or Login) */}
        <Route path="*" element={<AuthPage />} />
      </Routes>
      </AuthProvider>
    </Router>

  );
};

export default AppRouter;
