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
import TurnedInNotSharpIcon from '@mui/icons-material/TurnedInNotSharp';
import ImageSharpIcon from '@mui/icons-material/ImageSharp';
import "./Posts.css";
import Sidebar from "../profiles/Sidebar";

export default function ShowPost() {
  const [showOptions, setShowOptions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  const reactions = [
    { name: "Like", icon: <ThumbUpSharpIcon className="Reaction-Post"/> },
    { name: "Love", icon: <FavoriteSharpIcon className="Reaction-Post"/> },
    { name: "Celebrate", icon: <CelebrationSharpIcon className="Reaction-Post"/> },
    { name: "Funny", icon: <SentimentVerySatisfiedSharpIcon className="Reaction-Post"/> },
    { name: "Support", icon:<VolunteerActivismSharpIcon className="Reaction-Post"/> },
    { name: "Insightful", icon:<TipsAndUpdatesSharpIcon className="Reaction-Post"/>   },
  ];

  return (
    <>
    <section className="postShowPage">
    <Sidebar />
    <div className="post-container">
      <div className="post-header">
        <img src="" alt="User" className="user-avatar" />
        <div className="user-info">
          <p>George Jose</p>
          <p>1 hour ago</p>
        </div>
        <div className="post-options">
          <MoreVertIcon className="MoreVertIcon" onClick={() => setShowOptions(!showOptions)} />
          {showOptions && (
            <div className="options-menu">
              <div className="option">
                <EditIcon className="EditIcon"/> Edit
              </div>
              <div className="option">
                <DeleteIcon className="DeleteIcon"/> Delete
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="post-content">
        <p>Lorem ipsum dolor sit amet consectetur. Porttitor.</p>
        <img src="" className="post-image" alt="img"/>
      </div>

      <div className="post-actions">
        <div className="reactions-container">
          <div
            className="reaction-trigger"
            onClick={() => setShowReactions(!showReactions)}
          >
            <ThumbUpSharpIcon />
            <span className="react-name">Like</span>
          </div>
          {showReactions && (
            <div className="reactions-popover">
              {reactions.map((reaction) => (
                <div
                  className="reaction-item"
                  key={reaction.name}
                  onClick={() => setShowReactions(false)}
                >
                  <div className="reaction-name">{reaction.name}</div>
                  {reaction.icon}
                </div>
              ))}
            </div>
          )}
        </div>
        <button ><TurnedInNotSharpIcon className="savePost-btn"></TurnedInNotSharpIcon></button>
      </div>
      <p className="Show-All-Reactions"><a href="">ShowAllReactions</a></p>
         <hr></hr>
      <div className="post-comment">
        {/* <MapsUgcSharpIcon /> */}
        <img src="" alt="User" className="user-avatar" />
        <input type="text" placeholder="Write your comment..." />
        <ImageSharpIcon className='ImageSharpIcon'></ImageSharpIcon>
        <button className="comment-submit">Post</button>
      </div>
    </div>
    </section>
    </>
  );
}