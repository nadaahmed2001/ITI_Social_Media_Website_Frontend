// src/components/profiles/UserProfile/EditPhoto.jsx (Example path)
import React, { useState, useEffect, useRef, useContext } from 'react'; // Import useContext
import AuthContext from '../../../contexts/AuthContext'; // *** Adjust path to your AuthContext ***
// Use the API function that sends JSON (contains image URL) to PUT /users/account/
import { updateAccount } from '../../services/api'; // Adjust path

// Import MUI components used
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import PersonIcon from '@mui/icons-material/Person';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

// Import the CSS file (ensure path is correct)
import './EditPhoto.css';

// Define default avatar path
// const DEFAULT_USER_AVATAR = '../../../src/assets/images/user-default.webp'; // Adjust this path to your default image location
import defaultPic from '@/assets/images/user-default.webp';
const DEFAULT_USER_AVATAR = defaultPic;




// --- CLOUDINARY CONFIG (Use Environment Variables!) ---
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dsaznefnt"; // Replace with yours
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "ITIHub_profile_pics"; // Replace with yours
// --- End Cloudinary Config ---

const EditPhoto = ({ currentImageUrl, onUpdateSuccess }) => {
  // *** Get updateUserState from context ***
  const { updateUserState } = useContext(AuthContext);

  // State to hold the current image URL (from props or after widget upload)
  const [imageUrl, setImageUrl] = useState(currentImageUrl || null); // Initialize with prop or null
  // State to track if the image was changed since last load/save
  const [imageChanged, setImageChanged] = useState(false);
  // Loading state for the Save Changes action
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Ref for Cloudinary widget instance
  const cloudinaryWidget = useRef(null);

  // Initialize Cloudinary Widget on component mount
  useEffect(() => {
    if (window.cloudinary) {
      cloudinaryWidget.current = window.cloudinary.createUploadWidget({
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_UPLOAD_PRESET,
        sources: ['local', 'url', 'camera'],
        multiple: false,
        folder: 'user_profiles', // Specify folder
      }, (widgetError, result) => {
        if (!widgetError && result && result.event === "success") {
          console.log('Cloudinary Upload Success:', result.info);
          setError(''); setSuccess('');
          setImageUrl(result.info.secure_url); // Update local state with new URL
          setImageChanged(true); // Mark change
        } else if (widgetError) {
          console.error('Cloudinary Widget Error:', widgetError);
          setError("Image upload failed. Please try again.");
        }
      });
    } else {
      console.error("Cloudinary upload widget script not loaded");
      setError("Image upload service is unavailable.");
    }
  }, []); // Empty dependency array runs once

  // Effect to update local state if the prop changes from the parent
  useEffect(() => {
    setImageUrl(currentImageUrl || null); // Update local URL state
    setImageChanged(false); // Reset 'changed' status when prop updates
  }, [currentImageUrl]);

  // Function to open the Cloudinary widget
  const openCloudinaryWidget = () => {
    if (cloudinaryWidget.current) {
      setError(''); setSuccess('');
      cloudinaryWidget.current.open();
    } else {
      setError("Image upload service is not ready. Please refresh the page.");
    }
  };

  // Handles marking the image for removal
  const handleClearImage = () => {
    if (!imageUrl || imageUrl === DEFAULT_USER_AVATAR) return;
    if (window.confirm("Are you sure you want to remove your profile picture? Click 'Save Changes' to confirm.")) {
      setImageUrl(null); // Clear local state
      setImageChanged(true); // Mark change
      setError(''); setSuccess('');
    }
  };

  // Handles the final "Save Changes" button click
  const handleSaveChanges = async () => {
    if (!imageChanged) return; // Only save if changes were made

    setIsSaving(true); setError(''); setSuccess('');

    // Payload for the updateAccount API call
    const payload = {
      profile_picture: imageUrl // Send current imageUrl state (could be null if cleared)
    };

    try {
      // Call API to update backend
      const response = await updateAccount(payload); // Sends JSON PUT to /users/account/

      const newImageUrlFromApi = response.data?.profile_picture || null; // Get updated URL from response

      setSuccess('Profile photo updated successfully!');
      setImageChanged(false); // Reset changed status

      // *** Update global AuthContext state ***
      if (updateUserState) {
          updateUserState({ profile_picture: newImageUrlFromApi });
      }

      // Notify parent component if needed (optional)
      if (onUpdateSuccess) {
        onUpdateSuccess(newImageUrlFromApi);
      }

    } catch (err) {
      console.error("Save photo error:", err.response?.data || err.message);
      const errors = err.response?.data;
      let errorMessage = 'Failed to save photo changes.';
      // Extract specific error message if available
      if (typeof errors === 'object' && errors !== null) {
          errorMessage = errors.profile_picture?.[0] || errors.detail || JSON.stringify(errors);
      } else if (typeof errors === 'string') { errorMessage = errors; }
      setError(errorMessage);
      // Revert local state on failure?
      // setImageUrl(currentImageUrl || null);
      // setImageChanged(false);
    } finally {
      setIsSaving(false);
    }
  };

  // Determine image source for preview
  const imageToDisplay = imageUrl || DEFAULT_USER_AVATAR; // Show default if imageUrl is null
  const hasCustomImage = imageUrl && imageUrl !== DEFAULT_USER_AVATAR;

  return (
    // Assuming parent provides necessary margin/padding
    <div className="bg-[#F0F0F0] p-6 rounded-xl shadow-md w-full"> {/* Use w-full or specific width */}
      <div className='photo-title-section-light'>
        <h2 className="text-lg font-semibold text-[#7a2226] flex items-center gap-2 mb-4">
            <PhotoCameraOutlinedIcon />Edit Photo
        </h2>
      </div>

      <div className="edit-photo-container-light section-container-light">
        {/* Messages */}
        {error && <p className="error-message-light text-red-600 text-sm mb-3">{error}</p>}
        {success && <p className="success-message-light text-green-600 text-sm mb-3">{success}</p>}

        {/* Image Preview Section */}
        <div className="photo-preview-area-light mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Image preview</h4>
            <div className="image-placeholder-light w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border border-gray-300 mx-auto"> {/* Centered preview */}
                <img
                    key={imageToDisplay}
                    src={imageToDisplay}
                    alt="Profile Preview"
                    className="profile-image-preview-light w-full h-full object-cover" // Ensure image covers area
                    onError={(e) => { if (e.target.src !== DEFAULT_USER_AVATAR) e.target.src = DEFAULT_USER_AVATAR; }}
                />
            </div>
            {/* Remove Button */}
            {hasCustomImage && (
                <div className="text-center mt-2"> {/* Center remove button */}
                    <button
                        type="button"
                        className="text-button remove-link-light text-xs text-red-600 hover:text-red-800 disabled:opacity-50"
                        onClick={handleClearImage}
                        disabled={isSaving}
                    >
                        Remove current photo
                    </button>
                </div>
            )}
        </div>

        {/* Upload Control Section */}
        <div className="photo-upload-control-light mb-5">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Add / Change Image</h4>
            <div
                className="upload-input-row-light flex items-center justify-between border border-gray-300 rounded-lg p-2 cursor-pointer hover:border-gray-400 bg-white"
                onClick={openCloudinaryWidget}
                title="Choose or upload an image"
            >
                <span className="file-name-display-light text-sm text-gray-600 truncate pr-2">
                     {imageChanged ? (imageUrl ? "New image selected" : "Image marked for removal") : (imageUrl && imageUrl !== DEFAULT_USER_AVATAR ? "Current image shown" : "No image selected")}
                </span>
                <button
                    type="button"
                    className="upload-image-button-light text-xs font-semibold text-[#7a2226] border border-[#7a2226] rounded-md px-3 py-1 hover:bg-[#7a2226]/10 disabled:opacity-50"
                    onClick={(e) => { e.stopPropagation(); openCloudinaryWidget(); }} // Prevent row click, open widget
                    disabled={isSaving}
                >
                    Upload
                </button>
            </div>
        </div>

        {/* Save Action Area */}
        <div className="save-action-area-light border-t border-gray-200 pt-4 flex justify-end">
            <Button
                variant="contained"
                onClick={handleSaveChanges}
                disabled={isSaving || !imageChanged} // Disable if saving or no changes made
                sx = {{
                    backgroundColor: '#7a2226',
                    color: 'white', // White text on dark red
                    minWidth: '100px',
                    fontWeight: 'bold',
                    textTransform: 'none', // Keep normal case
                    '&:hover': {
                        backgroundColor: '#5a181b', // Darker red on hover
                    },
                    '&:disabled': {
                        backgroundColor: '#ab6a6d', // Muted red disabled background
                        color: '#e0e0e0'           // Lighter disabled text
                    }
                }}
            >
                {isSaving ? <CircularProgress size={24} sx={{color: 'white'}}/> : 'Save Changes'}
            </Button>
        </div>
      </div>
    </div>
  );
};

export default EditPhoto;
