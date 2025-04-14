import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { fetchPosts } from '../../services/api';
import CreatePost from './CreatePost';
import ShowPost from './ShowPost';
import { User } from 'lucide-react';
import AuthContext from '../../contexts/AuthContext'; 



export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const observer = useRef();
  const { user, loading: authLoading } = useContext(AuthContext); // Destructure 'user'


  const loadPosts = useCallback(async (pageNum) => {
    setLoading(true);
    try {
      const response = await fetchPosts(pageNum);
      const newPosts = response.data?.results || response.data;
      
      setPosts(prev => pageNum === 1 ? newPosts : [...prev, ...newPosts]);
      setHasMore(newPosts?.length > 0);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadPosts(1);
  }, [loadPosts]);

  // Infinite scroll observer
  useEffect(() => {
    if (loading || !hasMore) return;

    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0
    };

    const handleObserver = (entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    };

    observer.current = new IntersectionObserver(handleObserver, options);
    
    if (observer.current) {
      observer.current.observe(document.querySelector('#observer-target'));
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loading, hasMore]);

  // Load more when page changes
  useEffect(() => {
    if (page > 1) {
      loadPosts(page);
    }
  }, [page, loadPosts]);

  const handleNewPost = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handleDeletePost = (postId) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  };

  return (
    <div className="max-w-3xl mx-auto   !bg-[#1E1F1F]">
      <CreatePost onPostCreated={handleNewPost} />
      
      <div className="mt-6 space-y-6 !bg-[#1E1F1F]">
        {posts.map((post, index) => (
          <ShowPost 
            key={post.id} 
            postData={post} 
            onDeletePost={handleDeletePost} 
            currentUserId={user.user_id}
          />
        ))}
        
        {/* Observer target and loading indicators */}
        <div id="observer-target" className="h-1 w-full"></div>
        
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {!hasMore && !loading && (
          <p className="text-center text-gray-500 py-4">
            You've reached the end of the feed
          </p>
        )}
      </div>
    </div>
  );
}