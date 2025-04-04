import React, { useState } from "react";
import "./edit-comment.css";

export default function EditComment({ isOpen, comment, onClose, onConfirm }) {
  if (!isOpen || !comment) return null;

  // Initialize with comment text, not ID
  const [editedContent, setEditedContent] = useState(comment.comment || ""); 

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Comment</h3>
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="edit-textarea"
        />
        <div className="modal-actions">
          {/* Pass ONLY the updated content to onConfirm */}
          <button onClick={() => onConfirm(editedContent)}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}