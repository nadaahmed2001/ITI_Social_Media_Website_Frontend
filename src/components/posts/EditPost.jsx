import React, { useState } from "react";
import "./edit-post.css";

export default function EditPost({ isOpen, onClose, onConfirm, post }) {
  const [editedContent, setEditedContent] = useState(post?.body || "");

  if (!isOpen) return null;

  return (
    <div className="edit-post-overlay">
      <div className="edit-post">
        <h3>Edit Post</h3>
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="edit-textarea"
        />
        <div className="edit-post-btn">
          <button className="confirm-edit-post" onClick={() => onConfirm(post.id, editedContent)}>
            Confirm
          </button>
          <button className="cancel-edit-post" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}


// import React from 'react'

// export default function EditPost({ isOpen, onClose, onConfirm }) {
//   if (!isOpen) return null;
//   return (
//     <div className="edit-post-overlay">
//       <div className="edit-post">
//         <p>//here i need post content//</p>
//         <div className="edit-post-btn">
//           <button className="confirm-edit-post" onClick={onConfirm}>
//             Confirm
//           </button>
//           <button className="cancel-edit-post" onClick={onClose}>
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }
