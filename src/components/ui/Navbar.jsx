//Navbar.jsx
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  MessageCircle,
  User,
  // Settings,
  Sun,
  Moon,
  LogOut,
  Menu,
  ChartBarDecreasing,
} from "lucide-react";
import NotificationsDropdown from "../../pages/NotificationsDropdown";
import logo from "../../assets/images/logo.png"; 

import AuthContext from "../../contexts/AuthContext"; // Import AuthContext

export default function Navbar({ isDarkMode, toggleTheme }) {
  const { user,loading } = useContext(AuthContext); // Access the user object from AuthContext
  // console.log("User from Navbar.jsx:", user); // Log the user object to the console


  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("/dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Handle scroll event
  const handleScroll = () => {
    if (window.scrollY > lastScrollY) {
      // Scrolling down
      setIsVisible(false);
    } else {
      // Scrolling up
      setIsVisible(true);
    }
    setLastScrollY(window.scrollY); // Update last scroll position
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]); // Re-run this effect when lastScrollY changes


  if (loading) {
    return null;
  }
  // console.log("User from Navbar.jsx:", user);


  return (
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between p-3 bg-transparent backdrop-blur-md transition-all duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 -translate-y-full"
      }`}
    >
      <div className="flex items-center gap-5">
        {/* Logo */}
        <div className="text-xl font-bold cursor-pointer">
          <img src={logo} alt="Logo" className="h-12 w-12" />
        </div>

        {/* Search Bar (Hidden on Small Screens) */}
        <input
          type="text"
          placeholder="#Explore"
          className={`hidden md:block ${
            isDarkMode
              ? "bg-[#333] p-2 rounded-lg text-white focus:outline-none w-70 placeholder-gray-400 hover:bg-gray-700"
              : "bg-gray-300 p-2 rounded-lg text-gray-900 focus:outline-none w-70 placeholder-gray-500 hover:bg-gray-400"
          }`}
        />
      </div>

      {/* Desktop Navigation Icons (Hidden on Small Screens) */}
      <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 gap-6">
        {[
          { path: "/Home", Icon: Home },
          { path: "/chat", Icon: MessageCircle },
          { path: "/profile", Icon: User },
          // { path: "/settings", Icon: Settings },
          // Conditionally render ChartBarDecreasing for supervisors
          ...(user?.is_supervisor
            ? [{ path: "/supervisor/dashboard", Icon: ChartBarDecreasing }]
            : []),
        ].map(({ path, Icon }) => (
          <Link
            key={path}
            to={path}
            onClick={() => setActiveTab(path)}
            className="relative group"
          >
            <Icon
              size={24}
              className={
                activeTab === path
                  ? "text-[#7B2326]"
                  : isDarkMode
                  ? "text-white group-hover:text-[#7B2326]"
                  : "text-white group-hover:text-[#7B2326]"
              }
            />
            {activeTab === path && (
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#7B2326] rounded-full"></span>
            )}
          </Link>
        ))}
        <NotificationsDropdown />
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className="md:hidden p-2 rounded-full hover:bg-gray-700"
      >
        <Menu
          size={24}
          className={isDarkMode ? "text-white" : "text-gray-900"}
        />
      </button>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="w-64 h-full bg-gray-800 text-white p-5 flex flex-col gap-4">
            <button
              onClick={toggleMenu}
              className="self-end text-gray-400 hover:text-white"
            >
              ✖
            </button>
            {[
              { path: "/Home", label: "Dashboard", Icon: Home },
              { path: "/chat", label: "Chat", Icon: MessageCircle },
              { path: "/profile", label: "Profile", Icon: User },
              // { path: "/settings", label: "Settings", Icon: Settings },
              // Conditionally render ChartBarDecreasing for supervisors
              ...(user?.is_supervisor
                ? [
                    {
                      path: "/supervisor/dashboard",
                      label: "Dashboard",
                      Icon: ChartBarDecreasing,
                    },
                  ]
                : []),
            ].map(({ path, label, Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={toggleMenu}
                className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded-lg"
              >
                <Icon size={24} className="text-[#7B2326]" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Theme Toggle and Avatar */}
      <div className="hidden md:flex ml-auto items-left gap-4 relative">
        {/* <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-700"
        >
          {isDarkMode ? (
            <Sun size={24} className="text-[#7B2326]" />
          ) : (
            <Moon size={24} className="text-gray-900" />
          )}
        </button> */}
        <div
          className={
            isDarkMode
              ? "w-10 h-10 bg-gray-600 rounded-full cursor-pointer hover:ring-2 hover:ring-[#7B2326]"
              : "w-10 h-10 bg-gray-400 rounded-full cursor-pointer hover:ring-2 hover:ring-[#7B2326]"
          }
          onClick={toggleDropdown}
        ></div>
        {dropdownOpen && (
          <div className="absolute right-0 mt-14 w-40 bg-white text-black rounded-lg shadow-lg">
            <ul className="py-2">
              <li className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer hover:text-[#7B2326]">
                <User size={20} />
                <Link
                  to="/profile"
                  className="text-black hover:text-[#7B2326] no-underline"
                >
                  Profile
                </Link>
              </li>
              <li className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer hover:text-[#7B2326]">
                <LogOut size={20} />
                <Link
                  to="/logout"
                  className="text-black hover:text-[#7B2326] no-underline"
                >
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}