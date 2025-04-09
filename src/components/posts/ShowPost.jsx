import React, { useState, useEffect } from "react";
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
} from "../../services/api";
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
import EditComment from "./EditComment";
import DeleteComment from "./Deletecomment";
import ReactionsModal from "./ReactionsModal";
import "./Posts.css";
import ReactionsCommentModal from "./ReactionsCommentModal";

export default function ShowPost({ postData, onDeletePost, currentUserId }) {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [showOptionsCommentId, setShowOptionsCommentId] = useState(null);

  const [userReactions, setUserReactions] = useState([]);
  const [commentReactions, setCommentReactions] = useState({});
  const [showReactions, setShowReactions] = useState(false);
  const [showCommentReactions, setShowCommentReactions] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpenComment, setIsEditModalOpenComment] = useState(false);
  const [isDeleteModalOpenComment, setIsDeleteModalOpenComment] = useState(false);

  const [selectedComment, setSelectedComment] = useState(null);
  const [post, setPost] = useState(postData)

  const [showReactionsModal, setShowReactionsModal] = useState(false);
  const [showReactionsModalforcomment, setShowReactionsModalforcomment] = useState(false);

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
    if (!commentText.trim()) return;
    addComment(post.id, { post: post.id, comment: commentText }).then((res) => {
      setComments((prev) => [...prev, res.data]);
      setCommentText("");
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

  const reactions = [
    { name: "Like", icon: <ThumbUpSharpIcon className="Reaction-Post" /> },
    { name: "Love", icon: <FavoriteSharpIcon className="Reaction-Post" /> },
    { name: "Celebrate", icon: <CelebrationSharpIcon className="Reaction-Post" /> },
    { name: "funny", icon: <SentimentVerySatisfiedSharpIcon className="Reaction-Post" /> },
    { name: "Support", icon: <VolunteerActivismSharpIcon className="Reaction-Post" /> },
    { name: "Insightful", icon: <TipsAndUpdatesSharpIcon className="Reaction-Post" /> },
  ];

  return (
    <div className="post-container">
      <div className="post-header">
        <img src={post.authorAvatar || "/default-avatar.png"} alt="User" className="user-avatar" />
        <div className="user-info">
          <p>{post.author || "Unknown"}</p>
          <p>
            {post.created_on
              ? `${new Date(post.created_on).toISOString().split("T")[0]} ${new Date(post.created_on).toTimeString().slice(0, 5)}`
              : "Just now"}
          </p>

        </div>
        <div className="post-options">
          <MoreVertIcon className="MoreVertIcon" onClick={() => setShowOptions(!showOptions)} />
          {showOptions && (
            <div className="options-menu">
              <div className="option" onClick={() => setIsEditModalOpen(true)}><EditIcon className="EditIcon" /> Edit</div>
              <div className="option" onClick={() => setIsDeleteModalOpen(true)}><DeleteIcon className="DeleteIcon"/> Delete</div>
            </div>
          )}
        </div>
      </div>

      <div className="post-content">
        <p>{post.body}</p>
        <br></br>
         {post.attachments.length > 0 && <img src={post.attachments[0].image} className="post-image" />}
      </div>

      <div className="post-actions">
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


      <div className="comment-section">
        <h4>Comments</h4>
        
        {comments.length ? comments.map((comment) => (
          <div key={comment.id} className="comment">
            <div className="post-heade-comment">
            <img src={post.authorAvatar || "/default-avatar.png"} alt="User" className="user-avatar" />
            <div className="user-info">
            <b>{comment.author}</b> {comment.id} 
            <p className="comment-created-on"> 
            {post.created_on
              ? `${new Date(post.created_on).toISOString().split("T")[0]} ${new Date(post.created_on).toTimeString().slice(0, 5)}`
              : "Just now"}
          </p>
            </div>
            <div className="post-options">
              <MoreVertIcon onClick={() => setShowOptionsCommentId(comment.id ,!showOptionsCommentId)} />
              {showOptionsCommentId === comment.id && (
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

             <p className="comment-body">{comment.comment}</p>
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
                  // reactions={commentReactions[comment.id]}
                  onClose={() => setShowReactionsModalforcomment(false)}
                />
              }

            </div>
            <hr></hr>
          </div>
        )) : <p>No comments yet.</p>}

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
  );
}