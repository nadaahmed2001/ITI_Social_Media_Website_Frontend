import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ChatNotificationContext = createContext();

export const ChatNotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const token = localStorage.getItem("access_token");
  const axiosInstance = axios.create({
      headers: {
        Authorization: token ? `Bearer ${token}` : "", 
      },
    });

const fetchUnreadNotifications = async () => {
    try {
    const res = await axiosInstance.
    get("http://127.0.0.1:8000/api/notifications/chat/unread/");
    setUnreadCount(res.data.length);
    } catch (err) {
    console.error("Error fetching unread messages", err);
    }
};

  useEffect(() => {
    fetchUnreadNotifications();

    const interval = setInterval(fetchUnreadNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ChatNotificationContext.Provider value={{ unreadCount, fetchUnreadNotifications }}>
      {children}
    </ChatNotificationContext.Provider>
  );
};

export const useChatNotification = () => useContext(ChatNotificationContext);
