import React, { useState } from "react";
import Navbar from "../components/ui/Navbar"; 
import MainContent from "../components/ui/MainContent";

export default function DashboardPage() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className={isDarkMode ? "min-h-screen bg-[#1E1E1E] text-white" : "min-h-screen bg-gray-100 text-gray-900"}>

      
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

    </div>
  );
}
