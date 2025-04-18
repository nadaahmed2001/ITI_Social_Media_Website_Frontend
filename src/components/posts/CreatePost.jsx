import React, { useState, useEffect, useRef, useContext } from 'react';
import { createPost } from '../../services/api';
import { ImageSharp as ImageSharpIcon, Close as CloseIcon } from '@mui/icons-material';
import AuthContext from '../../contexts/AuthContext'; 
import {Link} from "react-router-dom"

const DEFAULT_USER_AVATAR = '../../src/assets/images/user-default.webp';
const CLOUDINARY_CLOUD_NAME = "dsaznefnt";
const CLOUDINARY_UPLOAD_PRESET = "ITIHub_profile_pics";
const MAX_POST_LENGTH = 3000;
const TRUNCATE_LENGTH = 500;


export default function CreatePost({ onPostCreated }) {
  const [postText, setPostText] = useState('');
  const [attachmentUrls, setAttachmentUrls] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const widgetRef = useRef(null);


  const { user, loading: authLoading } = useContext(AuthContext); // Destructure 'user'
  const avatarSrc = user?.profile_picture || DEFAULT_USER_AVATAR;
  
  // Initialize Cloudinary widget
  useEffect(() => {
    const handleCloudinaryUpload = (error, result) => {
      if (!error && result && result.event === "success") {
        setAttachmentUrls(prev => [...prev, result.info.secure_url]);
      }
      setIsUploading(false);
    };

    if (window.cloudinary) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: CLOUDINARY_CLOUD_NAME,
          uploadPreset: CLOUDINARY_UPLOAD_PRESET,
          sources: ['local', 'url', 'camera'],
          multiple: true,
          resourceType: 'auto',
          clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'mkv', 'webm'],
          maxFileSize: 15000000
        },
        handleCloudinaryUpload
      );
    }

    return () => {
      if (widgetRef.current) {
        widgetRef.current.destroy();
      }
    };
  }, []);

  const handleOpenUploadWidget = () => {
    setIsUploading(true);
    widgetRef.current?.open();
  };

  const handleRemoveAttachment = (indexToRemove) => {
    setAttachmentUrls(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleTextChange = (e) => {
    const text = e.target.value;
    if (text.length <= MAX_POST_LENGTH) {
      setPostText(text);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postText.trim() && attachmentUrls.length === 0) {
      alert("Post content or at least one attachment is required.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('body', postText);
      attachmentUrls.forEach(url => formData.append('attachment_urls', url));

      const response = await createPost(formData);
      if (response.status === 201) {
        setPostText('');
        setAttachmentUrls([]);
        onPostCreated?.(response.data);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const getCharCounterClass = () => {
    const ratio = postText.length / MAX_POST_LENGTH;
    if (ratio > 0.9) return 'text-red-500';
    if (ratio > 0.75) return 'text-yellow-500';
    return 'text-gray-500';
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 mb-4 mt-4 border-2 border-[#7a2226]/20 transition-all duration-300 hover:shadow-xl hover:border-[#7a2226]/30">
      <div className="relative ">
      <div className="flex items-center space-x-3">
          <Link to={`/profiles/${user?.id}`} className="flex-shrink-0 block hover:opacity-80 transition-opacity mt-1 group"> 
            <img 
                  src={avatarSrc} 
                  alt= "you" 
                  title= {user?.username} 
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#7a2226]/20 group-hover:border-[#7a2226]/40 transition-all shadow-sm"
                  onError={(e) => { 
                    // Prevent infinite loop if default avatar also fails
                    if (e.target.src !== DEFAULT_USER_AVATAR) {
                      e.target.src = DEFAULT_USER_AVATAR; 
                    }}}
              />
          </Link>
          <textarea
            value={postText}
            onChange={handleTextChange}
            placeholder={`What's on your mind? (${MAX_POST_LENGTH} characters max)`}
            className="placeholder:text-[#7a2226]/60 text-[#2d3748] w-full px-3 py-2 border-2 border-[#7a2226]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a2226]/40 focus:border-transparent resize-none bg-white/80 transition-all duration-300 hover:border-[#7a2226]/30"
            rows={2}
            maxLength={MAX_POST_LENGTH}
          />
      </div>
          <div className={`absolute bottom-3 right-3 text-xs text-[#7a2226]/60 font-medium transition-opacity duration-300 ${postText.length >= MAX_POST_LENGTH ? 'text-red-500' : ''}`}>
            {postText.length}/{MAX_POST_LENGTH}
          </div>
      </div>

      {/* Attachments preview */}
      <div className="mt-3 space-y-2">
        {attachmentUrls.map((url, index) => (
          <div key={index} className="relative group">
            {url.match(/\.(jpeg|jpg|gif|png)$/) ? (
              
              <img 
                src={url} 
                alt={`Attachment ${index}`}
                className="max-w-full rounded-lg shadow-sm border border-[#7a2226]/10 transition-transform duration-300 group-hover:scale-[1.01]"
              />
            ) : (
              <video controls className="max-w-full rounded-lg shadow-sm border border-[#7a2226]/10 transition-transform duration-300 group-hover:scale-[1.01]">
                <source src={url} type="video/mp4" />
              </video>
            )}
            <button
              type="button"
              onClick={() => handleRemoveAttachment(index)}
               className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105"
            >
              <CloseIcon className="w-5 h-5 text-[#7a2226] hover:text-[#a53d3d] transition-colors" />
            </button>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between mt-4">
        <button
          type="button"
          onClick={handleOpenUploadWidget}
          disabled={isUploading}
          className="flex items-center text-sm text-[#7a2226]/80 hover:text-[#7a2226] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ImageSharpIcon className="w-6 h-6 mr-2 text-[#7a2226] hover:text-[#a53d3d] transition-colors"  />
          {isUploading ? "Uploading..." : `${attachmentUrls.length > 0 ? 's' : ''}`}
        </button>
        <button
          type="submit"
          disabled={(!postText.trim() && attachmentUrls.length === 0) || isUploading}
          className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
            (!postText.trim() && attachmentUrls.length === 0) || isUploading
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#7a2226] to-[#a53d3d] text-white hover:from-[#6a1c1f] hover:to-[#8b2b2b] hover:shadow-md transform hover:-translate-y-0.5'
          }`}
        >
          Post
        </button>
      </div>
    </form>
  );
}