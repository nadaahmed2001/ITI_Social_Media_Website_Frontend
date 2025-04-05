import { useEffect, useState } from "react";
import { BellIcon } from "lucide-react";

const NotificationsDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/notifications/");
      const data = await res.json();
      console.log("Notifications data:", data);
      
      if (Array.isArray(data)) {
        setNotifications(data);
        setUnreadCount(data.filter((n) => n.status === "unread").length);  
      } else {
        console.error("The notifications data is not an array");
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const markAsRead = async (id) => {
    await fetch(`http://127.0.0.1:8000/api/notifications/${id}/mark-as-read/`, {
      method: "PATCH",
    });
    fetchNotifications();
  };

  const markAllAsRead = async () => {
    await fetch(`http://127.0.0.1:8000/api/notifications/mark-all-as-read/`, {
      method: "PATCH",
    });
    fetchNotifications();
  };

  const clearAllNotifications = async () => {
    await fetch(`http://127.0.0.1:8000/api/notifications/clear-all/`, {
      method: "DELETE",
    });
    fetchNotifications();
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
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 shadow-lg rounded-xl z-50">
          <div className="p-2 max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center text-gray-500">No notifications</p>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-2 rounded-md mb-1 text-sm ${
                    notif.status === "unread"
                      ? "bg-blue-100 dark:bg-blue-900"
                      : "bg-gray-100 dark:bg-gray-700"
                  } flex justify-between items-center`}
                >
                  <span>{notif.notification_text}</span>
                  {notif.status === "unread" && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="text-xs text-blue-600 hover:underline ml-2"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              ))
            )}
            <div className="mt-2 flex justify-between">
              <button
                onClick={markAllAsRead}
                className="text-sm text-green-600 hover:underline"
              >
                Mark all as read
              </button>
              <button
                onClick={clearAllNotifications}
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
