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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
            <div className="bg-[#292928] rounded-lg shadow-xl p-6 w-full max-w-md relative border border-[#7a2226]">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-100 p-1 rounded-full bg-gray-700 hover:bg-gray-600"
                    aria-label="Close reactions modal"
                >
                    <CloseIcon fontSize="small" />
                </button>

                <h4 className="text-lg font-semibold mb-4 !text-[#7a2226] border-b border-[#7a2226] pb-2">Reactions</h4>

                {/* Content Area */}
                <div className="max-h-80 overflow-y-auto pr-2"> {/* Scrollable content */}
                    {isLoading ? (
                        <div className="text-center text-gray-400">Loading reactions...</div>
                    ) : !reactions || reactions.length === 0 ? (
                        <div className="text-center text-gray-400">No reactions yet.</div>
                    ) : (
                        <ul className="space-y-3">
                            {/* Map over the reactions passed as props */}
                            {reactions.map((reaction) => {
                                // Get the style based on reaction type
                                const { colorClass, IconComponent } = getReactionStyle(reaction.reaction_type);

                                return (
                                    <li key={reaction.id || reaction.user_id} className="flex items-center justify-between bg-[#181819] p-2 rounded">
                                        <div className="flex items-center space-x-3">
                                            <img
                                                src={reaction.user_profile_picture || DEFAULT_USER_AVATAR} // Provide a default avatar path
                                                alt={reaction.user_username || 'User'}
                                                className="w-8 h-8 rounded-full object-cover border border-gray-500"
                                                onError={(e) => { e.target.src = DEFAULT_USER_AVATAR; }} // Handle broken image links
                                            />
                                            <span className="text-lg font-semibold !text-black">
                                                {reaction.user_username || 'Unknown User'}
                                            </span>
                                        </div>
                                        <IconComponent className={`w-5 h-5 ${colorClass}`} />
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ReactionsCommentModal;