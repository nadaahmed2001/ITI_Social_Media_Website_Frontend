// import React, { useEffect, useState } from "react";
// import { fetchComments, addComment } from "../../services/api";

// const CommentSection = ({ postId }) => {
//   const [comments, setComments] = useState([]);
//   const [commentText, setCommentText] = useState("");

//   useEffect(() => {
//     fetchComments(postId)
//       .then((res) => setComments(res.data))
//       .catch((err) => console.error("Error fetching comments:", err));
//   }, [postId]);

//   const handleComment = () => {
//     if (!commentText.trim()) return;

//     addComment(postId, { comment: commentText })
//       .then((res) => {
//         setComments((prev) => [...prev, res.data]); // Update UI
//         setCommentText(""); // Clear input
//       })
//       .catch((err) => console.error("Error adding comment:", err));
//   };

//   return (
//     <div>
//       <h4>Comments</h4>
//       {comments.length > 0 ? (
//         comments.map((comment) => (
//           <p key={comment.id}>
//             <b>{comment.author}</b>: {comment.comment}
//           </p>
//         ))
//       ) : (
//         <p>No comments yet.</p>
//       )}
//       <input
//         value={commentText}
//         onChange={(e) => setCommentText(e.target.value)}
//         placeholder="Write a comment..."
//       />
//       <button onClick={handleComment}>Comment</button>
//     </div>
//   );
// };

// export default CommentSection;