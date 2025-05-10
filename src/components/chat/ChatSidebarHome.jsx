import React, { useEffect, useState } from "react";
import {
  fetchGroupChats,
  fetchPrivateChatUsers,
} from "../../components/services/api";
import { Link, useNavigate } from "react-router-dom";
import Aichat from "./Aichat";
import { TextField, Button, Typography } from "@mui/material";
import Chatwellcommsg from "./Chatwellcommsg";
import { useLocation } from "react-router-dom";
import { useChatNotification } from "../../contexts/ChatNotificationContext";
import dayjs from "dayjs";



const ChatSidebarHome = () => {
  const [groupChats, setGroupChats] = useState([]);
  const [privateChats, setPrivateChats] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const { unreadChatNotifications, markChatNotificationsAsRead } = useChatNotification();

  const filteredPrivateChats = privateChats.filter((chat) =>
  chat.username.toLowerCase().includes(searchTerm.toLowerCase())
);

const filteredGroupChats = groupChats.filter((chat) =>
  chat.name.toLowerCase().includes(searchTerm.toLowerCase())
);



  const defaultGroupAvatar = "../../src/assets/images/group-chat-avatar.webp";
  const DEFAULT_USER_AVATAR = "../../src/assets/images/user-default.webp";

  const location = useLocation();

  const showWelcome = !(
    location.pathname.startsWith("/messagesList/") ||
    location.pathname === "/chat/aiChat" ||
    location.pathname === "/Home"
  );

  //---------------------------------------------FOR COUNT UNREAD NOTIFICATIONS ( PRIVATE AND GROUP )-----------------------------------
  const getUnreadCountForChat = (chatId) => {
    return unreadChatNotifications.filter(
      (n) =>
        n.notification_type === "chat" &&
        n.notification_link.includes(`/messagesList/private/${chatId}`)
    ).length;
  };

  const getUnreadCountForGroup = (groupId) => {
    return unreadChatNotifications.filter(
      (n) =>
        n.notification_type === "group_chat" &&
        n.notification_link.includes(`/messagesList/group/${groupId}`)
    ).length;
  };

  
  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const groupResponse = await fetchGroupChats();
        setGroupChats(groupResponse.data);
        const privateResponse = await fetchPrivateChatUsers();
        setPrivateChats(privateResponse.data);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };
    fetchChatData();
  }, []);

  const FilterButton = ({ label, value }) => (
    <Button
      variant={activeFilter === value ? "contained" : "outlined"}
      size="small"
      sx={{
        color: activeFilter === value ? "white" : "#7a2226",
        borderColor: "#7a2226",
        "&.MuiButton-contained": {
          backgroundColor: "#7a2226",
          "&:hover": {
            backgroundColor: "#5a181b",
          },
        },
        "&.MuiButton-outlined": {
          "&:hover": {
            backgroundColor: "rgba(122, 34, 38, 0.1)",
          },
        },
        borderRadius: "20px",
        textTransform: "none",
        px: 2,
        transition: "all 0.2s ease",
      }}
      onClick={() => setActiveFilter(value)}
    >
      {label}
    </Button>
  );


  return (
    <div className="flex flex-col">
      <button
        className={`hidden md:hidden fixed z-50 p-2 bg-[#7a2226] text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110${
          isSidebarOpen ? "left-[17rem] top-4" : "left-4 top-4"
        }`}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </button>
<div
  className={`w-80 text-[#7a2226] max-h-[75vh] p-4 fixed md:relative transform rounded-lg 
    ${isSidebarOpen ? "translate-x-0 z-40" : "-translate-x-full z-30"} 
    md:translate-x-0 transition-transform duration-300 border-2 border-[#7a2226]/20 
    bg-white/90 backdrop-blur-lg shadow-xl`}
>
  {/* Sticky Header + Controls */}
  <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-lg">
    <Typography
      variant="h6"
      className="!font-bold !mb-4 !text-[#7a2226] !text-xl"
    >
      Messages
    </Typography>

    <TextField
      fullWidth
      placeholder="Search Messages"
      variant="outlined"
      size="small"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      sx={{
        "& .MuiInputBase-root": {
          color: "#7a2226",
          borderRadius: "12px",
          border: "1px solid #7a2226/20",
          background: "rgba(122, 34, 38, 0.05)",
          transition: "all 0.3s ease",
          "&:hover": {
            borderColor: "#7a2226/40",
          },
          "&.Mui-focused": {
            borderColor: "#7a2226",
            boxShadow: "0 0 0 2px rgba(122, 34, 38, 0.2)",
          },
        },
        marginBottom: "1.5rem",
      }}
    />


    <div className="flex gap-2 mb-6">
      <FilterButton label="All" value="all" />
      <FilterButton label="Private" value="private" />
      <FilterButton label="Groups" value="groups" />
    </div>

    <Button
      fullWidth
      variant="contained"
      sx={{
        background: "linear-gradient(135deg, #7a2226 0%, #a53d3d 100%)",
        backgroundSize: "200% 200%",
        color: "white",
        borderRadius: "12px",
        py: 1.5,
        fontSize: "1rem",
        fontWeight: 600,
        textTransform: "none",
        transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        position: "relative",
        overflow: "hidden",
        transform: "translateZ(0)",
        "&:hover": {
          transform: "translateY(-2px) scale(1.02)",
          boxShadow: "0 8px 25px rgba(122, 34, 38, 0.3)",
          backgroundPosition: "100% 50%",
          "&::before": {
            transform: "translateX(100%)",
          },
        },
        "&:active": {
          transform: "translateY(1px) scale(0.98)",
          transition: "all 0.1s ease-out",
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.1) 50%, transparent 75%)",
          transform: "translateX(-100%)",
          transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        },
      }}
      onClick={() => navigate("/chat/aiChat")}
      startIcon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      }
    >
      AI Chat
    </Button>
  </div>

  {/* Scrollable Chat List */}
  <div className="space-y-4 overflow-y-auto mt-4 pr-2" style={{ maxHeight: '65%' }}>
          {/* Private Chats */}
          {(activeFilter === "all" || activeFilter === "private") &&
            filteredPrivateChats.map((chat) => (
              <div
                key={chat.id}
                className="flex justify-between items-center p-2 hover:bg-gray-300 rounded cursor-pointer"
                onClick={async () => {
                  await markChatNotificationsAsRead(chat.id, "chat");
                  navigate(`/messagesList/private/${chat.id}`);
              }}
              >
                {/* Left Side: Avatar and Chat Info */}
                <div className="flex items-center gap-2">
                  <img
                    src={chat.authorAvatar || DEFAULT_USER_AVATAR}
                    alt={`${chat.username} Avatar`}
                    className="w-8 h-8 rounded-full object-cover border border-gray-600 bg-white"
                    onError={(e) => {
                      if (e.target.src !== DEFAULT_USER_AVATAR)
                        e.target.src = DEFAULT_USER_AVATAR;
                    }}
                  />
                  <div className="flex flex-col">
                    <Typography className="!text-[#7a2226] !font-medium">
                      {chat.username}
                    </Typography>
                    <Typography variant="caption" className="!text-[#585858]">
                      {chat.last_message?.content || "No messages yet"}
                    </Typography>
                  </div>
                </div>

                {/* Right Side: Time and Unread Count */}
                <div className="flex flex-col items-end gap-1">
                  <Typography variant="caption" className="!text-[#585858]">
                    {chat.last_message?.timestamp
                    ? dayjs(chat.last_message.timestamp).format("hh:mm A")
                    : ""}
                  </Typography>
                  {getUnreadCountForChat(chat.id) > 0 && (
                    <span className="bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
                      {getUnreadCountForChat(chat.id)}
                    </span>
                  )}
                </div>
              </div>
            ))}

          
          {/* Group Chats */}
          {(activeFilter === "all" || activeFilter === "groups") &&
            filteredGroupChats.map((chat) => (
              <div
                key={chat.id}
                className="flex justify-between items-center p-2 hover:bg-gray-300 rounded cursor-pointer"
                onClick={async () => {
                  await markChatNotificationsAsRead(chat.id, "group_chat");
                  navigate(`/messagesList/group/${chat.id}`);
              }}s              >
                {/* Left Side: Avatar and Chat Info */}
                <div className="flex items-center gap-2">
                  <img
                    src={chat.authorAvatar || defaultGroupAvatar}
                    alt={`${chat.name} Avatar`}
                    className="w-8 h-8 rounded-full object-cover border border-gray-600 bg-white"
                    onError={(e) => {
                      if (e.target.src !== defaultGroupAvatar)
                        e.target.src = defaultGroupAvatar;
                    }}
                  />
                  <div className="flex flex-col">
                    <Typography className="!font-medium !text-[#7a2226]">
                      {chat.name}
                    </Typography>
                    <Typography className="!text-[#585858]" variant="caption">
                      {chat.last_message?.content || "No messages yet"}
                    </Typography>
                  </div>
                </div>

                {/* Right Side: Time and Unread Count */}
                <div className="flex flex-col items-end gap-1">
                  <Typography className="!text-[#585858]" variant="caption">
                    {chat.last_message?.timestamp
                    ? dayjs(chat.last_message.timestamp).format("hh:mm A")
                    : ""}
                  </Typography>
                  {getUnreadCountForGroup(chat.id) > 0 && (
                    <span className="bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
                      {getUnreadCountForGroup(chat.id)}
                    </span>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      {showWelcome && <Chatwellcommsg />}
    </div>
  );
};
export default ChatSidebarHome;