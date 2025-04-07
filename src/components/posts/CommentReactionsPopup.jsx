import React, { useEffect, useState } from "react";
import { fetchCommentReactions } from "../../services/api";
import CloseIcon from "@mui/icons-material/Close";

const CommentReactionsPopup = ({ commentId, onClose }) => {
  const [reactions, setReactions] = useState([]);

  useEffect(() => {
    fetchCommentReactions(commentId).then((res) => setReactions(res.data));
  }, [commentId]);

  return (
    <div className="reaction-popup">
      <div className="popup-content">
        <div className="popup-header">
          <h3>Comment Reactions</h3>
          <CloseIcon onClick={onClose} className="close-icon" />
        </div>
        <ul>
          {reactions.map((r, idx) => (
            <li key={idx}>
              <strong>{r.user.username}</strong> reacted with {r.reaction_type}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// export default CommentReactionsPopup;
// const ReactionsModal = ({ commentId, reactions, onClose }) => {
//     return (
//       <div className="modal-overlay">
//         <div className="reactions-modal">
//           <h3>Reactions</h3>
//           <button className="close-btn" onClick={onClose}>×</button>
//           <div className="reactions-list">
//             {reactions?.map(reaction => (
//               <div key={reaction.id} className="reaction-item">
//                 <span className="user">{reaction.user.username}</span>
//                 <span className="reaction-type">
//                   {REACTION_TYPES[reaction.reaction_type]}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   };