import {React} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import LayoutWithNavbar from "../layouts/LayoutWithNavbar";
import LayoutWithoutNavbar from "../layouts/LayoutWithoutNavbar";

import Logout from "../pages/Logout";
import SearchPage from "../pages/SearchPage";
import NotificationsDropdown from "../pages/NotificationsDropdown";
import SignUpForm from "../components/auth/SignUpForm";
import LoginForm from "../components/auth/LoginForm";
import ForgotPassword from "../components/auth/ForgotPassword";
import PasswordResetConfirm from "../components/auth/PasswordResetConfirm";
import MessagesList from "../components/chat/MessagesList";
import FollowButton from "../components/profiles/FollowButton";
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
import StartChat from "../pages/startChat";
import FollowerListPage from "../pages/FollowerListPage"; 
import FollowingListPage from "../pages/FollowingListPage"; 
import NotFoundPage from "../pages/NotFoundPage"; 
import UserPostsPage from "../pages/UserPostsPage";
import { ChatNotificationProvider } from "../contexts/ChatNotificationContext";
import ProjectPage from '../pages/ProjectPage'; // Import the new page
import ProjectFeedPage from '../pages/ProjectFeedPage'; // Import
import UsersList from "../pages/UsersList";//New




const AppContent = () => {

  return (
    <>
      <Routes>
        {/* --- Routes without Navbar --- */}
        <Route element={<LayoutWithoutNavbar />}>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/password-reset-confirm" element={<PasswordResetConfirm />} />
          <Route path="/email-change-success" element={<EmailChangeSuccess />} />
          <Route path="/email-change-failed" element={<EmailChangeFailed />} />
          <Route path="/logout" element={<Logout />} />
          {/* --- Default fallback --- */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* --- Routes with Navbar --- */}
        <Route element={<LayoutWithNavbar />}>
          
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
            path="/"
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
              <PrivateRoute>
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

          {/* Route to show all users */}
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <UsersList/>
              </PrivateRoute>
            }
          />

          {/* <Route path="/dashboard/chat/private/:id"
            element={
              <PrivateRoute>
                <MessagesList isGroupChat={false} />
              </PrivateRoute>
            }
          /> */}
          {/* <Route path="/dashboard/chat/groups/:id"
            <Route path="/dashboard/chat/groups/:id"
            element={
              <PrivateRoute>
                <MessagesList isGroupChat={true} />
              </PrivateRoute>
            }
          /> */}
      
          <Route
            path="/profiles/:profileId"
            element={
              <PrivateRoute>
                <ProfilePageById />
              </PrivateRoute>
            }
          />

          <Route
            path="/profiles/:profileId/followers"
            element={
              <PrivateRoute>
                <FollowerListPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profiles/:profileId/following"
            element={
              <PrivateRoute>
                <FollowingListPage />
              </PrivateRoute>
            }
          />
          <Route 
            path="/profiles/:profileId/posts" 
            element={
              <PrivateRoute> 
                <UserPostsPage />              
              </PrivateRoute>
            } 
          />
          <Route 
            path="/projects/:projectId" 
            element={
            <PrivateRoute> 
              <ProjectPage />
            </PrivateRoute>
            } 
            />
          
          <Route 
            path="/projects/feed" 
            element={
            <PrivateRoute> 
              <ProjectFeedPage />
            </PrivateRoute>
            } 
            /> 


          <Route path="/search" element={<SearchPage />} />
          {/* Follow button might be inside ProfilePageById and check auth there */}
          <Route path="/profiles/followbutton" element={<FollowButton />} />
        </Route>
      </Routes>
    </>
  );
};

// Main Router component
const AppRouter = () => {
  return (
    <Router>

    <AuthProvider>
      <ChatNotificationProvider>
          <AppContent />
      </ChatNotificationProvider>
    </AuthProvider>
  </Router>
  );
};

export default AppRouter;
