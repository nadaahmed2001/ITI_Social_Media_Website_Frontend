import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CommentReactionsPage = () => {
  const { postId, commentId } = useParams(); 
  const [reactions, setReactions] = useState([]);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/posts/${postId}/comment/${commentId}/reactions/`)
      .then((res) => {
        setReactions(res.data);
      })
      .catch((err) => {
        console.error("Error fetching reactions:", err);
      });
  }, [postId, commentId]);

  return (
    <div>
      <h1>Reactions for Comment {commentId} on Post {postId}</h1>
      <ul>
        {reactions.map((reaction) => (
          <li key={reaction.id}>{reaction.type} by {reaction.user.username}</li>
        ))}
      </ul>
    </div>
  );
};

export default CommentReactionsPage;
