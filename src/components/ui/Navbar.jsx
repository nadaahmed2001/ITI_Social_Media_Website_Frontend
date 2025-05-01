import React, { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import {
  Home,
  MessageCircle,
  User,
  LogOut,
  Menu,
  ChartBarDecreasing,
  Search, // Import Search icon (optional, if you add a button)
} from "lucide-react";
import NotificationsDropdown from "../../pages/NotificationsDropdown";
import logo from "../../assets/images/logo.png";
import AuthContext from "../../contexts/AuthContext";
import defaultAvatar from "../../assets/images/user-default.webp";
import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline";
import { useChatNotification } from "../../contexts/ChatNotificationContext";
import "./navbar.css";
import ExploreIcon from "@mui/icons-material/Explore"; // Example Icon

export default function Navbar({ isDarkMode, toggleTheme }) {
  const { user, loading } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { unreadChatNotifications } = useChatNotification();
  const activeTab = location.pathname;

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMenuOpen(false);
    }
  };

  if (loading) return null;

  const navItems = [
    { path: "/Home", label: "Dashboard", Icon: Home },
    {
      path: "/chat",
      label: "Chat",
      Icon: MessageCircle,
      customActive: location.pathname.startsWith("/chat"),
    },
    { path: "/profile", label: "Profile", Icon: User },
    { path: "/projects/feed", label: "Explore", Icon: ExploreIcon },

    ...(user?.is_supervisor
      ? [
          {
            path: "/supervisor/dashboard",
            label: "Supervisor",
            Icon: ChartBarDecreasing,
          },
        ]
      : []),
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-red-900/80 backdrop-blur-md shadow-md px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/Home">
            <img src={logo} alt="Logo" className="h-10 w-10 rounded-full" />
          </Link>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchSubmit}
            placeholder="#Explore Profiles..."
            className="hidden md:block bg-white/20 text-white px-3 py-2 rounded-lg placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 w-72"
          />
        </div>

        <div className="hidden md:flex gap-6 navbar-icons">
          {navItems.map(({ path, Icon, customActive }) => (
            <Link key={path} to={path} className="relative group">
              <Icon
                size={24}
                className={`transition ${
                  customActive || activeTab === path
                    ? "text-white"
                    : "text-white/60 group-hover:text-white"
                }`}
              />
              {(customActive || activeTab === path) && (
                <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></span>
              )}
              {path === "/chat" && unreadChatNotifications.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {unreadChatNotifications.length > 9
                    ? "9+"
                    : unreadChatNotifications.length}
                </span>
              )}
            </Link>
          ))}
          <NotificationsDropdown />
        </div>

        {/* Profile Avatar */}
        <div className="hidden md:flex items-center gap-4 relative">
          <div
            onClick={toggleDropdown}
            className="w-10 h-10 rounded-full ring-2 hover:ring-[#7B2326] cursor-pointer overflow-hidden"
          >
            <img
              src={user?.profile_picture || defaultAvatar}
              alt="Avatar"
              className="w-full h-full object-cover"
              onError={(e) => {
                if (e.target.src !== defaultAvatar)
                  e.target.src = defaultAvatar;
              }}
            />
          </div>
          {dropdownOpen && (
            <div className="absolute right-0 top-14 bg-white text-black rounded-lg shadow-lg w-48 z-50">
              <ul className="py-1 ">
                <li className="hover:bg-gray-100">
                  <Link
                    style={{ textDecoration: "none" }}
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 no-underline"
                  >
                    <User className="text-[#7B2326]" size={18} />{" "}
                    <span className="text-gray-900">Profile</span>
                  </Link>
                </li>
                <li className="hover:bg-gray-100">
                  <Link
                    style={{ textDecoration: "none" }}
                    to="/logout"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2"
                  >
                    <LogOut className="text-[#7B2326]" size={18} />{" "}
                    <span className="text-gray-900">Logout</span>
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Hamburger */}
        <button onClick={toggleMenu} className="md:hidden">
          <Menu size={24} className="text-white" />
        </button>
      </nav>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex justify-end mt-15">
          <div className="bg-white w-3/4 max-w-xs p-6 flex flex-col gap-4 shadow-lg">
            <button onClick={toggleMenu} className="self-end text-gray-500">
              ✖
            </button>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchSubmit}
              placeholder="#Explore Profiles..."
              className="bg-gray-100 text-black px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            {navItems.map(({ path, label, Icon }) => (
              <Link
                style={{ textDecoration: "none" }}
                key={path}
                to={path}
                onClick={toggleMenu}
                className={`flex items-center gap-3 p-2 rounded-lg !text-gray-800 hover:bg-gray-200 ${
                  activeTab === path ? "bg-gray-300 font-semibold" : ""
                }`}
              >
                <Icon size={22} className="text-[#7B2326]" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
