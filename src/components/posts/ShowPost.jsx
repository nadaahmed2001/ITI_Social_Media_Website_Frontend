import React, { useState, useEffect, useRef, useContext} from "react";
import AuthContext from '../../contexts/AuthContext';
import { Link } from "react-router-dom";
import TimeAgo from '../TimeAgo'; // Ensure path is correct
import CustomCircularProgress from "./CustomCircularProgress"; // Ensure path is correct
import { CommentItem } from "./CommentItem"; // Ensure path is correct
import EditPost from "./EditPost"; // Ensure path is correct
import DeletePost from "./DeletePost"; // Ensure path is correct
import EditComment from "./EditComment"; // Ensure path is correct
import DeleteComment from "./Deletecomment"; // Ensure path is correct
import ReactionsModal from "./ReactionsModal"; // Ensure path is correct
// import ReactionsCommentModal from "./ReactionsCommentModal"; // Rendered inside CommentItem

// API Functions
import {
  fetchComments, addComment, editPost, deletePost, deleteComment, editComment,
  likePost, likeComment, fetchReactionsForPost, removePostReaction, removeCommentReaction,
  savePost, unsavePost
} from "../../components/services/api"; // Adjust path if needed

// Icons
import {
  ThumbUpOffAlt as ThumbUpOutline, ThumbUpAlt as ThumbUpSolid,
  ShareOutlined as ShareIcon, ChatBubbleOutline as CommentIcon,
  FavoriteSharp as LoveIcon, VolunteerActivismSharp as SupportIcon,
  SentimentVerySatisfiedSharp as FunnyIcon, CelebrationSharp as CelebrateIcon,
  TipsAndUpdatesSharp as InsightfulIcon, MoreVert as MoreVertIcon,
  Edit as EditIcon, Delete as DeleteIcon, ImageSharp as ImageSharpIcon,
  Close as CloseIcon, EmojiEmotions as EmojiEmotionsIcon,
  BookmarkBorder as BookmarkBorderIcon, Bookmark as BookmarkIcon,
  ArrowBackIosNew, ArrowForwardIos // For slider
} from "@mui/icons-material";

// Slider CSS
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// --- Constants ---
const DEFAULT_USER_AVATAR   = '../../src/assets/images/user-default.webp'; // Verify path
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dsaznefnt";
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "ITIHub_profile_pics";
const MAX_COMMENT_INPUT_LENGTH = 2000;
const MAX_POST_LENGTH = 300;

// Define reactions array consistently (used for popover structure and icons)
const AVAILABLE_REACTIONS_DATA = [
  { name: "Like", icon: ThumbUpSolid },
  { name: "Love", icon: LoveIcon },
  { name: "Celebrate", icon: CelebrateIcon },
  { name: "funny", icon: FunnyIcon },
  { name: "Support", icon: SupportIcon },
  { name: "Insightful", icon: InsightfulIcon },
];

// Helper to get reaction icon component
const getReactionIconComponent = (reactionName) => {
    const reaction = AVAILABLE_REACTIONS_DATA.find(r => r.name === reactionName);
    return reaction ? reaction.icon : ThumbUpOutline; // Default to Like outline
};

// Helper to get reaction color class (Tailwind)
const getReactionColorClass = (reactionType) => {
    switch (reactionType) {
        case "Like": return 'text-blue-500';
        case "Love": return 'text-red-500';
        case "Celebrate": return 'text-green-500';
        case "funny": return 'text-violet-400'; // Consider slightly different yellow/orange
        case "Support": return 'text-purple-500';
        case "Insightful": return 'text-teal-400';
        default: return 'text-gray-400'; // Fallback
    }
};


function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  // Check if the slick-disabled class is present
  const isDisabled = className?.includes('slick-disabled');

  return (
    <button
      type="button"
      // Base styles + Positioning + Appearance
      className={`absolute top-1/2 right-1 md:right-2 -translate-y-1/2 z-10
                p-2 bg-black bg-opacity-40 rounded-full text-white
                transition-all duration-200 ease-in-out group // Added group for potential icon hover
                ${isDisabled
                  ? 'opacity-30 cursor-not-allowed' // Disabled state
                  : 'opacity-70 hover:opacity-100 hover:bg-opacity-60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white cursor-pointer' // Enabled + Hover + Focus state
                }
                ${className}` // Include original slick classes
              }
      style={{ ...style }} // Apply inline styles from react-slick
      onClick={onClick}
      aria-label="Next attachment"
      disabled={isDisabled}
    >
      {/* Icon - adjusted size and potential hover effect */}
      <ArrowForwardIos fontSize="medium" className="transition-transform group-hover:scale-110" />
    </button>
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  const isDisabled = className?.includes('slick-disabled');

  return (
    <button
      type="button"
       // Base styles + Positioning + Appearance
      className={`absolute top-1/2 left-1 md:left-2 -translate-y-1/2 z-10
                p-2 bg-black bg-opacity-40 rounded-full text-white
                transition-all duration-200 ease-in-out group
                ${isDisabled
                  ? 'opacity-30 cursor-not-allowed'
                  : 'opacity-70 hover:opacity-100 hover:bg-opacity-60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white cursor-pointer'
                }
                ${className}`
              }
      style={{ ...style }}
      onClick={onClick}
      aria-label="Previous attachment"
      disabled={isDisabled}
    >
       {/* Icon - adjusted size and potential hover effect */}
       {/* Added slight padding adjustment for Previous icon alignment */}
      <ArrowBackIosNew fontSize="medium" className="transition-transform group-hover:scale-110 ml-[-2px]" />
    </button>
  );
}

export default function ShowPost({ postData, onDeletePost }) {
  // --- State ---
  const [post, setPost] = useState(postData);
  const [comments, setComments] = useState([]);
  const [commentPagination, setCommentPagination] = useState({ page: 1, hasMore: true, isLoading: false, error: null });
  const [commentText, setCommentText] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isPostExpanded, setIsPostExpanded] = useState(false);
  const [showReactions, setShowReactions] = useState(false); // Popover visibility
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpenComment, setIsEditModalOpenComment] = useState(false);
  const [isDeleteModalOpenComment, setIsDeleteModalOpenComment] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [showReactionsModal, setShowReactionsModal] = useState(false); // List modal
  const [allPostReactions, setAllPostReactions] = useState([]);
  const [userReactions, setUserReactions] = useState([]); // User's reaction object(s) to THIS post
  const [reactionsLoading, setReactionsLoading] = useState(true);
  const [isPostSaved, setIsPostSaved] = useState(postData?.is_saved || false);
  const [isSavingToggleLoading, setIsSavingToggleLoading] = useState(false);
  const [error, setError] = useState(null); // General error state

  // Refs
  const widgetRef = useRef(null);
  const hidePopoverTimer = useRef(null);

  // Context
  const { user, loading: authLoading } = useContext(AuthContext);
  // Use profile ID from context if available, otherwise fallback might be needed depending on API structure
  const currentUserId = user?.profile?.id || user?.id; // Adjust based on where the relevant ID is stored
  const currentUserAvatar = user?.profile?.profile_picture || DEFAULT_USER_AVATAR;

  // --- Derived State ---
  const currentInputLength = commentText.length;
  const isCommentInputOverLimit = currentInputLength > MAX_COMMENT_INPUT_LENGTH;
  const commentCountColorClass = isCommentInputOverLimit ? 'text-red-600 font-medium' : 'text-gray-500';
  // Use profile ID for author check if available
  const isPostAuthor = post?.author_id === currentUserId;
  const displayAuthorAvatar = post?.author_profile_picture || DEFAULT_USER_AVATAR;
  const avatarAltText = isPostAuthor ? "You" : `${post?.author || "User"}'s avatar`;
  const avatarTitleText = isPostAuthor ? "You" : post?.author || "User";
  const attachments = post?.attachments || [];
  const numAttachments = attachments.length;
  // Get the type of the user's current reaction to the post (null if none)
  const currentUserReactionType = userReactions[0]?.reaction_type || null;


  // --- Effects ---

  // Initialize saved state and post state when postData prop changes
  // Also fetches initial reactions for the post
  useEffect(() => {
    setIsPostSaved(postData?.is_saved || false);
    setPost(postData); // Update local post state

    if (postData?.id) {
        setReactionsLoading(true);
        fetchReactionsForPost(postData.id)
          .then((res) => {
            const fetchedReactions = Array.isArray(res) ? res : [];
            // console.log("Fetched ALL Post Reactions:", fetchedReactions);
            setAllPostReactions(fetchedReactions);
            if (currentUserId) {
              const filteredUser = fetchedReactions.filter(r => String(r.user_id) === String(currentUserId));
              setUserReactions(filteredUser);
              // console.log("Set User Reactions:", filteredUser);
            } else {
              setUserReactions([]);
            }
          })
          .catch(err => { console.error("Error fetching post reactions", err); setAllPostReactions([]); setUserReactions([]); })
          .finally(() => { setReactionsLoading(false); });
    } else {
        setAllPostReactions([]); setUserReactions([]); setReactionsLoading(false);
    }
  }, [postData, currentUserId]);

  // Fetch Initial Comments
  useEffect(() => {
    if (!post?.id) return;
    const loadInitialComments = async () => {
        const initialPage = 1;
        setCommentPagination(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const response = await fetchComments(post.id, initialPage);
            const commentsData = Array.isArray(response.data?.results) ? response.data.results : [];
            setComments(commentsData);
            setCommentPagination({ page: initialPage, hasMore: !!response.data?.next, isLoading: false, error: null });
        } catch (error) {
            console.error("Failed to load initial comments:", error);
            setComments([]);
            setCommentPagination(prev => ({ ...prev, isLoading: false, error: "Could not load comments." }));
        }
    };
    loadInitialComments();
  }, [post?.id]);



  // Initialize Cloudinary Widget
  useEffect(() => {
    if (window.cloudinary) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
            cloudName: CLOUDINARY_CLOUD_NAME,
            uploadPreset: CLOUDINARY_UPLOAD_PRESET,
            folder: 'post_attachments', // Specific folder for post attachments
            sources: ['local', 'url', 'camera'],
            multiple: false, // Allow only one upload at a time for comment attachments?
            resourceType: 'auto',
            clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'webm', 'mkv', 'wmv', 'webp'], // Added webp
            maxFileSize: 15000000 // 15MB limit
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
    } else {
        console.warn("Cloudinary script not loaded yet.");
    }
  }, []); // Run only once on mount

  // --- Handlers ---

  // Load More Comments
  const loadMoreComments = async () => {
    if (!commentPagination.hasMore || commentPagination.isLoading || !post?.id) return;
    setCommentPagination(prev => ({ ...prev, isLoading: true, error: null }));
    const nextPage = commentPagination.page + 1;
    try {
      const response = await fetchComments(post.id, nextPage);
      const newComments = Array.isArray(response.data?.results) ? response.data.results : [];
      setComments(prev => [...prev, ...newComments]);
      setCommentPagination({ page: nextPage, hasMore: !!response.data?.next, isLoading: false, error: null });
    } catch (error) {
      console.error("Failed to load more comments:", error);
      setCommentPagination(prev => ({ ...prev, isLoading: false, error: "Could not load more comments." }));
    }
  };

  // Open Cloudinary Widget
  const handleOpenUploadWidget = () => {
    if (widgetRef.current) {
        setIsUploading(true); // Set loading state for UI feedback if needed
        widgetRef.current.open();
    } else {
        console.error("Cloudinary widget not initialized");
        alert("Attachment upload service is not ready. Please try again later.");
    }
  };

  // Add Comment
  const handleComment = () => {
    const trimmedComment = commentText.trim();
    if (!trimmedComment && !attachmentUrl) { alert("Please write a comment or add an attachment."); return; }
    if (isCommentInputOverLimit) { alert(`Comment cannot exceed ${MAX_COMMENT_INPUT_LENGTH} characters.`); return; }
    if (!post?.id) { alert("Cannot comment on this post."); return; }

    const commentData = { post: post.id, comment: trimmedComment, attachment_url: attachmentUrl };

    addComment(post.id, commentData)
      .then((res) => {
        const newComment = res.data;
        // Ensure the new comment object has necessary author info
        if (!newComment.author_id && user) {
            newComment.author_id = user.profile?.id || user.id; // Use profile ID if available
            newComment.author = user.username;
            newComment.author_profile_picture = user.profile?.profile_picture || currentUserAvatar;
        }
        setComments(prev => [newComment, ...prev]); // Prepend
        setCommentText("");
        setAttachmentUrl(null);
        // Optionally refetch page 1 or adjust count if pagination matters
      })
      .catch(err => { console.error("Failed to add comment:", err); alert("Failed to post comment."); });
  };

  // Delete Comment
  const handleConfirmDeleteComment = () => {
    if (!selectedComment || !post?.id) return;
    const commentIdToDelete = selectedComment.id;
    deleteComment(post.id, commentIdToDelete)
      .then(() => {
        setComments(prev => prev.filter(c => c.id !== commentIdToDelete));
        setIsDeleteModalOpenComment(false); setSelectedComment(null);
      })
      .catch(err => { console.error("Failed to delete comment:", err); alert("Failed to delete comment."); });
  };

  // Edit Post
  const handleEditPost = (postId, updatedContent) => {
    editPost(postId, { body: updatedContent })
      .then((res) => {
        setPost(prev => ({ ...prev, ...res.data })); // Update local post state
        setIsEditModalOpen(false);
      })
      .catch(err => { console.error("Failed to edit post:", err); alert("Failed to update post."); });
  };

  // Delete Post
  const handleDeletePost = (postId) => {
    deletePost(postId)
      .then(() => {
        setIsDeleteModalOpen(false);
        if (onDeletePost) onDeletePost(postId); // Notify parent
      })
      .catch(err => { console.error("Failed to delete post:", err); alert("Failed to delete post."); });
  };

  // Edit Comment
  const handleConfirmEditComment = (updatedContent) => {
    if (!selectedComment || !post?.id) return;
    const commentToUpdate = selectedComment;
    editComment(post.id, commentToUpdate.id, { comment: updatedContent })
      .then((res) => {
        setComments(prev => prev.map(c =>
          c.id === commentToUpdate.id
            ? { ...c, ...res.data } // Merge response, keeping original author info etc. if not returned
            : c
        ));
        setIsEditModalOpenComment(false); setSelectedComment(null);
      })
      .catch(err => { console.error("Edit comment failed:", err); alert("Failed to update comment."); });
  };

  // Add/Update Comment Reaction (no changes needed from previous state)
  const handleCommentReact = async (commentId, reactionType) => {
      // console.log(`Reacting to comment ${commentId} with ${reactionType}`);
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
        const response = await fetchComments(post.id, 1); // Reload first page? Or specific comment?
        setComments(response.data.results || []);
        // console.log(`Successfully reacted to comment ${commentId}`);
    } catch (error) {
        console.error("Failed to react to comment:", error);
        // --- Rollback Optimistic Update ---
        setComments(originalComments);
        alert("Failed to save reaction. Please try again."); // User feedback
    }
    };
    
    const handleCommentUnreact = async (commentId) => {
    // console.log(`Un-reacting from comment ${commentId}`);
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
          // console.log(`Successfully un-reacted from comment ${commentId}`);
          // Optional: Refetch or trust optimistic update
    } catch (error) {
        console.error("Failed to un-react from comment:", error);
          // --- Rollback Optimistic Update ---
          setComments(originalComments);
          alert("Failed to remove reaction. Please try again."); // User feedback
    }
    };

  // Save/Unsave Post
  const handleToggleSavePost = async () => {
                if (!post?.id || isSavingToggleLoading) return; // Prevent action if no post or already loading
            
                setIsSavingToggleLoading(true);
                const currentlySaved = isPostSaved; // Store current state before API call
            
                try {
                  if (currentlySaved) {
                    // If currently saved, call unsave API
                    await unsavePost(post.id);
                    setIsPostSaved(false); // Update state on success
                    // console.log("Post unsaved");
                  } else {
                    // If not saved, call save API
                    await savePost(post.id);
                    setIsPostSaved(true); // Update state on success
                    // console.log("Post saved");
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

// Post Body Expansion Toggle
const postToggleExpansion = () => setIsPostExpanded(!isPostExpanded);
const postfullText = post?.body || "";
const postneedsTruncation = postfullText.length > MAX_POST_LENGTH;
const postdisplayText = postneedsTruncation && !isPostExpanded ? postfullText.slice(0, MAX_POST_LENGTH) + "..." : postfullText;

// Post Reaction Popover Handlers
const handleMouseEnterTrigger = () => { clearTimeout(hidePopoverTimer.current); setShowReactions(true); };
const handleMouseLeaveArea = () => { hidePopoverTimer.current = setTimeout(() => { setShowReactions(false); }, 300); };
const handleMouseEnterPopover = () => { clearTimeout(hidePopoverTimer.current); };


// *** ADD/UPDATE Post Reaction with Optimistic Update (Including reaction_counts) ***
const handleAddReaction = async (reactionType) => {
  if (!post?.id || !currentUserId) return;

  // Store original states for potential rollback
  const originalUserReactions = [...userReactions];
  const originalAllReactions = [...allPostReactions];
  const originalPostState = { ...post }; // Store original post state including counts

  // --- Optimistic Update ---
  const oldReactionType = currentUserReactionType; // Reaction being replaced (if any)

  // 1. Update reaction_counts in local post state
  const newReactionCounts = { ...(post.reaction_counts || {}) };
  if (oldReactionType) { // Decrement old reaction if exists
    newReactionCounts[oldReactionType] = Math.max(0, (newReactionCounts[oldReactionType] || 1) - 1);
  }
  newReactionCounts[reactionType] = (newReactionCounts[reactionType] || 0) + 1; // Increment new reaction
  setPost(prev => ({ ...prev, reaction_counts: newReactionCounts })); // Update post state

  // 2. Update user's specific reaction state
  const optimisticReaction = {
      id: Date.now(), user_id: currentUserId, user_username: user?.username,
      user_profile_picture: user?.profile?.profile_picture, reaction_type: reactionType,
      timestamp: new Date().toISOString(), post: post.id, comment: null
  };
  setUserReactions([optimisticReaction]);

  // 3. Update the list of all reactions
  setAllPostReactions(prev => [
      ...prev.filter(r => String(r.user_id) !== String(currentUserId)),
      optimisticReaction
  ]);

    
  try {
    await likePost(post.id, reactionType); // Call API
    // console.log(`Successfully added/updated reaction: ${reactionType}`);
    // Optional: Refetch AFTER success to ensure data consistency (can cause flicker)
    // const updated = await fetchReactionsForPost(post.id);
    // const fetchedReactions = Array.isArray(updated) ? updated : [];
    // setAllPostReactions(fetchedReactions);
    // setUserReactions(fetchedReactions.filter(r => String(r.user_id) === String(currentUserId)));
    // // Refetch post data to get accurate counts from backend (more reliable than optimistic counts)
    // fetchPostData(post.id); // Assuming you have a function to fetch single post data

  } catch (error) {
    console.error("Add Reaction Error", error);
    // --- Rollback on Error ---
    setUserReactions(originalUserReactions);
    setAllPostReactions(originalAllReactions);
    setPost(originalPostState); // Revert post state (including counts)
    alert("Failed to add reaction.");
  }
};

// *** UPDATED: Remove Post Reaction with Optimistic Update (Including reaction_counts) ***
const handleRemoveReaction = async () => {
  if (!post?.id || !currentUserId || userReactions.length === 0) return;

  const reactionToRemove = currentUserReactionType; // Get type before clearing state
  const originalUserReactions = [...userReactions];
  const originalAllReactions = [...allPostReactions];
  const originalPostState = { ...post };

  // --- Optimistic Update ---
  // 1. Update reaction_counts in local post state
  if (reactionToRemove) {
      const newReactionCounts = { ...(post.reaction_counts || {}) };
      newReactionCounts[reactionToRemove] = Math.max(0, (newReactionCounts[reactionToRemove] || 1) - 1);
      setPost(prev => ({ ...prev, reaction_counts: newReactionCounts })); // Update post state
  }

  // 2. Update user's specific reaction state
  setUserReactions([]);

  // 3. Update the list of all reactions
  setAllPostReactions(prev => prev.filter(r => String(r.user_id) !== String(currentUserId)));
  // --- End Optimistic Update ---

  try {
    await removePostReaction(post.id); // Call API
    // console.log("Successfully removed reaction");
    // Optional: Refetch AFTER success
    // const updated = await fetchReactionsForPost(post.id);
    // setAllPostReactions(Array.isArray(updated) ? updated : []);
    // setUserReactions([]);
    // fetchPostData(post.id); // Refetch post for accurate counts

  } catch (error) {
    console.error("Remove Reaction Error", error);
    // --- Rollback on Error ---
    setUserReactions(originalUserReactions);
    setAllPostReactions(originalAllReactions);
    setPost(originalPostState); // Revert post state
    alert("Failed to remove reaction.");
  }
};
  


  
  // --- Slider Settings & Arrows ---
  const sliderSettings = {
    dots: true, infinite: false, speed: 500, slidesToShow: 1, slidesToScroll: 1,
    adaptiveHeight: true, arrows: true, nextArrow: <SampleNextArrow />, prevArrow: <SamplePrevArrow />
  };

  // --- Render ---
  if (!post) {
      return <div className="text-center p-10 text-gray-500">Post data not available.</div>;
  }

  return (

    <div key={post.id} className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6 border border-gray-200/80 transition-all duration-300 hover:shadow-xl"> {/* Adjusted styles */}
      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Link to={`/profiles/${post.author_id}`} className="group flex-shrink-0 hover:opacity-90 transition-opacity">
            <img
                  src={displayAuthorAvatar} alt={avatarAltText} title={avatarTitleText}
                  className="w-11 h-11 rounded-full object-cover border-2 border-[#7a2226]/30 group-hover:border-[#7a2226]/50 transition-all shadow-sm" // Slightly larger, adjusted border
                  onError={(e) => { if (e.target.src !== DEFAULT_USER_AVATAR) e.target.src = DEFAULT_USER_AVATAR; }}
              />
          </Link>
          <div>
            <Link to={`/profiles/${post.author_id}`} className="hover:opacity-90 transition-opacity !no-underline">
              <p className="mb-0 font-semibold text-base bg-gradient-to-r from-[#7a2226] to-[#a53d3d] bg-clip-text text-transparent">{avatarTitleText|| "Unknown"}</p> {/* Adjusted size/color */}
            </Link>
            <p className="text-xs text-gray-500"> {/* Adjusted color */}
              <TimeAgo timestamp={post.created_on}/>
            </p>
          </div>
        </div>
        {/* Options Menu */}
        <div className="relative">
          {user && ( // Only show if user is logged in
            <button onClick={() => setShowOptions(!showOptions)} className="text-gray-500 hover:text-[#7a2226] transition-colors p-1 rounded-full hover:bg-gray-100"> {/* Added hover bg */}
              <MoreVertIcon className="w-5 h-5"/>
            </button>
          )}
          {showOptions && user && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-20 border border-gray-200"> 
              <button onClick={handleToggleSavePost} disabled={isSavingToggleLoading} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#7a2226] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {isPostSaved ? <BookmarkIcon className="w-4 h-4 mr-2 text-[#7a2226]" /> : <BookmarkBorderIcon className="w-4 h-4 mr-2 text-gray-500" />}
                {isSavingToggleLoading ? '...' : (isPostSaved ? 'Unsave Post' : 'Save Post')}
              </button>
              {isPostAuthor && <hr className="border-t border-gray-200 my-1" />}
              {isPostAuthor && (
                <button onClick={() => { setIsEditModalOpen(true); setShowOptions(false); }} className="flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-600 w-full text-left">
                  <EditIcon className="w-4 h-4 mr-2 text-blue-400" /><span className="text-gray-900">Edit</span> 
                </button>
              )}
              {isPostAuthor && (
                <button onClick={() => { setIsDeleteModalOpen(true); setShowOptions(false); }} className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                  <DeleteIcon className="w-4 h-4 mr-2" /> Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div div className="mb-4">
        {/* Post body */}
        <div className="text-gray-800 text-sm md:text-base text-justify mb-3 whitespace-pre-wrap"> 
            {isPostExpanded ? (
                <>
                <p>{postdisplayText}</p>
                {postneedsTruncation && ( <button onClick={postToggleExpansion} className="text-[#7a2226] hover:underline font-medium text-xs"> See less </button> )}
                </>
            ) : (
                <>
                <p className="inline">{postdisplayText}</p>
                {postneedsTruncation && ( <button onClick={postToggleExpansion} className="ml-1 text-[#7a2226] hover:underline font-medium text-xs"> See more </button> )}
                </>
            )}
        </div>

      {/* Post attachments Slider */}
      {numAttachments > 0 && (
          <div className="mt-3 slick-slider-container relative border border-gray-200/80 rounded-lg overflow-hidden"> 
            <Slider {...sliderSettings}>
              {/* Map over ALL attachments */}
                {attachments.map((attachment, index) => (
                  // Each child of Slider is a slide
                  <div key={attachment.id || index} className="relative group"> 
                    {attachment.image ? (
                      <img
                        src={attachment.image}
                        alt={`Post attachment ${index + 1}`}
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
      
      <div className="px-1 pt-1 pb-2 flex justify-between items-center text-xs">
          <div className="flex items-center gap-1 text-gray-500">
              {Object.entries(post.reaction_counts || {}) // Use updated counts from post state
                  .filter(([_, count]) => count > 0).sort((a, b) => b[1] - a[1]).slice(0, 3)
                  .map(([reactionName, _]) => {
                      const Icon = getReactionIconComponent(reactionName);
                      const colorClass = getReactionColorClass(reactionName);
                      return <Icon key={reactionName} className={`w-4 h-4 ${colorClass}`} />;
                  })
              }
              {/* Total count still uses allPostReactions length */}
              {allPostReactions.length > 0 && (
                  <span className="ml-1 hover:underline cursor-pointer text-gray-600" onClick={() => setShowReactionsModal(true)} title="See who reacted">
                      {allPostReactions.length}
                  </span>
              )}
          </div>
          {/* Comment Count */}
          <div className="flex items-center gap-4">
              <span className="text-gray-500 hover:underline cursor-pointer">
                  {comments?.length || 0} Comment{comments?.length !== 1 ? 's' : ''}
              </span>
          </div>
      </div>

      {/* Post Actions Bar */}
      <div className="post-actions flex justify-around items-center border-y border-gray-200/80 px-1 py-1.5 mt-1">
          {/* React Button + Popover Wrapper */}
          <div className="relative flex-1 mx-1" onMouseEnter={handleMouseEnterTrigger} onMouseLeave={handleMouseLeaveArea}>
              {/* React Button */}
              <button
                  onClick={() => currentUserReactionType ? handleRemoveReaction() : handleAddReaction('Like') }
                  className={`w-full flex justify-center items-center gap-1.5 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-[#7a2226]/10 ${
                      currentUserReactionType ? getReactionColorClass(currentUserReactionType) + ' font-semibold' : 'text-gray-600 hover:text-[#7a2226]'
                  }`}
              >
                  {currentUserReactionType ? ( React.createElement(getReactionIconComponent(currentUserReactionType), { style: { fontSize: '20px' } }) ) : ( <ThumbUpOutline style={{ fontSize: '20px' }}/> )}
                  <span> {currentUserReactionType || 'React'} </span>
              </button>
              {/* Reaction Popover */}
              {showReactions && (
                  <div
                      onMouseEnter={handleMouseEnterPopover} onMouseLeave={handleMouseLeaveArea}
                      className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 flex space-x-1 bg-white shadow-lg rounded-full px-3 py-1.5 border border-gray-200 z-20"
                  >
                      {AVAILABLE_REACTIONS_DATA.map((reaction) => {
                          const colorClass = getReactionColorClass(reaction.name); // Get color
                          return (
                              <button
                                  key={reaction.name}
                                  onClick={(e) => { e.stopPropagation(); handleAddReaction(reaction.name); setShowReactions(false); }}
                                  className={`p-1 rounded-full transition-transform transform hover:scale-125 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#7a2226]`}
                                  title={reaction.name}
                              >
                                  {React.cloneElement(reaction.icon, { className: `w-6 h-6 ${colorClass}` })} {/* Apply color */}
                              </button>
                          );
                       })}
                  </div>
              )}
          </div>
          {/* Comment Button */}
          <button className="mx-1 flex-1 flex justify-center items-center gap-1.5 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:bg-[#7a2226]/10 hover:text-[#7a2226] transition-colors duration-200">
              <CommentIcon style={{ fontSize: '20px' }}/> Comment
          </button>
          {/* Share Button */}
          <button className="mx-1 flex-1 flex justify-center items-center gap-1.5 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:bg-[#7a2226]/10 hover:text-[#7a2226] transition-colors duration-200">
              <ShareIcon style={{ fontSize: '20px' }}/> Share
          </button>
      </div>

      {/* Comments Section */}
      <div className="mt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Comments</h4> {/* Adjusted style */}
          {/* Error message */}
          {commentPagination.error && ( <div className="text-red-600 text-xs mb-3 px-1"> Error: {commentPagination.error} </div> )}
          {/* Comments list */}
          {comments && comments.length > 0 ? (
              <>
                  {comments.map((comment) => (
                      <CommentItem
                          key={comment.id} comment={comment} currentUserId={currentUserId}
                          onEditRequest={(c) => { setSelectedComment(c); setIsEditModalOpenComment(true); }}
                          onDeleteRequest={(c) => { setSelectedComment(c); setIsDeleteModalOpenComment(true); }}
                          onReact={handleCommentReact} onUnreact={handleCommentUnreact}
                      />
                  ))}
                  {/* Load More button */}
                  {commentPagination.hasMore && (
                      <div className="flex justify-center pt-2">
                          <button onClick={loadMoreComments} disabled={commentPagination.isLoading} className={`px-4 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 transition-colors ${ commentPagination.isLoading ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200' }`}>
                              {commentPagination.isLoading ? ( <><CustomCircularProgress size={14} color="inherit" /> Loading...</> ) : ( 'Load More Comments' )}
                          </button>
                      </div>
                  )}
                  {/* End of comments message */}
                  {!commentPagination.hasMore && !commentPagination.isLoading && comments.length > 0 && ( <p className="text-center text-gray-400 text-xs italic mt-4">No more comments</p> )}
              </>
          ) : (
              !commentPagination.isLoading && !commentPagination.error && ( <p className="text-gray-500 text-sm italic px-1 py-4 text-center">No comments yet.</p> )
          )}
          {/* Initial loading indicator */}
          {commentPagination.isLoading && comments.length === 0 && ( <div className="text-center text-gray-500 text-sm py-6"> <CustomCircularProgress size={24} color="inherit"/> <p className="mt-2">Loading comments...</p> </div> )}
      </div>

      {/* Add Comment Section */}
      <div className="mt-5 flex items-start space-x-3 border-t border-gray-200/80 pt-4">
          <Link to={`/profiles/${user?.id}`} className="flex-shrink-0 block hover:opacity-90 transition-opacity group">
              <img src={ currentUserAvatar } alt={ user?.username || "You" } title={ user?.username || "You" } className="w-9 h-9 rounded-full object-cover border border-gray-300 group-hover:border-[#7a2226]/50 transition-all shadow-sm" onError={(e) => { if (e.target.src !== DEFAULT_USER_AVATAR) e.target.src = DEFAULT_USER_AVATAR; }} />
          </Link>
          <div className="flex-grow">
              {/* Input Wrapper */}
              <div className="relative w-full">
                  <input type="text" placeholder="Write your comment..." value={commentText} onChange={(e) => setCommentText(e.target.value)}
                      className={`placeholder:text-gray-400 text-black w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#7a2226] focus:border-[#7a2226] resize-none bg-white text-sm transition-colors ${isCommentInputOverLimit ? 'border-red-500 ring-red-500' : ''}`}
                      aria-describedby="comment-char-count" />
                  {/* Attachment Button */}
                  <button type="button" onClick={handleOpenUploadWidget} disabled={isUploading || !!attachmentUrl} className="absolute top-1/2 right-2.5 transform -translate-y-1/2 text-gray-400 hover:text-[#7a2226] disabled:opacity-50 disabled:cursor-not-allowed p-1" aria-label="Add Photo/Video" >
                      {isUploading ? <CustomCircularProgress size={18} color="inherit"/> : <ImageSharpIcon className="w-5 h-5" />}
                  </button>
              </div>
              
              {/* Character Counter */}
              <div id="comment-char-count" className={`text-xs mt-1 text-right ${commentCountColorClass}`}> {currentInputLength} / {MAX_COMMENT_INPUT_LENGTH} </div>
              
              {/* Attachment Preview */}
              {attachmentUrl && (
              // Use w-fit to make container only as wide as needed
              <div className="mt-2 relative w-fit">
                  {attachmentUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? ( // Added webp, case-insensitive
                      <img
                          src={attachmentUrl}
                          alt="Preview"
                          // Added max-h for consistency
                          className="max-w-xs max-h-40 rounded-lg border border-gray-600"
                      />
                  ) : attachmentUrl.match(/\.(mp4|mov|webm|mkv|avi)$/i) ? ( // Added avi, case-insensitive
                      <video controls className="max-w-xs max-h-40 rounded-lg border border-gray-600 bg-black">
                          <source src={attachmentUrl} /> Your browser does not support the video tag.
                      </video>
                  ) : (
                      <p className="text-xs text-gray-500 italic border border-dashed border-gray-600 p-2 rounded">Attachment added (preview not available)</p>
                  )}
                  {/* Close button */}
                  <button
                      onClick={() => setAttachmentUrl(null)}
                      // Improved styling for close button
                      className="absolute -top-2 -right-2 bg-gray-700 hover:bg-red-600 text-white rounded-full p-0.5 leading-none shadow-md transition-colors"
                      aria-label="Remove attachment"
                  >
                      <CloseIcon style={{ fontSize: '1rem'}} /> 
                  </button>
              </div>
              )}
              {/* Comment Button */}
              <div className="flex items-center justify-end mt-2">
                  <button type="button" onClick={handleComment} disabled={(!commentText.trim() && !attachmentUrl) || isUploading || isCommentInputOverLimit}
                      className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${ (!commentText.trim() && !attachmentUrl) || isUploading || isCommentInputOverLimit ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#7a2226] text-white hover:bg-[#5a181b]' }`} > Comment </button>
              </div>
          </div>
          </div>
      </div>
      
      {/* --- Modals --- */}
      <EditPost isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onConfirm={handleEditPost} post={post} />
      <DeletePost isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={() => handleDeletePost(post.id)} />
      <EditComment isOpen={isEditModalOpenComment} onClose={() => { setIsEditModalOpenComment(false); setSelectedComment(null); }} onConfirm={handleConfirmEditComment} comment={selectedComment} />
      <DeleteComment isOpen={isDeleteModalOpenComment} onClose={() => { setIsDeleteModalOpenComment(false); setSelectedComment(null); }} onConfirm={handleConfirmDeleteComment} />
      {showReactionsModal && ( <ReactionsModal reactions={allPostReactions} isLoading={reactionsLoading} onClose={() => setShowReactionsModal(false)} /> )}
  </div>
  );
};