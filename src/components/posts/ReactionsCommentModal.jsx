import React from 'react';
import {
    // Import the same reaction icons used elsewhere
    ThumbUpAlt as ThumbUpSolid,
    FavoriteSharp as LoveIcon,
    CelebrationSharp as CelebrateIcon,
    SentimentVerySatisfiedSharp as FunnyIcon,
    VolunteerActivismSharp as SupportIcon,
    TipsAndUpdatesSharp as InsightfulIcon,
    Close as CloseIcon,
    // Add a default icon if needed
    HelpOutline as DefaultIcon // Example default
} from "@mui/icons-material";

const DEFAULT_USER_AVATAR = '../../src/assets/images/user-default.webp';

const getReactionStyle = (reactionType) => {
    switch (reactionType) {
        case "Like":
            // Using yellow consistent with your button's reacted state
            return { colorClass: 'text-blue-500', IconComponent: ThumbUpSolid };
        case "Love":
            return { colorClass: 'text-red-500', IconComponent: LoveIcon };
        case "Celebrate":
            // Example color, adjust as needed
            return { colorClass: 'text-green-500', IconComponent: CelebrateIcon };
        case "funny":
             // Example color, adjust as needed
            return { colorClass: 'text-violet-400', IconComponent: FunnyIcon };
        case "Support":
             // Example color, adjust as needed
            return { colorClass: 'text-blue-200', IconComponent: SupportIcon };
        case "Insightful":
             // Example color, adjust as needed
            return { colorClass: 'text-[#7B2326]', IconComponent: InsightfulIcon };
        default:
            // Default style for unknown types or if reactionType is null/undefined
            return { colorClass: 'text-gray-400', IconComponent: DefaultIcon };
    }
};


function ReactionsCommentModal({ reactions = [], isLoading, onClose }) {

    // Basic Modal Structure (using Tailwind for example)
    // Replace with your actual modal component library if using one (e.g., Material UI Modal)
    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center !bg-[#00000079] bg-opacity-60 p-4 transition-opacity duration-300" 
            aria-labelledby="reactions-comment-modal-title" 
            role="dialog" 
            aria-modal="true" 
            onClick={onClose}
        >
            <div 
                className="py-2 relative bg-white rounded-lg shadow-xl w-full max-w-md mx-auto flex flex-col max-h-[70vh]"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 sticky top-0 bg-white rounded-t-lg z-10">
                    <h3 className="!text-md !font-bold !text-[#7a2226]" id="reactions-comment-modal-title">All Reactions</h3>
                    <button 
                        onClick={onClose} 
                        className="p-1 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        aria-label="Close modal"
                    >
                        <CloseIcon className="w-7 h-7" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-2 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex justify-center py-6 text-gray-500">Loading reactions...</div>
                    ) : reactions.length > 0 ? (
                        <ul className="space-y-3">
                            {reactions.map((reaction) => {
                                const { colorClass, IconComponent } = getReactionStyle(reaction.reaction_type);

                                return (
                                    <li key={reaction.id || reaction.user_id} className="flex items-center justify-between my-2">
                                        <div className="flex items-center space-x-3 group">
                                            <img
                                                src={reaction.user_profile_picture || DEFAULT_USER_AVATAR}
                                                alt={reaction.user_username || 'User'}
                                                title={reaction.user_username}
                                                className="w-12 h-12 rounded-full object-cover border border-gray-300"
                                                onError={(e) => { e.target.src = DEFAULT_USER_AVATAR; }}
                                            />
                                            <span className="text-2xl font-semibold text-gray-700 group-hover:text-primary-600">
                                                {reaction.user_username || 'User'}
                                            </span>
                                        </div>
                                        <IconComponent className={`w-6 h-6 ${colorClass} mr-3`} />
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500 text-sm py-6">No reactions yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ReactionsCommentModal;