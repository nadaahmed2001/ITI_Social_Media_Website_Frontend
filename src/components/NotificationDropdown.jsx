import React, { useEffect, useState } from "react";
import { fetchNotifications, markAllNotificationsAsRead } from "../services/api";

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications()
      .then((res) => {
        console.log("API Response:", res); // Debugging log
        if (res && res.data && Array.isArray(res.data)) {
          setNotifications(res.data); // ✅ Ensure it's an array
        } else {
          console.error("Unexpected API response:", res);
          setNotifications([]); // Prevents crashes
        }
      })
      .catch((err) => {
        console.error("Error fetching notifications:", err);
        setNotifications([]); // Prevent UI crashes
      });
  }, []);
  
  return (
    <div className="notification-dropdown">
      <h4>Notifications</h4>
      {notifications.length === 0 ? <p>No new notifications</p> : (
        <ul>
          {notifications.map((notif) => (
            <li key={notif.id}>{notif.notification_text}</li>
          ))}
        </ul>
      )}
      <button onClick={handleMarkAllAsRead}>Mark all as read</button>
    </div>
  );
};

export default NotificationDropdown;
