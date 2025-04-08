// src/components/posts/CreatePost.jsx
// FINAL VERSION: Tailwind CSS Dark Theme + Cloudinary Widget

import React, { useState, useEffect, useRef } from "react";
// Import the API function that sends JSON
import { createPost } from "../../services/api"; // Adjust path
import { PhotoIcon, XCircleIcon, PaperAirplaneIcon } from '@heroicons/react/24/solid'; // Using solid icons
import { useUser } from '../../context/UserContext';


// Adjust path relative to /public folder
const DEFAULT_AVATAR = '../../src/assets/user-default.webp';

// --- CLOUDINARY CONFIG (Use Environment Variables!) ---
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dsaznefnt"; // Use your cloud name
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "ITIHub_profile_pics"; // Create/Use an UNSIGNED preset
// --- End Cloudinary Config ---

const CreatePost = ({ onPostCreated }) => {
    const { currentUser } = useUser();
    const [postText, setPostText] = useState("");
    // State holds array of { url: '...', resource_type: '...' } from widget
    const [attachments, setAttachments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const postWidgetRef = useRef(null); // Ref for widget


    // --- Initialize Widget ---
    useEffect(() => {
        if (!window.cloudinary) {
            console.error("Cloudinary script not loaded");
            setError("Attachment upload service unavailable.");
            return; // Exit if script not loaded
        }

        // Destroy previous widget instance if exists (prevents memory leaks on re-renders)
        if (postWidgetRef.current) {
            postWidgetRef.current.destroy();
        }

        // Create the widget instance
        postWidgetRef.current = window.cloudinary.createUploadWidget({
            cloudName: CLOUDINARY_CLOUD_NAME,
            uploadPreset: CLOUDINARY_UPLOAD_PRESET,
            folder: 'post_attachments', // Optional Cloudinary folder
            sources: ['local', 'url'], // Allowed sources
            multiple: true, // Allow multiple uploads
            maxFiles: 5, // Example limit
            resourceType: 'auto', // Detect image/video/raw
            theme: 'minimal', // Use minimal theme if preferred
            styles: { /* Optional: Custom styling object for widget */ }
        }, (widgetError, result) => {
            // Widget Callback Handler
            if (widgetError) {
                console.error('Cloudinary Widget Error:', widgetError);
                setError("Attachment upload failed. Please try again.");
                // Close widget on error? widget.close();
                return; // Stop processing on error
            }
            if (result && result.event === "success") {
                console.log('Post Attachment Success:', result.info);
                setError(''); // Clear previous errors
                // Add successful upload details to state
                setAttachments(prev => [...prev, {
                    url: result.info.secure_url, // Use secure_url
                    resource_type: result.info.resource_type // 'image', 'video', 'raw'
                }]);
            } else if (result && result.event === 'queues-end') {
                console.log('Upload queue finished.');
                // Optionally close widget automatically after queue finishes
                // postWidgetRef.current.close();
            }
        });
        // Cleanup function to destroy widget on component unmount
        // return () => {
        //     if (postWidgetRef.current) {
        //         postWidgetRef.current.destroy();
        //     }
        // }; // This cleanup causes issues if widget needs to persist across renders? Test carefully.
    }, []); // Run only once on mount

    const handleTextChange = (e) => setPostText(e.target.value);

    // --- Open Widget ---
    const openPostAttachmentWidget = () => {
        const maxFiles = 5; // Sync with widget config
        if (attachments.length >= maxFiles) {
            setError(`Maximum ${maxFiles} attachments reached.`); return;
        }
        if (postWidgetRef.current) {
            setError(''); // Clear errors
            postWidgetRef.current.open();
        } else {
            setError("Attachment upload service is not ready. Please refresh.");
        }
    };

    // --- Remove Attachment Preview ---
    const removeAttachment = (indexToRemove) => {
        // For Widget approach, we just remove the URL/object from state
        setAttachments(prev => prev.filter((_, index) => index !== indexToRemove));
        setError(''); // Clear error when user manually removes
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
            // Send array of attachment data objects - backend expects 'attachments_input' key
            attachments_input: attachments // Send array like [{url: '...', resource_type: '...'}, ...]
        };
        console.log("Submitting Payload:", payload); // DEBUG

        try {
            // Use API function that sends JSON
            const response = await createPost(payload);
            // Reset state on success
            setPostText(""); setAttachments([]); setError('');
            if (onPostCreated) { onPostCreated(response.data); } // Update parent list
        } catch (error) {
            console.error("Error creating post:", error.response?.data || error);
            setError(`Failed to create post: ${error.response?.data?.detail || 'Server error'}`);
        } finally { setLoading(false); }
    };

    return (
        <div className="create-post-container bg-gray-800 p-4 rounded-lg border border-gray-700 mb-6 shadow-md">
            <form onSubmit={handleSubmit}>
                {/* Input Area */}
                <div className="flex items-start space-x-3">
                <img 
                    src={currentUser?.profile_picture} 
                    alt={currentUser?.username} 
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-gray-600" 
                    onError={(e) => { if(e.target.src !== DEFAULT_AVATAR) 
                    e.target.src = DEFAULT_AVATAR; }}
                />
                
                <textarea
                    value={postText}
                    onChange={handleTextChange}
                    placeholder="What's happening?"
                    rows="3"
                    className="flex-grow block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm px-3 py-2 text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 resize-none transition duration-150"
                    disabled={loading}
                />
                </div>

                {/* Attachment Previews */}
                {attachments.length > 0 && (
                <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {attachments.map((att, index) => (
                        <div key={index} className="relative aspect-square group bg-black rounded border border-gray-600">
                            {att.resource_type === 'image' ? (
                                <img src={att.url} alt={`preview ${index}`} className="w-full h-full object-cover rounded"/>
                            ) : att.resource_type === 'video' ? (
                                    <video src={att.url} className="w-full h-full object-cover rounded" controls={false} />
                            ) : <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">File</div> }
                            {/* Remove Button Overlay */}
                            <button
                                type="button"
                                onClick={() => removeAttachment(index)}
                                className="absolute top-1 right-1 p-0.5 bg-black bg-opacity-60 rounded-full text-white opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                                aria-label="Remove attachment"
                                disabled={loading}
                            > <XCircleIcon className="w-5 h-5"/> </button>
                        </div>
                        ))}
                    </div>
                )}

                {/* Action Bar */}
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-700">
                {/* Widget Trigger Button */}
                    <button type="button" onClick={openPostAttachmentWidget} disabled={loading || attachments.length >= 5} className="inline-flex items-center p-2 rounded-full text-gray-400 hover:text-yellow-400 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors duration-150" title={attachments.length >= 5 ? "Maximum attachments reached" : "Add photo/video"}>
                    <PhotoIcon className="w-6 h-6" />
                </button>
                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="inline-flex items-center px-5 py-2 border border-transparent text-sm font-bold rounded-md shadow-sm text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-yellow-400 disabled:opacity-50 transition duration-150"
                        disabled={loading || (!postText.trim() && attachments.length === 0)}
                    >
                        {loading ? ( <><svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle><path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor" className="opacity-75"></path></svg>Posting...</> ) : (<> <PaperAirplaneIcon className='w-5 h-5 mr-1 -ml-1 transform rotate-45'/> Post </>)}
                    </button>
                </div>
                {/* Display Create Post Error */}
                {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
            </form>
        </div>
    );
}

export default CreatePost;