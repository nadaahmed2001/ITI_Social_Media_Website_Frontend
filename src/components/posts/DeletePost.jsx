import React from "react";
import "./delete-post.css";
export default function DeletePost({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="delete-post-overlay">
      <div className="delete-post">
        <p>Are you sure you want to delete this post?</p>
        <div className="delete-post-btn">
          <button className="confirm-delete-post" onClick={onConfirm}>
            Confirm
          </button>
          <button className="cancel-delete-post" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
