import React, { useState } from "react";
import Navbar from "../components/ui/Navbar"; // Navbar component
import Sidebar from "../components/ui/Sidebar"; // Sidebar component ChatSidebar
import PostContent from "../components/ui/PostContent"; // PostContent component
import CreatePost from "../components/posts/CreatePost"; // PostContent component
import PostList from "../components/posts/PostList"; // PostContent component
// import ChatContent from "../components/ui/ChatContent"; // ChatContent component
import ChatSidebar from "../components/chat/ChatSidebar"; // ChatContent component

export default function HomePage() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className={isDarkMode ? "min-h-screen bg-[#1E1E1E] text-white" : "min-h-screen bg-gray-100 text-gray-900"}>
      {/* Navbar */}
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      {/* Main Content */}
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)] pt-23"> 
        <Sidebar isDarkMode={isDarkMode} className="md:w-64 w-full" />

        {/* Post Content */}
        <div className="flex-1 p-3 ">
          {/* <CreatePost isDarkMode={isDarkMode} /> */}
          <PostList isDarkMode={isDarkMode} />
        </div>

        {/* Chat Content */}
        <ChatSidebar isDarkMode={isDarkMode} className="md:w-64 w-full" />
      </div>
    </div>
  );
}
