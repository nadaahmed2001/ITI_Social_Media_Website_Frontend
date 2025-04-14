// //Navbar.jsx
// import React, { useState, useContext } from "react";
// import { Link } from "react-router-dom";
// import {
//   Home,
//   MessageCircle,
//   User,
//   // Settings,
//   Sun,
//   Moon,
//   LogOut,
//   Menu,
//   ChartBarDecreasing,
// } from "lucide-react";
// import NotificationsDropdown from "../../pages/NotificationsDropdown";
// import logo from "../../assets/images/logo.png"; 

// import AuthContext from "../../contexts/AuthContext"; // Import AuthContext

// export default function Navbar({ isDarkMode, toggleTheme }) {
//   const { user,loading } = useContext(AuthContext); // Access the user object from AuthContext
//   // console.log("User from Navbar.jsx:", user); // Log the user object to the console


//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState("/dashboard");
//   const [menuOpen, setMenuOpen] = useState(false);

//   // const [lastScrollY, setLastScrollY] = useState(0);

//   const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
//   const toggleMenu = () => setMenuOpen(!menuOpen);

//   // Handle scroll event
//   // const handleScroll = () => {
//   //   if (window.scrollY > lastScrollY) {
//   //     // Scrolling down
//   //     setIsVisible(false);
//   //   } else {
//   //     // Scrolling up
//   //     setIsVisible(true);
//   //   }
//   //   setLastScrollY(window.scrollY); // Update last scroll position
//   // };

//   // useEffect(() => {
//   //   window.addEventListener("scroll", handleScroll);
//   //   return () => {
//   //     window.removeEventListener("scroll", handleScroll);
//   //   };
//   // }, [lastScrollY]); // Re-run this effect when lastScrollY changes


//   if (loading) {
//     return null;
//   }
//   // console.log("User from Navbar.jsx:", user);


//   return (
//     <nav className="fixed top-0 left-0 w-full flex items-center justify-between p-3 !bg-black backdrop-blur-md z-50">
//       <div className="flex items-center gap-5">
//         {/* Logo */}
//         <div className="text-xl font-bold cursor-pointer">
//           <img src={logo} alt="Logo" className="h-12 w-12" />
//         </div>

//         {/* Search Bar (Hidden on Small Screens) */}
//         <input
//           type="text"
//           placeholder="#Explore"
//           className={`hidden md:block ${
//             isDarkMode
//               ? "bg-[#333] p-2 rounded-lg text-white focus:outline-none w-70 placeholder-gray-400 hover:bg-gray-700"
//               : "bg-gray-300 p-2 rounded-lg text-gray-900 focus:outline-none w-70 placeholder-gray-500 hover:bg-gray-400"
//           }`}
//         />
//       </div>

//       {/* Desktop Navigation Icons (Hidden on Small Screens) */}
//       <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 gap-6">
//         {[
//           { path: "/Home", Icon: Home },
//           { path: "/chat", Icon: MessageCircle },
//           { path: "/profile", Icon: User },
//           // { path: "/settings", Icon: Settings },
//           // Conditionally render ChartBarDecreasing for supervisors
//           ...(user?.is_supervisor
//             ? [{ path: "/supervisor/dashboard", Icon: ChartBarDecreasing }]
//             : []),
//         ].map(({ path, Icon }) => (
//           <Link
//             key={path}
//             to={path}
//             onClick={() => setActiveTab(path)}
//             className="relative group"
//           >
//             <Icon
//               size={24}
//               className={
//                 activeTab === path
//                   ? "text-[#7B2326]"
//                   : isDarkMode
//                   ? "text-white group-hover:text-[#7B2326]"
//                   : "text-white group-hover:text-[#7B2326]"
//               }
//             />
//             {activeTab === path && (
//               <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#7B2326] rounded-full"></span>
//             )}
//           </Link>
//         ))}
//         <NotificationsDropdown />
//       </div>

//       {/* Mobile Menu Button */}
//       <button
//         onClick={toggleMenu}
//         className="md:hidden p-2 rounded-full hover:bg-gray-700"
//       >
//         <Menu
//           size={24}
//           className={isDarkMode ? "text-white" : "text-gray-900"}
//         />
//       </button>

//       {/* Mobile Menu Drawer */}
//       {menuOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
//           <div className="w-64 h-full bg-gray-800 text-white p-5 flex flex-col gap-4">
//             <button
//               onClick={toggleMenu}
//               className="self-end text-gray-400 hover:text-white"
//             >
//               ✖
//             </button>
//             {[
//               { path: "/Home", label: "Dashboard", Icon: Home },
//               { path: "/chat", label: "Chat", Icon: MessageCircle },
//               { path: "/profile", label: "Profile", Icon: User },
//               // { path: "/settings", label: "Settings", Icon: Settings },
//               // Conditionally render ChartBarDecreasing for supervisors
//               ...(user?.is_supervisor
//                 ? [
//                     {
//                       path: "/supervisor/dashboard",
//                       label: "Dashboard",
//                       Icon: ChartBarDecreasing,
//                     },
//                   ]
//                 : []),
//             ].map(({ path, label, Icon }) => (
//               <Link
//                 key={path}
//                 to={path}
//                 onClick={toggleMenu}
//                 className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded-lg"
//               >
//                 <Icon size={24} className="text-[#7B2326]" />
//                 {label}
//               </Link>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Theme Toggle and Avatar */}
//       <div className="hidden md:flex ml-auto items-left gap-4 relative">
//         {/* <button
//           onClick={toggleTheme}
//           className="p-2 rounded-full hover:bg-gray-700"
//         >
//           {isDarkMode ? (
//             <Sun size={24} className="text-[#7B2326]" />
//           ) : (
//             <Moon size={24} className="text-gray-900" />
//           )}
//         </button> */}
//         <div
//           className={
//             isDarkMode
//               ? "w-10 h-10 bg-gray-600 rounded-full cursor-pointer hover:ring-2 hover:ring-[#7B2326]"
//               : "w-10 h-10 bg-gray-400 rounded-full cursor-pointer hover:ring-2 hover:ring-[#7B2326]"
//           }
//           onClick={toggleDropdown}
//         ></div>
//         {dropdownOpen && (
//           <div className="absolute right-0 mt-14 w-40 bg-white text-black rounded-lg shadow-lg">
//             <ul className="py-2">
//               <li className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer hover:text-[#7B2326]">
//                 <User size={20} />
//                 <Link
//                   to="/profile"
//                   className="text-black hover:text-[#7B2326] no-underline"
//                 >
//                   Profile
//                 </Link>
//               </li>
//               <li className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer hover:text-[#7B2326]">
//                 <LogOut size={20} />
//                 <Link
//                   to="/logout"
//                   className="text-black hover:text-[#7B2326] no-underline"
//                 >
//                   Logout
//                 </Link>
//               </li>
//             </ul>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// }

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

export default function Navbar({ isDarkMode, toggleTheme }) {
  const { user, loading } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // *** State for search input ***
  const location = useLocation();
  const navigate = useNavigate(); // *** Hook for navigation ***
  const activeTab = location.pathname;

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const isMessagesActive =
    location.pathname === "/chat" ||
    location.pathname === "/chat/aiChat" ||
    location.pathname.startsWith("/messagesList/");

  // *** Handler for search input change ***
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // *** Handler for submitting search (on Enter key) ***
  const handleSearchSubmit = (event) => {
    // Check if Enter key was pressed and query is not just whitespace
    if (event.key === 'Enter' && searchQuery.trim()) {
      // Navigate to the search results page with the query parameter
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      // Optional: Clear the search input after submission
      // setSearchQuery('');
       // Optional: Close mobile menu if open
      if (menuOpen) {
          setMenuOpen(false);
      }
    }
  };

  if (loading) return null; // Or a loading skeleton

  // --- Nav items definitions (no changes) ---
  const navItems = [
    { path: "/Home", Icon: Home },
    { path: "/chat", Icon: MessageCircle, customActive: isMessagesActive },
    { path: "/profile", Icon: User },
    ...(user?.is_supervisor
      ? [{ path: "/supervisor/dashboard", Icon: ChartBarDecreasing }]
      : []),
  ];

  const mobileNavItems = [
    { path: "/Home", label: "Dashboard", Icon: Home },
    { path: "/chat", label: "Chat", Icon: MessageCircle },
    { path: "/profile", label: "Profile", Icon: User },
    ...(user?.is_supervisor
      ? [
          {
            path: "/supervisor/dashboard",
            label: "Supervisor Dashboard",
            Icon: ChartBarDecreasing,
          },
        ]
      : []),
  ];
  // --- End Nav items definitions ---


  return (
    <nav className="fixed top-0 left-0 w-full flex items-center justify-between p-3 !bg-black backdrop-blur-md z-50">
      {/* Logo & Search */}
      <div className="flex items-center gap-5">
        <Link to="/Home">
          <img src={logo} alt="Logo" className="h-12 w-12" />
        </Link>
        {/* --- Updated Search Input --- */}
        <input
          type="text"
          placeholder="#Explore Profiles..." // Updated placeholder
          value={searchQuery} // Controlled input
          onChange={handleSearchChange} // Update state on change
          onKeyDown={handleSearchSubmit} // Handle Enter key press
          className={`hidden md:block ${ // Keep existing styles
            isDarkMode // You might want to remove isDarkMode logic if theme is consistent
              ? "bg-[#333] p-2 rounded-lg text-white w-70 placeholder-gray-400 hover:bg-gray-700"
              : "bg-gray-300 p-2 rounded-lg text-gray-900 w-70 placeholder-gray-500 hover:bg-gray-400"
          } focus:outline-none`}
          aria-label="Search profiles" // Accessibility
        />
        {/* Optional: Add a search button here if desired */}
        {/* <button onClick={() => handleSearchSubmit({ key: 'Enter' })} className="p-2 text-white ..."> <Search size={20}/> </button> */}
      </div>

      {/* Center Desktop Nav (no changes) */}
      {/* ... */}
       <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 gap-6">
        {navItems.map(({ path, Icon, customActive }) => (
          <Link key={path} to={path} className="relative group">
            <Icon
              size={24}
              className={
                customActive || activeTab === path
                  ? "text-[#7B2326]"
                  // Simpler text color logic if dark mode isn't used here
                  : "text-white group-hover:text-[#7B2326]"
              }
            />
            {(customActive || activeTab === path) && (
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#7B2326] rounded-full"></span>
            )}
          </Link>
        ))}
        <NotificationsDropdown />
      </div>


      {/* Mobile Hamburger Menu (no changes) */}
      {/* ... */}
       <button
        onClick={toggleMenu}
        className="md:hidden p-2 rounded-full hover:bg-gray-700"
      >
         {/* Simpler text color logic if dark mode isn't used here */}
        <Menu size={24} className={"text-white"} />
      </button>


      {/* Mobile Menu Drawer (Consider adding search here too) */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="w-64 h-full bg-gray-800 text-white p-5 flex flex-col gap-4">
            <button
              onClick={toggleMenu}
              className="self-end text-gray-400 hover:text-white"
            >
              ✖
            </button>
            {/* Optional: Add a search input inside mobile menu */}
             <input
                type="text"
                placeholder="Search Profiles..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchSubmit}
                className="bg-[#333] p-2 rounded-lg text-white placeholder-gray-400 focus:outline-none mb-4"
                aria-label="Search profiles"
            />
            {/* --- Mobile Nav Items --- */}
            {mobileNavItems.map(({ path, label, Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={toggleMenu} // Close menu on navigation
                className={`flex items-center gap-3 p-2 rounded-lg ${
                  activeTab === path ? "bg-[#7B2326]" : "hover:bg-gray-700"
                }`}
              >
                <Icon size={24} className="text-[#7B2326]" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Avatar & Dropdown (no changes) */}
      {/* ... */}
       <div className="hidden md:flex ml-auto items-center gap-4 relative"> {/* Changed items-left to items-center */}
        <div
          className={
            // Simpler class if dark mode isn't used here
            "w-10 h-10 rounded-full cursor-pointer ring-2 ring-transparent hover:ring-[#7B2326] overflow-hidden"
          }
          onClick={toggleDropdown}
        >
          <img
            src={user?.profile_picture || defaultAvatar}
            alt="Avatar"
            className="w-full h-full object-cover"
             onError={(e) => { if (e.target.src !== defaultAvatar) e.target.src = defaultAvatar; }}
          />
        </div>

        {dropdownOpen && (
          <div className="absolute right-0 mt-14 w-48 bg-white text-black rounded-lg shadow-lg z-50"> {/* Increased width slightly */}
            <ul className="py-1"> {/* Reduced padding */}
              {/* Profile Link */}
              <li className="hover:bg-gray-100">
                <Link to="/profile" onClick={() => setDropdownOpen(false)} className="px-4 py-2 flex items-center gap-2 text-black hover:text-[#7B2326] no-underline w-full">
                  <User size={18} /> {/* Slightly smaller icon */}
                  Profile
                </Link>
              </li>
              {/* Logout Link/Button */}
               <li className="hover:bg-gray-100">
                 {/* Assuming /logout triggers logout logic via context or route component */}
                <Link to="/logout" onClick={() => setDropdownOpen(false)} className="px-4 py-2 flex items-center gap-2 text-black hover:text-[#7B2326] no-underline w-full">
                  <LogOut size={18} />
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
