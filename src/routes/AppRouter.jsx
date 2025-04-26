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
import FollowerListPage from "../pages/FollowerListPage"; // <-- IMPORT NEW
import FollowingListPage from "../pages/FollowingListPage"; // <-- IMPORT NEW

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
    
        {/* Viewing other users' profiles might be public */}
        <Route path="/profiles/:profileId" element={<ProfilePageById />} />
        <Route path="/profiles/:profileId/followers" element={<PrivateRoute> <FollowerListPage /> </PrivateRoute>} />
        <Route path="/profiles/:profileId/following" element={<PrivateRoute> <FollowingListPage /> </PrivateRoute>} />

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
