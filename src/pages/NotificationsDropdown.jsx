import { useEffect, useState, useRef } from "react";
import { BellIcon, Mail, Bell, Users, Heart, MessageCircle } from "lucide-react";
import { 
  fetchNotifications, 
  markNotificationAsRead, 
  clearNotification, 
  markAllNotificationsAsRead, 
  clearAllNotifications 
} from "../components/services/api"; 

const NotificationsDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchNotificationsData();
    }
  }, [isOpen]);

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

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="relative">
        <BellIcon className="w-6 h-6 text-gray-800 dark:text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 shadow-lg rounded-xl z-50"
        >
          <div className="p-2 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="text-center">Loading...</div>
            ) : notifications.length === 0 ? (
              <p className="text-center text-gray-500">No notifications</p>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={async (e) => {
                    e.stopPropagation(); // Prevent other clicks from propagating
                    await handleMarkAsRead(notif.id);
                    if (notif.notification_link) {
                      window.location.assign(notif.notification_link); // Use assign for redirection
                    }
                  }}
                  className={`p-2 rounded-md mb-1 text-sm cursor-pointer transition-all duration-300 flex items-start gap-2 ${
                    notif.status === "unread"
                      ? "bg-blue-100 dark:bg-blue-900 font-semibold"
                      : "bg-gray-100 dark:bg-gray-700"
                  } hover:bg-blue-200 dark:hover:bg-blue-800`}
                >
                  <div>{getIcon(notif.notification_type)}</div>
                  <div className="flex-1">{notif.notification_text}</div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent redirect
                      handleClearNotification(notif.id);
                    }}
                    className="text-xs text-red-600 hover:underline ml-2"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
            <div className="mt-2 flex justify-between">
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-green-600 hover:underline"
              >
                Mark all as read
              </button>
              <button
                onClick={handleClearAllNotifications}
                className="text-sm text-red-600 hover:underline"
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
