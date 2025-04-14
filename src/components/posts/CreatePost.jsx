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
    <form onSubmit={handleSubmit} className="!bg-[#3e1113] rounded-lg shadow-md p-4 mb-4 border border-gray-200">
      <div className="relative ">
      <div className="flex items-center space-x-3 !bg-[#3e1113]">
          <Link to={`/profiles/${user?.id}`} className="flex-shrink-0 block hover:opacity-80 transition-opacity mt-1 !bg-[#3e1113]"> 
            <img 
                  src={avatarSrc} 
                  alt= "you" 
                  title= {user?.username} 
                  className="w-10 h-10 rounded-full object-cover border border-gray-200 !bg-[#3e1113] "
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
            className="!bg-[#292928] w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            rows={2}
            maxLength={MAX_POST_LENGTH}
          />
      </div>
          <div className={`!bg-[#292928] absolute bottom-2 right-2 text-xs ${getCharCounterClass()}`}>
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
                className="max-w-full rounded-lg"
              />
            ) : (
              <video controls className="max-w-full rounded-lg">
                <source src={url} type="video/mp4" />
              </video>
            )}
            <button
              type="button"
              onClick={() => handleRemoveAttachment(index)}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <CloseIcon className="w-4 h-4 text-red-500" />
            </button>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="!bg-[#3e1113] flex items-center justify-between mt-3">
        <button
          type="button"
          onClick={handleOpenUploadWidget}
          disabled={isUploading}
          className="!bg-[#3e1113] flex items-center text-sm text-gray-400 hover:text-primary-600 disabled:opacity-50"
        >
          <ImageSharpIcon className="!bg-[#7a2226] text-size-lg w-10 h-10 ml-15" />
          {isUploading ? "Uploading..." : `${attachmentUrls.length > 0 ? 's' : ''}`}
        </button>
        <button
          type="submit"
          disabled={(!postText.trim() && attachmentUrls.length === 0) || isUploading}
          className={`!bg-[#191919] px-4 py-1 !rounded-lg text-sm font-medium border border-gray-600  ${
            (!postText.trim() && attachmentUrls.length === 0) || isUploading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed '
              : 'bg-[#191919] text-white hover:bg-[#333333]'
          }`}
        >
          Post
        </button>
      </div>
    </form>
  );
}