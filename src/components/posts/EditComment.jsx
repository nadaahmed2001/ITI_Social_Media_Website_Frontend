import React, { useState, useEffect } from 'react';
import { Close as CloseIcon } from "@mui/icons-material"; 

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 transition-opacity duration-300" 
      aria-labelledby="edit-comment-title" role="dialog" aria-modal="true" 
      onClick={onClose} // Click outside closes
    >
        
        {/* Modal Content Container */}
        {/* REMOVED: scale-95 opacity-0 animate-modal-scale-in */}
        {/* KEPT: Basic layout, background, shadow, size constraints */}
        <div 
            className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto" // Removed animation/initial hidden state classes
            onClick={e => e.stopPropagation()} // Prevent clicks inside from closing modal
        > 
             {/* Header */}
             <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
                 <h3 className="text-lg font-medium text-gray-900" id="edit-comment-title">Edit Comment</h3>
                 <button onClick={onClose} disabled={isSaving} className="p-1 text-gray-400 rounded-md hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50">
                    <CloseIcon className="w-5 h-5" /> 
                 </button>
             </div>
             {/* Body */}
             <div className="p-5">
                <textarea
                    value={editedContent}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-md resize-y min-h-[120px] text-sm text-gray-800 focus:ring-1 focus:outline-none ${isOverLimit ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'}`} 
                    placeholder="Edit your comment..."
                    rows="5"
                    autoFocus
                    disabled={isSaving}
                />
                 {/* Character Count Indicator */}
                 <div className={`text-xs mt-1 text-right ${countColorClass}`}>
                     {currentLength} / {MAX_EDIT_LENGTH}
                 </div>
             </div>
             {/* Footer */}
             <div className="flex justify-end items-center px-5 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg space-x-3">
                 <button 
                     className="px-4 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50" 
                     onClick={onClose}
                     disabled={isSaving}
                 >
                    Cancel
                 </button>
                 <button 
                     className={`inline-flex items-center px-4 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed ${!editedContent.trim() || isOverLimit || isSaving ? 'bg-gray-400' : 'bg-primary-600 hover:bg-primary-700'}`}
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