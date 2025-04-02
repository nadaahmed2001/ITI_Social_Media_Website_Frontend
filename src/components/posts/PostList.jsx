import React, { useState, useEffect } from "react";
import { fetchPosts } from "../../services/api";
import CreatePost from "./CreatePost";
import ShowPost from "./ShowPost";
// import CommentSection from "./CommentSection"; // Import CommentSection
import Sidebar from "../profiles/Sidebar";

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts()
      .then((res) => {
        if (Array.isArray(res.data)) {
          setPosts(res.data);
        } else if (res.data && Array.isArray(res.data.posts)) {
          setPosts(res.data.posts);
        } else {
          setPosts([]);
        }
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const handleNewPost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  return (
    <>
    <div className="feed-container">
    <div className="sidebar-showpost">
    <Sidebar />
    </div>
    <div className="main-content">
    <CreatePost onPostCreated={handleNewPost} />
    <div className="posts-list">
        {loading ? (
          <p className="loading-message">Loading posts...</p>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <ShowPost key={post.id} post={post} />
          ))
        ) : (
          <p className="no-posts-message">No posts available.</p>
        )}
      </div>
    </div>
  </div>
  </>
  );
}
//////////////////////////////////////////////////////////////////////////
// import React, { useState, useEffect } from "react";
// import { fetchPosts } from "../../services/api";
// import CreatePost from "./CreatePost";
// import ShowPost from "./ShowPost";
// import CommentSection from "./CommentSection"; // Import CommentSection
// import Sidebar from "../profiles/Sidebar";

// export default function PostList() {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const handleDeletePost = (postId) => {
//     setPosts(posts.filter((post) => post.id !== postId));
//   };

//   const handleEditPost = (postId, updatedContent) => {
//     setPosts(posts.map((post) => 
//       post.id === postId ? { ...post, body: updatedContent } : post
//     ));
//   };

//   useEffect(() => {
//     fetchPosts()
//       .then((res) => {
//         if (Array.isArray(res.data)) {
//           setPosts(res.data);
//         } else if (res.data && Array.isArray(res.data.posts)) {
//           setPosts(res.data.posts);
//         } else {
//           setPosts([]);
//         }
//       })
//       .catch(() => setPosts([]))
//       .finally(() => setLoading(false));
//   }, []);

//   const handleNewPost = (newPost) => {
//     setPosts((prevPosts) => [newPost, ...prevPosts]);
//   };

//   return (
//     <>
//     <div className="feed-container">

//     <div className="sidebar-showpost">
//     <Sidebar />
//     </div>

  
//     <div className="main-content">
//     <CreatePost onPostCreated={handleNewPost} />
//     <div className="posts-list">
//         {loading ? (
//           <p className="loading-message">Loading posts...</p>
//         ) : posts.length > 0 ? (
//           posts.map((post) => (
//             <ShowPost key={post.id} post={post} onDelete={handleDeletePost} onEdit={handleEditPost} />
//           ))
//         ) : (
//           <p className="no-posts-message">No posts available.</p>
//         )}
//       </div>
//     </div>
  
  
    
//   </div>
//   </>
//   );
// }

////////////////////////////////////////////////
// import React, { useState, useEffect } from "react";
// import { fetchPosts } from "../../services/api";
// import CreatePost from "./CreatePost";
// import ShowPost from "./ShowPost";

// export default function PostList() {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchPosts()
//       .then((res) => {
//         if (Array.isArray(res.data)) {
//           setPosts(res.data);
//         } else if (res.data && Array.isArray(res.data.posts)) {
//           setPosts(res.data.posts);
//         } else {
//           setPosts([]);
//         }
//       })
//       .catch(() => setPosts([]))
//       .finally(() => setLoading(false));
//   }, []);

//   const handleNewPost = (newPost) => {
//     setPosts((prevPosts) => [newPost, ...prevPosts]); // Add new post to the beginning
//   };

//   return (
//     <div>
//       <CreatePost onPostCreated={handleNewPost} />
//       {loading ? (
//         <p>Loading posts...</p>
//       ) : posts.length > 0 ? (
//         posts.map((post) => <ShowPost key={post.id} post={post} />)
//       ) : (
//         <p>No posts available.</p>
//       )}
//     </div>
//   );
// }
//////////////////////////////////////////////////////////
// import React, { useState, useEffect } from "react";
// import { fetchPosts } from "../services/api";
// import CreatePost from "../components/posts/CreatePost";
// import ShowPost from "../components/posts/ShowPost";
// import CommentSection from "./CommentSection";

// export default function PostList() {
//   const [posts, setPosts] = useState([]);

//   useEffect(() => {
//     fetchPosts()
//       .then((res) => {
//         if (Array.isArray(res.data)) {
//           setPosts(res.data);
//         } else if (res.data && Array.isArray(res.data.posts)) {
//           setPosts(res.data.posts);
//         } else {
//           setPosts([]);
//         }
//       })
//       .catch(() => setPosts([]));
//   }, []);

//   // Function to update posts when a new post is created
//   const handleNewPost = (newPost) => {
//     setPosts((prevPosts) => [newPost, ...prevPosts]); // Add new post to the beginning
//   };

//   return (
//     <div>
//       <CreatePost onPostCreated={handleNewPost} />
//       {posts.map((post) => (
//         <ShowPost key={post.id} post={post} />
//       ))}
//     </div>
//   );
// }

// // import React, { useEffect, useState } from "react";
// // import { fetchPosts, likePost } from "../services/api";
// // import CommentSection from "./CommentSection";

// // const PostList = () => {
// //   const [posts, setPosts] = useState([]);

// //   useEffect(() => {
// //     fetchPosts()
// //       .then((res) => {
// //         console.log("API Response:", res); // Debugging
// //         if (Array.isArray(res.data)) {
// //           setPosts(res.data); //  Ensure it's an array
// //         } else if (res.data && Array.isArray(res.data.posts)) {
// //           setPosts(res.data.posts); //  Handle nested data
// //         } else {
// //           console.error("Unexpected API response:", res.data);
// //           setPosts([]); // Fallback to empty array
// //         }
// //       })
// //       .catch((err) => {
// //         console.error("Error fetching posts:", err);
// //         setPosts([]); // Prevent map error by ensuring posts is always an array
// //       });
// //   }, []);

// //   const handleLike = (postId) => {
// //     likePost(postId, "like")
// //       .then(() => {
// //         setPosts((prevPosts) =>
// //           prevPosts.map((post) =>
// //             post.id === postId
// //               ? { ...post, likes_count: (post.likes_count || 0) + 1 }
// //               : post
// //           )
// //         );
// //       })
// //       .catch((err) => console.error("Error liking post:", err));
// //   };

// //   return (
// //     <div>
// //       {posts.length > 0 ? (
// //         posts.map((post) => (
// //           <div key={post.id} className="post">
// //             <h3>{post.author}</h3>
// //             <p>{post.body}</p>
// //             <button onClick={() => handleLike(post.id)}>❤️ {post.likes_count || 0}</button>
// //             <CommentSection postId={post.id} />
// //           </div>
// //         ))
// //       ) : (
// //         <p>No posts available.</p> //  Handle empty state
// //       )}
// //     </div>
// //   );
// // };

// // export default PostList;
