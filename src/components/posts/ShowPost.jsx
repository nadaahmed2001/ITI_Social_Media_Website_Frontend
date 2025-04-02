import React, { useState, useEffect } from "react";
import { fetchComments, addComment , editPost , deletePost } from "../../services/api";
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
import EditPost from "./EditPost";
import DeletePost from "./DeletePost";
import "./Posts.css";

export default function ShowPost({ post, onDelete }) {
  const [showOptions, setShowOptions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  // Comments State
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

   // Pop-Up Modal States
   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

   const [posts, setPosts] = useState([]);
  // Fetch Comments
  useEffect(() => {
    fetchComments(post.id)
      .then((res) => setComments(res.data))
      .catch((err) => console.error("Error fetching comments:", err));
  }, [post.id]);

  // Handle adding a comment
  const handleComment = () => {
    if (!commentText.trim()) return;

    addComment(post.id, { post: post.id, comment: commentText })
      .then((res) => {
        setComments((prevComments) => [...prevComments, res.data]);
        setCommentText(""); // Clear input after posting
      })
      .catch((err) => console.error("Error adding comment:", err));
  };
//start
// Handle editing the post
const handleEditPost = (postId, updatedContent) => {
    editPost(postId, { body: updatedContent })
    .then((response) => {
      alert("Post updated successfully!");
      setIsEditModalOpen(false); // Close the modal after success
    })
    .catch((err) => console.error("Error updating post:", err));
};

// Handle deleting the post
const handleDeletePost = (postId) => {
  deletePost(postId)
    .then((response) => {
      alert("Post deleted successfully!");
      onDelete(postId); // Remove the post from the parent list
      setIsDeleteModalOpen(false); // Close the modal after success
    })
    .catch((err) => console.error("Error deleting post:", err));
};
//end
  if (!post) return <p>Loading post...</p>;

  const reactions = [
    { name: "Like", icon: <ThumbUpSharpIcon className="Reaction-Post" /> },
    { name: "Love", icon: <FavoriteSharpIcon className="Reaction-Post" /> },
    { name: "Celebrate", icon: <CelebrationSharpIcon className="Reaction-Post" /> },
    { name: "Funny", icon: <SentimentVerySatisfiedSharpIcon className="Reaction-Post" /> },
    { name: "Support", icon: <VolunteerActivismSharpIcon className="Reaction-Post" /> },
    { name: "Insightful", icon: <TipsAndUpdatesSharpIcon className="Reaction-Post" /> },
  ];

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
              <div className="option" onClick={() => setIsEditModalOpen(true)}>
                <EditIcon className="EditIcon" /> Edit
              </div>
              <div className="option" onClick={() => setIsDeleteModalOpen(true)}>
                <DeleteIcon className="DeleteIcon"/> Delete
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="post-content">
        <p>{post.body}</p>
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
              {reactions.map((reaction) => (
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
        <button><TurnedInNotSharpIcon className="savePost-btn" /></button>
      </div>

      <p className="Show-All-Reactions"><a href="">Show All Reactions</a></p>
      <hr />

      <div className="comment-section">
        <h4>Comments</h4>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="comment">
              <b>{comment.author}</b>: {comment.comment}
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}

        <div className="post-comment">
          <img src="/default-avatar.png" alt="User" className="user-avatar" />
          <input
            type="text"
            placeholder="Write your comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <ImageSharpIcon className="ImageSharpIcon" />
          <button className="comment-submit" onClick={handleComment}>Post</button>
        </div>
      </div>
      {/* Edit and Delete Pop-Up Modals */}
      <EditPost
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onConfirm={handleEditPost}
        post={post}
      />
      <DeletePost
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => handleDeletePost(post.id)}
      />
    </div>
  );
}
