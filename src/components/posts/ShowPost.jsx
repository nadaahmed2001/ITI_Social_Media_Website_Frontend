import React, { useState, useEffect, useRef, useContext} from "react";
import AuthContext from '../../contexts/AuthContext'; 
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material"; // Import arrow icons
import { PaperClipIcon } from '@heroicons/react/24/outline'; // or '/solid'
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from "react-router-dom"


import TimeAgo from '../TimeAgo';

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
  
} from "../../components/services/api";

import {
  ThumbUpSharp as ThumbUpSharpIcon,
  FavoriteSharp as FavoriteSharpIcon,
  VolunteerActivismSharp as VolunteerActivismSharpIcon,
  SentimentVerySatisfiedSharp as SentimentVerySatisfiedSharpIcon,
  CelebrationSharp as CelebrationSharpIcon,
  TipsAndUpdatesSharp as TipsAndUpdatesSharpIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ImageSharp as ImageSharpIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import EditPost from "./EditPost";
import DeletePost from "./DeletePost";
import EditComment from "./EditComment";
import DeleteComment from "./Deletecomment";
import ReactionsModal from "./ReactionsModal";
import ReactionsCommentModal from "./ReactionsCommentModal";


import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const DEFAULT_USER_AVATAR   = '../../src/assets/images/user-default.webp'
const CLOUDINARY_CLOUD_NAME =  "dsaznefnt";
const CLOUDINARY_UPLOAD_PRESET = "ITIHub_profile_pics";


const MAX_COMMENT_INPUT_LENGTH = 2000;

function CommentItem({ comment, currentUserId, onEditRequest, onDeleteRequest  , post ,comments/* Add other handlers like onReaction if needed */ }) {
  
  // --- State specific to THIS comment ---
  const [isExpanded, setIsExpanded] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const optionsMenuRef = useRef(null); 
  // --- End Component State ---
  const MAX_COMMENT_LENGTH = 150;
  // --- Calculate text display based on local state ---
  const fullText = comment.comment || "";
  const needsTruncation = fullText.length > MAX_COMMENT_LENGTH;
  const displayText = needsTruncation && !isExpanded 
                      ? fullText.slice(0, MAX_COMMENT_LENGTH) + "..." 
                      : fullText;
  // ---
  const [commentReactions, setCommentReactions] = useState({});
  const [showCommentReactions, setShowCommentReactions] = useState(null);
  const [showReactionsModalforcomment, setShowReactionsModalforcomment] = useState(false);
  // --- Check if current user is the author ---
  // Ensure your comment object from API has author_id or a similar field
  const isCommentAuthor = comment.author_id === currentUserId; 
  console.log(comment.author_id) 
  console.log(currentUserId)
  const authorName = comment.author || "User"; // Use author name from comment data
  // ---

  // --- Handlers specific to THIS comment ---
  const toggleExpansion = () => setIsExpanded(!isExpanded);
  const toggleOptionsMenu = () => setShowOptionsMenu(!showOptionsMenu);
  // ---

  // --- Effect for closing options menu ---
  // useEffect(() => {
  //   if (comments?.length) {
  //     const fetchAllCommentReactions = async () => {
  //       const reactionsMap = {};
  //       for (const comment of post.comments) {
  //         const reactions = await fetchReactionsForComment(comment.id);
  //         reactionsMap[comment.id] = reactions;
  //       }
  //       setCommentReactions(reactionsMap);
  //     };
  
  //     fetchAllCommentReactions();
  //   }
  // }, [comments]);
  
  const hasReacted = (reactionName) => {
    const userReaction = commentReactions[comment.id]?.find(r => r.user.id === currentUserId);
    return userReaction?.reaction_type === reactionName;
  };
  
  const handleAddReactionForComment = async (commentId, reactionType) => {
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
          await likeComment(post.id, commentId, reactionType);
        }
      } else {
        await likeComment(post.id, commentId, reactionType);
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
  
  
  const handleremoveCommentReaction = async (commentId) => {
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

  const reactions = [
    { name: "Like", icon: <ThumbUpSharpIcon className="Reaction-Post" /> },
    { name: "Love", icon: <FavoriteSharpIcon className="Reaction-Post" /> },
    { name: "Celebrate", icon: <CelebrationSharpIcon className="Reaction-Post" /> },
    { name: "funny", icon: <SentimentVerySatisfiedSharpIcon className="Reaction-Post" /> },
    { name: "Support", icon: <VolunteerActivismSharpIcon className="Reaction-Post" /> },
    { name: "Insightful", icon: <TipsAndUpdatesSharpIcon className="Reaction-Post" /> },
  ];

  ///////////////////////////////////////////////
  useEffect(() => {
      const handleClickOutside = (event) => {
          if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target)) {
              setShowOptionsMenu(false);
          }
      };
      if (showOptionsMenu) {
          document.addEventListener("mousedown", handleClickOutside);
      } else {
          document.removeEventListener("mousedown", handleClickOutside);
      }
      return () => {
          document.removeEventListener("mousedown", handleClickOutside);
      };
  }, [showOptionsMenu]);
  // ---

  return (
    <div className="mb-1 pb-4 border-b !border-[#181819] last:border-0 !bg-[#292928]">
      {/* Comment Header */}
      <div className="flex items-start justify-between mb-2 !bg-[#292928]">
        <div className="flex items-center space-x-2 !bg-[#292928]">
        <Link to={`/profiles/${comment.author_id}`} className="!bg-[#292928] flex-shrink-0 block hover:opacity-80 transition-opacity"> 

          <img 
            src={ comment.author_profile_picture || DEFAULT_USER_AVATAR } // Use comment author pic
            alt={authorName} 
            title={isCommentAuthor ?  "You" : `${authorName}`} 
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
            onError={(e) => { if (e.target.src !== DEFAULT_USER_AVATAR) e.target.src = DEFAULT_USER_AVATAR; }}
          />
          </Link>
          <div className="!bg-[#292928]">
            <p className="font-medium text-sm text-white mb-0 pt-2 !bg-[#292928]">{isCommentAuthor ?  "You" : `${authorName}`} </p>
            <p className="text-xs text-white !bg-[#292928]">
              <TimeAgo timestamp={comment.created_on} />
            </p>
          </div>
        </div>
        {/* Edit/Delete Menu */}
        {isCommentAuthor && (
          <div className="relative !bg-[#292928]" ref={optionsMenuRef}>
              <button onClick={toggleOptionsMenu} className="!text-[#fffd02] text-gray-500 hover:text-gray-700 !bg-[#292928]">
                <MoreVertIcon className="w-5 h-5 !bg-[#292928]" />
              </button>
              {showOptionsMenu && (
                <div className="absolute right-0 mt-2 w-40 !bg-[#292928] rounded-md shadow-lg py-1 z-20">
                  {/* Edit Button - Calls prop */}
                  <button
                    onClick={() => { onEditRequest(comment); setShowOptionsMenu(false); }} 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <EditIcon className="w-4 h-4 mr-2 text-primary-600" /> Edit
                  </button>
                  {/* Delete Button - Calls prop */}
                  <button
                    onClick={() => { onDeleteRequest(comment); setShowOptionsMenu(false); }} 
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                  >
                    <DeleteIcon className="w-4 h-4 mr-2" /> Delete
                  </button>
                </div>
              )}
          </div>
        )}
      </div>

      {/* --- Comment Body with See more/less --- */}
      <div className="text-gray-800 ml-10 mb-2 whitespace-pre-wrap !bg-[#292928]"> {/* Margin to align with author name */}
          {isExpanded ? (
            <>
              <p className="text-white !bg-[#292928]">{displayText}</p>
              {needsTruncation && (
                <button
                  onClick={toggleExpansion}
                  className="mt-1 text-[#A52B2B] hover:underline focus:outline-none font-medium text-xs !bg-[#292928]" 
                  aria-expanded={isExpanded}
                >
                  See less
                </button>
              )}
            </>
          ) : (
            <>
              <p className="!bg-[#292928] inline text-white">{displayText}</p>
              {needsTruncation && (
                <button
                  onClick={toggleExpansion}
                  className="ml-1 text-[#A52B2B] hover:underline focus:outline-none font-medium text-xs !bg-[#292928]"
                  aria-expanded={isExpanded}
                >
                  See more
                </button>
              )}
            </>
          )}
      </div>
       {/* --- End Comment Body --- */}
      
      {/* Comment Attachments (if any - simplified) */}
      {comment.attachments?.length > 0 && (
      <div className="ml-10 mt-2 space-y-2 !bg-[#292928]">
        {comment.attachments.map((attachment) => (
          <div key={attachment.id} className="flex items-center !bg-[#292928] mt-3">
            {attachment.image != null ? (
              <img 
                src={attachment.image} 
                alt="Comment attachment" 
                className="max-w-xs rounded-md"
              />
            ) : (
              <video 
                target="_blank" 
                src={attachment.video}
                controls
                playsInline
                className="w-full h-auto block max-h-[75vh] bg-black max-w-xs rounded-md" // Limit height, add bg for potential letterboxing
                preload="metadata" // Don't preload the whole video
              >
              </video>
            )}
          </div>
        ))}
      </div>
      )}
      {/* Comment Actions (Like, Reactions - Simplified Placeholder) */}
      <div className="flex items-center space-x-4 ml-10 mt-2 !bg-[#292928]">
      <div className="comment-actions">
              <div className="reactions-container">
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
                          // {commentReactions[comment.id]?.length > 0 && (
                          //   <div className="comment-reactions-summary">
                          //     {commentReactions[comment.id].map((reaction, index) => (
                          //       <span key={index}>
                          //         {reaction.reaction_type} by {reaction.user.username}
                          //       </span>
                          //     ))}
                          //   </div>
                          // )}

                          hasReacted(reaction.name)
                            ? handleremoveCommentReaction(comment.id)
                            : handleAddReactionForComment(comment.id, reaction.name);
                            setShowCommentReactions(false);
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
              <p className="Show-All-Reactions-comment"
              onClick={() => setShowReactionsModalforcomment(true)}
              >Show All Reactions</p>
              {showReactionsModalforcomment && 
                <ReactionsCommentModal
                  commentId={comment.id}
                  reactions={commentReactions[comment.id]}
                  // reactions={commentReactions[comment.id]}
                  onClose={() => setShowReactionsModalforcomment(false)}
                />
              }

            </div>
      </div>
    </div>
  );
}
// --- End CommentItem Component ---



export default function ShowPost({ postData, onDeletePost, currentUserId }) {
  // const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [userReactions, setUserReactions] = useState([]);
  const [commentReactions, setCommentReactions] = useState({});
  const [showReactionsModal, setShowReactionsModal] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpenComment, setIsEditModalOpenComment] = useState(false);
  const [isDeleteModalOpenComment, setIsDeleteModalOpenComment] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [post, setPost] = useState(postData);
  const [attachmentUrl, setAttachmentUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const widgetRef = useRef(null);
  const [isPostExpanded, setIsPostExpanded] = useState(false);
  const { user, loading: authLoading } = useContext(AuthContext); // Destructure 'user'
  
  console.log(currentUserId)

  // const currentUserId = user?.id; // Get logged-in user's UUID string (or null)
  const currentUserAvatar = user?.profile_picture || DEFAULT_USER_AVATAR;

// --- State and Calculation for Validation ---
const currentInputLength = commentText.length;
const isCommentInputOverLimit = currentInputLength > MAX_COMMENT_INPUT_LENGTH;
// Determine color for counter based on limit
const commentCountColorClass = isCommentInputOverLimit ? 'text-red-600 font-medium' // Red if over limit
                                                          : 'text-gray-500';

// Add these state variables at the top of your component
const [comments, setComments] = useState([]);
const [commentPagination, setCommentPagination] = useState({
  page: 1,
  hasMore: true,
  isLoading: false,
  error: null
});


// Replace your existing useEffect for fetching comments with:
useEffect(() => {
  const loadInitialComments = async () => {
    const initialPage = 1; // Define page number
    try {
      setCommentPagination(prev => ({...prev, isLoading: true, error: null}));
      console.log(`ShowPost: Calling fetchComments for initial page: ${initialPage}`); // Add log
      
      // --- CORRECTED CALL ---
      const response = await fetchComments(post.id, initialPage); // Pass the number 1
      // --- END CORRECTION ---
      
      // ... rest of the success handling ...
      const commentsData = Array.isArray(response.data) ? response.data : response.data.results || [];
      setComments(commentsData);
      setCommentPagination({
        page: initialPage, // Set page number state
        hasMore: response.data.next ? true : false,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.log(error)
    }
  };
  
  loadInitialComments();
}, [post.id]);

// Add this function to load more comments
const loadMoreComments = async () => {
  if (!commentPagination.hasMore || commentPagination.isLoading) return;
  
  try {
    setCommentPagination(prev => ({...prev, isLoading: true, error: null}));
    const nextPage = commentPagination.page + 1;
    console.log(`ShowPost: Calling fetchComments for next page: ${nextPage}`); // Add log
    
    // --- CORRECTED CALL ---
    const response = await fetchComments(post.id, nextPage); // Pass the number nextPage
    // --- END CORRECTION ---

    // ... rest of success handling ...
     const newComments = Array.isArray(response.data) ? response.data : response.data.results || [];
     setComments(prev => [...prev, ...newComments]);
     setCommentPagination({
       page: nextPage,
       hasMore: response.data.next ? true : false,
       isLoading: false,
       error: null
     });
  } catch (error) { 
    console.log(error)
  }
};
// // Initialize Cloudinary widget
  useEffect(() => {
    if (window.cloudinary) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: CLOUDINARY_CLOUD_NAME,
          uploadPreset: CLOUDINARY_UPLOAD_PRESET,
          sources: ['local', 'url', 'camera'],
          multiple: false,
          resourceType: 'auto', // Accepts both images and videos
          clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'webm', 'mkv', 'wmv'],
          maxFileSize: 15000000 // 15MB
        },
        (error, result) => {
          if (!error && result && result.event === "success") {
            setAttachmentUrl(result.info.secure_url);
            setIsUploading(false);
          } else if (error) {
            console.error("Upload error:", error);
            setIsUploading(false);
          }
        }
      );
    }
  }, []);

  const handleOpenUploadWidget = () => {
    setIsUploading(true);
    if (widgetRef.current) {
      widgetRef.current.open();
    }
  };  
  useEffect(() => {
    if (post?.comments?.length) {
      const fetchAllCommentReactions = async () => {
        const reactionsMap = {};
        for (const comment of post.comments) {
          const reactions = await fetchReactionsForComment( post.id, comment.id);
          reactionsMap[comment.id] = reactions;
        }
        setCommentReactions(reactionsMap);
      };
  
      fetchAllCommentReactions();
    }
  }, [post.comments]);

  const handleComment = () => {
    const trimmedComment = commentText.trim();
  
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
        // Prepend new comment to the list
        setComments(prev => [res.data, ...prev]);
        setCommentText("");
        setAttachmentUrl(null);
        
        // Reset pagination to first page
        setCommentPagination(prev => ({
          ...prev,
          page: 1,
          hasMore: true
        }));
      })
      .catch(err => {
        console.error("Failed to add comment:", err);
        alert("Failed to post comment. Please try again.");
      });
  };
  
  const handleConfirmDeleteComment = () => {
    if (!selectedComment) return;
    
    deleteComment(post.id, selectedComment.id).then(() => {
      setComments(prev => prev.filter(comment => comment.id !== selectedComment.id));
      setIsDeleteModalOpenComment(false);
      setSelectedComment(null);
    }).catch(err => {
      console.error("Failed to delete comment:", err);
    });
};

  const handleAddReaction = async (reactionType) => {
        await likePost(post.id, reactionType);
        const updated = await fetchReactionsForPost(post.id);
        setUserReactions(updated.filter(r => r.user.id === currentUserId));
      };
    
      const hasReacted = (reactionType) => {
        return userReactions.some(r => r.reaction_type === reactionType);
      };
    
      const handleRemoveReaction = async (reactionId) => {
        try {
          await removePostReaction(postId, reactionId); // Pass both IDs
          setReactions(prev => prev.filter(r => r.id !== reactionId));
        } catch (error) {
          console.error("Removal failed:", error);
        }
      };
    
      
      const handleEditPost = (postId, updatedContent) => {
        editPost(postId, { body: updatedContent }).then(() => {
          setIsEditModalOpen(false);
          
          post.body = updatedContent;
          setPost({ ...post, body: updatedContent });
        });
      };
    
      const handleDeletePost = (postId) => {
        deletePost(postId).then(() => {
          setIsDeleteModalOpen(false);
          onDeletePost(postId);                                     
        });
      };
    
      const handleEditCommentRequest = (commentToEdit) => {
        setSelectedComment(commentToEdit); 
        setIsEditModalOpenComment(true);  
      };
    
      
      const handleDeleteCommentRequest = (commentToDelete) => { // Define this handler
          setSelectedComment(commentToDelete);
          setIsDeleteModalOpenComment(true);
      };
      
      const handleConfirmEditComment = (updatedContent) => {
        if (!selectedComment) return;
        console.log(`Editing comment ${selectedComment.id} for post ${post.id} with:`, updatedContent); // Debug
        // Call the imported API function
        editComment(post.id, selectedComment.id, { comment: updatedContent })
          .then((res) => {
            console.log("Edit successful, response:", res.data); // Debug
            // Update the comment in the state array
            setComments(prevComments =>
              prevComments.map(c => c.id === selectedComment.id ? res.data : c)
            );
            setIsEditModalOpenComment(false); // Close modal
            setSelectedComment(null);         // Clear selection
          }).catch(err => {
              console.error("Failed to edit comment:", err.response?.data || err); // Log detailed error
              // Optionally show error to user
          });
      };
      

    // Custom Next Arrow Component
    function SampleNextArrow(props) {
      const { className, style, onClick } = props;
      const isDisabled = className?.includes('slick-disabled'); 
    
      return (
        <button
          type="button"
          // INCREASED PADDING from p-2 to p-3
          className={`absolute top-1/2 right-2 md:right-4 -translate-y-1/2 z-10 
                    p-3 bg-black bg-opacity-30 rounded-full text-white 
                    hover:bg-opacity-50 transition-all duration-200 ease-in-out w-120 h-120 flex items-center justify-center
                    ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                    ${className}` 
                  }
          style={{ ...style }} 
          onClick={onClick} 
          aria-label="Next attachment"
          disabled={isDisabled} 
        >
          {/* INCREASED ICON SIZE to large */}
          <ArrowForwardIos fontSize="large" /> 
        </button>
      );
    }
    
    // Custom Previous Arrow Component - Larger
    function SamplePrevArrow(props) {
      const { className, style, onClick } = props;
      const isDisabled = className?.includes('slick-disabled');
    
      return (
        <button
          type="button"
           // INCREASED PADDING from p-2 to p-3
          className={`absolute top-1/2 left-2 md:left-4 -translate-y-1/2 z-10 
                    p-3 bg-black bg-opacity-30 rounded-full text-white 
                    hover:bg-opacity-50 transition-all duration-200 ease-in-out w-1200 h-1200 flex items-center justify-center
                    ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                    ${className}` 
                  }
          style={{ ...style }}
          onClick={onClick}
          aria-label="Previous attachment"
          disabled={isDisabled}
        >
          {/* INCREASED ICON SIZE to large */}
          <ArrowBackIosNew fontSize="large" /> 
        </button>
      );
    }

    const sliderSettings = {
      dots: true,         
      infinite: false,    
      speed: 500,         
      slidesToShow: 1,      
      slidesToScroll: 1,   
      // lazyLoad: 'ondemand', 
      adaptiveHeight: true, 
      arrows: true, 
      nextArrow: <SampleNextArrow />,
      prevArrow: <SamplePrevArrow /> 
    };

    
    const attachments = post.attachments || [];
    const numAttachments = attachments.length;


  const reactions = [
    { name: "Like", icon: <ThumbUpSharpIcon className="w-5 h-5" /> },
    { name: "Love", icon: <FavoriteSharpIcon className="w-5 h-5" /> },
    { name: "Celebrate", icon: <CelebrationSharpIcon className="w-5 h-5" /> },
    { name: "funny", icon: <SentimentVerySatisfiedSharpIcon className="w-5 h-5" /> },
    { name: "Support", icon: <VolunteerActivismSharpIcon className="w-5 h-5" /> },
    { name: "Insightful", icon: <TipsAndUpdatesSharpIcon className="w-5 h-5" /> },
  ];



  const MAX_POST_LENGTH = 300; 
  const postfullText = post.body || "";
  const postneedsTruncation = postfullText.length > MAX_POST_LENGTH;
  // Show truncated text + "..." if needed and not expanded, otherwise show full text
  const postdisplayText = postneedsTruncation && !isPostExpanded 
                      ? postfullText.slice(0, MAX_POST_LENGTH) + "..." 
                      : postfullText;
  // --- Toggle function ---
  const postToggleExpansion = () => {
    setIsPostExpanded(!isPostExpanded);
  };

  const isPostAuthor = post.author_id === currentUserId; 
  const displayAuthorAvatar = post.author_profile_picture || DEFAULT_USER_AVATAR; 
  const avatarAltText = isPostAuthor ? "You" : `${post.author || "User"}'s avatar`;
  const avatarTitleText = isPostAuthor ? "You" : post.author || "User";


  return (
    <div className="!bg-[#292928] rounded-lg shadow-md p-4 mb-4 border !border-[#7a2226]">
      {/* Post Header */}
      <div className="flex items-center justify-between mb-2 !bg-[#292928]">
        <div className="flex items-center space-x-3 !bg-[#292928]">
        <Link to={`/profiles/${post.author_id}`} className="!bg-[#292928] flex-shrink-0 block hover:opacity-80 transition-opacity"> 
        <img 
              src={displayAuthorAvatar} 
              alt={avatarAltText} 
              title={avatarTitleText} 
              className="w-10 h-10 rounded-full object-cover border border-gray-200 [background-color:inherit]"
              onError={(e) => { 
                if (e.target.src !== DEFAULT_USER_AVATAR) {
                  e.target.src = DEFAULT_USER_AVATAR; 
                }
              }}
          />
          </Link>
          <div className="!bg-[#292928]">
            <p className="font-medium text-white mb-0 mt-3 !bg-[#292928]">{avatarTitleText|| "Unknown"}</p>
            <p className="text-xs text-gray-500 !bg-[#292928]">
              <TimeAgo timestamp={post.created_on}/>
            </p>
          </div>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowOptions(!showOptions)}
            className="text-gray-500 hover:text-gray-700 !bg-[#292928] "
          >
            <MoreVertIcon className="w-5 h-5 !bg-[#292928] !text-[#fffd02]" />
          </button>
          
          {isPostAuthor && ( 
            <div className="relative !bg-[#292928] "> 
              {showOptions && ( 
                <div className="absolute right-0 mt-2 w-40 !bg-[#292928] rounded-md shadow-lg py-1 z-20"> 
                  {/* Edit Post Button */}
                  <button onClick={() => { setIsEditModalOpen(true); setShowOptions(false); }} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"> 
                    <EditIcon className="w-4 h-4 mr-2 text-primary-600" /> Edit 
                  </button> 
                  {/* Delete Post Button */}
                  <button onClick={() => { setIsDeleteModalOpen(true); setShowOptions(false); }} className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-gray-100 w-full text-left"> 
                    <DeleteIcon className="w-4 h-4 mr-2 " /> Delete 
                  </button> 
                </div> 
              )} 
            </div> 
            )}
          
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-3 !bg-[#292928]">
        {/* Post body */}
        {/* --- MODIFIED POST BODY DISPLAY with Conditional Line Break --- */}
        <div className="text-gray-800 mb-3 whitespace-pre-wrap !bg-[#292928]"> {/* Keep whitespace-pre-wrap */}
          
          {/* Conditionally render structure based on isPostExpanded state */}
          {isPostExpanded ? (
            // --- Expanded View ---
            <>
              {/* Full text in a block-level paragraph */}
              <p className="text-white !bg-[#292928]">{postdisplayText}</p> 
              {/* Button appears after the block paragraph, naturally on new line */}
              {postneedsTruncation && ( // Only show button if text was actually long enough
                <button
                  onClick={postToggleExpansion}
                  className="mt-1 text-[#A52B2B] hover:underline focus:outline-none font-medium text-sm !bg-[#292928]" 
                  aria-expanded={isPostExpanded}
                >
                  See less
                </button>
              )}
            </>
          ) : (
            // --- Collapsed View ---
            <>
              {/* Truncated text in an INLINE paragraph */}
              <p className="inline text-white !bg-[#292928]">{postdisplayText}</p>
              {/* "See more" button appears immediately after inline text */}
              {postneedsTruncation && (
                <button
                  onClick={postToggleExpansion}
                   // Style button: brown color, add left margin for spacing
                  className="ml-1 text-[#A52B2B] hover:underline focus:outline-none font-medium text-sm !bg-[#292928]"
                  aria-expanded={isPostExpanded}
                >
                  See more
                </button>
              )}
            </>
          )}
        </div>
        {/* Post attachments */}
        {post.attachments?.length > 0 && (
          <div className="mt-2 !bg-[#292928]">
            {/* --- SLIDESHOW ATTACHMENT DISPLAY --- */}
        {numAttachments > 0 && (
          // Apply a wrapper for styling context if needed, e.g., for arrow/dot position
          // The border/rounded can apply here or on the slider itself
          <div className="!bg-[#292928] mt-2 slick-slider-container relative border border-gray-800 rounded-lg overflow-hidden"> 
            {/* 3. Use Slider component with settings */}
            <Slider {...sliderSettings}>
              
              {/* Map over ALL attachments */}
              {attachments.map((attachment, index) => (
                // Each child of Slider is a slide
                <div key={attachment.id || index} className="slide-item !bg-[#292928] "> {/* Added bg */}
                  {attachment.image ? (
                    <img
                      src={attachment.image}
                      alt={`Post attachment ${index + 1}`}
                      // Style image to fit well within the slide
                      className="w-full h-auto object-contain mx-auto block max-h-[75vh] !bg-[#292928]" // Use object-contain, limit max height
                    />
                  ) : attachment.video ? (
                    <video
                      src={attachment.video}
                      controls
                      playsInline
                      // Style video to fit well
                      className="w-full h-auto block max-h-[75vh] !bg-[#292928]" // Limit height, add bg for potential letterboxing
                      preload="metadata" // Don't preload the whole video
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                     // Fallback for unknown type
                    <div className="!bg-[#292928] aspect-video flex items-center justify-center text-gray-400 text-xs p-1">
                      Unsupported Attachment Type
                    </div>
                  )}
                </div>
              ))}
            </Slider>
          </div>
        )}
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="post-actions !bg-[#292928] " >
  <div className="reactions-container">
    <div 
      className="reaction-trigger" 
      onClick={() => setShowReactions(!showReactions)}
      onMouseLeave={() => setShowReactions(false)}
    >
      <ThumbUpSharpIcon className="ThumbUpSharpIcon"/> 
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
  </div>
</div>

<p className="Show-All-Reactions"
       onClick={() => setShowReactionsModal(true)}
       >Show All Reactions</p>
      {showReactionsModal &&
       <ReactionsModal postId={post.id}
        onClose={() => setShowReactionsModal(false)} />}



      <div className="mt-4 !bg-[#292928]">
      <h4 className="!text-small !font-medium !text-[#fffd02] !bg-[#292928] mb-3">Comments</h4> 

  
        {/* Error message */}
        {commentPagination.error && (
                <div className="text-red-500 text-sm mb-3">
                  Error: {commentPagination.error}
                  {/* Optional: Add a retry button */}
                  <button 
                    onClick={() => loadPosts(1)} // Reload first page on retry?
                    className="ml-2 text-primary-600 hover:underline"
                  >
                    Retry
                  </button>
                </div>
              )}
              
              {/* Comments list */}
              {/* Check if comments array exists before mapping */}
              {comments && comments.length > 0 ? (
                <>
                  {comments.map((comment) => (
                    <CommentItem 
                      key={comment.id} 
                      comment={comment} 
                      currentUserId={user?.id} // Use context user ID
                      onEditRequest={handleEditCommentRequest} 
                      onDeleteRequest={handleDeleteCommentRequest} 
                    />
                  ))}
                  
                  {/* Load More button */}
                  {commentPagination.hasMore && (
                  <div className="flex justify-center">
                    <button
                      onClick={loadMoreComments}
                      disabled={commentPagination.isLoading}
                      className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${
                        commentPagination.isLoading 
                          ? 'bg-gray-400 text-gray-700 cursor-not-allowed' // Adjusted disabled style
                          : 'bg-primary-600 text-grey hover:bg-primary-700' // Check primary color definition
                      }`}
                    >
                      {commentPagination.isLoading ? (
                        <>
                          <CircularProgress 
                        // Set size (in pixels) - smaller for buttons usually looks better
                        size={18} 
                        // Option 1: Inherit color from button text (useful if text color changes)
                        color="red" 
                        // Option 2: Use sx prop for specific styling
                        sx={{ 
                            color: 'white', // Set color explicitly (if button text is white)
                            marginRight: '8px' // Add some spacing before the text (like Tailwind mr-2)
                        }} 
                      />
                        </>
                      ) : (
                        'Load More Comments'
                      )}
                </button>
              </div>
            )}
                  
            {/* End of comments message */}
             {!commentPagination.hasMore && !commentPagination.isLoading && (
                 <p className="text-center text-gray-500 text-xs italic mt-4">No more comments</p>
             )}
          </>
        ) : (
          // Show 'No comments' only if not loading and no error
          !commentPagination.isLoading && !commentPagination.error && (
            <p className="text-gray-500 text-sm italic !bg-[#292928]">No comments yet.</p>
          )
        )}
         {/* Initial loading indicator for comments */}
         {commentPagination.isLoading && comments.length === 0 && (
            <p className="text-center text-gray-500 text-sm py-4">Loading comments...</p>
         )}
      </div>
{/* ======================================================================= */}

        {/* --- Add Comment Section with Icon Inside Input --- */}
        <div className="mt-1 flex items-start space-x-3 border-t border-gray-100 pt-4 !bg-[#292928]">
        <Link to={`/profiles/${post.author_id}`} className="!bg-[#292928] flex-shrink-0 block hover:opacity-80 transition-opacity"> 
        <img 
            src={ currentUserAvatar } // Use derived avatar
            alt={ user?.username || "You" }
            title={ user?.username || "You" }
            className="w-8 h-8 rounded-full object-cover border border-gray-200 flex-shrink-0"
            onError={(e) => { if (e.target.src !== DEFAULT_USER_AVATAR) e.target.src = DEFAULT_USER_AVATAR; }}
          />
          </Link>
          <div className="flex-grow !bg-[#292928]">
             
            {/* --- Input Wrapper with Relative Positioning --- */}
            <div className="relative w-full"> 
               <input
                 type="text"
                 placeholder="Write your comment..."
                 value={commentText}
                 onChange={(e) => setCommentText(e.target.value)}
                 className={`!bg-[#181819] w-full pl-3 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent text-sm ${isCommentInputOverLimit ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:ring-primary-500'}`} 
                 aria-describedby="comment-char-count"
               />
               {/* --- Absolutely Positioned Icon Button --- */}
               
               <button
                  type="button" // Prevent form submission
                  onClick={handleOpenUploadWidget}
                  disabled={isUploading || !!attachmentUrl} 
                  // Position inside the input padding area
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Add Photo/Video" // Accessibility
                >
                 <ImageSharpIcon className="w-5 h-5" /> 
               </button>

               
            </div>

            {/* Character Counter (Stays outside the relative wrapper) */}
             <div id="comment-char-count" className={`text-xs mt-1 text-right !bg-[#292928] ${commentCountColorClass}`}>
                 {currentInputLength} / {MAX_COMMENT_INPUT_LENGTH}
             </div>

            {/* Attachment Preview (Keep as is) */}
            {attachmentUrl && (
              <div className="mt-2 relative">
              {attachmentUrl.match(/\.(jpeg|jpg|gif|png)$/) ? (
                <img 
                  src={attachmentUrl} 
                  alt="Preview" 
                  className="max-w-xs rounded-lg border border-gray-200" // Added border
                />
              ) : attachmentUrl.match(/\.(mp4|mov|webm|mkv)$/) ? ( // Check for video extensions
                <video controls className="max-w-xs rounded-lg border border-gray-200 bg-black">
                  <source src={attachmentUrl} /* Optional: add type based on extension */ />
                  Your browser does not support the video tag.
                </video>
              ): (
                <p className="text-xs text-gray-500 italic">Attachment added (preview not available)</p>
              )}
              {/* Close button for preview */}
              <button
                onClick={() => setAttachmentUrl(null)}
                className="absolute -top-1 -right-1 bg-gray-600 hover:bg-red-500 text-white rounded-full p-0.5 shadow-sm leading-none" // Adjusted position/style
                aria-label="Remove attachment"
              >
                <CloseIcon style={{ fontSize: '0.8rem' }} /> {/* Smaller icon */}
              </button>
            </div>
            )}

            {/* Action Buttons (Only Post button remains here) */}
            <div className="flex items-center justify-end mt-2 !bg-[#292928]"> 
              {/* "Add Photo/Video" button was moved inside input wrapper */}
              <button
                type="button" // Or type="submit" if this div is wrapped in a <form>
                onClick={handleComment}
                disabled={(!commentText.trim() && !attachmentUrl) || isUploading || isCommentInputOverLimit} 
                className={`px-3 py-1 rounded-md text-sm font-medium ${(!commentText.trim() && !attachmentUrl) || isUploading || isCommentInputOverLimit ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-primary-600 text-white hover:bg-primary-700'}`} 
              >
                Comment
              </button>
            </div>
          </div>
        </div>
        
      {/* Modals */}
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
      <EditComment
        isOpen={isEditModalOpenComment}
        comment={selectedComment} 
        onClose={() => {setIsEditModalOpenComment(false); setSelectedComment(null);}} 
        // ** Pass the CORRECT confirmation handler **
        onConfirm={handleConfirmEditComment} 
        
      />
      <DeleteComment
        isOpen={isDeleteModalOpenComment}
        onClose={() => {setIsDeleteModalOpenComment(false); setSelectedComment(null);}} 
        // ** Pass the CORRECT confirmation handler **
        onConfirm={handleConfirmDeleteComment} 
      />
      <ReactionsModal 
        postId={post.id}
        onClose={() => setShowReactionsModal(false)} 
      />
    </div>
  );
}