// import React, { useEffect, useState } from "react";

// const NotificationDropdown = () => {
//   const [notifications, setNotifications] = useState([]);
//   const navigate = useNavigate();

//   // Extract the access token from localStorage (or use your preferred method)
//   const token = localStorage.getItem("access_token");

//   // Axios default setup to include the token in headers
//   const axiosInstance = axios.create({
//     headers: {
//       Authorization: token ? `Bearer ${token}` : "", // Add token to Authorization header if it exists
//     },
//   });

//   // Fetch notifications when component mounts
//   useEffect(() => {
//     axiosInstance
//       .get("${import.meta.env.VITE_API_BASE_URL}notifications/")
//       .then((res) => {
//         console.log("API Response:", res); // Debugging log
//         if (res && res.data && Array.isArray(res.data)) {
//           setNotifications(res.data);
//         } else {
//           console.error("Unexpected API response:", res);
//           setNotifications([]); // Prevent crashes
//         }
//       })
//       .catch((err) => {
//         console.error("Error fetching notifications:", err);
//         setNotifications([]); // Prevent UI crashes
//         if (err.response && err.response.status === 401) {
//           navigate('/login');  // If unauthorized, redirect to login
//         }
//       });
//   }, []);

//   // Handle marking a notification as read
//   const handleMarkAsRead = (id) => {
//     axiosInstance
//       .patch(`${import.meta.env.VITE_API_BASE_URL}notifications/${id}/mark-as-read/`)
//       .then((res) => {
//         console.log("Notification marked as read:", res);
//         setNotifications((prevNotifications) =>
//           prevNotifications.map((notif) =>
//             notif.id === id ? { ...notif, is_read: true } : notif
//           )
//         );
//       })
//       .catch((err) => {
//         console.error("Error marking notification as read:", err);
//         if (err.response && err.response.status === 401) {
//           navigate('/login');  // If unauthorized, redirect to login
//         }
//       });
//   };

//   // Handle marking all notifications as read
//   const handleMarkAllAsRead = () => {
//     axiosInstance
//       .patch("${import.meta.env.VITE_API_BASE_URL}notifications/mark-all-as-read/")
//       .then((res) => {
//         console.log("All notifications marked as read:", res);
//         axiosInstance
//           .get("${import.meta.env.VITE_API_BASE_URL}notifications/")
//           .then((res) => {
//             if (res && res.data && Array.isArray(res.data)) {
//               setNotifications(res.data);
//             } else {
//               console.error("Unexpected API response:", res);
//               setNotifications([]);
//             }
//           })
//           .catch((err) => {
//             console.error("Error fetching notifications after mark as read:", err);
//           });
//       })
//       .catch((err) => {
//         console.error("Error marking notifications as read:", err);
//       });
//   };

//   // Handle opening the notification link and marking it as read
//   const handleOpenLink = (id, link, highlightedReactionId) => {
//     handleMarkAsRead(id);

//     const commentMatch = link.match(/\/posts\/(\d+)\/comment\/(\d+)/);
//     const reactionMatch = link.match(/\/posts\/(\d+)\/reactions/);
  
//     const privateChatMatch = link.match(/\/dashboard\/chat\/private\/(\d+)/);  // Match private chat
//     const groupChatMatch = link.match(/\/dashboard\/chat\/groups\/(\d+)/);  // Match group chat
    
//     if (commentMatch) {
//       const postId = commentMatch[1];
//       const commentId = commentMatch[2];
//       navigate(`/posts/${postId}?highlightComment=${commentId}`);
//       return;
//     }
  
//     if (reactionMatch) {
//       const postId = reactionMatch[1];
//       navigate(`/posts/${postId}?highlightReactionId=${highlightedReactionId}`);
//       return;
//     }
  
//     if (privateChatMatch) {
//       const chatId = privateChatMatch[1];  // Extract chat ID from the link
//       navigate(`/dashboard/chat/private/${chatId}`);  // Navigate to the private chat
//       return;
//     }
  
//     if (groupChatMatch) {
//       const chatId = groupChatMatch[1];  // Extract chat ID from the link
//       navigate(`/dashboard/chat/groups/${chatId}`);  // Navigate to the group chat
//       return;
//     }
//     navigate(link);
//   };

//   return (
//     <div className="notification-dropdown">
//       <h4>Notifications</h4>
//       {notifications.length === 0 ? (
//         <p>No new notifications</p>
//       ) : (
//         <ul>
//           {notifications.map((notif) => (
//             <li
//               key={notif.id}
//               onClick={() => handleOpenLink(notif.id, notif.notification_link, notif.reaction_id)}  // Pass the reaction_id to highlight
//               style={{
//                 backgroundColor: notif.is_read ? "#f0f0f0" : "#fff",
//                 cursor: "pointer",
//               }}
//             >
//               {notif.notification_text}
//             </li>
//           ))}
//         </ul>
//       )}
//       <button onClick={handleMarkAllAsRead}>Mark all as read</button>
//     </div>
//   );
// };

// export default NotificationDropdown;
