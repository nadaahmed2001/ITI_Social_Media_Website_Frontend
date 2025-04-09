// import React, { useState } from "react";
// import ImageSharpIcon from "@mui/icons-material/ImageSharp";
// import { createPost } from "../services/api";
// import "./Posts.css";

// export default function CreatePost({ onPostCreated }) {
//   const [postText, setPostText] = useState("");
//   const [image, setImage] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleTextChange = (e) => setPostText(e.target.value);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];

//     if (file) {
//       setImage(file);
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!postText.trim() && !image) {
//       alert("Post content or an image is required.");
//       return;
//     }

//     setLoading(true);
//     const formData = new FormData();
//     formData.append("body", postText);
//     if (image) formData.append("attachments", image);

//     try {
//       const response = await createPost(formData);
//       if (response.status === 201) {
//         alert("Post created successfully!");
//         setPostText("");
//         setImage(null);
//         setPreview(null);
//         if (onPostCreated) onPostCreated(response.data); // Update parent state
//       }
//     } catch (error) {
//       console.error("Error creating post:", error);
//       alert("Failed to create post.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form className="create-post-container" onSubmit={handleSubmit}>
//       <div className="create-post">
//         <img src="/default-avatar.png" alt="User" className="user-avatar" />
//         <input
//           value={postText}
//           onChange={handleTextChange}
//           type="text"
//           placeholder="Tell your friends about your thoughts..."
//         />
//         <label htmlFor="image-upload">
//           <ImageSharpIcon className="ImageSharpIcon" />
//         </label>
//         <input
//           type="file"
//           id="image-upload"
//           accept="image/*"
//           style={{ display: "none" }}
//           onChange={handleImageChange}
//         />
//         {preview && <img src={preview} alt="Preview" className="preview-image" />}
//         <button type="submit" className="post-submit" disabled={loading}>
//           {loading ? "Posting..." : "Post"}
//         </button>
//       </div>
//     </form>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import { createPost } from "../../services/api"; // Ensure this sends JSON now
import { useUser } from '../../context/UserContext'; // Adjust path
// Use Heroicons (Outline for consistency or Solid)
import { PhotoIcon, XCircleIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

// Adjust path relative to /public folder
const DEFAULT_AVATAR = '/images/profiles/user-default.png'; // Or your actual path

// --- CLOUDINARY CONFIG (Use Environment Variables!) ---
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "YOUR_CLOUD_NAME"; // Replace!
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "YOUR_POSTS_UNSIGNED_PRESET"; // Replace!
// --- End Cloudinary Config ---

const CreatePost = ({ onPostCreated }) => {
    const { currentUser } = useUser(); // Get logged-in user info
    const [postText, setPostText] = useState("");
    // State holds array of { url: '...', resource_type: '...' } from widget
    const [attachments, setAttachments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const postWidgetRef = useRef(null); // Ref for widget

    // --- Initialize Cloudinary Widget ---
    useEffect(() => {
        if (!window.cloudinary) {
            console.error("Cloudinary script not loaded");
            setError("Attachment service unavailable.");
            return;
        }
        // Destroy previous instance if exists
        if (postWidgetRef.current) { postWidgetRef.current.destroy(); }

        postWidgetRef.current = window.cloudinary.createUploadWidget({
            cloudName: CLOUDINARY_CLOUD_NAME,
            uploadPreset: CLOUDINARY_UPLOAD_PRESET,
            folder: 'post_attachments',
            sources: ['local', 'url', 'camera'], // Allow camera uploads
            multiple: true, maxFiles: 5, // Example limits
            resourceType: 'auto', // Detect image/video
            theme: 'minimal', // Or 'default'
            // Add styles matching your theme if needed
            styles: {
                palette: { /* ... your theme colors ... */ },
                fonts: { default: null, "'Open Sans', sans-serif": { url: "https://fonts.googleapis.com/css?family=Open+Sans", active: true } }
            }
        }, (widgetError, result) => {
            if (widgetError) {
                console.error('Cloudinary Widget Error:', widgetError);
                setError("Attachment upload failed. Please try again.");
                return;
            }
            if (result && result.event === "success") {
                setError('');
                // Add successful upload details to state
                setAttachments(prev => [...prev, {
                    url: result.info.secure_url, // Use secure_url
                    resource_type: result.info.resource_type // 'image', 'video', 'raw'
                }]);
            } else if (result && result.event === 'queues-end') {
                // Optionally close widget automatically
                // postWidgetRef.current.close();
            }
        });
        // Cleanup on unmount (optional, test carefully)
        // return () => { if (postWidgetRef.current) { postWidgetRef.current.destroy(); } };
    }, []); // Run only once

    const handleTextChange = (e) => { setPostText(e.target.value); setError(''); };

    // --- Open Cloudinary Widget ---
    const openPostAttachmentWidget = () => {
        const maxFiles = 5; // Sync with widget config
        if (attachments.length >= maxFiles) {
            setError(`Maximum ${maxFiles} attachments reached.`); return;
        }
        if (postWidgetRef.current) { setError(''); postWidgetRef.current.open(); }
        else { setError("Attachment upload service is not ready. Please refresh."); }
    };

    // --- Remove Attachment Preview ---
    const removeAttachment = (indexToRemove) => {
        setAttachments(prev => prev.filter((_, index) => index !== indexToRemove));
        setError(''); // Clear max attachment error if user removes one
    };

    // --- Handle Submit (Sends JSON with URLs) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!postText.trim() && attachments.length === 0) {
            setError("Write something or add an attachment to post."); return;
        }
        setLoading(true); setError('');

        // --- Create JSON Payload ---
        const payload = {
            body: postText.trim(),
            // Send array of attachment URLs - ensure backend expects 'attachment_urls'
            attachment_urls: attachments.map(att => att.url)
            // OR if backend expects {url, type}:
            // attachments_input: attachments
        };
        console.log("Submitting Payload:", payload); // DEBUG

        try {
            // Use API function that sends JSON
            const response = await createPost(payload);
            setPostText(""); setAttachments([]); setError(''); // Reset state
            if (onPostCreated) { onPostCreated(response.data); } // Update parent list
        } catch (err) {
            console.error("Error creating post:", err.response?.data || err);
            setError(`Failed to create post: ${err.response?.data?.detail || 'Server error'}`);
        } finally { setLoading(false); }
    };

    // Determine avatar source
    const avatarSrc = currentUser?.profile_picture || DEFAULT_AVATAR;
    const canSubmit = !loading && (postText.trim() || attachments.length > 0);
    const maxAttachmentsReached = attachments.length >= 5;

    return (
        // Use neutral background based on your theme (e.g., neutral-50 or white)
        <div className="create-post-container bg-white p-4 rounded-lg border border-neutral-200 mb-6 shadow-sm">
             <form onSubmit={handleSubmit}>
                 {/* Input Area */}
                 <div className="flex items-start space-x-3">
                    <img
                        src={avatarSrc}
                        alt={currentUser?.username || "User"}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-neutral-300"
                        onError={(e) => { if(e.target.src !== DEFAULT_AVATAR) e.target.src = DEFAULT_AVATAR; }}
                    />
                    <textarea
                        value={postText}
                        onChange={handleTextChange}
                        placeholder="What's happening?"
                        rows="3"
                        className="flex-grow block w-full bg-neutral-50 border border-neutral-300 rounded-md shadow-sm px-3 py-2 text-sm text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 resize-none transition duration-150 disabled:opacity-70"
                        disabled={loading}
                    />
                 </div>

                 {/* Attachment Previews */}
                 {attachments.length > 0 && (
                    <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                        {attachments.map((att, index) => (
                            <div key={index} className="relative aspect-square group bg-neutral-900 rounded border border-neutral-300 overflow-hidden">
                                {att.resource_type === 'image' ? (
                                    <img src={att.url} alt={`preview ${index}`} className="w-full h-full object-cover"/>
                                ) : att.resource_type === 'video' ? (
                                    // Basic video preview - consider adding a play icon overlay
                                    <video src={att.url} className="w-full h-full object-cover" controls={false} />
                                ) : (
                                    // Placeholder for other file types
                                    <div className="w-full h-full flex items-center justify-center text-neutral-500 text-xs p-1 break-all">File</div>
                                )}
                                {/* Remove Button Overlay */}
                                <button
                                    type="button"
                                    onClick={() => removeAttachment(index)}
                                    className="absolute top-0.5 right-0.5 p-0.5 bg-black bg-opacity-50 rounded-full text-white opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity disabled:cursor-not-allowed"
                                    aria-label="Remove attachment"
                                    disabled={loading}
                                >
                                    <XCircleIcon className="w-5 h-5"/>
                                </button>
                            </div>
                        ))}
                    </div>
                 )}

                 {/* Action Bar */}
                 <div className="flex justify-between items-center mt-3 pt-3 border-t border-neutral-200">
                     {/* Widget Trigger Button */}
                     <button
                        type="button"
                        onClick={openPostAttachmentWidget}
                        disabled={loading || maxAttachmentsReached}
                        className="inline-flex items-center p-2 rounded-full text-neutral-500 hover:text-primary-600 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors duration-150"
                        title={maxAttachmentsReached ? "Maximum attachments reached" : "Add photo/video"}
                     >
                         <PhotoIcon className="w-6 h-6" />
                     </button>

                     {/* Submit Button */}
                     <button
                         type="submit"
                         className={`inline-flex items-center px-4 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition duration-150 ${canSubmit ? 'bg-primary-600 hover:bg-primary-700' : 'bg-neutral-400 cursor-not-allowed'}`}
                         disabled={!canSubmit}
                     >
                         {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                                    <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor" className="opacity-75"></path>
                                </svg>
                                Posting...
                            </>
                         ) : (
                            <>
                                <PaperAirplaneIcon className='w-5 h-5 mr-1 -ml-1 transform -rotate-45'/> Post
                            </>
                         )}
                     </button>
                 </div>
                 {/* Display Create Post Error */}
                 {error && <p className="text-red-600 text-xs mt-2">{error}</p>}
             </form>
         </div>
    );
}

export default CreatePost;