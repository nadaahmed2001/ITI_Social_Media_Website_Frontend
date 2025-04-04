// DeleteComment.jsx
import React from "react";

export default function DeleteComment({ isOpen , onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>Are you sure you want to delete this comment?</p>
        <div className="modal-actions">
          <button onClick={onConfirm}>Delete</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}