import React, { useState } from "react";
import ThumbUpSharpIcon from "@mui/icons-material/ThumbUpSharp";
import FavoriteSharpIcon from "@mui/icons-material/FavoriteSharp";
import VolunteerActivismSharpIcon from "@mui/icons-material/VolunteerActivismSharp";
import SentimentVerySatisfiedSharpIcon from "@mui/icons-material/SentimentVerySatisfiedSharp";
import CelebrationSharpIcon from "@mui/icons-material/CelebrationSharp";
import TipsAndUpdatesSharpIcon from "@mui/icons-material/TipsAndUpdatesSharp";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TurnedInNotSharpIcon from "@mui/icons-material/TurnedInNotSharp";
import ImageSharpIcon from "@mui/icons-material/ImageSharp";
import DeletePost from "./DeletePost"; // Import the DeletePost component
import "./Posts.css";

export default function ShowPost({ post, onDelete }) {
  const [showOptions, setShowOptions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isEditPopupOpen, setisEditPopupOpen] = useState(false);

  if (!post) return <p>Loading post...</p>;

  const handleDelete = () => {
    onDelete(post.id); // Call the delete function from the parent
    setIsDeletePopupOpen(false); // Close the popup after deleting
  };

  const handleEdit = () => {
    onEdit(post.id); // Call the delete function from the parent
    setisEditPopupOpen (false); // Close the popup after deleting
  };

  return (
    <div className="post-container">
      <div className="post-header">
        <img src={post.authorAvatar || "/default-avatar.png"} alt="User" className="user-avatar" />
        <div className="user-info">
          <p>{post.author || "Unknown"}</p>
          <p>{post.createdAt || "Just now"}</p>
        </div>
        <div className="post-options">
          <MoreVertIcon className="MoreVertIcon" onClick={() => setShowOptions(!showOptions)} />
          {showOptions && (
            <div className="options-menu">
              <div className="option" onClick={() => isEditPopupOpen(true)}>
                <EditIcon className="EditIcon" /> Edit
              </div>
              <div className="option" onClick={() => setIsDeletePopupOpen(true)}>
                <DeleteIcon className="DeleteIcon" /> Delete
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="post-content">
        <p>{post.body}</p>
        <br>
        </br>
        {post.image && <img src={post.image} alt="Post" className="post-image" />}
      </div>

      <div className="post-actions">
        <div className="reactions-container">
          <div className="reaction-trigger" onClick={() => setShowReactions(!showReactions)}>
            <ThumbUpSharpIcon />
            <span className="react-name">Like</span>
          </div>
          {showReactions && (
            <div className="reactions-popover">
              {[
                { name: "Like", icon: <ThumbUpSharpIcon className="Reaction-Post" /> },
                { name: "Love", icon: <FavoriteSharpIcon className="Reaction-Post" /> },
                { name: "Celebrate", icon: <CelebrationSharpIcon className="Reaction-Post" /> },
                { name: "Funny", icon: <SentimentVerySatisfiedSharpIcon className="Reaction-Post" /> },
                { name: "Support", icon: <VolunteerActivismSharpIcon className="Reaction-Post" /> },
                { name: "Insightful", icon: <TipsAndUpdatesSharpIcon className="Reaction-Post" /> },
              ].map((reaction) => (
                <div
                  className="reaction-item"
                  key={reaction.name}
                  onClick={() => setShowReactions(false)}
                >
                  {reaction.icon} {reaction.name}
                </div>
              ))}
            </div>
          )}
        </div>
        <button>
          <TurnedInNotSharpIcon className="savePost-btn" />
        </button>
      </div>
      <p className="Show-All-Reactions"><a href="">Show All Reactions</a></p>
      <hr />
      <div className="post-comment">
        <img src="" alt="User" className="user-avatar" />
        <input type="text" placeholder="Write your comment..." />
        <ImageSharpIcon className="ImageSharpIcon" />
        <button className="comment-submit">Post</button>
      </div>

      {/* Delete Confirmation Pop-up */}
      <DeletePost
        isOpen={isDeletePopupOpen}
        onClose={() => setIsDeletePopupOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

// import React, { useState } from "react";
// import ThumbUpSharpIcon from "@mui/icons-material/ThumbUpSharp";
// import FavoriteSharpIcon from "@mui/icons-material/FavoriteSharp";
// import VolunteerActivismSharpIcon from "@mui/icons-material/VolunteerActivismSharp";
// import SentimentVerySatisfiedSharpIcon from "@mui/icons-material/SentimentVerySatisfiedSharp";
// import CelebrationSharpIcon from "@mui/icons-material/CelebrationSharp";
// import TipsAndUpdatesSharpIcon from "@mui/icons-material/TipsAndUpdatesSharp";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import TurnedInNotSharpIcon from '@mui/icons-material/TurnedInNotSharp';
// import ImageSharpIcon from '@mui/icons-material/ImageSharp';
// import "./Posts.css";

// export default function ShowPost({ post }) {
//   const [showOptions, setShowOptions] = useState(false);
//   const [showReactions, setShowReactions] = useState(false);

//   if (!post) return <p>Loading post...</p>;

//   const reactions = [
//     { name: "Like", icon: <ThumbUpSharpIcon className="Reaction-Post" /> },
//     { name: "Love", icon: <FavoriteSharpIcon className="Reaction-Post" /> },
//     { name: "Celebrate", icon: <CelebrationSharpIcon className="Reaction-Post" /> },
//     { name: "Funny", icon: <SentimentVerySatisfiedSharpIcon className="Reaction-Post" /> },
//     { name: "Support", icon: <VolunteerActivismSharpIcon className="Reaction-Post" /> },
//     { name: "Insightful", icon: <TipsAndUpdatesSharpIcon className="Reaction-Post" /> },
//   ];

//   return (
//     <div className="post-container">
//       <div className="post-header">
//         <img src={post.authorAvatar || "/default-avatar.png"} alt="User" className="user-avatar" />
//         <div className="user-info">
//           <p>{post.author || "Unknown"}</p>
//           <p>{post.createdAt || "Just now"}</p>
//         </div>
//         <div className="post-options">
//           <MoreVertIcon className="MoreVertIcon" onClick={() => setShowOptions(!showOptions)} />
//           {showOptions && (
//             <div className="options-menu">
//               <div className="option">
//                 <EditIcon className="EditIcon" /> Edit
//               </div>
//               <div className="option">
//                 <DeleteIcon className="DeleteIcon" /> Delete
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="post-content">
//         <p>{post.body}</p>
//          <br></br>
         
         
//         {post.image && <img src={post.image} alt="Post" className="post-image" />}
//       </div>

//       <div className="post-actions">
//         <div className="reactions-container">
//           <div className="reaction-trigger" onClick={() => setShowReactions(!showReactions)}>
//             <ThumbUpSharpIcon />
//             <span className="react-name">Like</span>
//           </div>
//           {showReactions && (
//             <div className="reactions-popover">
//               {reactions.map((reaction) => (
//                 <div
//                   className="reaction-item"
//                   key={reaction.name}
//                   onClick={() => setShowReactions(false)}
//                 >
//                   {reaction.icon} {reaction.name}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//         <button><TurnedInNotSharpIcon className="savePost-btn" /></button>
//       </div>
//       <p className="Show-All-Reactions"><a href="">ShowAllReactions</a></p>
//          <hr></hr>
//       <div className="post-comment">
//         <img src="" alt="User" className="user-avatar" />
//         <input type="text" placeholder="Write your comment..." />
//         <ImageSharpIcon className='ImageSharpIcon'></ImageSharpIcon>
//         <button className="comment-submit">Post</button>
//       </div>
//     </div>
//   );
//}

// import React, { useState } from "react";
// import ThumbUpSharpIcon from "@mui/icons-material/ThumbUpSharp";
// import FavoriteSharpIcon from "@mui/icons-material/FavoriteSharp";
// import VolunteerActivismSharpIcon from "@mui/icons-material/VolunteerActivismSharp";
// import SentimentVerySatisfiedSharpIcon from "@mui/icons-material/SentimentVerySatisfiedSharp";
// import CelebrationSharpIcon from "@mui/icons-material/CelebrationSharp";
// import TipsAndUpdatesSharpIcon from "@mui/icons-material/TipsAndUpdatesSharp";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import TurnedInNotSharpIcon from '@mui/icons-material/TurnedInNotSharp';
// import ImageSharpIcon from '@mui/icons-material/ImageSharp';
// import "./Posts.css";
// import Sidebar from "../profiles/Sidebar";

// export default function ShowPost() {
//   const [showOptions, setShowOptions] = useState(false);
//   const [showReactions, setShowReactions] = useState(false);

//   const reactions = [
//     { name: "Like", icon: <ThumbUpSharpIcon className="Reaction-Post"/> },
//     { name: "Love", icon: <FavoriteSharpIcon className="Reaction-Post"/> },
//     { name: "Celebrate", icon: <CelebrationSharpIcon className="Reaction-Post"/> },
//     { name: "Funny", icon: <SentimentVerySatisfiedSharpIcon className="Reaction-Post"/> },
//     { name: "Support", icon:<VolunteerActivismSharpIcon className="Reaction-Post"/> },
//     { name: "Insightful", icon:<TipsAndUpdatesSharpIcon className="Reaction-Post"/>   },
//   ];

//   return (
//     <>
//     <div className="post-container">
//       <div className="post-header">
//         <img src={post.authorAvatar || "/default-avatar.png"} alt="User" className="user-avatar" />
//         <div className="user-info">
//           <p>{post.author || "Unknown"}</p>
//           <p>{post.createdAt || "Just now"}</p>
//         </div>
//       </div>

//       <div className="post-content">
//         <p>{post.body}</p>
//         {post.image && <img src={post.image} alt="Post" className="post-image" />}
//       </div>
//     </div>
//     </>
//   );
// }