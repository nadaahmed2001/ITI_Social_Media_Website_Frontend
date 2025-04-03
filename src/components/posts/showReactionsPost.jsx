import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchReactionsForPost } from "../../services/api";

export default function ShowReactionsPost() {
  const { postId } = useParams();
  const [reactions, setReactions] = useState([]);

  useEffect(() => {
    fetchReactionsForPost(postId)
      .then((data) => {
        // Ensure data is an array even if API returns undefined/null
        setReactions(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("Error fetching reactions:", error);
        setReactions([]); // Reset to empty array on error
      });
  }, [postId]);

  return (
    <div>
      <h3>Reactions for Post {postId}</h3>
      <ul>
        {reactions.length > 0 ? (
          reactions.map((reaction) => (
            <li key={reaction.id}>
              <b>{reaction.user}</b>: {reaction.reaction_type}
            </li>
          ))
        ) : (
          <p>No reactions yet.</p>
        )}
      </ul>
    </div>
  );
}