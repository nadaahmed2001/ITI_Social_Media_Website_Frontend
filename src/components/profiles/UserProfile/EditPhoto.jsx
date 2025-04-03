import React, { useState, useRef } from 'react';
// Import the API function that sends FormData to the /users/account/ PUT endpoint
// We'll use this for both uploading and clearing the image.
// If you had separate functions (updateAccountData vs updateAccount), ensure you use the one sending FormData.
// Let's assume 'updateProfilePicture' is the one sending FormData based on previous context.
import { updateProfilePicture } from '../../../services/api'; // Adjust path if needed
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import UploadIcon from '@mui/icons-material/Upload';
import PersonIcon from '@mui/icons-material/Person'; // Placeholder icon
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'; // Import Delete icon
import './EditPhoto.css'; // Your CSS file

// Define default avatar path (ADJUST THIS PATH TO YOUR PROJECT STRUCTURE)
const DEFAULT_PROFILE_PIC = '../../src/assets/images/user-default.webp';

const EditPhoto = ({ currentImageUrl, onUpdateSuccess }) => {
// --- State ---
const [selectedFile, setSelectedFile] = useState(null); // Holds the selected File object
const [previewUrl, setPreviewUrl] = useState(null); // Holds URL for local preview
const [isUploading, setIsUploading] = useState(false); // Loading state specifically for upload action
const [isDeleting, setIsDeleting] = useState(false); // Loading state specifically for delete action
const [error, setError] = useState(''); // Holds error messages
const [success, setSuccess] = useState(''); // Holds success messages
const fileInputRef = useRef(null); // Ref to access hidden file input

// --- Handlers ---

// Handles file selection from the input
const handleFileChange = (event) => {
const file = event.target.files[0];
// Reset messages on new selection attempt
setError('');
setSuccess('');
if (file) {
    // Basic validation (optional but recommended)
    if (!file.type.startsWith('image/')) {
        setError('Please select an image file (e.g., JPG, PNG, GIF).');
        setSelectedFile(null); setPreviewUrl(null); return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit example
        setError('File size cannot exceed 5MB.');
        setSelectedFile(null); setPreviewUrl(null); return;
    }
    // Update state if file is valid
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file)); // Show local preview
} else {
    // Clear state if user cancels file selection
    setSelectedFile(null);
    setPreviewUrl(null);
}
};

// Programmatically clicks the hidden file input
const triggerFileChoose = () => {
// Clear previous errors/success when user intends to choose a new file
setError('');
setSuccess('');
fileInputRef.current?.click();
};

// Handles the actual upload API call
const handleUpload = async () => {
if (!selectedFile) {
    setError('Please select an image file first.');
    return;
}
setIsUploading(true); // Set uploading state
setError('');
setSuccess('');
const formData = new FormData();

// --- CORRECTED: Use 'profile_image' key matching Profile model field ---
formData.append('profile_image', selectedFile);
// --- End Correction ---

try {
    // Use the API function sending FormData to PUT /users/account/
    const response = await updateProfilePicture(formData);
    console.log("Backend PUT Response Data:", JSON.stringify(response.data, null, 2));
    setSuccess('Profile picture updated successfully!');
    setSelectedFile(null); // Clear selection state
    setPreviewUrl(null); // Clear local preview

    // Pass the updated image URL (which should be a Cloudinary URL now) back to parent
    // Prioritize 'profile_image' based on the model change
    const newImageUrl = response.data.profile_image || response.data.profile_picture; // Check both just in case
    if (onUpdateSuccess) {
        // If backend returns null/empty after successful save, pass that along
        onUpdateSuccess(newImageUrl || null);
    }
} catch (err) {
    console.error("Photo upload error:", err.response?.data || err.message);
    const errors = err.response?.data;
    let errorMessage = 'Failed to upload photo.';
    if (typeof errors === 'object' && errors !== null) {
        // Try to extract specific errors
        errorMessage = errors.profile_image?.[0] || errors.detail || JSON.stringify(errors);
    } else if (typeof errors === 'string') {
        errorMessage = errors;
    }
    setError(errorMessage);
} finally {
    setIsUploading(false); // Clear uploading state
}
};

// Handles deleting the existing profile image
const handleDeleteImage = async () => {
    // Check the prop passed from the parent for the current image URL
    if (!currentImageUrl || currentImageUrl === DEFAULT_PROFILE_PIC) {
        setError("No custom profile picture to remove.");
        return;
    }
    if (!window.confirm("Are you sure you want to remove your profile picture?")) {
        return;
    }
    setIsDeleting(true); // Set deleting state
    setError('');
    setSuccess('');

    // --- CORRECTED: Send FormData with empty string to clear ---
    const formData = new FormData();
    // Use the correct field name 'profile_image' and send an empty string
    // The backend's partial update + ImageField should interpret this as clearing
    formData.append('profile_image', '');
    // --- End Correction ---

    try {
        // Use the same API function that sends FormData
        await updateProfilePicture(formData); // It sends PUT to /users/account/
        setSuccess("Profile picture removed successfully.");
        setSelectedFile(null); // Clear any file selection
        setPreviewUrl(null);   // Clear preview
        if (onUpdateSuccess) {
            onUpdateSuccess(null); // Update parent state (image is now null)
        }
    } catch (err) {
        console.error("Delete photo error:", err.response?.data || err.message);
        const errors = err.response?.data;
        setError(errors?.detail || 'Failed to remove profile picture.');
    } finally {
        setIsDeleting(false); // Clear deleting state
    }
};

// --- Render Variables ---
// Determine the image source: local preview > current image from props (Cloudinary URL)
const imageToDisplay = previewUrl || currentImageUrl;
// Check if there is a current image stored (and it's not the default placeholder)
const hasCustomImage = currentImageUrl && currentImageUrl !== DEFAULT_PROFILE_PIC;
// Combine loading states for disabling elements
const isProcessing = isUploading || isDeleting;

// --- JSX ---
return (
<div className="edit-photo-container section-container">
    {/* Title Section */}
    <div className='photo-title-section'>
    <h2><PhotoCameraIcon /> Photo</h2>
    <p>Add a nice photo of yourself for your profile.</p>
    </div>

    {/* Display Error/Success Messages */}
    {error && <p className="error-message">{error}</p>}
    {success && <p className="success-message">{success}</p>}

    {/* Main Content Area */}
    <div className="photo-edit-area">

        {/* Image Preview Section */}
        <div className="photo-preview-section">
            <h4>Image preview</h4>
            <div className="image-placeholder">
                {/* Show local preview or current image, otherwise placeholder icon */}
                {imageToDisplay && imageToDisplay !== DEFAULT_PROFILE_PIC ? (
                <img
                    // Using previewUrl or currentImageUrl helps refresh if URL string doesn't change but content might
                    key={previewUrl || currentImageUrl}
                    src={imageToDisplay}
                    alt="Profile Preview"
                    className="profile-image-preview"
                    // Add onError handler for potentially broken Cloudinary URLs
                    onError={(e) => {
                        console.warn(`Error loading image: ${e.target.src}. Falling back to default.`);
                        // Avoid infinite loop if default image also fails
                        if (e.target.src !== DEFAULT_PROFILE_PIC) {
                            e.target.src = DEFAULT_PROFILE_PIC;
                        }
                        }}
                />
                ) : (
                    <PersonIcon className="placeholder-icon" /> // Placeholder
                )}
            </div>
            {/* Delete Button (only show if a custom image exists and not currently previewing a new one) */}
            {hasCustomImage && !previewUrl && (
                <button
                    className="delete-photo-button"
                    onClick={handleDeleteImage}
                    disabled={isProcessing} // Disable if uploading or deleting
                    title="Remove profile picture"
                >
                    {isDeleting ? <span className="spinner small red"></span> : <DeleteForeverIcon fontSize="small"/>}
                    {isDeleting ? 'Removing...' : 'Remove Photo'}
                </button>
            )}
        </div>

        {/* Upload Control Section */}
        <div className="photo-upload-control">
            <h4>Add / Change Image</h4>
            {/* Hidden file input */}
            <input
                type="file"
                accept="image/png, image/jpeg, image/gif" // Specific image types
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{ display: 'none' }}
                disabled={isProcessing} // Disable if uploading or deleting
            />
            {/* Row for file name display and upload button */}
            <div className="upload-input-row">
                <span
                    className="file-name-display"
                    onClick={triggerFileChoose} // Click text area to choose file
                    title="Click to choose an image"
                    aria-disabled={isProcessing} // Accessibility hint
                >
                    {selectedFile ? selectedFile.name : "No File Selected"}
                </span>
                <button
                    className="upload-button"
                    onClick={handleUpload} // This button triggers the upload
                    disabled={!selectedFile || isProcessing} // Disable if no file or loading
                    title={selectedFile ? "Upload selected image" : "Select an image first"}
                >
                    <UploadIcon fontSize="small"/> {isUploading ? 'UPLOADING...' : 'UPLOAD'}
                </button>
            </div>
        </div>

    </div>
</div>
);
};

export default EditPhoto;