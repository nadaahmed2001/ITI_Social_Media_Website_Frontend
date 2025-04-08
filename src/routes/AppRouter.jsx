import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import HomePage from "../pages/HomePage";
import ProfilePage from "../pages/ProfilePage";
import SearchPage from "../pages/SearchPage";
import NotificationsDropdown from "../pages/NotificationsDropdown";
// Components (Optional - For Direct Rendering in Pages)
import SignUpForm from "../components/auth/SignUpForm";
import LoginForm from "../components/auth/LoginForm";
import ForgotPassword from "../components/auth/ForgotPassword";
import PasswordResetConfirm from "../components/auth/PasswordResetConfirm";
import CreatePost from "../components/posts/CreatePost";
import ShowPost from "../components/posts/ShowPost";
import PostList from "../components/posts/PostList";
import ChatSidebar from "../components/chat/ChatSidebar";
import MessagesList from "../components/chat/MessagesList";
import FollowButton from "../components/profiles/FollowButton";
import SearchFilters from "../components/search/SearchFilters";
import DeletePost from "../components/posts/DeletePost";
import EditPost from "../components/posts/EditPost";
import Sidebar from "../components/profiles/Sidebar/Sidebar";
import UserProfilePage from "../pages/UserProfilePage";
import EmailChangeSuccess from "../pages/EmailChangeSuccess";
import EmailChangeFailed from "../pages/EmailChangeFailed";

import { AuthProvider } from "../contexts/AuthContext";
import PrivateRoute from './../components/PrivateRoute';
// import ShowReactionsPost from "../components/posts/showReactionsPost";
import Dashboard from "../pages/SupervisorDashboard/Dashboard";
import BatchPage from "../pages/SupervisorDashboard/BatchPage";
import HomePage from "../pages/HomePage";
import PostListWithSideBar from "../components/posts/PostListWithSideBar";
import Aichat from "../components/chat/Aichat";



const AppRouter = () => {
        const userToken = localStorage.getItem("access_token") || sessionStorage.getItem("access_token") || null;
        // console.log("User Token:", userToken); // Log the token to check its value
        return (
                <AuthProvider>
                        <Router>

                                <Routes>
                                        {/* Authentication */}
                                        {/* <Route path="/auth" element={<AuthPage />} /> */}
                                        <Route path="/signup" element={<SignUpForm />} />
                                        <Route path="/login" element={<LoginForm />} />
                                        <Route path="/forgot-password" element={<ForgotPassword />} />
                                        <Route path="/password-reset-confirm" element={<PasswordResetConfirm />} />

                                        {/* Dashboards */}
                                        <Route path="/Home" element={<HomePage />} />


                                        {/* Supervisor Routes */}

                                        {/* This is the dashboard that make supervisor manage the batches */}
                                        <Route path="/supervisor/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                                        <Route path="/batches/:trackId" element={<BatchPage />} />

                                        {/* Profile, Search, and Chat */}
                                        <Route path="/profile" element={<UserProfilePage />} />
                                        <Route path="/search" element={<SearchPage />} />
                                        <Route path="/chat" element={<ChatSidebar token={userToken} />} />
                                        <Route path="/Sidebar" element={<Sidebar />} />
                                        <Route path="/chat/aiChat" element={<Aichat />} />
                                        <Route path="/messagesList/group/:id" element={<MessagesList token={userToken} isGroupChat={true} />} />
                                        <Route path="/messagesList/private/:id" element={<MessagesList token={userToken} isGroupChat={false} />} />

                                        {/* Notifications */}
                                        <Route path="/notifications" element={<NotificationsDropdown />} />

                                        {/* Posts */}
                                        <Route path="/posts/create" element={<CreatePost />} />
                                        <Route path="/posts/show" element={<ShowPost />} />
                                        <Route path="/posts/delete" element={<DeletePost />} />
                                        <Route path="/posts/edit" element={<EditPost />} />
                                        <Route path="/posts/list" element={<PostList />} />
                                        {/* <Route path="/dashboard" element={<PrivateRoute><PostListWithSideBar /></PrivateRoute>} /> */}
                                        {/* <Route path="/posts/show-reactions/:postId" element={<ShowReactionsPost />} /> */}

                                        {/* Profile Components */}
                                        <Route path="/profiles/followbutton" element={<FollowButton />} />
                                        <Route path="/profiles/:userId" element={<ProfilePage />} />

                                        {/* Search Components */}
                                        <Route path="/search/filters" element={<SearchFilters />} />

                                        {/* Email Change */}
                                        <Route path="/email-change-success" element={<EmailChangeSuccess />} />
                                        <Route path="/email-change-failed/" element={<EmailChangeFailed />} />

                                        {/* Default Route */}
                                        <Route path="*" element={<LoginForm />} />
                                </Routes>

                        </Router>
                </AuthProvider>
        );
};

export default AppRouter;
