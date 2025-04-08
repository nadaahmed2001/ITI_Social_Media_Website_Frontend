import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CommentPage = () => {
  const { postId, commentId } = useParams(); 
  const [comment, setComment] = useState(null);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/posts/${postId}/comment/${commentId}/`)
      .then((res) => {
        setComment(res.data);
      })
      .catch((err) => {
        console.error("Error fetching comment:", err);
      });
  }, [postId, commentId]);

  if (!comment) return <div>Loading...</div>;

  return (
    <div>
      <h1>Comment on Post {postId}</h1>
      <p><strong>{comment.user.username}</strong> said:</p>
      <p>{comment.content}</p>
    </div>
  );
};

export default CommentPage;
