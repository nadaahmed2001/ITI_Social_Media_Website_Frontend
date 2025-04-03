// components/ReactionsModal.jsx
import React, { useEffect, useState } from "react";
import { fetchReactionsForPost , removeReactionsForPost } from "../../services/api";

export default function ReactionsModal({ postId, onClose }) {
  const [reactions, setReactions] = useState([]);

  useEffect(() => {
    fetchReactionsForPost(postId)
      .then((data) => {
        setReactions(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("Error fetching reactions:", error);
        setReactions([]);
      });
  }, [postId]);

  useEffect(() => {
    removeReactionsForPost(postId)
      .then((data) => {
        setReactions(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("Error fetching reactions:", error);
        setReactions([]);
      });
  }, [postId]);
  

  return (
    <div className="show-reactions-overlay">
      <div className="show-reactions-content">
        <div className="show-reactions-header">
          <h3>Reactions</h3>
          <button className="show-reactions-close-button" onClick={onClose}>&times;</button>
        </div>
        
        <div className="show-reactions-list">
          {reactions.length > 0 ? (
            reactions.map((reaction) => (
              <div key={reaction.id} className="show-reaction-item">
                <span className="show-reactions-user">{reaction.user}</span>
                <span className="show-reactions-reaction-type">{reaction.reaction_type}</span>
                <button className="show-reactions-remove-btn">Remove</button>
              </div>
            ))
          ) : (
            <p className="show-no-reactions">No reactions yet</p>
          )}
        </div>
      </div>
    </div>
  );
}