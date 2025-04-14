import React, { useState, useEffect } from 'react';
import { Close as CloseIcon } from "@mui/icons-material"; 
import "./edit-comment.css"; // Import your CSS file for custom styles
const MAX_EDIT_LENGTH = 2000; 

export default function EditComment({ isOpen, comment, onClose, onConfirm }) {
  const [editedContent, setEditedContent] = useState('');
  const [isSaving, setIsSaving] = useState(false); 

  useEffect(() => {
    if (isOpen && comment) {
      setEditedContent(comment.comment || '');
    } 
  }, [isOpen, comment]); 

  const handleInputChange = (e) => { setEditedContent(e.target.value); };
  
  const handleSave = async () => {
    const trimmedContent = editedContent.trim();
    if (!trimmedContent || trimmedContent.length > MAX_EDIT_LENGTH) {
       // Basic validation alerts
      alert( !trimmedContent ? "Comment cannot be empty." : `Comment cannot exceed ${MAX_EDIT_LENGTH} characters.`);
      return;
    }
    setIsSaving(true);
    try {
        await onConfirm(trimmedContent); 
    } catch (error) {
        console.error("Error saving comment edit:", error);
        alert("Failed to save comment. Please try again.");
    } finally {
        setIsSaving(false);
    }
  };

  const currentLength = editedContent.length;
  const isOverLimit = currentLength > MAX_EDIT_LENGTH;
  const countColorClass = isOverLimit ? 'text-red-600 font-medium' : 'text-gray-500'; 

  if (!isOpen || !comment) return null;

  return (
    // Overlay: Stays the same (z-50)
    <div 
      className="edit-comment-overlay" 
      aria-labelledby="edit-comment-title" role="dialog" aria-modal="true" 
      onClick={onClose} // Click outside closes
    >
        
        {/* Modal Content Container */}
        {/* REMOVED: scale-95 opacity-0 animate-modal-scale-in */}
        {/* KEPT: Basic layout, background, shadow, size constraints */}
        <div 
            className="edit-comment" // Removed animation/initial hidden state classes
            onClick={e => e.stopPropagation()} // Prevent clicks inside from closing modal
        > 
             {/* Header */}
             <div className="edit-comment-title flex items-center justify-between px-5 py-3 border-b edit-comment-title">
                 <h3 id="edit-comment-title-id">Edit Comment</h3>
                 <button onClick={onClose} disabled={isSaving} className="p-1 text-gray-400 rounded-md hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50">
                    <CloseIcon className="w-5 h-5" /> 
                 </button>
             </div>
             {/* Body */}
             <div className="p-5 edit-comment-text-area">
                <textarea
                    value={editedContent}
                    onChange={handleInputChange}
                    className="edit-textarea"
                    placeholder="Edit your comment..."
                    rows="5"
                    autoFocus
                    disabled={isSaving}
                />
                 {/* Character Count Indicator */}
                 <div className={`comment-char-count text-xs mt-1 text-right ${countColorClass}`}>
                     {currentLength} / {MAX_EDIT_LENGTH}
                 </div>
             </div>
             {/* Footer */}
             <div className="edit-comment-btn">
                 <button 
                     className="cancel-edit-comment" 
                     onClick={onClose}
                     disabled={isSaving}
                 >
                    Cancel
                 </button>
                 <button 
                     className="confirm-edit-comment"
                     onClick={handleSave}
                     disabled={!editedContent.trim() || isOverLimit || isSaving} 
                 >
                    {isSaving ? 'Saving...' : 'Save Changes'} 
                 </button>
             </div>
         </div>
     </div>
  );
}