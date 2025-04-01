import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Home, MessageCircle, User, Plus, Settings, Bell, Sun, Moon, LogOut, Menu } from "lucide-react";
import logo from "../../assets/images/logo.png"; // Adjust the path to your logo image

export default function Navbar({ isDarkMode, toggleTheme }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("/dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className={`fixed top-0 left-0 w-full flex items-center justify-between p-3 bg-transparent backdrop-blur-md`}> 
      <div className="flex items-center gap-5">
        {/* Logo */}
        <div className="text-xl font-bold cursor-pointer">
          <img src={logo} alt="Logo" className="h-12 w-12" /> 
        </div>

        {/* Search Bar (Hidden on Small Screens) */}
        <input
          type="text"
          placeholder="#Explore"
          className={`hidden md:block ${isDarkMode 
            ? "bg-[#333] p-2 rounded-lg text-white focus:outline-none w-70 placeholder-gray-400 hover:bg-gray-700"
            : "bg-gray-300 p-2 rounded-lg text-gray-900 focus:outline-none w-70 placeholder-gray-500 hover:bg-gray-400"}`}
        />
      </div>

      {/* Desktop Navigation Icons (Hidden on Small Screens) */}
      <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 gap-6">
        {[{ path: "/dashboard", Icon: Home },
          { path: "/chat", Icon: MessageCircle },
          { path: "/profile", Icon: User },
          { path: "/notifications", Icon: Bell },
          { path: "/settings", Icon: Settings },
          { path: "/add", Icon: Plus }].map(({ path, Icon }) => (
          <Link key={path} to={path} onClick={() => setActiveTab(path)} className="relative group">
            <Icon size={24} className={activeTab === path ? "text-yellow-400" : isDarkMode ? "text-white group-hover:text-yellow-400" : "text-gray-900 group-hover:text-yellow-400"} />
            {activeTab === path && <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-yellow-400 rounded-full"></span>}
          </Link>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <button onClick={toggleMenu} className="md:hidden p-2 rounded-full hover:bg-gray-700">
        <Menu size={24} className={isDarkMode ? "text-white" : "text-gray-900"} />
      </button>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="w-64 h-full bg-gray-800 text-white p-5 flex flex-col gap-4">
            <button onClick={toggleMenu} className="self-end text-gray-400 hover:text-white">✖</button>
            {[{ path: "/dashboard", label: "Dashboard", Icon: Home },
              { path: "/chat", label: "Chat", Icon: MessageCircle },
              { path: "/profile", label: "Profile", Icon: User },
              { path: "/notifications", label: "Notifications", Icon: Bell },
              { path: "/settings", label: "Settings", Icon: Settings },
              { path: "/add", label: "Add Post", Icon: Plus }].map(({ path, label, Icon }) => (
              <Link key={path} to={path} onClick={toggleMenu} className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded-lg">
                <Icon size={24} className="text-yellow-400" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Theme Toggle and Avatar */}
      <div className="hidden md:flex ml-auto items-left gap-4 relative">
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-700">
          {isDarkMode ? <Sun size={24} className="text-yellow-400" /> : <Moon size={24} className="text-gray-900" />}
        </button>
        <div className={isDarkMode ? "w-10 h-10 bg-gray-600 rounded-full cursor-pointer hover:ring-2 hover:ring-yellow-400" : "w-10 h-10 bg-gray-400 rounded-full cursor-pointer hover:ring-2 hover:ring-yellow-400"} onClick={toggleDropdown}></div>
        {dropdownOpen && (
          <div className="absolute right-0 mt-14 w-40 bg-white text-black rounded-lg shadow-lg">
            <ul className="py-2">
              <li className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer hover:text-yellow-400">
                <User size={20} />
                <Link to="/profile" className="text-black hover:text-yellow-400 no-underline">Profile</Link>
              </li>
              <li className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer hover:text-yellow-400">
                <LogOut size={20} />
                <Link to="/logout" className="text-black hover:text-yellow-400 no-underline">Logout</Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}