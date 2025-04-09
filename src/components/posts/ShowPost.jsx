
import React, { useState, useEffect, useRef, useContext} from "react";
import AuthContext from '../../contexts/AuthContext'; 
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material"; // Import arrow icons
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

const MAX_COMMENT_LENGTH = 150;


function CommentItem({ comment, currentUserId, onEditRequest, onDeleteRequest /* Add other handlers like onReaction if needed */ }) {
  
  // --- State specific to THIS comment ---
  const [isExpanded, setIsExpanded] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const optionsMenuRef = useRef(null); 
  // --- End Component State ---

  // --- Calculate text display based on local state ---
  const fullText = comment.comment || "";
  const needsTruncation = fullText.length > MAX_COMMENT_LENGTH;
  const displayText = needsTruncation && !isExpanded 
                      ? fullText.slice(0, MAX_COMMENT_LENGTH) + "..." 
                      : fullText;
  // ---

  // --- Check if current user is the author ---
  // Ensure your comment object from API has author_id or a similar field
  const isCommentAuthor = comment.author_id === currentUserId; 
  const authorName = comment.author || "User"; // Use author name from comment data
  // ---

  // --- Handlers specific to THIS comment ---
  const toggleExpansion = () => setIsExpanded(!isExpanded);
  const toggleOptionsMenu = () => setShowOptionsMenu(!showOptionsMenu);
  // ---

  // --- Effect for closing options menu ---
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
    <div className="mb-4 pb-4 border-b border-gray-100 last:border-0">
      {/* Comment Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <img 
            src={ comment.author_profile_picture || DEFAULT_USER_AVATAR } // Use comment author pic
            alt={authorName} 
            title={authorName}
            className="w-8 h-8 rounded-full object-cover border border-gray-200"
            onError={(e) => { if (e.target.src !== DEFAULT_USER_AVATAR) e.target.src = DEFAULT_USER_AVATAR; }}
          />
          <div>
            <p className="font-medium text-sm text-gray-900">{authorName}</p>
            <p className="text-xs text-gray-500">
              {new Date(comment.created_on).toLocaleString()}
            </p>
          </div>
        </div>
        {/* Edit/Delete Menu */}
        {isCommentAuthor && (
          <div className="relative" ref={optionsMenuRef}>
              <button onClick={toggleOptionsMenu} className="text-gray-500 hover:text-gray-700">
                <MoreVertIcon className="w-5 h-5" />
              </button>
              {showOptionsMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-20">
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
      <div className="text-gray-800 ml-10 mb-2 whitespace-pre-wrap"> {/* Margin to align with author name */}
          {isExpanded ? (
            <>
              <p>{displayText}</p>
              {needsTruncation && (
                <button
                  onClick={toggleExpansion}
                  className="mt-1 text-[#A52B2B] hover:underline focus:outline-none font-medium text-xs" 
                  aria-expanded={isExpanded}
                >
                  See less
                </button>
              )}
            </>
          ) : (
            <>
              <p className="inline">{displayText}</p>
              {needsTruncation && (
                <button
                  onClick={toggleExpansion}
                  className="ml-1 text-[#A52B2B] hover:underline focus:outline-none font-medium text-xs"
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
         <div className="ml-10 mt-2"> {/* Margin to align */}
             {/* Render comment attachments - needs logic based on your data */}
            <p className="text-xs text-gray-500 italic">(Attachment present - display logic needed)</p>
        </div>
      )}

      {/* Comment Actions (Like, Reactions - Simplified Placeholder) */}
      <div className="flex items-center space-x-4 ml-10 mt-2">
        <div className="relative">
            {/* Placeholder Like Button */}
          <button className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 text-sm">
              <ThumbUpSharpIcon className="w-4 h-4" />
              <span>Like</span>
          </button>
           {/* Reaction Popover logic would go here */}
        </div>
        {/* Placeholder Show Reactions Button */}
        <button className="text-sm text-primary-600 hover:text-primary-800">
            Show Reactions
        </button>
      </div>
    </div>
  );
}
// --- End CommentItem Component ---


export default function ShowPost({ postData, onDeletePost, currentUserId }) {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [userReactions, setUserReactions] = useState([]);
  const [commentReactions, setCommentReactions] = useState({});
  const [showReactions, setShowReactions] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpenComment, setIsEditModalOpenComment] = useState(false);
  const [isDeleteModalOpenComment, setIsDeleteModalOpenComment] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [post, setPost] = useState(postData);
  const [showReactionsModalforcomment, setShowReactionsModalforcomment] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const widgetRef = useRef(null);
  const [isPostExpanded, setIsPostExpanded] = useState(false);
  const { user, loading: authLoading } = useContext(AuthContext); // Destructure 'user'
  const avatarSrc = user?.profile_picture || DEFAULT_USER_AVATAR;



  // Initialize Cloudinary widget
  useEffect(() => {
    if (window.cloudinary) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: CLOUDINARY_CLOUD_NAME,
          uploadPreset: CLOUDINARY_UPLOAD_PRESET,
          sources: ['local', 'url', 'camera'],
          multiple: false,
          resourceType: 'auto', // Accepts both images and videos
          clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'webm', 'mkv'],
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

  useEffect(() => {commentReactions
        fetchComments(post.id).then((res) => setComments(res.data));
        fetchReactionsForPost(post.id).then((res) => setUserReactions(res.filter(r => r.user.id === currentUserId)));
      }, [post.id, currentUserId]);
    
    
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
  }, [post.comments]);

  const handleComment = () => {
    if (!commentText.trim() && !attachmentUrl) return;
    
    const commentData = {
      post: post.id,
      comment: commentText,
      attachment_url: attachmentUrl
    };

    addComment(post.id, commentData).then((res) => {
      setComments((prev) => [...prev, res.data]);
      setCommentText("");
      setAttachmentUrl(null);
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
    
      const handleRemoveReaction = async (reactionType) => {
        await removePostReaction(post.id);
        const updated = await fetchReactionsForPost(post.id);
        setUserReactions(updated.filter(r => r.user?.id === currentUserId));
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
      const handleConfirmDeleteComment = () => {
        if (!selectedComment) return;
        console.log(`Deleting comment ${selectedComment.id} for post ${post.id}`); // Debug
         // Call the imported API function
         deleteComment(post.id, selectedComment.id).then(() => {
          console.log("Delete successful"); // Debug
          setComments(prevComments => prevComments.filter((comment) => comment.id !== selectedComment.id));
          setIsDeleteModalOpenComment(false); // Close modal
          setSelectedComment(null);         // Clear selection
        }).catch(err => {
            console.error("Failed to delete comment:", err.response?.data || err); // Log detailed error
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
    const currentUserAvatar = user?.profile_picture || DEFAULT_USER_AVATAR;


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


  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-200">
      {/* Post Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <img 
            src={currentUserAvatar} 
            alt= {post.author} 
            title= {post.author} 
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
            onError={(e) => { 
              // Prevent infinite loop if default avatar also fails
              if (e.target.src !== DEFAULT_USER_AVATAR) {
                e.target.src = DEFAULT_USER_AVATAR; 
              }}}
          />
          <div>
            <p className="font-medium text-gray-900">{post.author || "Unknown"}</p>
            <p className="text-xs text-gray-500">
              {post.created_on
                ? `${new Date(post.created_on).toISOString().split("T")[0]} ${new Date(post.created_on).toTimeString().slice(0, 5)}`
                : "Just now"}
            </p>
          </div>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowOptions(!showOptions)}
            className="text-gray-500 hover:text-gray-700"
          >
            <MoreVertIcon className="w-5 h-5" />
          </button>
          {showOptions && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <button
                onClick={() => {
                  setIsEditModalOpen(true);
                  setShowOptions(false);
                }}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <EditIcon className="w-4 h-4 mr-2 text-primary-600" />
                Edit
              </button>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(true);
                  setShowOptions(false);
                }}
                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
              >
                <DeleteIcon className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-3">
        {/* Post body */}
        {/* --- MODIFIED POST BODY DISPLAY with Conditional Line Break --- */}
        <div className="text-gray-800 mb-3 whitespace-pre-wrap"> {/* Keep whitespace-pre-wrap */}
          
          {/* Conditionally render structure based on isPostExpanded state */}
          {isPostExpanded ? (
            // --- Expanded View ---
            <>
              {/* Full text in a block-level paragraph */}
              <p>{postdisplayText}</p> 
              {/* Button appears after the block paragraph, naturally on new line */}
              {postneedsTruncation && ( // Only show button if text was actually long enough
                <button
                  onClick={postToggleExpansion}
                  // Style button: brown color, add some top margin
                  className="mt-1 text-[#A52B2B] hover:underline focus:outline-none font-medium text-sm" 
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
              <p className="inline">{postdisplayText}</p>
              {/* "See more" button appears immediately after inline text */}
              {postneedsTruncation && (
                <button
                  onClick={postToggleExpansion}
                   // Style button: brown color, add left margin for spacing
                  className="ml-1 text-[#A52B2B] hover:underline focus:outline-none font-medium text-sm"
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
          <div className="mt-2">
            {/* --- SLIDESHOW ATTACHMENT DISPLAY --- */}
        {numAttachments > 0 && (
          // Apply a wrapper for styling context if needed, e.g., for arrow/dot position
          // The border/rounded can apply here or on the slider itself
          <div className="mt-2 slick-slider-container relative border border-gray-100 rounded-lg overflow-hidden"> 
            {/* 3. Use Slider component with settings */}
            <Slider {...sliderSettings}>
              
              {/* Map over ALL attachments */}
              {attachments.map((attachment, index) => (
                // Each child of Slider is a slide
                <div key={attachment.id || index} className="slide-item bg-gray-50"> {/* Added bg */}
                  {attachment.image ? (
                    <img
                      src={attachment.image}
                      alt={`Post attachment ${index + 1}`}
                      // Style image to fit well within the slide
                      className="w-full h-auto object-contain mx-auto block max-h-[75vh]" // Use object-contain, limit max height
                    />
                  ) : attachment.video ? (
                    <video
                      src={attachment.video}
                      controls
                      playsInline
                      // Style video to fit well
                      className="w-full h-auto block max-h-[75vh] bg-black" // Limit height, add bg for potential letterboxing
                      preload="metadata" // Don't preload the whole video
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                     // Fallback for unknown type
                    <div className="aspect-video flex items-center justify-center text-gray-400 text-xs p-1">
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
      <div className="flex items-center justify-between border-t border-b border-gray-100 py-2 mb-3">
        <div className="relative">
          <button
            onClick={() => setShowReactions(!showReactions)}
            onMouseLeave={() => setShowReactions(false)}
            className="flex items-center space-x-1 text-gray-600 hover:text-primary-600"
          >
            <ThumbUpSharpIcon className="w-5 h-5" />
            <span>Like</span>
          </button>
          {showReactions && (
            <div className="absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-lg p-2 flex space-x-2 z-10">
              {reactions.map((reaction) => (
                <button
                  key={reaction.name}
                  onClick={() => {
                    hasReacted(reaction.name)
                      ? handleRemoveReaction(reaction.name)
                      : handleAddReaction(reaction.name);
                    setShowReactions(false);
                  }}
                  className="transform hover:scale-125 transition-transform duration-200"
                  title={reaction.name}
                >
                  {reaction.icon}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={() => setShowReactionsModal(true)}
          className="text-sm text-primary-600 hover:text-primary-800"
        >
          Show All Reactions
        </button>
      </div>

      {/* Comments Section */}
      <div className="mt-4">
        <h4 className="font-medium text-gray-900 mb-3">Comments</h4>
        
        {comments.length > 0 ? (
          // --- Use CommentItem component in map ---
          comments.map((comment) => (
            <CommentItem 
              key={comment.id} 
              comment={comment} 
              currentUserId={currentUserId} // Pass the ID for author check
              // ** Pass the CORRECT handlers to trigger modals **
              onEditRequest={handleEditCommentRequest} 
              onDeleteRequest={handleDeleteCommentRequest} 
              // Pass other handlers like onReaction if CommentItem needs them
            />
          ))
          // --- End Use CommentItem ---
        ) : (
          <p className="text-gray-500 text-sm italic">No comments yet.</p>
        )}


        {/* Add Comment */}
        <div className="mt-4 flex items-start space-x-3">
          <img 
            src= { avatarSrc }
            alt= { user?.username }
            title = { user?.username }
            className="w-8 h-8 rounded-full object-cover border border-gray-200 flex-shrink-0"
            onError={(e) => { 
              // Prevent infinite loop if default avatar also fails
              if (e.target.src !== DEFAULT_USER_AVATAR) {
                e.target.src = DEFAULT_USER_AVATAR; 
              }}}
          />
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Write your comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {attachmentUrl && (
              <div className="mt-2 relative">
                {attachmentUrl.match(/\.(jpeg|jpg|gif|png)$/) ? (
                  <img 
                    src={attachmentUrl} 
                    alt="Preview" 
                    className="max-w-xs rounded-lg"
                  />
                ) : (
                  <video controls className="max-w-xs rounded-lg">
                    <source src={attachmentUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
                <button
                  onClick={() => setAttachmentUrl(null)}
                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100"
                >
                  <CloseIcon className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            )}
            <div className="flex items-center justify-between mt-2">
              <button
                onClick={handleOpenUploadWidget}
                disabled={isUploading}
                className="text-gray-500 hover:text-primary-600 flex items-center text-sm"
              >
                <ImageSharpIcon className="w-5 h-5 mr-1" />
                {isUploading ? "Uploading..." : "Add Photo/Video"}
              </button>
              <button
                onClick={handleComment}
                disabled={(!commentText.trim() && !attachmentUrl) || isUploading}
                className={`px-3 py-1 rounded-md text-sm font-medium ${(!commentText.trim() && !attachmentUrl) || isUploading ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-primary-600 text-white hover:bg-primary-700'}`}
              >
                Post
              </button>
            </div>
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
        onClose={() => {setIsEditModalOpenComment(false); setSelectedComment(null);}} 
        // ** Pass the CORRECT confirmation handler **
        onConfirm={handleConfirmEditComment} 
        comment={selectedComment} 
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
      {showReactionsModalforcomment && selectedComment && (
        <ReactionsCommentModal
          commentId={selectedComment.id}
          onClose={() => setShowReactionsModalforcomment(false)}
        />
      )}
    </div>
  );
}