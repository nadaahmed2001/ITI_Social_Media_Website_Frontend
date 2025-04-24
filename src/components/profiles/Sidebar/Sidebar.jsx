import React, { useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditIcon from "@mui/icons-material/Edit";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import BuildIcon from "@mui/icons-material/Build";
import SecurityIcon from "@mui/icons-material/Security";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import BookmarkSharpIcon from "@mui/icons-material/BookmarkSharp";
import FeedIcon from "@mui/icons-material/Feed";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

export const SECTIONS = {
  VIEW_PUBLIC: "viewPublicProfile",
  EDIT_PROFILE: "editProfile",
  EDIT_PHOTO: "editPhoto",
  CHANGE_CREDENTIALS: "changeCredentials",
  SKILLS_PROJECTS: "skillsProjects",
  PRIVACY: "privacy",
  MY_POSTS: "myPosts",
  SAVED: "saved",
};

export default function Sidebar({ activeSection, setActiveSection, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login";

    if (onLogout) onLogout();
  };

  const SidebarOption = ({ sectionKey, icon, label }) => (
    <div
      className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all ${
        activeSection === sectionKey
          ? "bg-red-100 text-red-800 font-semibold"
          : "text-gray-700"
      } hover:bg-red-100 hover:text-red-800`}
      onClick={() => {
        setActiveSection(sectionKey);
        setMobileOpen(false);
      }}
    >
      <div className="text-[20px]">{icon}</div>
      <span className="text-base">{label}</span>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Toggle */}
      <div className="md:hidden flex justify-between items-center px-4 py-3 border-b bg-white shadow-sm sticky top-0 z-10">
        <span className="font-semibold text-gray-700 text-lg">Settings</span>
        <button onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Sidebar Container */}
      <div
        className={`${
          mobileOpen ? "block" : "hidden"
        } md:block w-full md:w-[300px] bg-gray-50 text-gray-800 rounded-lg shadow-md p-4 md:mt-[100px] md:ml-[100px] min-h-[85vh] space-y-4`}
      >
        {/* Search Bar */}
        <div className="flex items-center bg-gray-200 rounded-md px-3 py-2">
          <SearchSharpIcon className="text-gray-600 mr-2" />
          <input
            type="text"
            placeholder="Search settings"
            className="w-full bg-transparent outline-none text-gray-800"
          />
        </div>

        {/* Sidebar Options */}
        <div className="space-y-1">
          <SidebarOption
            sectionKey={SECTIONS.VIEW_PUBLIC}
            icon={<AccountCircleIcon />}
            label="View Public Profile"
          />
          <SidebarOption
            sectionKey={SECTIONS.EDIT_PROFILE}
            icon={<EditIcon />}
            label="Edit Profile"
          />
          <SidebarOption
            sectionKey={SECTIONS.EDIT_PHOTO}
            icon={<PhotoCameraIcon />}
            label="Photo"
          />
          <SidebarOption
            sectionKey={SECTIONS.CHANGE_CREDENTIALS}
            icon={<VpnKeyIcon />}
            label="Change Email or Password"
          />
          <SidebarOption
            sectionKey={SECTIONS.SKILLS_PROJECTS}
            icon={<BuildIcon />}
            label="Skills & Projects"
          />
          <SidebarOption
            sectionKey={SECTIONS.PRIVACY}
            icon={<SecurityIcon />}
            label="Privacy and Security"
          />
          <SidebarOption
            sectionKey={SECTIONS.MY_POSTS}
            icon={<FeedIcon />}
            label="My Posts"
          />
          <SidebarOption
            sectionKey={SECTIONS.SAVED}
            icon={<BookmarkSharpIcon />}
            label="Saved"
          />
        </div>

        {/* Logout */}
        <div className="border-t pt-3 mt-4">
          <div
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer text-red-700 hover:bg-red-100 transition-all"
          >
            <LogoutIcon />
            <span>Logout</span>
          </div>
        </div>
      </div>
    </>
  );
}
