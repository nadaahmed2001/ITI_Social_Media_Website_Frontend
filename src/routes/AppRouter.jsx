// //AppRouter.jsx
// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// // import ProfilePage from "../pages/ProfilePage";
// import SearchPage from "../pages/SearchPage";
// import NotificationsDropdown from "../pages/NotificationsDropdown";
// // Components (Optional - For Direct Rendering in Pages)
// import SignUpForm from "../components/auth/SignUpForm";
// import LoginForm from "../components/auth/LoginForm";
// import ForgotPassword from "../components/auth/ForgotPassword";
// import PasswordResetConfirm from "../components/auth/PasswordResetConfirm";
// import CreatePost from "../components/posts/CreatePost";
// import ShowPost from "../components/posts/ShowPost";
// import PostList from "../components/posts/PostList";
// import ChatSidebar from "../components/chat/ChatSidebar";
// import MessagesList from "../components/chat/MessagesList";
// import FollowButton from "../components/profiles/FollowButton";
// import SearchFilters from "../components/search/SearchFilters";
// import DeletePost from "../components/posts/DeletePost";
// import EditPost from "../components/posts/EditPost";
// import Sidebar from "../components/profiles/Sidebar/Sidebar";
// import UserProfilePage from "../pages/UserProfilePage";
// import EmailChangeSuccess from "../pages/EmailChangeSuccess";
// import EmailChangeFailed from "../pages/EmailChangeFailed";

// import ProfilePageById from "../components/profiles/ProfilePageById";

// import { AuthProvider } from "../contexts/AuthContext";
// import PrivateRoute from './../components/PrivateRoute';
// // import ShowReactionsPost from "../components/posts/showReactionsPost";
// import Dashboard from "../pages/SupervisorDashboard/Dashboard";
// // import Dashboard from "../pages/SupervisorDashboard/Dashboard2";
// import BatchPage from "../pages/SupervisorDashboard/BatchPage";
// import HomePage from "../pages/HomePage";
// import PostListWithSideBar from "../components/posts/PostListWithSideBar";
// import Aichat from "../components/chat/Aichat";



// import PostDetail from "../components/notifications/PostDetail"; // Import the PostDetail component

// const AppRouter = () => {
//         const userToken = localStorage.getItem("access_token") || sessionStorage.getItem("access_token") || null;
//         // console.log("User Token:", userToken); // Log the token to check its value
//         return (
//                 <AuthProvider>
//                         <Router>
                                
//                                 <Routes>
//                                         {/* Authentication */}
//                                         {/* <Route path="/auth" element={<AuthPage />} /> */}
//                                         <Route path="/signup" element={<SignUpForm />} />
//                                         <Route path="/login" element={<LoginForm />} />
//                                         <Route path="/forgot-password" element={<ForgotPassword />} />
//                                         <Route path="/password-reset-confirm" element={<PasswordResetConfirm />} />

                                        

//                                         {/* Dashboards */}
//                                         <Route path="/Home" element={<HomePage />} />


//                                         {/* Supervisor Routes */}

//                                         {/* This is the dashboard that make supervisor manage the batches */}
//                                         {/* <Route path="/supervisor/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} /> */}
//                                         <Route path="/supervisor/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
//                                         <Route path="/batches/:programId/:trackId" element={<BatchPage />} />

//                                         {/* Profile, Search, and Chat */}
//                                         <Route path="/profile" element={<UserProfilePage />} />
//                                         <Route path="/search" element={<SearchPage />} />
//                                         <Route path="/chat" element={<ChatSidebar token={userToken} />} />
//                                         <Route path="/Sidebar" element={<Sidebar />} />
//                                         <Route path="/chat/aiChat" element={<Aichat />} />
//                                         <Route path="/messagesList/group/:id" element={<MessagesList token={userToken} isGroupChat={true} />} />
//                                         <Route path="/messagesList/private/:id" element={<MessagesList token={userToken} isGroupChat={false} />} />

//                                         {/* Notifications */}
//                                         <Route path="/notifications" element={<NotificationsDropdown />} />

//                                         {/* Posts */}
//                                         <Route path="/posts/create" element={<CreatePost />} />
//                                         <Route path="/posts/show" element={<ShowPost />} />
//                                         <Route path="/posts/delete" element={<DeletePost />} />
//                                         <Route path="/posts/edit" element={<EditPost />} />
//                                         <Route path="/posts/list" element={<PostList />} />
//                                         {/* <Route path="/dashboard" element={<PrivateRoute><PostListWithSideBar /></PrivateRoute>} /> */}
//                                         {/* <Route path="/posts/show-reactions/:postId" element={<ShowReactionsPost />} /> */}

//                                         {/* Profile Components */}
//                                         <Route path="/profiles/followbutton" element={<FollowButton />} />
//                                         <Route path="/profiles/:profileId" element={<ProfilePageById />} />

//                                         {/* Search Components */}
//                                         <Route path="/search/filters" element={<SearchFilters />} />

//                                         {/* Email Change */}
//                                         <Route path="/email-change-success" element={<EmailChangeSuccess />} />
//                                         <Route path="/email-change-failed/" element={<EmailChangeFailed />} />

//                                         {/* <Route path="/posts/:postId" element={<PostDetail />} /> */}
//                                         <Route path="/dashboard/posts/:postId" element={<PostDetail />} />

//                                         {/* Default Route */}
//                                         <Route path="*" element={<LoginForm />} />
//                                 </Routes>

//                         </Router>
//                 </AuthProvider>
//         );
// };

// export default AppRouter;


import {React} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

// All your imports (same as before) ...
import Logout from "../pages/Logout";
import SearchPage from "../pages/SearchPage";
import NotificationsDropdown from "../pages/NotificationsDropdown";
import SignUpForm from "../components/auth/SignUpForm";
import LoginForm from "../components/auth/LoginForm";
import ForgotPassword from "../components/auth/ForgotPassword";
import PasswordResetConfirm from "../components/auth/PasswordResetConfirm";
import ChatSidebar from "../components/chat/ChatSidebar";
import MessagesList from "../components/chat/MessagesList";
import FollowButton from "../components/profiles/FollowButton";
import SearchFilters from "../components/search/SearchFilters";
import Sidebar from "../components/profiles/Sidebar/Sidebar";
import UserProfilePage from "../pages/UserProfilePage";
import EmailChangeSuccess from "../pages/EmailChangeSuccess";
import EmailChangeFailed from "../pages/EmailChangeFailed";
import ProfilePageById from "../components/profiles/ProfilePageById";
import ViewPublicProfileWrapper from "../components/profiles/UserProfile/ViewPublicProfileWrapper";
import { AuthProvider } from "../contexts/AuthContext";
import PrivateRoute from "../components/PrivateRoute"; // Your PrivateRoute component
import Dashboard from "../pages/SupervisorDashboard/Dashboard";
import BatchPage from "../pages/SupervisorDashboard/BatchPage";
import HomePage from "../pages/HomePage";
import Aichat from "../components/chat/Aichat";
import PostDetail from "../components/notifications/PostDetail";
import Navbar from "../components/ui/Navbar";
import StartChat from "../pages/startChat";

// ✅ IMPORT ChatNotificationProvider
import { ChatNotificationProvider } from "../contexts/ChatNotificationContext";

// Wrapper component to handle conditional Navbar and Routes
const AppContent = () => {
  const location = useLocation();
  // Routes where the Navbar should be hidden
  const hideNavbarRoutes = [
    "/login",
    "/signup",
    "/forgot-password",
    "/password-reset-confirm",
    "/email-change-success",
    "/email-change-failed",
    "/logout",
  ];

  // Check if the current path starts with /messagesList/
  // const isMessagesListRoute = location.pathname.startsWith("/messagesList/");

  // Determine if Navbar should be shown
  // Show Navbar if NOT in hideNavbarRoutes AND NOT a messagesList route
  const showNavbar = !hideNavbarRoutes.includes(location.pathname) ;


  // You might not need userToken here if PrivateRoute handles context internally
  // const userToken = localStorage.getItem("access_token") || sessionStorage.getItem("access_token") || null;

  return (
    <>
      {/* Conditionally render Navbar */}
      {showNavbar && <Navbar />}

      <Routes>
        {/* --- Public Authentication Routes --- */}
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/password-reset-confirm" element={<PasswordResetConfirm />} />
        <Route path="/email-change-success" element={<EmailChangeSuccess />} />
        <Route path="/email-change-failed" element={<EmailChangeFailed />} />
        <Route path="/logout" element={<Logout />} />

        <Route path="/search" element={<SearchPage />} />



        {/* --- Protected Routes --- */}
        <Route
          path="/Home"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/supervisor/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/batches/:programId/:trackId"
          element={
            <PrivateRoute> {/* Assuming batches require login */}
              <BatchPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"  // User's own profile
          element={
            <PrivateRoute>
              <UserProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <StartChat />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat/aiChat"
          element={
            <PrivateRoute>
              <Aichat />
            </PrivateRoute>
          }
        />
        <Route
          path="/messagesList/group/:id"
          element={
            <PrivateRoute>
              <MessagesList /* token={userToken} */ isGroupChat={true} />
            </PrivateRoute>
          }
        />
        <Route
          path="/messagesList/private/:id"
          element={
            <PrivateRoute>
              <MessagesList /* token={userToken} */ isGroupChat={false} />
            </PrivateRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <NotificationsDropdown />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/posts/:postId" // Viewing specific post detail
          element={
            <PrivateRoute>
              <PostDetail />
            </PrivateRoute>
          }
        />

         {/* <Route path="/dashboard/chat/private/:id"
         element={
          <PrivateRoute>
            <MessagesList isGroupChat={false} />
          </PrivateRoute>
        }
      />
       <Route path="/dashboard/chat/groups/:id"
       element={
        <PrivateRoute>
          <MessagesList isGroupChat={true} />
        </PrivateRoute>
      }
    /> */}
    
         {/* <Route path="/profiles/followbutton" element={<PrivateRoute><FollowButton /></PrivateRoute>} /> */}

        {/* --- Potentially Public Routes --- */}
        {/* Viewing other users' profiles might be public */}
        <Route path="/profiles/:profileId" element={<ProfilePageById />} />
        {/* Search filters might be part of a public search page */}
        <Route path="/search/filters" element={<SearchFilters />} />
        {/* Follow button might be inside ProfilePageById and check auth there */}
        <Route path="/profiles/followbutton" element={<FollowButton />} />


        {/* --- Default fallback --- */}
        <Route path="*" element={<LoginForm />} />
      </Routes>
    </>
  );
};

// Main Router component remains the same
const AppRouter = () => {
  return (
    <AuthProvider>
      <ChatNotificationProvider>
        <Router>
          <AppContent />
        </Router>
      </ChatNotificationProvider>
    </AuthProvider>
  );
};

export default AppRouter;
