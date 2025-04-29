import React, { useState } from "react";
import Sidebar from "../components/ui/Sidebar";
import PostList from "../components/posts/PostList";
import ChatSidebar from "../components/chat/ChatSidebar";

import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const navigate = useNavigate('login')

  if (!localStorage.getItem("access_token")) {
    navigate("/login");
    return null; // Prevent rendering if not authenticated
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 text-gray-900">
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)] pt-28 w-[90%] mx-auto gap-6">
        <Sidebar className="md:w-64 w-full" />

        <div className="flex-1">
          <PostList />
        </div>

        
        <ChatSidebar className="md:w-64 w-full max-w-full" />
      </div>
    </div>
    </>
  );
}

