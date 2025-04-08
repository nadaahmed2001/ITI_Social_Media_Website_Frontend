import React, { useState, useEffect } from "react";
import { fetchPosts } from "../../services/api";
import CreatePost from "./CreatePost";
import ShowPost from "./ShowPost";
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

  const handleDeletePost = (postId) => {
    setPosts(posts.filter((post) => post.id !== postId));
  }

  return (
    <>
    <div className="feed-container">
    {/* <div className="sidebar-showpost">
    <Sidebar />
    </div> */}
    <div className="main-content">
    <CreatePost onPostCreated={handleNewPost} />
    <div className="posts-list">
        {loading ? (
          <p className="loading-message">Loading posts...</p>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <ShowPost key={post.id} postData={post} onDeletePost={() => handleDeletePost(post.id)} />
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