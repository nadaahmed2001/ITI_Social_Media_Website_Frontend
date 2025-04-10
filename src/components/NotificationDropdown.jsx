import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import { fetchNotifications, markAllNotificationsAsRead } from "../components/services/api";

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  // Extract the access token from localStorage (or use your preferred method)
  const token = localStorage.getItem("access_token");

  // Axios default setup to include the token in headers
  const axiosInstance = axios.create({
    headers: {
      Authorization: token ? `Bearer ${token}` : "", // Add token to Authorization header if it exists
    },
  });

  // Fetch notifications when component mounts
  useEffect(() => {
    axiosInstance
      .get("http://127.0.0.1:8000/api/notifications/")
      .then((res) => {
        console.log("API Response:", res); // Debugging log
        if (res && res.data && Array.isArray(res.data)) {
          setNotifications(res.data); // ✅ Ensure it's an array
        } else {
          console.error("Unexpected API response:", res);
          setNotifications([]); // Prevent crashes
        }
      })
      .catch((err) => {
        console.error("Error fetching notifications:", err);
        setNotifications([]); // Prevent UI crashes
        if (err.response && err.response.status === 401) {
          navigate('/login');  // If unauthorized, redirect to login
        }
      });
  }, []);

  // Handle marking a notification as read
  const handleMarkAsRead = (id) => {
    axiosInstance
      .patch(`http://127.0.0.1:8000/api/notifications/${id}/mark-as-read/`)
      .then((res) => {
        console.log("Notification marked as read:", res);
        setNotifications((prevNotifications) =>
          prevNotifications.map((notif) =>
            notif.id === id ? { ...notif, is_read: true } : notif
          )
        );
      })
      .catch((err) => {
        console.error("Error marking notification as read:", err);
        if (err.response && err.response.status === 401) {
          navigate('/login');  // If unauthorized, redirect to login
        }
      });
  };

  // Handle marking all notifications as read
  const handleMarkAllAsRead = () => {
    axiosInstance
      .patch("http://127.0.0.1:8000/api/notifications/mark-all-as-read/")
      .then((res) => {
        console.log("All notifications marked as read:", res);
        axiosInstance
          .get("http://127.0.0.1:8000/api/notifications/")
          .then((res) => {
            if (res && res.data && Array.isArray(res.data)) {
              setNotifications(res.data);
            } else {
              console.error("Unexpected API response:", res);
              setNotifications([]);
            }
          })
          .catch((err) => {
            console.error("Error fetching notifications after mark as read:", err);
          });
      })
      .catch((err) => {
        console.error("Error marking notifications as read:", err);
      });
  };

  // Handle opening the notification link and marking it as read
  const handleOpenLink = (id, link) => {
    handleMarkAsRead(id);
  
    if (link.includes("/comment/") && link.includes("/reactions")) {
      const matches = link.match(/\/posts\/(\d+)\/comment\/(\d+)\/reactions/);
      if (matches) {
        const postId = matches[1];
        const commentId = matches[2];
        navigate(`/posts/${postId}`, {
          state: {
            openCommentReactionModal: true,
            commentId: commentId,
          },
        });
        return;
      }
    }
  
    if (link.includes("/reactions")) {
      const matches = link.match(/\/posts\/(\d+)/);
      if (matches) {
        const postId = matches[1];
        navigate(`/posts/${postId}/reactions`);
        return;
      }
    }
  
    navigate(link);
  };
  

  return (
    <div className="notification-dropdown">
      <h4>Notifications</h4>
      {notifications.length === 0 ? (
        <p>No new notifications</p>
      ) : (
        <ul>
          {notifications.map((notif) => (
            <li
              key={notif.id}
              onClick={() => handleOpenLink(notif.id, notif.notification_link)}
              style={{
                backgroundColor: notif.is_read ? "#f0f0f0" : "#fff",
                cursor: "pointer",
              }}
            >
              {notif.notification_text}
            </li>
          ))}
        </ul>
      )}
      <button onClick={handleMarkAllAsRead}>Mark all as read</button>
    </div>
  );
};

export default NotificationDropdown;
