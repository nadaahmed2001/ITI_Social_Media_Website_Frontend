import React, { useEffect, useState } from "react";
import { fetchReactionsForComment, removePostReaction } from "../../services/api";

export default function ReactionsCommentModal({ commentId, onClose }) {
  const [reactions, setReactions] = useState([]);

  // Only keep the fetch useEffect
  useEffect(() => {
    fetchReactionsForComment(commentId)
      .then((data) => setReactions(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, [commentId]);

  const handleRemoveReaction = async (reactionId) => {
    try {
      await removePostReaction(commentId);
      // Refresh reactions after removal
      const updated = await fetchReactionsForComment(commentId);
      setReactions(updated);
    } catch (error) {
      console.error("Removal failed:", error);
    }
  };

  return (
    <div className="show-reactions-overlay">
      <div className="show-reactions-content">
        <div className="show-reactions-header">
          <h3>Reactions</h3>
          <button className="show-reactions-close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        
        <div className="show-reactions-list">
          {reactions.length > 0 ? (
            reactions.map((reaction) => (
              <div key={reaction.id} className="show-reaction-item">
                <span className="show-reactions-user">{reaction.user}</span>
                <span className="show-reactions-reaction-type">
                  {reaction.reaction_type}
                </span>
                <button 
                  className="show-reactions-remove-btn"
                  onClick={() => handleRemoveReaction(reaction.id)}
                >
                  Remove
                </button>
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
