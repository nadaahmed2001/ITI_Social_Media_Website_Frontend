import { React, useEffect, useState, useRef } from "react";
import {
  BellIcon,
  Mail,
  Bell,
  Users,
  Heart,
  MessageCircle,
} from "lucide-react";
import {
  fetchNotifications,
  markNotificationAsRead,
  clearNotification,
  markAllNotificationsAsRead,
  clearAllNotifications,
} from "../components/services/api";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NotificationsDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // const token = localStorage.getItem("access_token");

  // // Axios default setup to include the token in headers
  // const axiosInstance = axios.create({
  //   headers: {
  //     Authorization: token ? `Bearer ${token}` : "", // Add token to Authorization header if it exists
  //   },
  // });

  // useEffect(() => {
  //   if (isOpen) {
  //     fetchNotificationsData();
  //   }
  // }, [isOpen]);

  useEffect(() => {
    fetchNotificationsData(); // once on mount

    const interval = setInterval(() => {
      fetchNotificationsData(); // every 2s
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotificationsData = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return; // Skip fetching if no token
    setLoading(true);
    try {
      const response = await fetchNotifications(); // Make the API call
      // Access the 'data' property of the response object
      const data = response.data;

      // Ensure data is an array
      if (Array.isArray(data)) {
        setNotifications(data);
        setUnreadCount(data.filter((n) => n.status === "unread").length);
      } else {
        console.error("Expected an array but received:", data);
        setNotifications([]); // If not an array, reset to empty array
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setNotifications([]); // Set to empty array in case of error
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      fetchNotificationsData(); // Refresh notifications after updating
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const handleClearNotification = async (id) => {
    try {
      await clearNotification(id);
      fetchNotificationsData(); // Refresh notifications after clearing
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      fetchNotificationsData(); // Refresh notifications after marking all as read
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  const handleClearAllNotifications = async () => {
    try {
      await clearAllNotifications();
      fetchNotificationsData(); // Refresh notifications after clearing all
    } catch (err) {
      console.error("Error clearing all notifications:", err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "chat":
      case "group_chat":
        return <Mail className="w-4 h-4 text-blue-500" />;
      case "mention":
        return <Bell className="w-4 h-4 text-yellow-500" />;
      case "batch_assignment":
      case "batch_end":
        return <Users className="w-4 h-4 text-purple-500" />;
      case "reaction":
        return <Heart className="w-4 h-4 text-pink-500" />;
      case "comment":
        return <MessageCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };
  // const handleOpenLink = (id, link, highlightedReactionId) => {
  //   handleMarkAsRead(id);

  //   const commentMatch = link.match(/\/posts\/(\d+)\/comment\/(\d+)/);
  //   const reactionMatch = link.match(/\/posts\/(\d+)\/reactions/);

  //   const privateChatMatch = link.match(/\/dashboard\/chat\/private\/(\d+)/);  // Match private chat
  //   const groupChatMatch = link.match(/\/dashboard\/chat\/groups\/(\d+)/);  // Match group chat

  //   if (commentMatch) {
  //     const postId = commentMatch[1];
  //     const commentId = commentMatch[2];
  //     navigate(`/posts/${postId}?highlightComment=${commentId}`);
  //     return;
  //   }

  //   if (reactionMatch) {
  //     const postId = reactionMatch[1];
  //     navigate(`/posts/${postId}?highlightReactionId=${highlightedReactionId}`);
  //     return;
  //   }

  //   if (privateChatMatch) {
  //     const chatId = privateChatMatch[1];  // Extract chat ID from the link
  //     navigate(`/dashboard/chat/private/${chatId}`);  // Navigate to the private chat
  //     return;
  //   }

  //   if (groupChatMatch) {
  //     const chatId = groupChatMatch[1];  // Extract chat ID from the link
  //     navigate(`/dashboard/chat/groups/${chatId}`);  // Navigate to the group chat
  //     return;
  //   }
  //   navigate(link);
  // };

  const pages = ["profiles", "batches", "messagesList", "dashboard"];

  const handleNavigate = async (e, notif) => {
    e.stopPropagation(); // Prevent other clicks from propagating
    await handleMarkAsRead(notif.id);

    // find if notif.notification_link contains one of pages, then split it
    const page = pages.find((p) => notif.notification_link.includes(p));
    if (page) {
      console.log("notification link", notif.notification_link);
      console.log("page", page);
      const path = notif.notification_link.split(page)[1];
      console.log("path", path);
      navigate(`/${page}${path}`);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative focus:outline-none"
      >
        <BellIcon className="w-6 h-6 text-gray-800 dark:text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 shadow-sm">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 shadow-lg rounded-xl z-50"
        >
          <div className="p-4 max-h-96 overflow-y-auto custom-scrollbar space-y-2">
            {loading ? (
              <div className="text-center text-gray-500 dark:text-gray-400">
                Loading...
              </div>
            ) : notifications.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400">
                No notifications
              </p>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={(e) => handleNavigate(e, notif)}
                  className={`group p-3 rounded-md text-sm cursor-pointer transition-all duration-300 flex items-start gap-3 ${
                    notif.status === "unread"
                      ? "bg-blue-50 dark:bg-blue-950 font-semibold"
                      : "bg-gray-50 dark:bg-gray-800"
                  } hover:bg-blue-100 dark:hover:bg-blue-800`}
                >
                  <div className="mt-0.5">
                    {getIcon(notif.notification_type)}
                  </div>
                  <div className="flex-1 text-gray-800 dark:text-gray-100">
                    {notif.notification_text}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent redirect
                      handleClearNotification(notif.id);
                    }}
                    className="text-xs text-red-500 hover:underline opacity-70 group-hover:opacity-100 transition"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between">
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-green-600 dark:text-green-400 hover:underline"
              >
                Mark all as read
              </button>
              <button
                onClick={handleClearAllNotifications}
                className="text-sm text-red-600 dark:text-red-400 hover:underline"
              >
                Clear all
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;