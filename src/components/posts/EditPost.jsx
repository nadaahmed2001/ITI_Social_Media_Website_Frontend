import React from 'react'

export default function EditPost({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;
  return (
    <div className="edit-post-overlay">
      <div className="edit-post">
        <p>//here i need post content//</p>
        <div className="edit-post-btn">
          <button className="confirm-edit-post" onClick={onConfirm}>
            Confirm
          </button>
          <button className="cancel-edit-post" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
