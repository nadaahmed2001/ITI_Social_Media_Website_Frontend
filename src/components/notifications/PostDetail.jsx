import React, { useEffect, useState, useRef } from "react";
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
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';

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
  const [attachmentUrl, setAttachmentUrl] = useState(null);

  const hidePopoverTimer = useRef(null); 


  const reactions = [
    { name: "Like", icon: <ThumbUpSharpIcon className="Reaction-Post" /> },
    { name: "Love", icon: <FavoriteSharpIcon className="Reaction-Post" /> },
    { name: "Celebrate", icon: <CelebrationSharpIcon className="Reaction-Post" /> },
    { name: "Funny", icon: <SentimentVerySatisfiedSharpIcon className="Reaction-Post" /> },
    { name: "Support", icon: <VolunteerActivismSharpIcon className="Reaction-Post" /> },
    { name: "Insightful", icon: <TipsAndUpdatesSharpIcon className="Reaction-Post" /> },
  ];


  const [commentPagination, setCommentPagination] = useState({
    page: 1,
    hasMore: true,
    isLoading: false,
    error: null
  });
  
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
      fetchReactionsForPost(post.id).then((res) =>
        setUserReactions(res.filter((r) => r.user_id === currentUserId))
      );
    }
  }, [post, currentUserId]);


  const MAX_COMMENT_INPUT_LENGTH = 200;


  const handleComment = () => {
    const trimmedComment = commentText.trim();
    const currentInputLength = trimmedComment.length;
  
    if (!trimmedComment && !attachmentUrl) {
      alert("Please write a comment or add an attachment."); 
      return;
    }
    
    if (currentInputLength > MAX_COMMENT_INPUT_LENGTH) {
      alert(`Comment cannot exceed ${MAX_COMMENT_INPUT_LENGTH} characters.`); 
      return;
    }
  
    const commentData = {
      post: post.id,
      comment: trimmedComment,
      attachment_url: attachmentUrl
    };
  
    addComment(post.id, commentData)
      .then((res) => {
        // setComments(prev => [res.data, ...prev]);
        setComments(prev => Array.isArray(prev) ? [res.data, ...prev] : [res.data]);
        setCommentText("");
        setAttachmentUrl(null);
        setCommentPagination(prev => ({
            ...(prev || {}),
          page: 1,
          hasMore: true
        }));
      })
      .catch(err => {
        console.error("Failed to add comment:", err);
        alert("Failed to post comment. Please try again.");
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
  try {
    await likePost(post.id, reactionType);
    const updated = await fetchReactionsForPost(post.id);
    const fetchedReactions = Array.isArray(updated) ? updated : [];
    
    // Store the full reaction object
    const filtered = fetchedReactions.filter(r => r.user_id === user?.id);
    setUserReactions(filtered);
    
    setAllPostReactions(fetchedReactions);
  } catch (error) {
    console.error("Add Reaction Error", error);
  }
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

    const handleMouseEnterTrigger = () => {
      // Clear any existing timer to prevent hiding if mouse re-enters quickly
      clearTimeout(hidePopoverTimer.current); 
      setShowReactions(true); // Show immediately
  };

  const handleMouseLeaveArea = () => {
    // Set a timer to hide the popover after a short delay (e.g., 300ms)
    hidePopoverTimer.current = setTimeout(() => {
        setShowReactions(false);
    }, 300); // Adjust delay as needed
  };

  const handleMouseEnterPopover = () => {
    // If mouse enters the popover itself, clear the hide timer
    clearTimeout(hidePopoverTimer.current); 
  };

  // Return a loading state if post is not yet loaded
  if (!post) return <div>Loading...</div>;

  return (
    <div className= "min-h-screen bg-[#1E1E1E] text-white">
      <Navbar  />

      <div className="flex justify-center items-center min-h-screen px-6 pt-26">
        <div className="w-full max-w-2xl !bg-[#292928] p-6 rounded-lg shadow-md border !border-[#7a2226] text-white">

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img src={post.authorAvatar || "/default-avatar.png"} className="w-10 h-10 rounded-full border border-gray-300 object-cover" />
              <div>
                <p className="font-bold text-[#7a2226]">{post.author || "Unknown"}</p>
                <p className="text-xs text-gray-400">
                  {post.created_on ? new Date(post.created_on).toLocaleString() : "Just now"}
                </p>
            </div>
            </div>
            <div className="post-options">
              <MoreVertIcon onClick={() =>  
                setShowOptionsCommentId(comment.id ,!showOptionsCommentId)} />
              {showOptions && (
                <div className="options-menu">
                  <div className="option" onClick={() => { 
                        setIsEditModalOpenComment(true); 
                               
                      }}>
                        <EditIcon className="EditIcon" /> Edit
                      </div>
                      <div className="option" onClick={() => { 
                        setIsDeleteModalOpenComment(true);
                        
                      }}>
                        <DeleteIcon className="DeleteIcon" /> Delete
                      </div>
                </div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <p className="text-white text-sm">{post.body}</p>
            {post.attachments?.length > 0 && (
              <img src={post.attachments[0].image} alt="Attachment" className="mt-2 rounded-md border border-gray-600 max-h-96 object-contain" />
            )}
          </div>


          <div className="post-actions flex justify-around items-center border-y border-gray-700 px-1 py-2 mt-1 !bg-[#282828]">
            <div 
              className="relative flex-1 !bg-[#282828] mx-2" // flex-1 makes buttons distribute space
              onMouseEnter={handleMouseEnterTrigger} // Show on enter trigger area
              onMouseLeave={handleMouseLeaveArea}  // Start timer on leave trigger area
           >
           
             {/* Like Button Itself */}
                      <button 
                          // Use your existing handler logic. This example assumes a generic handleReaction
                          // You might need separate onClick for Like vs. Remove if logic differs greatly
                          onClick={() => userReactions.length > 0 ? handleRemoveReaction(userReactions[0]?.reaction_type) : handleAddReaction('Like') } 
                          // Dynamic classes based on whether the user has reacted
                          className={`!bg-[#181919] w-full flex justify-center items-center gap-1.5 py-2 rounded text-sm font-medium transition-all ease-in-out duration-500 ${ // Base styles + transition
                            userReactions.length > 0 
                            ? 'text-[#7B2326] font-semibold' // LIKED state (use a clear distinct color)
                            : 'text-gray-400 hover:bg-gray-700 hover:text-gray-100 hover:scale-105 hover:font-semibold' // NOT LIKED state + hover
                        }`}
                      >
                          {/* Show solid icon if reacted, outline otherwise */}
                          {userReactions.length > 0 ? <ThumbUpSharpIcon  className="!bg-[#181819] w-5 h-7"/> : <ThumbUpOutlinedIcon  className="!bg-[#181819] w-5 h-5"/>} 
                          
                          {/* Display user's current reaction text or default 'Like' */}
                          <span className="!bg-[#181819]">{reactions.find(r => r.name === userReactions[0]?.reaction_type)?.name || 'React'}</span>
                      </button>
                      {/* Reaction Popover (Conditionally Rendered) */}
                                {showReactions && ( 
                                    <div 
                                      // Keep popover open if mouse moves onto it
                                      onMouseEnter={handleMouseEnterPopover} // Keep open if mouse enters popover
                                      onMouseLeave={handleMouseLeaveArea} // Start timer on leave popover
                                      // Styling for the popover box
                                      className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 
                                                  flex space-x-1 !bg-[#7a2226] shadow-lg rounded-full 
                                                  px-3 py-1 border border-gray-500 z-20" // z-index to appear above other elements
                                    > 
                                        {/* Map through your defined 'reactions' array */}
                                        {reactions.map((reaction) => ( 
                                          <button 
                                              key={reaction.name} 
                                              onClick={(e) => {
                                                  e.stopPropagation(); // Prevent potential conflicts
                                                  // Call your add/update reaction handler
                                                  handleAddReaction(reaction.name); 
                                                  setShowReactions(false); // Hide popover after selection
                                              }} 
                                              // Styling for each reaction icon button in the popover
                                              className="p-1.5 rounded-full !bg-[#7a2226] 
                                                          transition-transform transform hover:scale-110" 
                                              title={reaction.name} // Tooltip on hover
                                          > 
                                              {/* Render the icon component directly */}
                                              {React.cloneElement(reaction.icon, { className: "w-6 h-6 !bg-[#7a2226]" })} 
                                          </button> 
                                        ))} 
                                    </div> 
                                )}
                            </div>
                            {/* End Like Button + Popover Wrapper */}
            <button className="!bg-[#181819] mx-2 flex-1 flex justify-center items-center gap-1.5 py-2 rounded text-sm font-medium text-gray-400 hover:bg-gray-700 hover:text-white transition-all duration-300">
              💬 Comment
            </button>
            <button className="!bg-[#181819] mx-2 flex-1 flex justify-center items-center gap-1.5 py-2 rounded text-sm font-medium text-gray-400 hover:bg-gray-700 hover:text-white transition-all duration-300">
              🔁 Share
            </button>
          </div>


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
                              hasReacted(reaction.name)
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