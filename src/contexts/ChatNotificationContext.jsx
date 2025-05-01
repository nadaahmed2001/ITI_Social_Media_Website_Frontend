import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ChatNotificationContext = createContext();

export const ChatNotificationProvider = ({ children }) => {
  const [unreadChatNotifications, setUnreadChatNotifications] = useState([]);

  const token = localStorage.getItem("access_token");
  const axiosInstance = axios.create({
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  const fetchUnreadNotifications = async () => {
    try {
      if (token) {
        const res = await axiosInstance.get(
          "http://127.0.0.1:8000/api/notifications/chat/unread/"
        );
        if (res.data) {
          setUnreadChatNotifications(res.data);
        }
      }
    } catch (err) {
      console.error("Error fetching unread messages", err);
    }
  };

  useEffect(() => {
    fetchUnreadNotifications();

    const interval = setInterval(fetchUnreadNotifications, 15000);
    return () => clearInterval(interval);
  }, [token]);

  return (
    <ChatNotificationContext.Provider
      value={{ unreadChatNotifications, fetchUnreadNotifications }}
    >
      {children}
    </ChatNotificationContext.Provider>
  );
};

export const useChatNotification = () => useContext(ChatNotificationContext);
