import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const PostReactionsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [reactions, setReactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the post details
    axios.get(`http://127.0.0.1:8000/api/posts/${id}/`)
      .then((res) => {
        setPost(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching post:", err);
        setError("Failed to load post.");
        setLoading(false);
      });

    // Fetch the reactions for the post
    axios.get(`http://127.0.0.1:8000/api/posts/${id}/reactions/`)
      .then((res) => {
        setReactions(res.data);
      })
      .catch((err) => {
        console.error("Error fetching reactions:", err);
        setError("Failed to load reactions.");
      });
  }, [id]);

  if (loading) {
    return <p>Loading post...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      {post && (
        <div>
          <h1>{post.title}</h1>
          <p>{post.content}</p> {/* Displaying the post content */}
          <hr />
        </div>
      )}
      
      <h2>Reactions</h2>
      {reactions.length === 0 ? (
        <p>No reactions yet.</p>
      ) : (
        <ul>
          {reactions.map((reaction) => (
            <li key={reaction.id}>
              {reaction.type} by {reaction.user.username}
            </li>
          ))}
        </ul>
      )}

      {/* Add a back button */}
      <button onClick={() => navigate(-1)}>Back to Posts</button>
    </div>
  );
};

export default PostReactionsPage;
