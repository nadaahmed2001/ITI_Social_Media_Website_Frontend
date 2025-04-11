import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import ThumbUpSharpIcon from "@mui/icons-material/ThumbUpSharp";
import FavoriteSharpIcon from "@mui/icons-material/FavoriteSharp";
import VolunteerActivismSharpIcon from "@mui/icons-material/VolunteerActivismSharp";
import SentimentVerySatisfiedSharpIcon from "@mui/icons-material/SentimentVerySatisfiedSharp";
import CelebrationSharpIcon from "@mui/icons-material/CelebrationSharp";
import TipsAndUpdatesSharpIcon from "@mui/icons-material/TipsAndUpdatesSharp";
import ImageSharpIcon from "@mui/icons-material/ImageSharp";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Navbar from "../ui/Navbar";
import EditPost from "../posts/EditPost";
import DeletePost from "../posts/DeletePost";
import EditComment from "../posts/EditComment";
import DeleteComment from "../posts/Deletecomment";
import ReactionsModal from "../posts/ReactionsModal";
import ReactionsCommentModal from "../posts/ReactionsCommentModal";
import {
  fetchComments,
  addComment,
  editPost,
  deletePost,
  deleteComment,
  editComment,
  likePost,
  likeComment,
  fetchReactionsForPost,
  removePostReaction,
  removeCommentReaction,
  fetchReactionsForComment,
} from "../services/api";

const PostDetail = () => {
  const { postId } = useParams();
  const location = useLocation();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpenComment, setIsEditModalOpenComment] = useState(false);
  const [isDeleteModalOpenComment, setIsDeleteModalOpenComment] = useState(false);
  const [userReactions, setUserReactions] = useState([]);
  const [showReactions, setShowReactions] = useState(false);
  const [showOptionsCommentId, setShowOptionsCommentId] = useState(null);
  const [showCommentReactions, setShowCommentReactions] = useState(null);
  const [showReactionsModal, setShowReactionsModal] = useState(false);
  const [showReactionsModalForComment, setShowReactionsModalForComment] = useState(false);
  const [commentReactions, setCommentReactions] = useState({});
  const [selectedComment, setSelectedComment] = useState(null);
  const currentUserId = localStorage.getItem("user_id");
  const scrollToId = new URLSearchParams(location.search).get("scroll_to");

  const reactions = [
    { name: "Like", icon: <ThumbUpSharpIcon className="Reaction-Post" /> },
    { name: "Love", icon: <FavoriteSharpIcon className="Reaction-Post" /> },
    { name: "Celebrate", icon: <CelebrationSharpIcon className="Reaction-Post" /> },
    { name: "Funny", icon: <SentimentVerySatisfiedSharpIcon className="Reaction-Post" /> },
    { name: "Support", icon: <VolunteerActivismSharpIcon className="Reaction-Post" /> },
    { name: "Insightful", icon: <TipsAndUpdatesSharpIcon className="Reaction-Post" /> },
  ];

  // Fetch post and comments data
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    axios
      .get(`http://127.0.0.1:8000/api/posts/${postId}/`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      })
      .then((res) => {
        setPost(res.data);
        setComments(res.data.comments || []);
      })
      .catch((err) => {
        console.error("Error fetching post:", err);
        if (err.response && err.response.status === 403) {
          alert("You don't have permission to view this post.");
        }
      });
  }, [postId]);

  // Scroll to specific comment or reaction if needed
  useEffect(() => {
    if (scrollToId) {
      const element = document.getElementById(scrollToId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.classList.add("bg-yellow-100", "transition", "duration-500");
        setTimeout(() => {
          element.classList.remove("bg-yellow-100");
        }, 2000);
      }
    }
  }, [scrollToId]);

  useEffect(() => {
    if (post && post.id) {
      fetchComments(post.id).then((res) => setComments(res.data));
      fetchReactionsForPost(post.id).then((res) =>
        setUserReactions(res.filter((r) => r.user.id === currentUserId))
      );
    }
  }, [post, currentUserId]);

useEffect(() => {
    if (post?.comments?.length) {
      const fetchAllCommentReactions = async () => {
        const reactionsMap = {};
        for (const comment of post.comments) {
          const reactions = await fetchReactionsForComment(comment.id);
          reactionsMap[comment.id] = reactions;
        }
        setCommentReactions(reactionsMap);
      };
  
      fetchAllCommentReactions();
    }
  }, [post]);

  const handleComment = () => {
    if (!commentText.trim()) return;
    addComment(post.id, { post: post.id, comment: commentText }).then((res) => {
      setComments((prev) => [...prev, res.data]);
      setCommentText("");
    });
  };

  const handleEditPost = (postId, updatedContent) => {
    editPost(postId, { body: updatedContent }).then(() => {
      setIsEditModalOpen(false);
      post.body = updatedContent;
      setPost(post);
    });
  };

  const handleDeletePost = (postId) => {
    deletePost(postId).then(() => {
      setIsDeleteModalOpen(false);
    });
  };

  const handleAddReaction = async (reactionType) => {
    await likePost(post.id, reactionType);
    const updated = await fetchReactionsForPost(post.id);
    setUserReactions(updated.filter((r) => r.user.id === currentUserId));
  };

  const hasReacted = (reactionType) => {
    return userReactions.some((r) => r.reaction_type === reactionType);
  };

  const handleRemoveReaction = async (reactionType) => {
    await removePostReaction(post.id);
    const updated = await fetchReactionsForPost(post.id);
    setUserReactions(updated.filter((r) => r.user?.id === currentUserId));
  };

  const handleAddReactionForComment = async (commentId, reactionType) => {
    console.log("Adding reaction:", reactionType, "to comment:", commentId); // Debugging
    try {
      const existingReaction = commentReactions[commentId]?.find(
        r => r.user.id === currentUserId
      );
  
      if (existingReaction) {
        // If the same reaction is clicked, remove it
        if (existingReaction.reaction_type === reactionType) {
          await removeCommentReaction(commentId);
        } else {
          // If a different reaction is clicked, replace it
          await removeCommentReaction(commentId);
          await likeComment(commentId, reactionType);
        }
      } else {
        await likeComment(commentId, reactionType);
      }
  
      const updated = await fetchReactionsForComment(commentId);
      setCommentReactions(prev => ({
        ...prev,
        [commentId]: updated,
      }));
    } catch (error) {
      console.error("Reaction error:", error);
    }
  };
  
  const handleRemoveCommentReaction = async (commentId) => {
    try {
      await removeCommentReaction(commentId);
      const updated = await fetchReactionsForComment(commentId);
      setCommentReactions(prev => ({
        ...prev,
        [commentId]: updated
      }));
    } catch (error) {
      console.error("Remove reaction error:", error);
    }
  };

  const hasReactedToComment = (commentId, reactionType) => {
    return commentReactions[commentId]?.some(
      (r) => r.user.id.toString() === currentUserId && r.reaction_type === reactionType
    );
  };


  const handleEditComment = (postId, comment, updatedData) => {
      editComment(postId, comment.id, { comment: updatedData }).then(() => {
       setIsEditModalOpenComment(false);
  
       comment.comment = updatedData;
       setComments(comments);
      });
  
    };
  
  const handleDeleteComment = (postId, commentId) => {
      deleteComment(postId, commentId).then(() => {
        setIsDeleteModalOpenComment(false);
  
        setComments(comments.filter((comment) => comment.id !== commentId));
      });
    };

  // Return a loading state if post is not yet loaded
  if (!post) return <div>Loading...</div>;

  return (
    <div className={isDarkMode ? "min-h-screen bg-[#1E1E1E] text-white" : "min-h-screen bg-gray-100 text-gray-900"}>
      <Navbar isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} />

      <div className="flex justify-center items-center min-h-screen px-4">
        <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
          <div className="post-header">
            {post.authorAvatar && (
              <img src={post.authorAvatar || "/default-avatar.png"} alt="User" className="user-avatar" />
            )}
            <div className="user-info">
              <p>{post.author || "Unknown"}</p>
              <p>
                {post.created_on
                  ? `${new Date(post.created_on).toISOString().split("T")[0]} ${new Date(post.created_on).toTimeString().slice(0, 5)}`
                  : "Just now"}
              </p>
            </div>
            <div className="post-options">
              <MoreVertIcon onClick={() =>  setShowOptionsCommentId((prev) =>prev === comment.id ? null : comment.id)} />
              {showOptions && (
                <div className="options-menu">
                  <div className="option" onClick={() => { 
                        setIsEditModalOpenComment(true); 
                        setSelectedComment(comment);  // Add this
                               
                      }}>
                        <EditIcon className="EditIcon" /> Edit
                      </div>
                      <div className="option" onClick={() => { 
                        setIsDeleteModalOpenComment(true);
                        setSelectedComment(comment);  // Add this
                        
                      }}>
                        <DeleteIcon className="DeleteIcon" /> Delete
                      </div>
                </div>
              )}
            </div>
          </div>

          <div className="post-content">
            <p>{post.body}</p>
            {post.attachments && post.attachments.length > 0 && (
              <img src={post.attachments[0].image} className="post-image" alt="Attachment" />
            )}
          </div>

          <div className="post-actions">
            <div className="reaction-trigger" onClick={() => setShowReactions(!showReactions)}>
              <ThumbUpSharpIcon />
              <span>Like</span>
              {showReactions && (
                <div className="reactions-popover">
                  {reactions.map((reaction) => (
                    <div
                      key={reaction.name}
                      className="reaction-item"
                      
                      onClick={() => {
                        hasReacted(reaction.name)
                          ? handleRemoveReaction(reaction.name)
                          : handleAddReaction(reaction.name);
                        setShowReactions(false);
                      }}
                    >
                      {reaction.icon}
                      <span>{reaction.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <p className="Show-All-Reactions" onClick={() => setShowReactionsModal(true)}>
            Show All Reactions
          </p>

          {showReactionsModal && (
            <ReactionsModal postId={post.id} onClose={() => setShowReactionsModal(false)} />
          )}

          <div className="comment-section">
            <h4>Comments</h4>

            {comments.length ? (
              comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <div className="post-header-comment">
                    <img src={comment.authorAvatar || "/default-avatar.png"} alt="User" className="user-avatar" />
                    <div className="user-info">
                      <b>{comment.author}</b>
                      <p>
                        {comment.created_on
                          ? `${new Date(comment.created_on).toISOString().split("T")[0]} ${new Date(comment.created_on).toTimeString().slice(0, 5)}`
                          : "Just now"}
                      </p>
                    </div>
                  </div>
                  <p className="comment-body">{comment.comment}</p>

                  <div className="comment-actions">
                    <div className="reaction-trigger" onClick={() => setShowCommentReactions(comment.id)}>
                      <ThumbUpSharpIcon /> <span>Like</span>
                    </div>

                    {showCommentReactions === comment.id && (
                      <div className="reactions-popover">
                        {reactions.map((reaction) => (
                          <div
                            key={reaction.name}
                            className="reaction-item"
                            onClick={() => {
                              console.log("Reaction clicked:", reaction.name, "for comment:", comment.id); // Debugging
                              hasReactedToComment(comment.id, reaction.name)
                                ? handleRemoveCommentReaction(comment.id)
                                : handleAddReactionForComment(comment.id, reaction.name);
                              setShowCommentReactions(null);
                            }}
                          >
                            <div className="reaction-icon-container">
                              <div className="reaction-icon">
                                {reaction.icon}
                                <span className="reaction-name">{reaction.name}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <p className="Show-All-Reactions-comment" onClick={() => setShowReactionsModalForComment(true)}>
                    Show All Reactions
                  </p>

                  {showReactionsModalForComment && (
                    <ReactionsCommentModal commentId={comment.id} onClose={() => setShowReactionsModalForComment(false)} />
                  )}
                </div>
              ))
            ) : (
              <p>No comments yet.</p>
            )}
          </div>

          <div className="post-comment">
            <input
              type="text"
              placeholder="Write your comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button onClick={handleComment}>Comment</button>
          </div>

          <EditPost
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onConfirm={handleEditPost}
            post={post}
          />
          <DeletePost
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeletePost}
          />
          <EditComment
                  isOpen={isEditModalOpenComment}
                  onClose={() => setIsEditModalOpenComment(false)}
                  onConfirm={(updatedContent) => handleEditComment(post.id, selectedComment, updatedContent)}
                  comment={selectedComment}
          />
          <DeleteComment
            isOpen={isDeleteModalOpenComment}
            onClose={() => setIsDeleteModalOpenComment(false)}
            onConfirm={() => handleDeleteComment(post.id, selectedComment.id)}
          />
        </div>
      </div>
    </div>
  );
};


export default PostDetail;
