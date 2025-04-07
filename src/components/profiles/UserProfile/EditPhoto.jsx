import React, { useState, useEffect, useRef } from 'react';
// Use the API function that sends JSON (contains image URL) to PUT /users/account/
import { updateAccount } from '../../services/api';

// Import MUI components used
import Button from '@mui/material/Button'; // Using MUI button for Save
import CircularProgress from '@mui/material/CircularProgress';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined'; // Or PhotoCameraIcon
import PersonIcon from '@mui/icons-material/Person'; // Placeholder icon
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'; // For remove text button

// Import the CSS file with light theme styles
import './EditPhoto.css';

// Define default avatar path (ADJUST THIS PATH TO YOUR PROJECT STRUCTURE in /public folder)
const DEFAULT_PROFILE_PIC = '/images/profiles/user-default.png';

// --- CLOUDINARY CONFIG (Use Environment Variables for security!) ---
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dsaznefnt"; // Replace with yours
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "ITIHub_profile_pics"; // Replace with yours
// --- End Cloudinary Config ---

const EditPhoto = ({ currentImageUrl, onUpdateSuccess }) => {
// State to hold the current image URL (from props or after widget upload)
// Initialize with currentImageUrl from props
const [imageUrl, setImageUrl] = useState(currentImageUrl);
// State to track if the image was changed (by widget or cleared) since last load/save
const [imageChanged, setImageChanged] = useState(false);
// Loading state for the Save Changes action
const [isSaving, setIsSaving] = useState(false);
const [error, setError] = useState('');
const [success, setSuccess] = useState('');

// Ref for Cloudinary widget instance
const cloudinaryWidget = useRef(null);

// Initialize Cloudinary Widget on component mount
useEffect(() => {
// Check if Cloudinary script is loaded
if (window.cloudinary) {
    cloudinaryWidget.current = window.cloudinary.createUploadWidget({
    cloudName: CLOUDINARY_CLOUD_NAME,
    uploadPreset: CLOUDINARY_UPLOAD_PRESET,
    sources: ['local', 'url', 'camera'], // Allowed upload sources
    multiple: false, // Only allow single file selection
    // Optional: Add folder, tags, cropping, etc.
    folder: 'user_profiles',
    // cropping: true, // Enable cropping aspect ratio
    // croppingAspectRatio: 1, // Square aspect ratio
    // showSkipCropButton: false,
    }, (widgetError, result) => {
    // Widget Callback Handler
    if (!widgetError && result && result.event === "success") {
        // On successful upload via widget
        console.log('Cloudinary Upload Success:', result.info);
        setError(''); // Clear previous errors
        setSuccess(''); // Clear previous success
        setImageUrl(result.info.secure_url); // Update state with the new Cloudinary URL
        setImageChanged(true); // Mark that image has been changed
    } else if (widgetError) {
        // Handle widget errors
        console.error('Cloudinary Widget Error:', widgetError);
        setError("Image upload failed. Please try again.");
        // Close widget on error maybe? widget.close();
    }
    });
} else {
    // Handle script loading issue
    console.error("Cloudinary upload widget script not loaded");
    setError("Image upload service is unavailable.");
}
}, []); // Empty dependency array ensures this runs only once on mount

// Effect to update local state if the prop changes from the parent component
useEffect(() => {
setImageUrl(currentImageUrl); // Update local URL state
setImageChanged(false); // Reset 'changed' status when prop updates
}, [currentImageUrl]); // Dependency on the prop from parent

// Function to open the Cloudinary widget
const openCloudinaryWidget = () => {
if (cloudinaryWidget.current) {
    setError(''); setSuccess(''); // Clear messages before opening
    cloudinaryWidget.current.open();
} else {
    setError("Image upload service is not ready. Please refresh the page.");
}
};

// Handles the action of *marking* the image for removal (doesn't save yet)
const handleClearImage = () => {
// Check if there's actually an image URL to clear
if (!imageUrl || imageUrl === DEFAULT_PROFILE_PIC) return;

if (window.confirm("Are you sure you want to remove your profile picture? Click 'Save Changes' to confirm.")) {
    setImageUrl(null); // Clear the URL in local state
    setImageChanged(true); // Mark that a change occurred
    setError(''); setSuccess(''); // Clear messages
}
};

// Handles the final "Save Changes" button click
const handleSaveChanges = async () => {
// Only proceed if the image state has actually been changed
if (!imageChanged) {
    // Optionally show a message or just do nothing
    // setSuccess("No changes to save.");
    return;
}

setIsSaving(true); // Set loading state for save button
setError('');
setSuccess('');

// Prepare the payload - just the profile_image field needs updating
// Send null if imageUrl state is null (meaning user cleared it)
const payload = {
    profile_picture: imageUrl
};

try {
    // Call the API function that sends JSON via PUT to /users/account/
    const response = await updateAccount(payload);

    setSuccess('Profile photo updated successfully!');
    setImageChanged(false); // Reset changed status after successful save

    // Notify parent component of the update (passing the new URL or null)
    if (onUpdateSuccess) {
    onUpdateSuccess(response.data.profile_picture || null);
    }

} catch (err) {
    console.error("Save photo error:", err.response?.data || err.message);
    const errors = err.response?.data;
    let errorMessage = 'Failed to save photo changes.';
    if (typeof errors === 'object' && errors !== null) {
        errorMessage = errors.profile_picture?.[0] || errors.detail || JSON.stringify(errors);
    } else if (typeof errors === 'string') { errorMessage = errors; }
    setError(errorMessage);
    // Optional: Revert local imageUrl state to original currentImageUrl on failure?
    setImageUrl(currentImageUrl);
} finally {
    setIsSaving(false); // Clear loading state
}
};

// Determine what to show in the preview area based on current state
const imageToDisplay = imageUrl; // Use state which holds preview or current
const hasCustomImage = imageUrl && imageUrl !== DEFAULT_PROFILE_PIC; // Check if current state has a non-default image

// --- JSX Structure ---
return (
// Use class names matching the light theme CSS

    <div>
    {/* Title and Subtitle */}
    <div className='photo-title-section-light'>
        <h2><PhotoCameraOutlinedIcon /> Photo</h2>
        <p>Add a nice photo of yourself for your profile.</p>
    </div>

    <div className="edit-photo-container-light section-container-light">

        {/* Error/Success Messages */}
        {error && <p className="error-message-light">{error}</p>}
        {success && <p className="success-message-light">{success}</p>}

        {/* Image Preview Section */}
        <div className="photo-preview-area-light">
            <h4>Image preview</h4>
            <div className="image-placeholder-light">
                {/* Show image from state (Cloudinary URL or null) */}
                {imageToDisplay ? (
                    <img
                        key={imageToDisplay} // Helps React detect src changes
                        src={imageToDisplay}
                        alt="Profile Preview"
                        className="profile-image-preview-light"
                        // Fallback to default ONLY if the Cloudinary URL itself is broken
                        onError={(e) => { if (e.target.src !== DEFAULT_PROFILE_PIC) e.target.src = DEFAULT_PROFILE_PIC; }}
                    />
                ) : (
                    // Show placeholder icon if imageUrl state is null
                    <PersonIcon className="placeholder-icon-light" />
                )}
            </div>
            {/* Show remove button only if there IS an image currently displayed */}
            {hasCustomImage && (
                <button
                    type="button"
                    className="text-button remove-link-light"
                    onClick={handleClearImage} // Triggers setting state to null
                    disabled={isSaving} // Disable while saving
                >
                    Remove current photo
                </button>
            )}
        </div>

        {/* Upload Control Section - Styled as Input Row */}
        <div className="photo-upload-control-light">
            <h4>Add / Change Image</h4>
            {/* This row looks like an input but triggers the widget */}
            <div
            className="upload-input-row-light"
            onClick={openCloudinaryWidget} // Click row to open widget
            title="Choose or upload an image"
            >
                <span className="file-name-display-light">
                    {/* Display status based on whether image was changed */}
                    {imageChanged ? (imageUrl ? "New image selected" : "Image marked for removal") : (imageUrl ? "Current image shown" : "No image selected")}
                </span>
                {/* This button also triggers the widget */}
                <button
                    type="button"
                    className="upload-image-button-light" // Styled with purple border
                    onClick={openCloudinaryWidget} // Also opens widget
                    disabled={isSaving} // Disable while saving
                >
                    Upload image {/* Text from screenshot */}
                </button>
            </div>
        </div>

        {/* Save Action Area */}
        <div className="save-action-area-light">
            {/* Dark  */}
            

                <Button // Using MUI Button
                    variant="contained"
                    className="save-button-light" // Optional class
                    onClick={handleSaveChanges}
                    disabled={isSaving || !imageChanged}
                    // --- UPDATE SX PROP with Hardcoded Dark Theme Colors ---
                    sx = {{
                        backgroundColor: '#fffd02', // Hardcoded YELLOW
                        color: '#191919',       // Hardcoded DARK TEXT
                        minWidth: '100px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase', // Match target style "SAVE"
                        '&:hover': {
                            backgroundColor: '#e6e400', // Darker yellow
                        },
                        '&:disabled': {
                            backgroundColor: '#555', // Dark disabled background
                            color: '#888'           // Dark disabled text
                        }
                    }}
                    // --- END UPDATE ---
                >
                    {/* Update CircularProgress color to match text */}
                    {isSaving ? <CircularProgress size={24} sx={{color: '#191919'}}/> : 'Save'}
                </Button>
            
            
            
            {/* light  */}
            {/* <Button // Using MUI Button
                variant="contained"
                className="save-button-light" // Keep class if specific CSS needed
                onClick={handleSaveChanges} // Trigger save function
                // Disable if saving OR if no change has been marked
                disabled={isSaving || !imageChanged}
                sx = {{ // MUI styles for purple button
                    backgroundColor: '#6f42c1',
                    color: 'white',
                    minWidth: '100px', // Ensure decent button width
                    '&:hover': { backgroundColor: '#5a349b' },
                    '&:disabled': { backgroundColor: '#cdc1e0', color: '#6c757d'}
                }}
            >
                {isSaving ? <CircularProgress size={24} sx={{color: 'white'}}/> : 'Save Changes'}
            </Button> */}
    </div>
</div> 



</div>

);
};

export default EditPhoto;