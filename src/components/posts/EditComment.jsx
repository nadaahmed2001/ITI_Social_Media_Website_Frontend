// EditComment.jsx
import React, { useState, useEffect } from 'react';
import './edit-comment.css';
export default function EditComment({ isOpen, comment, onClose, onConfirm }) {
  const [editedContent, setEditedContent] = useState('');

  useEffect(() => {
    if (comment) {
      setEditedContent(comment.comment || '');
    }
  }, [comment]);

  if (!isOpen || !comment) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Comment</h3>
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="edit-textarea"
          autoFocus
        />
        <div className="modal-actions">
          <button 
            className="confirm-btn" 
            onClick={() => onConfirm(editedContent)}
            disabled={!editedContent.trim()}
          >
            Save
          </button>
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}