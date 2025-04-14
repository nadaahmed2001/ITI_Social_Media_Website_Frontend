// src/components/posts/ReactionsModal.jsx
import React from 'react';
import { Close as CloseIcon } from "@mui/icons-material";
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from 'react-router-dom'; // Import Link for usernames

// Import reaction icons (make sure these match names in your reactions array/backend)
import {
    ThumbUpAlt as LikeIcon, 
    Favorite as LoveIcon, 
    Celebration as CelebrateIcon,
    SentimentVerySatisfied as FunnyIcon,
    VolunteerActivism as SupportIcon, // Changed from Support
    TipsAndUpdates as InsightfulIcon 
} from '@mui/icons-material';

// Map reaction types (keys should exactly match reaction_type string from backend)
const reactionIconMap = {
    'Like': <LikeIcon sx={{ fontSize: 28 }} className="text-blue-500"/>,
    'Love': <LoveIcon sx={{ fontSize: 28 }} className="text-red-500"/>,
    'Celebrate': <CelebrateIcon sx={{ fontSize: 28 }} className="text-yellow-500"/>,
    'funny': <FunnyIcon sx={{ fontSize: 28 }} className="text-[#7B2326]"/>,
    'Insightful': <InsightfulIcon sx={{ fontSize: 28 }} className="text-purple-500"/>,
    'Support': <SupportIcon sx={{ fontSize: 28 }} className="text-green-500"/>,
};

const DEFAULT_AVATAR = '../../src/assets/images/user-default.webp'; // Ensure path correct relative to /public

export default function ReactionsModal({ reactions = [], isLoading, onClose }) {

    return (
        // Overlay
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center !bg-[#00000079] bg-opacity-60 p-4 transition-opacity duration-300" 
            aria-labelledby="reactions-modal-title" 
            role="dialog" 
            aria-modal="true" 
            onClick={onClose} // Click outside closes
        >
            {/* Modal Content Box */}
            <div 
                className="py-2 relative bg-white rounded-lg shadow-xl w-full max-w-md mx-auto flex flex-col max-h-[70vh]" // Smaller width, limit height
                onClick={e => e.stopPropagation()} 
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 sticky top-0 bg-white rounded-t-lg z-10">
                    <h3 className="!text-md !font-bold !text-[#7a2226]" id="reactions-modal-title">All Reactions</h3>
                    <button 
                        onClick={onClose} 
                        className="p-1 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        aria-label="Close modal"
                    >
                        <CloseIcon className="w-7 h-7" /> 
                    </button>
                </div>

                {/* Body - Scrollable List */}
                <div className="p-2 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex justify-center py-6">
                            <CircularProgress size={24} />
                        </div>
                    ) : reactions.length > 0 ? (
                        <ul className="space-y-3">
                            {reactions.map((reaction) => (
                                <li key={reaction.id} className="flex items-center justify-between my-2">
                                    {/* User Info (Linked) */}
                                    <Link 
                                        to={`/profiles/${reaction.user_id}`} // Link using the correct user ID
                                        className="flex items-center space-x-2 group"
                                        onClick={onClose} // Close modal when clicking link
                                    >
                                        <img src={reaction.user_profile_picture || DEFAULT_AVATAR} alt={reaction.user_username} title={reaction.user_username} className="w-12 h-12 rounded-full"/>
                                    </Link>
                                    <Link 
                                        to={`/profiles/${reaction.user_id}`} // Link using the correct user ID
                                        className="flex items-center  group !no-underline "
                                        onClick={onClose} // Close modal when clicking link
                                    >
                                        <span className="text-2xl font-medium text-gray-700 group-hover:text-primary-600 ">
                                            {reaction.user_username || 'User'}
                                        </span>
                                    </Link>
                                    
                                    {/* Reaction Icon */}
                                    <span className=" ml-35 mr-5">
                                        {reactionIconMap[reaction.reaction_type] || reaction.reaction_type}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500 text-sm py-6">No reactions yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}