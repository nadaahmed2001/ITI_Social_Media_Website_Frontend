// import React, { useState } from "react";
// import { createPost } from "../services/api";

// const PostForm = ({ onPostAdded }) => {
//   const [text, setText] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await createPost({ body: text });
//       setText(""); // Clear the input after submitting
//       if (onPostAdded) {
//         onPostAdded(res.data); // Update post list in PostList.jsx
//       }
//     } catch (err) {
//       console.error("Error creating post:", err);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <textarea 
//         value={text} 
//         onChange={(e) => setText(e.target.value)} 
//         placeholder="Write a post..." 
//         required 
//       />
//       <button type="submit">Post</button>
//     </form>
//   );
// };

// export default PostForm;
