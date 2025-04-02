// src/components/UserProfile/EditPhoto.jsx
import React, { useState, useRef } from 'react';
// Import both API functions
import { updateProfilePicture, updateAccount } from '../../../services/api';
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import UploadIcon from '@mui/icons-material/Upload';
import PersonIcon from '@mui/icons-material/Person';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'; // Import Delete icon
import './EditPhoto.css';

const DEFAULT_PROFILE_PIC = '/images/profiles/user-default.png';

const EditPhoto = ({ currentImageUrl, onUpdateSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // For upload
  const [isDeleting, setIsDeleting] = useState(false); // For delete
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    // ... (keep existing file change logic, including validation) ...
     const file = event.target.files[0];
     setError('');
     setSuccess('');
     if (file) {
       if (!file.type.startsWith('image/')) {
           setError('Please select an image file (e.g., JPG, PNG, GIF).');
           setSelectedFile(null); setPreviewUrl(null); return;
       }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            setError('File size cannot exceed 5MB.');
            setSelectedFile(null); setPreviewUrl(null); return;
        }
       setSelectedFile(file);
       setPreviewUrl(URL.createObjectURL(file));
     } else {
        setSelectedFile(null); setPreviewUrl(null);
     }
  };

  const triggerFileChoose = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    // ... (keep existing upload logic) ...
     if (!selectedFile) { setError('Please select an image file first.'); return; }
     setIsLoading(true); setError(''); setSuccess('');
     const formData = new FormData();
     formData.append('profile_picture', selectedFile); // Key check!
     try {
       const response = await updateProfilePicture(formData);
       setSuccess('Profile picture updated successfully!');
       setSelectedFile(null); setPreviewUrl(null);
       const newImageUrl = response.data.profile_picture || response.data.profile_image;
       if (onUpdateSuccess && newImageUrl) { onUpdateSuccess(newImageUrl); }
     } catch (err) {
        console.error("Photo upload error:", err.response?.data || err.message);
        const detailError = err.response?.data?.detail;
        const fieldError = err.response?.data?.profile_picture?.[0] || err.response?.data?.profile_image?.[0];
        setError(fieldError || detailError || 'Failed to upload photo.');
     } finally { setIsLoading(false); }
  };

  // --- NEW: Delete Image Handler ---
  const handleDeleteImage = async () => {
      if (!currentImageUrl || currentImageUrl === DEFAULT_PROFILE_PIC) {
          setError("No custom profile picture to remove.");
          return;
      }

      if (!window.confirm("Are you sure you want to remove your profile picture?")) {
          return;
      }

      setIsDeleting(true);
      setError('');
      setSuccess('');

      try {
          // Send null for the picture field using the standard updateAccount (JSON)
          // Ensure the key matches what the backend PUT expects for clearing
          await updateAccount({ profile_picture: null });
          setSuccess("Profile picture removed successfully.");
          setSelectedFile(null); // Clear any selection
          setPreviewUrl(null);   // Clear preview
          if (onUpdateSuccess) {
              onUpdateSuccess(null); // Update parent state to remove image
          }
      } catch (err) {
          console.error("Delete photo error:", err.response?.data || err.message);
          setError(err.response?.data?.detail || 'Failed to remove profile picture.');
      } finally {
          setIsDeleting(false);
      }
  };

   const imageToDisplay = previewUrl || currentImageUrl;
   const hasCustomImage = currentImageUrl && currentImageUrl !== DEFAULT_PROFILE_PIC;


  return (
    <div className="edit-photo-container section-container">
      {/* Title Section */}
      <div className='photo-title-section'>
        <h2><PhotoCameraIcon /> Photo</h2>
        <p>Add a nice photo of yourself for your profile.</p>
      </div>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      {/* --- Image Preview Area --- */}
      <div className="photo-preview-area">
          <h4>Image preview</h4>
          <div className="image-placeholder">
             {imageToDisplay && imageToDisplay !== DEFAULT_PROFILE_PIC ? ( // Only show img if not default
                <img
                    key={imageToDisplay}
                    src={imageToDisplay}
                    alt="Profile Preview"
                    className="profile-image-preview"
                />
             ) : (
                 <PersonIcon className="placeholder-icon" /> // Show placeholder icon
             )}
          </div>
            {/* --- NEW: Delete Button --- */}
            {hasCustomImage && ( // Show delete button only if there's a non-default image
                <button
                    className="delete-photo-button"
                    onClick={handleDeleteImage}
                    disabled={isDeleting || isLoading} // Disable if deleting or uploading
                    title="Remove profile picture"
                >
                   {isDeleting ? <span className="spinner small red"></span> : <DeleteForeverIcon fontSize="small"/>}
                   {isDeleting ? 'Removing...' : 'Remove Photo'}
                </button>
           )}
      </div>


      {/* --- Upload Control Section --- */}
      <div className="photo-upload-control">
          <h4>Add / Change Image</h4>
          <input /* Hidden file input (same as before) */
              type="file" accept="image/png, image/jpeg, image/gif" onChange={handleFileChange}
              ref={fileInputRef} style={{ display: 'none' }} disabled={isLoading || isDeleting}
          />
          <div className="upload-input-row">
              <span
                  className="file-name-display"
                  onClick={triggerFileChoose}
                  title="Click to choose an image"
              >
                  {selectedFile ? selectedFile.name : "No File Selected"}
              </span>
              <button
                  className="upload-button"
                  onClick={handleUpload}
                  disabled={!selectedFile || isLoading || isDeleting}
                  title={selectedFile ? "Upload selected image" : "Select an image first"}
              >
                  <UploadIcon fontSize="small"/> {isLoading ? 'UPLOADING...' : 'UPLOAD'}
              </button>
          </div>
      </div>
    </div>
  );
};

export default EditPhoto;