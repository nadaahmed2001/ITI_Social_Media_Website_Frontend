import React, { useEffect, useState, useRef, useContext } from "react";
import { useParams, useLocation , Link} from "react-router-dom";
import axios from "axios";
import Navbar from "../ui/Navbar";
import EditPost from "../posts/EditPost";
import DeletePost from "../posts/DeletePost";
import EditComment from "../posts/EditComment";
import DeleteComment from "../posts/Deletecomment";
import ReactionsModal from "../posts/ReactionsModal";
import ReactionsCommentModal from "../posts/ReactionsCommentModal";
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import { CommentItem } from "../posts/CommentItem"; // *** IMPORT CommentItem ***
import AuthContext from '../../contexts/AuthContext'; 
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material"; // Import arrow icons
import TimeAgo from "../TimeAgo";
import CustomCircularProgress from "../posts/CustomCircularProgress";
import Slider from "react-slick";
import { GraduationCap } from "lucide-react";

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
  savePost, 
  unsavePost,
} from "../services/api";

import {
  ThumbUpAlt as ThumbUpSolid,
  ThumbUpSharp as ThumbUpSharpIcon,
  ShareOutlined as ShareIcon,
  ChatBubbleOutline as CommentIcon,
  FavoriteSharp as LoveIcon,
  VolunteerActivismSharp as SupportIcon,
  SentimentVerySatisfiedSharp as FunnyIcon,
  CelebrationSharp as CelebrateIcon,
  TipsAndUpdatesSharp as InsightfulIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ImageSharp as ImageSharpIcon,
  Close as CloseIcon,
  BookmarkBorder as BookmarkBorderIcon, // <-- Icon for Save
  Bookmark as BookmarkIcon, 
} from "@mui/icons-material";


  
// const DEFAULT_USER_AVATAR   = '../../src/assets/images/user-default.webp'
import defaultPic from '@/assets/images/user-default.webp';
const DEFAULT_USER_AVATAR = defaultPic;

const CLOUDINARY_CLOUD_NAME =  "dsaznefnt";
const CLOUDINARY_UPLOAD_PRESET = "ITIHub_profile_pics";


const PostDetail = (postData) => {
  const { postId } = useParams();
  const location = useLocation();
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
  const [allPostReactions, setAllPostReactions] = useState([]);
  const { user, loading: authLoading } = useContext(AuthContext); // Destructure 'user'
  const [post, setPost] = useState(postData);
  const [isPostExpanded, setIsPostExpanded] = useState(false);

  // const currentUserId = localStorage.getItem("user_id");
  const currentUserId = user?.id; // Get user ID from context
  const scrollToId = new URLSearchParams(location.search).get("scroll_to");
  const [attachmentUrl, setAttachmentUrl] = useState(null);

  const currentUserAvatar = user?.profile_picture || DEFAULT_USER_AVATAR;
  const [isUploading, setIsUploading] = useState(false);
  const [reactionsLoading, setReactionsLoading] = useState(true); // Loading state for ALL reactions
  const widgetRef = useRef(null);
  const commentInputRef = useRef(null); 
  const [isPostSaved, setIsPostSaved] = useState(postData?.is_saved || false); // <-- STATE FOR SAVED STATUS
  const [isSavingToggleLoading, setIsSavingToggleLoading] = useState(false); // <-- Loading state for save action
  

  useEffect(() => {
    setIsPostSaved(postData?.is_saved || false);
    setPost(postData); // Update post state if postData prop changes
  }, [postData]);

  

  const hidePopoverTimer = useRef(null); 


  const reactions = [
    { name: "Like", icon: <ThumbUpSharpIcon className="Reaction-Post" /> },
    { name: "Love", icon: <LoveIcon className="Reaction-Post" /> },
    { name: "Celebrate", icon: <CelebrateIcon className="Reaction-Post" /> },
    { name: "funny", icon: <FunnyIcon className="Reaction-Post" /> },
    { name: "Support", icon: <SupportIcon className="Reaction-Post" /> },
    { name: "Insightful", icon: <InsightfulIcon className="Reaction-Post" /> },
  ];
  const MAX_COMMENT_INPUT_LENGTH = 200;
  const currentInputLength = commentText.length;
  const isCommentInputOverLimit = currentInputLength > MAX_COMMENT_INPUT_LENGTH;
  // Determine color for counter based on limit
  const commentCountColorClass = isCommentInputOverLimit ? 'text-red-600 font-medium' : 'text-gray-500';// Red if over limit
  
  const [commentPagination, setCommentPagination] = useState({
    page: 1,
    hasMore: true,
    isLoading: false,
    error: null
  });

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
  // Fetch post and comments data
  useEffect(() => {
    const token = localStorage.getItem("access_token");
  
    // Fetch post
    axios
      .get(`http://itihub-backend-ncohav-026f24-129-159-8-224.traefik.me/api/posts/${postId}/`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      })
      .then((res) => {
        setPost(res.data);
      })
      .catch((err) => {
        console.error("Error fetching post:", err);
        if (err.response && err.response.status === 403) {
          alert("You don't have permission to view this post.");
        }
      });
  
    // Fetch comments separately
    axios
      .get(`http://itihub-backend-ncohav-026f24-129-159-8-224.traefik.me/api/posts/${postId}/comments/`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      })
      .then((res) => {
        setComments(res.data.results);
      })
      .catch((err) => {
        console.error("Error fetching comments:", err);
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
  }, [comments, scrollToId]); 
  

  useEffect(() => {
    if (post && post.id) {
      fetchReactionsForPost(post.id).then((res) =>
        setUserReactions(res.filter((r) => r.user_id === currentUserId))
      );
    }
  }, [post, currentUserId]);


  useEffect(() => {
    setReactionsLoading(true); // Start loading
    if (post && post.id) { // Ensure post and post.id are available
        fetchReactionsForPost(post.id).then((res) => {
            const fetchedReactions = Array.isArray(res) ? res : [];
            console.log("Fetched ALL Reactions:", fetchedReactions); 
            setAllPostReactions(fetchedReactions); // Store all reactions
            
            // Filter for the current user's reaction for the button state
            const filteredUser = fetchedReactions.filter(r => r.user_id === currentUserId);
            setUserReactions(filteredUser); 
            
        }).catch(err => {
            console.error("Error fetching post reactions", err);
            setAllPostReactions([]); // Clear on error
            setUserReactions([]);
        }).finally(() => {
            setReactionsLoading(false); // Finish loading
        });
    } else {
        setAllPostReactions([]); // No post, clear reactions
        setUserReactions([]); // No post, clear reactions
        setReactionsLoading(false); // Finish loading
    }
    // Fetch comments logic ...
  }, [post, user?.id]); // Rerun if post or user changes
  

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

  const handleRemoveReaction = async (reactionType) => {
    await removePostReaction(post.id);
    const updated = await fetchReactionsForPost(post.id);
    setUserReactions(updated.filter((r) => r.user?.id === currentUserId));
  };

 const handleCommentReact = async (commentId, reactionType) => {
   console.log(`Reacting to comment ${commentId} with ${reactionType}`);
   const originalComments = [...comments]; // Store original state for potential rollback
 
   // --- Optimistic Update ---
   setComments(prevComments => prevComments.map(c => {
       if (c.id === commentId) {
           const newCounts = { ...(c.reaction_counts || {}) };
           const oldReaction = c.my_reaction;
 
           // Decrement old reaction count if exists
           if (oldReaction && newCounts[oldReaction]) {
               newCounts[oldReaction] = Math.max(0, newCounts[oldReaction] - 1);
           }
           // Increment new reaction count
           newCounts[reactionType] = (newCounts[reactionType] || 0) + 1;
 
           return { ...c, my_reaction: reactionType, reaction_counts: newCounts };
       }
       return c;
   }));
 
   try {
     // Call the API function (assuming it handles add/update logic correctly)
     // Note: likeComment might need adjustment if it doesn't handle updates
     // If your backend `likeComment` only adds, you might need to call
     // `removeCommentReaction` first if changing reactions. Let's assume
     // `likeComment` implicitly handles the update on the backend.
     await likeComment(commentId, reactionType);
     // Optional: Refetch comments or trust optimistic update if API guarantees consistency
     // Example refetch (less ideal for performance):
     // const response = await fetchComments(post.id, 1); // Reload first page? Or specific comment?
     // setComments(response.data.results || []);
     console.log(`Successfully reacted to comment ${commentId}`);
 } catch (error) {
     console.error("Failed to react to comment:", error);
     // --- Rollback Optimistic Update ---
     setComments(originalComments);
     alert("Failed to save reaction. Please try again."); // User feedback
 }
 };
 
 const handleCommentUnreact = async (commentId) => {
 console.log(`Un-reacting from comment ${commentId}`);
 const originalComments = [...comments]; // Store original state
 
 // --- Optimistic Update ---
 setComments(prevComments => prevComments.map(c => {
     if (c.id === commentId) {
         const oldReaction = c.my_reaction;
         if (!oldReaction) return c; // No reaction to remove
 
         const newCounts = { ...(c.reaction_counts || {}) };
         if (newCounts[oldReaction]) {
             newCounts[oldReaction] = Math.max(0, newCounts[oldReaction] - 1);
         }
         return { ...c, my_reaction: null, reaction_counts: newCounts };
     }
     return c;
 }));
  // --- End Optimistic Update ---
 
 try {
     await removeCommentReaction(commentId); // Pass only commentId if API expects that
      console.log(`Successfully un-reacted from comment ${commentId}`);
     // Optional: Refetch or trust optimistic update
 } catch (error) {
     console.error("Failed to un-react from comment:", error);
      // --- Rollback Optimistic Update ---
      setComments(originalComments);
      alert("Failed to remove reaction. Please try again."); // User feedback
 }
 };

  const handleEditComment = (postId, comment, updatedData) => {
      editComment(postId, comment.id, { comment: updatedData }).then(() => {
       setIsEditModalOpenComment(false);
  
       comment.comment = updatedData;
       setComments(comments);
      });
  
    };
  
    const handleConfirmEditComment = (updatedContent) => {
      if (!selectedComment) return;
    
      editComment(post.id, selectedComment.id, { comment: updatedContent })
        .then((res) => {
          // Preserve CRITICAL fields (id, author_id) from the original comment
          setComments(prev => prev.map(c => 
            c.id === selectedComment.id 
              ? { ...res.data, id: selectedComment.id, author_id: selectedComment.author_id } 
              : c
          ));
          setIsEditModalOpenComment(false);
          setSelectedComment(null);
        })
        .catch(err => console.error("Edit failed:", err));
    };
    
              
    const handleConfirmDeleteComment = () => {
      if (!selectedComment) return;
      
      deleteComment(post.id, selectedComment.id)
        .then(() => {
          // Correctly filter out the deleted comment
          setComments(prev => prev.filter(c => c.id !== selectedComment.id));
          setIsDeleteModalOpenComment(false);
          setSelectedComment(null);
        })
        .catch(err => {
          console.error("Failed to delete comment:", err);
          alert("Failed to delete comment. Please try again.");
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


  // const isPostAuthor = post?.author?.id?.toString() === currentUserId?.toString();
  const isPostAuthor = 
  post?.author_id?.toString().trim() === currentUserId?.toString().trim();
  // const isPostAuthor = post?.author_id === currentUserId; 
  const displayAuthorAvatar = post?.author_profile_picture || DEFAULT_USER_AVATAR; 
  const avatarAltText = isPostAuthor ? "You" : `${post?.author || "User"}'s avatar`;
  const avatarTitleText = isPostAuthor ? "You" : post?.author || "User";
  // const isPostAuthor = post?.author_id?.toString() === currentUserId?.toString();
  
  
  
//   console.log("Post Author ID:", post?.author_id);
// console.log("Current User ID:", currentUserId);
// console.log("Is Post Author:", post?.author_id === currentUserId);
  
  const AVAILABLE_REACTIONS = [
    { 
      name: "Like", 
      icon: <ThumbUpSolid className="text-blue-500 w-5 h-5" />
    },
    { 
      name: "Love", 
      icon: <LoveIcon className="text-red-500 w-5 h-5" />
    },
    { 
      name: "Celebrate", 
      icon: <CelebrateIcon className="text-violet-400 w-5 h-5" />
    },
    { 
      name: "funny", 
      icon: <FunnyIcon className="text-green-400 w-5 h-5" />
    },
    { 
      name: "Support", 
      icon: <SupportIcon className="text-blue-600 w-5 h-5" />
    },
    { 
      name: "Insightful", 
      icon: <InsightfulIcon className="text-yellow-200 w-5 h-5" />
    },
  ];

  const handleToggleSavePost = async () => {
      if (!post?.id || isSavingToggleLoading) return; // Prevent action if no post or already loading
  
      setIsSavingToggleLoading(true);
      const currentlySaved = isPostSaved; // Store current state before API call
  
      try {
        if (currentlySaved) {
          // If currently saved, call unsave API
          await unsavePost(post.id);
          setIsPostSaved(false); // Update state on success
          console.log("Post unsaved");
        } else {
          // If not saved, call save API
          await savePost(post.id);
          setIsPostSaved(true); // Update state on success
          console.log("Post saved");
        }
      } catch (error) {
        console.error("Failed to toggle save status:", error);
        // Optional: Revert state on error? Or show error message
        // setIsPostSaved(currentlySaved); // Revert optimistic update if implemented
        alert(`Failed to ${currentlySaved ? 'unsave' : 'save'} post.`);
      } finally {
        setIsSavingToggleLoading(false); // Reset loading state
        setShowOptions(false); // Close the options menu
      }
  };

  // Return a loading state if post is not yet loaded
  if (!post) return <div>Loading...</div>;

  return (
    <div className="bg-white/90  backdrop-blur-sm rounded-xl shadow-lg p-6 mb-4 border-2 border-[#7a2226]/20 transition-all duration-300 hover:shadow-xl">
      {/* <Navbar  /> */}
{/*  */}
      <div className="flex justify-center items-center min-h-screen px-6 pt-26">
        <div className="w-full max-w-2xl  p-6 rounded-xl shadow-lg border-2 border-[#7a2226]/20 transition-all duration-300 hover:shadow-xl">

          {/* Post Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
          <Link to={`/profiles/${post.author_id}`} className= " flex-shrink-0 group hover:opacity-80 transition-opacity"> 
            <img 
                  src={displayAuthorAvatar} 
                  alt={avatarAltText} 
                  title={avatarTitleText} 
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#7a2226]/20 group-hover:border-[#7a2226]/40 transition-all"
                  onError={(e) => { 
                    if (e.target.src !== DEFAULT_USER_AVATAR) {
                      e.target.src = DEFAULT_USER_AVATAR; 
                    }
                  }}
              />
          </Link >

          <div>
            <Link to={`/profiles/${post.author_id}`} className= "hover:opacity-80 transition-opacity !no-underline"> 
            <p className="mb-0 mt-2 font-bold text-lg bg-gradient-to-r from-[#7a2226] to-[#a53d3d] bg-clip-text text-transparent">{avatarTitleText|| "Unknown"}</p>
            </Link>
            <p className="text-xs text-[#4a5568] !bg-[#FFFEFE]">
              {post.created_on && (
                <TimeAgo timestamp={new Date(post.created_on)} />
              )}

            </p>
          </div>
        </div>
        
<div className="relative">

  <button 
    onClick={() => setShowOptions(!showOptions)}
    className="text-[#7a2226] hover:text-[#5a181b] transition-colors"
  >
    <MoreVertIcon className="w-6 h-6" />
  </button>
  
  {showOptions && ( 
    <div  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-20 border border-[#7a2226]/20"> 
      {/* Save/Unsave Button */}
      <button
        onClick={handleToggleSavePost}
        disabled={isSavingToggleLoading} // Disable while action is in progress
        className="flex items-center w-full px-4 py-2 text-sm text-[#7a2226] hover:bg-[#7a2226]/10 transition-colors"
        >
        {isPostSaved ? (
            <BookmarkIcon className="w-4 h-4 mr-2 text-blue-400" /> // Icon when saved
        ) : (
            <BookmarkBorderIcon className="w-4 h-4 mr-2 text-gray-400" /> // Icon when not saved
        )}
        {isPostSaved ? 'Unsave Post' : 'Save Post'}
      </button>


      {/* Separator if author */}
      {isPostAuthor && <hr className="border-t border-gray-600 my-1 mx-2" />}

      
      {isPostAuthor && (
        <>
          <button 
            onClick={() => { setIsEditModalOpen(true); setShowOptions(false); }} 
            className="flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-600 w-full text-left"
          > 
            <EditIcon className="w-4 h-4 mr-2 text-blue-400" /> Edit 
          </button> 
          <button 
            onClick={() => { setIsDeleteModalOpen(true); setShowOptions(false); }} 
            className="flex items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-600 w-full text-left"
          > 
            <DeleteIcon className="w-4 h-4 mr-2" /> Delete 
          </button>
        </>
      )}
      
      <button 
        onClick={() => { /* Handle share logic */ setShowOptions(false); }}
        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
      >
        <ShareIcon className="w-4 h-4 mr-2" /> Share
      </button>
    </div> 
  )}
  </div>
</div>
 {/* Post Content */}
 <div className="mb-">
        {/* Post body */}
        {/* --- MODIFIED POST BODY DISPLAY with Conditional Line Break --- */}
        <div className="text-[#2d3748] text-justify">
          
          {/* Conditionally render structure based on isPostExpanded state */}
          {isPostExpanded ? (
            // --- Expanded View ---
            <>
              {/* Full text in a block-level paragraph */}
              <p className="mb-2">{postdisplayText}</p> 
              {/* Button appears after the block paragraph, naturally on new line */}
              {postneedsTruncation && ( // Only show button if text was actually long enough
                <button
                  onClick={postToggleExpansion}
                 className="ml-1 text-[#7a2226] hover:underline font-medium text-sm"
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
              <p className="inline text-gray-900 ">{postdisplayText}</p>
              {/* "See more" button appears immediately after inline text */}
              {postneedsTruncation && (
                <button
                  onClick={postToggleExpansion}
                   // Style button: brown color, add left margin for spacing
                 className="ml-1 text-[#7a2226] hover:underline font-medium text-sm"
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
          <div className="mt-4">
            {/* --- SLIDESHOW ATTACHMENT DISPLAY --- */}
        {numAttachments > 0 && (
          // Apply a wrapper for styling context if needed, e.g., for arrow/dot position
          // The border/rounded can apply here or on the slider itself
          <div className=" mt-2 slick-slider-container relative border border-gray-800 rounded-lg overflow-hidden"> 
            {/* 3. Use Slider component with settings */}
            <Slider {...sliderSettings}>
              
              {/* Map over ALL attachments */}
              {attachments.map((attachment, index) => (
                // Each child of Slider is a slide
                <div key={attachment.id || index} className="relative group"> {/* Added bg */}
                  {attachment.image ? (
                    <img
                      src={attachment.image}
                      alt={`Post attachment ${index + 1}`}
                      // Style image to fit well within the slide
                      className="w-full h-auto object-contain rounded-xl border border-[#7a2226]/10"
                    />
                  ) : attachment.video ? (
                    <video
                      src={attachment.video}
                      controls
                      playsInline
                      // Style video to fit well
                      className="w-full h-auto rounded-xl border border-[#7a2226]/10" // Limit height, add bg for potential letterboxing
                      preload="metadata" // Don't preload the whole video
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                     // Fallback for unknown type
                    <div  className="aspect-video flex items-center justify-center text-[#7a2226]">
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

{/* ============================================================= POST REACTIONS ==================================================================*/}

<div className="px-4 pt-1 pb-2 flex justify-between items-center text-xs "> 
      {/* Left Side: Reaction Summary Icons (Optional) */}
      <div className="flex items-center gap-1 text-gray-400 ">
          {/* For example, if you have reaction counts: */}
          {post.reaction_counts?.Like > 0 && <ThumbUpSolid className="w-4 h-4 text-blue-500 " />}
          {post.reaction_counts?.Love > 0 && <LoveIcon className="w-4 h-4 text-red-500 -ml-1 " />}
          {post.reaction_counts?.funny > 0 && <FunnyIcon className="w-4 h-4 text-violet-400 " />}
          {post.reaction_counts?.Celebrate > 0 && <CelebrateIcon className="w-4 h-4 text-green-400 " />}
          {post.reaction_counts?.Insightful > 0 && <InsightfulIcon className="w-4 h-4 text-[#7B2326] " />}
          {post.reaction_counts?.Support > 0 && <SupportIcon className="w-4 h-4 text-blue-200 " />}

          {/* Display total count if > 0 */}
          {allPostReactions.length > 0 && (
            
            <span 
                  className="ml-1 hover:underline cursor-pointer " 
                  onClick={() => setShowReactionsModal(true)} // Make count clickable too
                  title="See who reacted"
              > 
                  {allPostReactions.length}
              </span>
          )}
      </div>
      
      
      <div className="flex items-center gap-4"> {/* Increased gap */}
          {/* Comment Count (Optional: make clickable to scroll to comments) */}
          {comments.length == 1 ? (
              <span className="text-gray-400 hover:underline cursor-pointer ">
                  1 Comment
              </span>):
              (
              <span className="text-gray-400 hover:underline cursor-pointer">
                {comments?.length || 0} Comments
              </span>
              )}
      </div>
  </div>

  <div className="post-actions flex justify-around items-center border-y border-gray-700 px-1 py-2 mt-1 "> {/* Optional: Set specific bg */}
      {/* Like Button + Popover Wrapper Div */}
      <div 
          className="relative flex-1 mx-2" // flex-1 makes buttons distribute space
          onMouseEnter={handleMouseEnterTrigger} // Show on enter trigger area
          onMouseLeave={handleMouseLeaveArea}  // Start timer on leave trigger ar
      >
          {/* Like Button Itself */}
          <button 
              // Use your existing handler logic. This example assumes a generic handleReaction
              // You might need separate onClick for Like vs. Remove if logic differs greatly
              onClick={() => userReactions.length > 0 ? handleRemoveReaction(userReactions[0]?.reaction_type) : handleAddReaction('Like') } 
              // Dynamic classes based on whether the user has reacted
              className={`!bg-[#7a2226] w-full flex justify-center items-center gap-1.5 py-2 rounded text-sm font-medium transition-all ease-in-out duration-500 ${ // Base styles + transition
                userReactions.length > 0 
                ? 'text-white font-semibold bg-transparent' // LIKED state (use a clear distinct color)
                : 'text-gray-400 hover:bg-gray-700 hover:text-gray-100 hover:scale-105 hover:font-semibold' // NOT LIKED state + hover
            }`}
          >
              {/* Show solid icon if reacted, outline otherwise */}
              {userReactions[0] ? (
    AVAILABLE_REACTIONS.find(r => r.name === userReactions[0].reaction_type)?.icon
  ) : (
    <ThumbUpOutlinedIcon className="!w-5 h-5"/>
  )}
  
  {/* Display reaction text */}
  <span className="">
    {userReactions[0]?.reaction_type || 'React'}
  </span>
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

      {/* Placeholder Comment Button */}
      <button onClick={() => commentInputRef.current?.focus()} className="!bg-[#7a2226] mx-2 flex-1 flex justify-center items-center gap-1.5 py-2 rounded text-sm font-medium text-gray-400 hover:bg-gray-700 hover:text-gray-100 transition-all ease-in-out duration-700 hover:scale-105"> 
          <CommentIcon className="!bg-[#7a2226] w-5 h-5"/> Comment 
      </button>

      {/* Placeholder Share Button */}
      <button className="!bg-[#7a2226] mx-2 flex-1 flex justify-center items-center gap-1.5 py-2 rounded text-sm font-medium text-gray-400 hover:bg-gray-700 hover:text-gray-100 transition-all ease-in-out duration-700 hover:scale-105"> 
          <ShareIcon className="!bg-[#7a2226] w-5 h-5"/> Share 
      </button>

      {/* --- Render Reactions Modal --- */}
      {/* Pass the fetched data and loading state down */}
      {showReactionsModal && (
          <ReactionsModal 
            reactions={allPostReactions} 
            isLoading={reactionsLoading} 
            onClose={() => setShowReactionsModal(false)} 
          />
      )}

  </div>

      <div className="mt-4 ">
      <h4 className="!text-sm !font-bold !text-[#7a2226] mb-3">Comments</h4> 
  
        {/* Error message */}
        {commentPagination.error && (
                <div className="text-red-500 text-sm mb-3">
                  Error: {commentPagination.error}
                  {/* Optional: Add a retry button */}
                  <button 
                    onClick={() => loadMoreComments(1)} // Reload first page on retry?
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
                  <div id={`comment-${comment.id}`} key={comment.id}>
                  <CommentItem
                    comment={comment}
                    currentUserId={currentUserId}
                    onEditRequest={(comment) => {
                      setSelectedComment(comment);
                      setIsEditModalOpenComment(true);
                    }}
                    onDeleteRequest={(comment) => { 
                      setSelectedComment(comment);
                      setIsDeleteModalOpenComment(true);
                    }}
                    onReact={handleCommentReact}
                    onUnreact={handleCommentUnreact}
                  />
                </div>

                ))}

                  {/* Load More button */}
                  {commentPagination.hasMore && (
                  <div className="flex justify-center ">
                    <button
                      onClick={loadMoreComments}
                      disabled={commentPagination.isLoading}
                      className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
                        commentPagination.isLoading 
                          ? ' text-gray-700 cursor-not-allowed'
                          : ' text-grey hover:bg-primary-700'
                      }`}
                    >
                      {commentPagination.isLoading ? (
                          <CustomCircularProgress/>
                      ) : (
                      <span className="font-semibold text-gray-700">
                          Load More Comments
                      </span>                      
                      )}
                </button>
              </div>
            )}
                  
            {/* End of comments message */}
             {!commentPagination.hasMore && !commentPagination.isLoading && (
                 <p className="text-center !text-[#7a2226] text-xs italic mt-4">No more comments</p>
             )}
          </>
        ) : (
          // Show 'No comments' only if not loading and no error
          !commentPagination.isLoading && !commentPagination.error && (
            <p className="text-gray-500 text-sm italic ">No comments yet.</p>
          )
        )}
         {/* Initial loading indicator for comments */}
         {commentPagination.isLoading && comments.length === 0 && (
            <p className="text-center text-gray-500 text-sm py-4">Loading comments...</p>
         )}
      </div>
{/* ============================================================= POST REACTIONS ==================================================================*/}
 {/* --- Add Comment Section with Icon Inside Input --- */}
 <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 mb-4 mt-4 border-2 border-[#7a2226]/20 transition-all duration-300 hover:shadow-xl hover:border-[#7a2226]/30 flex items-start space-x-3"> {/* <-- Added flex items-start space-x-3 */}
 <Link to={`/profiles/${post.author_id}`} className=" flex-shrink-0 block hover:opacity-80 transition-opacity group"> 
        <img 
            src={ currentUserAvatar } // Use derived avatar
            alt={ user?.username || "You" }
            title={ user?.username || "You" }
            className="w-10 h-10 rounded-full object-cover border-2 border-[#7a2226]/20 group-hover:border-[#7a2226]/40 transition-all shadow-sm"
            onError={(e) => { if (e.target.src !== DEFAULT_USER_AVATAR) e.target.src = DEFAULT_USER_AVATAR; }}
          />
          </Link>

          <div className="flex-grow ">
              {/* --- Input Wrapper with Relative Positioning --- */}
              <div className="relative w-full "> 
                <input
                  ref={commentInputRef}
                  type="text"
                  placeholder="Write your comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className={`placeholder:text-[#7a2226]/60 text-black w-full px-3 py-2 border-2 border-[#7a2226]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a2226]/40 focus:border-transparent resize-none bg-white/80 transition-all duration-300 hover:border-[#7a2226]/30`}
                  aria-describedby="comment-char-count"
                />
                {/* --- Absolutely Positioned Icon Button --- */}
                
                <button
                  type="button" // Prevent form submission
                  onClick={handleOpenUploadWidget}
                  disabled={isUploading || !!attachmentUrl} 
                  // Position inside the input padding area
                  className="absolute top-1/2 right-2.5 transform -translate-y-1/2 text-gray-500 hover:text-[#7a2226] disabled:opacity-50 disabled:cursor-not-allowed p-1" // Adjusted padding/position
                  aria-label="Add Photo/Video" // Accessibility
                >
                  {isUploading ? <CircularProgress size={20} color="inherit"/> : <ImageSharpIcon className="w-5 h-5" />}
              </button>
            </div>

            {/* Character Counter (Stays outside the relative wrapper) */}
            <div id="comment-char-count" className={`text-xs mt-1 text-right ${commentCountColorClass}`}>
                {currentInputLength} / {MAX_COMMENT_INPUT_LENGTH}
            </div>

            {/* Attachment Preview (Keep as is) */}
            {attachmentUrl && (
              <div className="mt-2 relative w-fit">
                  {attachmentUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? ( // Added webp, case-insensitive
                <img 
                  src={attachmentUrl} 
                  alt="Preview" 
                  className="max-w-xs max-h-40 rounded-lg border border-gray-600"
                  />
                ) : attachmentUrl.match(/\.(mp4|mov|webm|mkv|avi)$/i) ? ( // Added avi, case-insensitive
                  <video controls className="max-w-xs max-h-40 rounded-lg border border-gray-600 bg-black">
                          <source src={attachmentUrl} /> Your browser does not support the video tag.
                          Your browser does not support the video tag.
                 </video>
              ): (
                <p className="text-xs text-gray-500 italic border border-dashed border-gray-600 p-2 rounded">Attachment added (preview not available)</p>
              )}
              {/* Close button for preview */}
                <button
                  onClick={() => setAttachmentUrl(null)}
                  className="absolute -top-2 -right-2 bg-gray-700 hover:bg-red-600 text-white rounded-full p-0.5 leading-none shadow-md transition-colors"
                  aria-label="Remove attachment"
                >
                      <CloseIcon style={{ fontSize: '1rem'}} /> {/* Slightly smaller */}
                </button>
            </div>
            )}

            {/* Action Buttons (Only Post button remains here) */}
            <div className="flex items-center justify-end mt-2"> {/* Removed rounded-lg here */}
              <button
                type="button" // Or type="submit" if this div is wrapped in a <form>
                onClick={handleComment}
                disabled={(!commentText.trim() && !attachmentUrl) || isUploading || isCommentInputOverLimit} 
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  (!commentText.trim() && !attachmentUrl) || isUploading || isCommentInputOverLimit
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed' // Disabled state
                  : 'bg-[#7a2226] text-white hover:bg-[#5a181b]' // Active state
                }`}
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
        onClose={() => {
          setIsEditModalOpenComment(false);
          setSelectedComment(null); // Reset to prevent stale data
        }}
        onConfirm={handleConfirmEditComment}
        comment={selectedComment}
      />
      <DeleteComment
              isOpen={isDeleteModalOpenComment}
              onClose={() => {setIsDeleteModalOpenComment(false); setSelectedComment(null);}} 
              // ** Pass the CORRECT confirmation handler **
              onConfirm={handleConfirmDeleteComment} 
            />
        </div>
      </div>
    </div>
  );
};


export default PostDetail;