// import React, { useState, useEffect, useRef } from 'react';
// // Use the API function that sends JSON (contains image URL) to PUT /users/account/
// import { updateAccount } from '../../../services/api'; // Adjust path as needed

// // Import MUI components used
// import Button from '@mui/material/Button'; // Using MUI button for Save
// import CircularProgress from '@mui/material/CircularProgress';
// import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined'; // Or PhotoCameraIcon
// import PersonIcon from '@mui/icons-material/Person'; // Placeholder icon
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever'; // For remove text button

// // Import the CSS file with light theme styles
// import './EditPhoto.css';

// // Define default avatar path (ADJUST THIS PATH TO YOUR PROJECT STRUCTURE in /public folder)
// const DEFAULT_PROFILE_PIC = '/images/profiles/user-default.png';

// // --- CLOUDINARY CONFIG (Use Environment Variables for security!) ---
// const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dsaznefnt"; // Replace with yours
// const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "ITIHub_profile_pics"; // Replace with yours
// // --- End Cloudinary Config ---

// const EditPhoto = ({ currentImageUrl, onUpdateSuccess }) => {
// // State to hold the current image URL (from props or after widget upload)
// // Initialize with currentImageUrl from props
// const [imageUrl, setImageUrl] = useState(currentImageUrl);
// // State to track if the image was changed (by widget or cleared) since last load/save
// const [imageChanged, setImageChanged] = useState(false);
// // Loading state for the Save Changes action
// const [isSaving, setIsSaving] = useState(false);
// const [error, setError] = useState('');
// const [success, setSuccess] = useState('');

// // Ref for Cloudinary widget instance
// const cloudinaryWidget = useRef(null);

// // Initialize Cloudinary Widget on component mount
// useEffect(() => {
// // Check if Cloudinary script is loaded
// if (window.cloudinary) {
//     cloudinaryWidget.current = window.cloudinary.createUploadWidget({
//     cloudName: CLOUDINARY_CLOUD_NAME,
//     uploadPreset: CLOUDINARY_UPLOAD_PRESET,
//     sources: ['local', 'url', 'camera'], // Allowed upload sources
//     multiple: false, // Only allow single file selection
//     // Optional: Add folder, tags, cropping, etc.
//     folder: 'user_profiles',
//     // cropping: true, // Enable cropping aspect ratio
//     // croppingAspectRatio: 1, // Square aspect ratio
//     // showSkipCropButton: false,
//     }, (widgetError, result) => {
//     // Widget Callback Handler
//     if (!widgetError && result && result.event === "success") {
//         // On successful upload via widget
//         console.log('Cloudinary Upload Success:', result.info);
//         setError(''); // Clear previous errors
//         setSuccess(''); // Clear previous success
//         setImageUrl(result.info.secure_url); // Update state with the new Cloudinary URL
//         setImageChanged(true); // Mark that image has been changed
//     } else if (widgetError) {
//         // Handle widget errors
//         console.error('Cloudinary Widget Error:', widgetError);
//         setError("Image upload failed. Please try again.");
//         // Close widget on error maybe? widget.close();
//     }
//     });
// } else {
//     // Handle script loading issue
//     console.error("Cloudinary upload widget script not loaded");
//     setError("Image upload service is unavailable.");
// }
// }, []); // Empty dependency array ensures this runs only once on mount

// // Effect to update local state if the prop changes from the parent component
// useEffect(() => {
// setImageUrl(currentImageUrl); // Update local URL state
// setImageChanged(false); // Reset 'changed' status when prop updates
// }, [currentImageUrl]); // Dependency on the prop from parent

// // Function to open the Cloudinary widget
// const openCloudinaryWidget = () => {
// if (cloudinaryWidget.current) {
//     setError(''); setSuccess(''); // Clear messages before opening
//     cloudinaryWidget.current.open();
// } else {
//     setError("Image upload service is not ready. Please refresh the page.");
// }
// };

// // Handles the action of *marking* the image for removal (doesn't save yet)
// const handleClearImage = () => {
// // Check if there's actually an image URL to clear
// if (!imageUrl || imageUrl === DEFAULT_PROFILE_PIC) return;

// if (window.confirm("Are you sure you want to remove your profile picture? Click 'Save Changes' to confirm.")) {
//     setImageUrl(null); // Clear the URL in local state
//     setImageChanged(true); // Mark that a change occurred
//     setError(''); setSuccess(''); // Clear messages
// }
// };

// // Handles the final "Save Changes" button click
// const handleSaveChanges = async () => {
// // Only proceed if the image state has actually been changed
// if (!imageChanged) {
//     // Optionally show a message or just do nothing
//     // setSuccess("No changes to save.");
//     return;
// }

// setIsSaving(true); // Set loading state for save button
// setError('');
// setSuccess('');

// // Prepare the payload - just the profile_image field needs updating
// // Send null if imageUrl state is null (meaning user cleared it)
// const payload = {
//     profile_picture: imageUrl
// };

// try {
//     // Call the API function that sends JSON via PUT to /users/account/
//     const response = await updateAccount(payload);

//     setSuccess('Profile photo updated successfully!');
//     setImageChanged(false); // Reset changed status after successful save

//     // Notify parent component of the update (passing the new URL or null)
//     if (onUpdateSuccess) {
//     onUpdateSuccess(response.data.profile_picture || null);
//     }

// } catch (err) {
//     console.error("Save photo error:", err.response?.data || err.message);
//     const errors = err.response?.data;
//     let errorMessage = 'Failed to save photo changes.';
//     if (typeof errors === 'object' && errors !== null) {
//         errorMessage = errors.profile_picture?.[0] || errors.detail || JSON.stringify(errors);
//     } else if (typeof errors === 'string') { errorMessage = errors; }
//     setError(errorMessage);
//     // Optional: Revert local imageUrl state to original currentImageUrl on failure?
//     setImageUrl(currentImageUrl);
// } finally {
//     setIsSaving(false); // Clear loading state
// }
// };

// // Determine what to show in the preview area based on current state
// const imageToDisplay = imageUrl; // Use state which holds preview or current
// const hasCustomImage = imageUrl && imageUrl !== DEFAULT_PROFILE_PIC; // Check if current state has a non-default image

// // --- JSX Structure ---
// return (
// // Use class names matching the light theme CSS

//     <div>
//     {/* Title and Subtitle */}
//     <div className='photo-title-section-light'>
//         <h2><PhotoCameraOutlinedIcon /> Photo</h2>
//         <p>Add a nice photo of yourself for your profile.</p>
//     </div>

//     <div className="edit-photo-container-light section-container-light">

//         {/* Error/Success Messages */}
//         {error && <p className="error-message-light">{error}</p>}
//         {success && <p className="success-message-light">{success}</p>}

//         {/* Image Preview Section */}
//         <div className="photo-preview-area-light">
//             <h4>Image preview</h4>
//             <div className="image-placeholder-light">
//                 {/* Show image from state (Cloudinary URL or null) */}
//                 {imageToDisplay ? (
//                     <img
//                         key={imageToDisplay} // Helps React detect src changes
//                         src={imageToDisplay}
//                         alt="Profile Preview"
//                         className="profile-image-preview-light"
//                         // Fallback to default ONLY if the Cloudinary URL itself is broken
//                         onError={(e) => { if (e.target.src !== DEFAULT_PROFILE_PIC) e.target.src = DEFAULT_PROFILE_PIC; }}
//                     />
//                 ) : (
//                     // Show placeholder icon if imageUrl state is null
//                     <PersonIcon className="placeholder-icon-light" />
//                 )}
//             </div>
//             {/* Show remove button only if there IS an image currently displayed */}
//             {hasCustomImage && (
//                 <button
//                     type="button"
//                     className="text-button remove-link-light"
//                     onClick={handleClearImage} // Triggers setting state to null
//                     disabled={isSaving} // Disable while saving
//                 >
//                     Remove current photo
//                 </button>
//             )}
//         </div>

//         {/* Upload Control Section - Styled as Input Row */}
//         <div className="photo-upload-control-light">
//             <h4>Add / Change Image</h4>
//             {/* This row looks like an input but triggers the widget */}
//             <div
//             className="upload-input-row-light"
//             onClick={openCloudinaryWidget} // Click row to open widget
//             title="Choose or upload an image"
//             >
//                 <span className="file-name-display-light">
//                     {/* Display status based on whether image was changed */}
//                     {imageChanged ? (imageUrl ? "New image selected" : "Image marked for removal") : (imageUrl ? "Current image shown" : "No image selected")}
//                 </span>
//                 {/* This button also triggers the widget */}
//                 <button
//                     type="button"
//                     className="upload-image-button-light" // Styled with purple border
//                     onClick={openCloudinaryWidget} // Also opens widget
//                     disabled={isSaving} // Disable while saving
//                 >
//                     Upload image {/* Text from screenshot */}
//                 </button>
//             </div>
//         </div>

//         {/* Save Action Area */}
//         <div className="save-action-area-light">
//             {/* Dark  */}
            

//                 <Button // Using MUI Button
//                     variant="contained"
//                     className="save-button-light" // Optional class
//                     onClick={handleSaveChanges}
//                     disabled={isSaving || !imageChanged}
//                     // --- UPDATE SX PROP with Hardcoded Dark Theme Colors ---
//                     sx = {{
//                         backgroundColor: '#fffd02', // Hardcoded YELLOW
//                         color: '#191919',       // Hardcoded DARK TEXT
//                         minWidth: '100px',
//                         fontWeight: 'bold',
//                         textTransform: 'uppercase', // Match target style "SAVE"
//                         '&:hover': {
//                             backgroundColor: '#e6e400', // Darker yellow
//                         },
//                         '&:disabled': {
//                             backgroundColor: '#555', // Dark disabled background
//                             color: '#888'           // Dark disabled text
//                         }
//                     }}
//                     // --- END UPDATE ---
//                 >
//                     {/* Update CircularProgress color to match text */}
//                     {isSaving ? <CircularProgress size={24} sx={{color: '#191919'}}/> : 'Save'}
//                 </Button>
            
            
            
//             {/* light  */}
//             {/* <Button // Using MUI Button
//                 variant="contained"
//                 className="save-button-light" // Keep class if specific CSS needed
//                 onClick={handleSaveChanges} // Trigger save function
//                 // Disable if saving OR if no change has been marked
//                 disabled={isSaving || !imageChanged}
//                 sx = {{ // MUI styles for purple button
//                     backgroundColor: '#6f42c1',
//                     color: 'white',
//                     minWidth: '100px', // Ensure decent button width
//                     '&:hover': { backgroundColor: '#5a349b' },
//                     '&:disabled': { backgroundColor: '#cdc1e0', color: '#6c757d'}
//                 }}
//             >
//                 {isSaving ? <CircularProgress size={24} sx={{color: 'white'}}/> : 'Save Changes'}
//             </Button> */}
//     </div>
// </div> 



// </div>

// );
// };

// export default EditPhoto;

// src/components/UserProfile/EditPhoto.jsx (Adjust path)
// FINAL VERSION: Tailwind CSS + Cloudinary Widget

// src/components/UserProfile/EditPhoto.jsx (Adjust path)
// Tailwind CSS + Cloudinary Widget - Light Theme

import React, { useState, useEffect, useRef } from 'react';
// Use the API function that sends JSON (contains image URL) to PUT /users/account/
import { updateAccount } from '../../../services/api'; // Adjust path

// Import Heroicons v2 (Outline)
import { PhotoIcon, UserCircleIcon, TrashIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

// Define default avatar path (ADJUST THIS PATH to your /public folder)
const DEFAULT_PROFILE_PIC = '/images/profiles/user-default.png';

// --- CLOUDINARY CONFIG (Use Environment Variables!) ---
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dsaznefnt"; // Replace with yours
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "ITIHub_profile_pics"; // Replace with yours


const EditPhoto = ({ currentImageUrl, onUpdateSuccess }) => {
  // --- State (Keep existing widget logic state) ---
  const [imageUrl, setImageUrl] = useState(currentImageUrl);
  const [imageChanged, setImageChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const cloudinaryWidget = useRef(null);

  // --- Cloudinary Widget Initialization (Keep existing) ---
  useEffect(() => {
    if (window.cloudinary) {
      cloudinaryWidget.current = window.cloudinary.createUploadWidget({
        cloudName: CLOUDINARY_CLOUD_NAME, uploadPreset: CLOUDINARY_UPLOAD_PRESET,
        sources: ['local', 'url', 'camera'], multiple: false, folder: 'profile_pics',
        cropping: true, croppingAspectRatio: 1, showSkipCropButton: false, // Example crop
      }, (widgetError, result) => {
        if (!widgetError && result && result.event === "success") {
          setError(''); setSuccess(''); setImageUrl(result.info.secure_url); setImageChanged(true);
        } else if (widgetError) { console.error('Widget Error:', widgetError); setError("Image upload failed."); }
      });
    } else { console.error("Cloudinary script not loaded"); setError("Image upload service unavailable."); }
  }, []);

  // --- Sync with prop (Keep existing) ---
  useEffect(() => { setImageUrl(currentImageUrl); setImageChanged(false); }, [currentImageUrl]);

  // --- Handlers (Keep existing widget logic) ---
  const openCloudinaryWidget = () => {
    if (cloudinaryWidget.current) { setError(''); setSuccess(''); cloudinaryWidget.current.open(); }
    else { setError("Image upload service not ready."); }
  };
  const handleClearImage = () => {
    if (!imageUrl || imageUrl === DEFAULT_PROFILE_PIC) return;
    if (window.confirm("Mark image for removal? Changes saved when you click 'Save Changes'.")) {
      setImageUrl(null); setImageChanged(true); setError(''); setSuccess('');
    }
  };
  const handleSaveChanges = async () => {
    if (!imageChanged) return;
    setIsSaving(true); setError(''); setSuccess('');
    // Use 'profile_picture' key if that's what ProfileSerializer expects
    // Or 'profile_image' if you named the URLField that way
    const payload = { profile_picture: imageUrl }; // <-- Verify backend field name
    try {
      const response = await updateAccount(payload); // Sends JSON
      setSuccess('Photo updated successfully!'); setImageChanged(false);
      if (onUpdateSuccess) { onUpdateSuccess(response.data.profile_picture || null); } // Use correct field name
    } catch (err) {
       console.error("Save photo error:", err); const errors = err.response?.data; let errorMessage = 'Failed to save.';
       if(typeof errors === 'object' && errors !== null){ errorMessage = errors.profile_picture?.[0] || errors.detail || JSON.stringify(errors); } // Check correct field name
       else if(typeof errors === 'string'){ errorMessage = errors; } setError(errorMessage);
       setImageUrl(currentImageUrl); // Revert on failure
    } finally { setIsSaving(false); }
  };

  // --- Render Variables ---
  const imageToDisplay = imageUrl;
  const hasCustomImage = imageUrl && imageUrl !== DEFAULT_PROFILE_PIC;

  // --- JSX with Tailwind (Light Theme) ---
  return (
    // Main Container - Light theme
    <div className="p-6 md:p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-200 pb-4 mb-6">
        <PhotoIcon className="w-6 h-6 text-primary-600" /> {/* Purple Icon */}
        <h2 className="text-xl font-semibold font-title text-gray-800"> Photo </h2>
      </div>
      <p className="text-sm text-gray-500 mb-6 -mt-2">
          Add a nice photo of yourself for your profile.
      </p>

      {/* Messages */}
      {error && <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md">{error}</div>}
      {success && <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 border border-green-300 rounded-md">{success}</div>}

      {/* Layout */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {/* Preview Section */}
          <div className="flex-shrink-0 text-center md:text-left w-full sm:w-auto">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Image preview</h4>
              {/* Use rounded-full for avatar preview */}
              <div className="w-36 h-36 mx-auto sm:mx-0 bg-gray-100 border border-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                  {imageToDisplay ? (
                      <img
                          key={imageToDisplay}
                          src={imageToDisplay}
                          alt="Profile Preview"
                          className="w-full h-full object-cover" // Image fills circle
                          onError={(e) => { if (e.target.src !== DEFAULT_PROFILE_PIC) e.target.src = DEFAULT_PROFILE_PIC; }}
                      />
                  ) : (
                      <UserCircleIcon className="w-24 h-24 text-gray-400" /> // Placeholder icon
                  )}
              </div>
              {/* Remove Button */}
              {hasCustomImage && (
                 <button
                     type="button"
                     onClick={handleClearImage}
                     disabled={isSaving}
                     className="mt-2 text-xs text-red-600 hover:text-red-800 disabled:opacity-50 transition-colors"
                 >
                     Remove photo
                 </button>
              )}
          </div>

          {/* Upload Controls + Save Area */}
          <div className="flex-grow w-full">
               <div className="photo-upload-control mb-6"> {/* Spacing */}
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Add / Change image</h4>
                   {/* Button triggers widget - Light theme secondary button style */}
                  <button
                      type="button"
                      onClick={openCloudinaryWidget}
                      disabled={isSaving}
                      className="w-full flex justify-center items-center gap-2 px-4 py-2 border border-primary-500 rounded-md shadow-sm text-sm font-medium text-primary-600 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500 disabled:opacity-60 transition"
                  >
                      <ArrowUpTrayIcon className="w-5 h-5 text-primary-600"/>
                      Choose / Upload Image
                  </button>
                  {/* Status Text */}
                  {imageChanged && <p className="text-xs text-gray-500 mt-2 italic">{imageUrl ? "New image selected." : "Image marked for removal."} Click 'Save Changes' below.</p>}
               </div>

               {/* Save Action Area */}
               <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
                  {/* Save Button - Light theme primary button style */}
                  <button
                      type="button"
                      onClick={handleSaveChanges}
                      disabled={isSaving || !imageChanged} // Disable if saving or no changes made
                      className="inline-flex justify-center items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-60 transition duration-150 ease-in-out" // Purple button
                  >
                       {isSaving ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg>
                                Saving...
                            </>
                       ) : ( 'Save Changes' )}
                  </button>
               </div>
          </div>
      </div>
    </div>
  );
};

export default EditPhoto;