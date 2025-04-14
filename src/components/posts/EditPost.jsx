// src/components/posts/EditPost.jsx
// Styled with Tailwind CSS, similar to EditComment

import React, { useState, useEffect } from 'react';
// Import Close Icon from MUI (ensure @mui/icons-material is installed)
import { Close as CloseIcon } from "@mui/icons-material"; 
// Optional: Import CircularProgress for loading state
import CircularProgress from '@mui/material/CircularProgress'; 

// Define Max Length (should match your backend Post model validator, e.g., 3000)
const MAX_EDIT_POST_LENGTH = 3000; 

export default function EditPost({ isOpen, post, onClose, onConfirm }) { 
  const [editedContent, setEditedContent] = useState('');
  const [isSaving, setIsSaving] = useState(false); // State for loading indicator

  // Effect to set initial content when modal opens or post data changes
  useEffect(() => {
    // Only update state if the modal is open and post data is available
    if (isOpen && post) {
      setEditedContent(post.body || ''); // Pre-fill with current post body
      setIsSaving(false); // Reset saving state when opening/post changes
    }
    // Reset when closing (optional)
    // if (!isOpen) {
    //   setEditedContent(''); 
    // }
  }, [isOpen, post]); // Re-run if isOpen or post changes

  // Handler for textarea changes
  const handleInputChange = (e) => {
      setEditedContent(e.target.value);
  };

  // Handle Save button click
  const handleSave = async () => {
      const trimmedContent = editedContent.trim();
      // Validation
      if (!trimmedContent) {
         alert("Post content cannot be empty.");
         return; 
      }
      if (trimmedContent.length > MAX_EDIT_POST_LENGTH) {
         alert(`Post cannot exceed ${MAX_EDIT_POST_LENGTH} characters.`);
         return;
      }
      
      setIsSaving(true); // Indicate loading
      try {
          // Call the onConfirm prop (passed from ShowPost) which handles the API call
          await onConfirm(post.id, trimmedContent); 
          // Success: Parent component (ShowPost) should handle closing the modal 
          // by setting its state based on the promise resolution of onConfirm.
          // We don't call onClose() directly here.
      } catch (error) {
          console.error("Error saving post edit:", error);
          alert("Failed to save post changes. Please try again.");
          setIsSaving(false); // Turn off loading indicator on error
      } 
      // No finally block needed to set isSaving false if parent closes modal on success.
      // If parent doesn't close modal automatically, add finally: finally { setIsSaving(false); }
  };

  // --- Character Count Logic ---
  const currentLength = editedContent.length;
  const isOverLimit = currentLength > MAX_EDIT_POST_LENGTH;
  // Use Tailwind classes for conditional coloring
  const countColorClass = isOverLimit ? 'text-red-600 font-medium' 
                          : 'text-gray-500'; 
  // ---

  // Don't render anything if the modal isn't open or if post data is missing
  if (!isOpen || !post) return null; 

  return (
    // --- Tailwind Modal Structure ---
    // Overlay
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 transition-opacity duration-300" 
      aria-labelledby="edit-post-title" role="dialog" aria-modal="true" 
      onClick={!isSaving ? onClose : undefined} // Close on overlay click only if not saving
    >
        {/* Content Box */}
        <div 
          className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto" // Using max-w-lg like EditComment example
          onClick={e => e.stopPropagation()} // Prevent click inside closing modal
        > 
             {/* Header */}
             <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
                 <h3 className="text-lg font-medium text-gray-900" id="edit-post-title">Edit Post</h3>
                 <button 
                    onClick={onClose} 
                    disabled={isSaving} 
                    className="p-1 text-gray-400 rounded-md hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                    aria-label="Close modal"
                 >
                    <CloseIcon className="w-5 h-5" /> 
                 </button>
             </div>
             {/* Body */}
             <div className="p-5">
                <textarea
                    value={editedContent}
                    onChange={handleInputChange}
                    // Apply similar textarea styling, including error state border
                    className={`w-full p-2 border rounded-md resize-y min-h-[150px] text-sm text-black-800 focus:ring-1 focus:outline-none ${isOverLimit ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'}`} 
                    placeholder="Edit your post..."
                    rows="6" // Adjust rows as needed for post content
                    autoFocus
                    disabled={isSaving}
                    aria-describedby="post-char-count" // Accessibility link
                />
                 {/* Character Count Indicator */}
                 <div id="post-char-count" className={`text-xs mt-1 text-right ${countColorClass}`}>
                     {currentLength} / {MAX_EDIT_POST_LENGTH}
                 </div>
             </div>
             {/* Footer */}
             <div className="flex justify-end items-center px-5 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg space-x-3">
                 {/* Cancel Button */}
                 <button 
                     type="button"
                     className="px-4 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50" 
                     onClick={onClose}
                     disabled={isSaving}
                 >
                    Cancel
                 </button>
                 {/* Confirm Button */}
                 <button 
                     type="button"
                     // Apply styling and disabled logic
                     className={`inline-flex items-center justify-center px-4 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-[110px] ${!editedContent.trim() || isOverLimit || isSaving ? 'bg-gray-400' : 'bg-primary-600 hover:bg-primary-700'}`} 
                     onClick={handleSave}
                     disabled={!editedContent.trim() || isOverLimit || isSaving} // Check empty, over limit, or saving
                 >
                     {isSaving ? ( // Show spinner if saving
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
             {/* Removed animation style block - add to global CSS or Tailwind config if needed */}
         </div>
     </div>
     // --- End Tailwind Modal Structure ---
  );
}