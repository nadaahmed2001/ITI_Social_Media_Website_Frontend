import React, { useState, useEffect } from 'react';
import { Close as CloseIcon } from "@mui/icons-material"; 
import CircularProgress from '@mui/material/CircularProgress'; 
import "./edit-post.css"; 
const MAX_EDIT_POST_LENGTH = 3000; 
export default function EditPost({ isOpen, post, onClose, onConfirm }) { 
  const [editedContent, setEditedContent] = useState('');
  const [isSaving, setIsSaving] = useState(false); 
  useEffect(() => {
    if (isOpen && post) {
      setEditedContent(post.body || ''); 
      setIsSaving(false); 
    }
    // Reset when closing (optional)
    // if (!isOpen) {
    //   setEditedContent(''); 
    // }
  }, [isOpen, post]); 
  const handleInputChange = (e) => {
      setEditedContent(e.target.value);
  };
  const handleSave = async () => {
      const trimmedContent = editedContent.trim();
      if (!trimmedContent) {
         alert("Post content cannot be empty.");
         return; 
      }
      if (trimmedContent.length > MAX_EDIT_POST_LENGTH) {
         alert(`Post cannot exceed ${MAX_EDIT_POST_LENGTH} characters.`);
         return;
      }
      
      setIsSaving(true);
      try {
          await onConfirm(post.id, trimmedContent); 
      } catch (error) {
          console.error("Error saving post edit:", error);
          alert("Failed to save post changes. Please try again.");
          setIsSaving(false); 
      } 
  };
  const currentLength = editedContent.length;
  const isOverLimit = currentLength > MAX_EDIT_POST_LENGTH;
  const countColorClass = isOverLimit ? 'text-red-600 font-medium' 
                          : 'text-gray-500'; 
  if (!isOpen || !post) return null; 

  return (
    <div 
      className="edit-post-overlay" 
      aria-labelledby="edit-post-title" role="dialog" aria-modal="true" 
      onClick={!isSaving ? onClose : undefined} 
    >
        <div 
          className="edit-post"
          onClick={e => e.stopPropagation()} 
        > 
             {/* Header */}
             <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 edit-post-title">
                 <h3 className="text-lg font-medium text-gray-900" id="edit-post-title">Edit Post</h3>
                 <button 
                    onClick={onClose} 
                    disabled={isSaving} 
                    className="p-1 text-gray-400 rounded-md hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 CloseIcon"
                    aria-label="Close modal"
                 >
                    <CloseIcon className="w-5 h-5 CloseIcon" /> 
                 </button>
             </div>
             {/* Body */}
             <div className="p-5 edit-post-text-aria">
                <textarea
                    value={editedContent}
                    onChange={handleInputChange}
                    
                    className="edit-textarea"
                    placeholder="Edit your post..."
                    rows="6" 
                    autoFocus
                    disabled={isSaving}
                    aria-describedby="post-char-count"
                />
                 {/* Character Count Indicator */}
                 <div id="post-char-count" className={`text-xs mt-1 text-right ${countColorClass}`}>
                     {currentLength} / {MAX_EDIT_POST_LENGTH}
                 </div>
             </div>
             {/* Footer */}
             <div className="edit-post-btn">
                 {/* Cancel Button */}
                 <button 
                     type="button"
                     className="cancel-edit-post" 
                     onClick={onClose}
                     disabled={isSaving}
                 >
                    Cancel
                 </button>
                 {/* Confirm Button */}
                 <button 
                     type="button"
                     className="confirm-edit-post"
                     onClick={handleSave}
                     disabled={!editedContent.trim() || isOverLimit || isSaving} 
                 >
                     {isSaving ? (
                       <>
                         {/* Using MUI spinner */}
                         <CircularProgress size={16} sx={{ color: 'white', marginRight: '8px' }} /> 
                         Saving...
                       </>
                     ) : (
                        'Save Changes'
                     )} 
                 </button>
             </div>
         </div>
     </div>
  );
}