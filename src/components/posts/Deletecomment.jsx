// DeleteComment.jsx
import React from 'react';
import './delete-comment.css';
export default function DeleteComment({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Confirm Deletion</h3>
        <p>Are you sure you want to delete this comment?</p>
        <div className="modal-actions">
          <button className="confirm-btn" onClick={onConfirm}>
            Delete
          </button>
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}