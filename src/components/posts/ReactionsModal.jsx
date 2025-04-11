import React, { useEffect, useRef, useState } from "react";
import { fetchReactionsForPost, removePostReaction } from "../../services/api";

export default function ReactionsModal({ postId, onClose, highlightedReactionId }) {
  const [reactions, setReactions] = useState([]);
  
  // Ref to keep track of the highlighted reaction
  const reactionRefs = useRef({});

  useEffect(() => {
    fetchReactionsForPost(postId)
      .then((data) => setReactions(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, [postId]);

  // Highlight the reaction if it matches the highlightedReactionId
  useEffect(() => {
    if (highlightedReactionId) {
      const highlightedReaction = reactionRefs.current[highlightedReactionId];
      if (highlightedReaction) {
        highlightedReaction.scrollIntoView({ behavior: "smooth", block: "center" });
        highlightedReaction.classList.add("bg-green-100", "ring", "ring-green-400");

        // Remove highlight after a delay
        setTimeout(() => {
          highlightedReaction.classList.remove("bg-green-100", "ring", "ring-green-400");
        }, 3000);
      }
    }
  }, [highlightedReactionId]);

  const handleRemoveReaction = async (reactionId) => {
    try {
      await removePostReaction(postId);
      const updated = await fetchReactionsForPost(postId);
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
              <div
                key={reaction.id}
                ref={(el) => (reactionRefs.current[reaction.id] = el)} // Save reference to each reaction
                className="show-reaction-item"
              >
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
