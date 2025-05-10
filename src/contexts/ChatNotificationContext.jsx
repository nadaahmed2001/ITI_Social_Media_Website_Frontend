import { createContext, useContext, useEffect, useState, useRef  } from "react";
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

  // const fetchUnreadNotifications = async () => {
  //   try {
  //     if (token) {
  //       const res = await axiosInstance.get(
  //         "http://itihub-backend-ncohav-026f24-129-159-8-224.traefik.me/api/notifications/chat/unread/"
  //       );
  //       if (res.data) {
  //         setUnreadChatNotifications(res.data);
  //       }
  //     }
  //   } catch (err) {
  //     console.error("Error fetching unread messages", err);
  //   }
  // };
  const fetchUnreadNotifications = async () => {
    try {
      if (token) {
        const res = await axiosInstance.get("http://itihub-backend-ncohav-026f24-129-159-8-224.traefik.me/api/notifications/");
        if (res.data) {
          const chatNotifications = res.data.filter(
            (n) => n.notification_type === "chat" || n.notification_type === "group_chat"
          );
          setUnreadChatNotifications(chatNotifications.filter(n => n.status === "unread"));
        }
      } else {
        console.error("Token is missing or invalid");
      }
    } catch (err) {
      console.error("Error fetching unread messages", err.response ? err.response.data : err.message);
    }
  };

  const intervalRef = useRef(null);
  useEffect(() => {
    if (token) {
      fetchUnreadNotifications(); // Fetch once on mount
      intervalRef.current = setInterval(fetchUnreadNotifications, 2000);
      return () => clearInterval(intervalRef.current);
    }
  }, [token]);
  
  const markChatNotificationsAsRead = async (chatId, type = "chat") => {
    clearInterval(intervalRef.current);
    const path =
      type === "chat"
        ? `/messagesList/private/${chatId}`
        : `/messagesList/group/${chatId}`;

    const relatedNotifications = unreadChatNotifications.filter(
      (n) => n.notification_type === type && n.notification_link.includes(path)
    );

    try {
      await Promise.all(
        relatedNotifications.map((n) =>
          axiosInstance.patch(
            `http://itihub-backend-ncohav-026f24-129-159-8-224.traefik.me/api/notifications/${n.id}/mark-as-read/`
          )
        )
      );

      setUnreadChatNotifications((prevNotifications) =>
        prevNotifications.filter(
          (n) =>
            !relatedNotifications.some((r) => String(r.id) === String(n.id))
        )
      );
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
    finally {
      if (!intervalRef.current) {
        intervalRef.current = setInterval(fetchUnreadNotifications, 2000);
      }
    }
  };

  // useEffect(() => {
  //   fetchUnreadNotifications();

  //   const interval = setInterval(fetchUnreadNotifications, 15000);
  //   return () => clearInterval(interval);
  // }, [token]);

  return (
    <ChatNotificationContext.Provider
      value={{ unreadChatNotifications, fetchUnreadNotifications, markChatNotificationsAsRead }}
    >
      {children}
    </ChatNotificationContext.Provider>
  );
};

export const useChatNotification = () => useContext(ChatNotificationContext);