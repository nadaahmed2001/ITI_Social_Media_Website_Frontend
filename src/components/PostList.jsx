import React, { useEffect, useState } from "react";
import { fetchPosts, likePost } from "../services/api";
import CommentSection from "./CommentSection";

const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts()
      .then((res) => {
        console.log("API Response:", res); // Debugging
        if (Array.isArray(res.data)) {
          setPosts(res.data); //  Ensure it's an array
        } else if (res.data && Array.isArray(res.data.posts)) {
          setPosts(res.data.posts); //  Handle nested data
        } else {
          console.error("Unexpected API response:", res.data);
          setPosts([]); // Fallback to empty array
        }
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
        setPosts([]); // Prevent map error by ensuring posts is always an array
      });
  }, []);

  const handleLike = (postId) => {
    likePost(postId, "like")
      .then(() => {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? { ...post, likes_count: (post.likes_count || 0) + 1 }
              : post
          )
        );
      })
      .catch((err) => console.error("Error liking post:", err));
  };

  return (
    <div>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="post">
            <h3>{post.author}</h3>
            <p>{post.body}</p>
            <button onClick={() => handleLike(post.id)}>❤️ {post.likes_count || 0}</button>
            <CommentSection postId={post.id} />
          </div>
        ))
      ) : (
        <p>No posts available.</p> //  Handle empty state
      )}
    </div>
  );
};

export default PostList;
