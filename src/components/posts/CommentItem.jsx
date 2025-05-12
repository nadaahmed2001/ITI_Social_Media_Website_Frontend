import React, { useState, useEffect, useRef, useContext } from "react";
import AuthContext from '../../contexts/AuthContext';
import { Link } from "react-router-dom";
import TimeAgo from '../TimeAgo';
import ReactionsCommentModal from "./ReactionsCommentModal"; // Keep if needed for showing reactors
import { fetchReactionsForComment } from "../../components/services/api";

import {
    // Reaction Icons (reuse from ShowPost or define consistently)
    ThumbUpOffAlt as ThumbUpOutline,
    ThumbUpAlt as ThumbUpSolid, // Use this for the main button when reacted
    FavoriteSharp as LoveIcon,
    CelebrationSharp as CelebrateIcon,
    SentimentVerySatisfiedSharp as FunnyIcon, // Renamed for clarity
    VolunteerActivismSharp as SupportIcon,   // Renamed for clarity
    TipsAndUpdatesSharp as InsightfulIcon, // Renamed for clarity
    // Other Icons
    MoreVert as MoreVertIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Close as CloseIcon,
    ImageSharp as ImageSharpIcon, // Keep for attachment icon
} from "@mui/icons-material";

// const DEFAULT_USER_AVATAR = '../../src/assets/images/user-default.webp';
import defaultPic from '@/assets/images/user-default.webp';
const DEFAULT_USER_AVATAR = defaultPic;


// Define reactions array consistently (can be moved to a shared constants file)
const AVAILABLE_REACTIONS = [
    { name: "Like", icon: ThumbUpSolid }, // Use solid icon for consistency in popup
    { name: "Love", icon: LoveIcon },
    { name: "Celebrate", icon: CelebrateIcon },
    { name: "funny", icon: FunnyIcon },
    { name: "Support", icon: SupportIcon },
    { name: "Insightful", icon: InsightfulIcon },
];

// Helper to get the correct icon component based on reaction name
const getReactionIconComponent = (reactionName) => {
    const reaction = AVAILABLE_REACTIONS.find(r => r.name === reactionName);
    return reaction ? reaction.icon : ThumbUpOutline; // Default to Like icon (outline)
};


const getReactionColorClass = (reactionType) => {
    switch (reactionType) {
        case "Like":
            // Match the main button's reacted state color
            return 'text-blue-400';
        case "Love":
            return 'text-red-500';
        case "Celebrate":
            // Choose consistent colors, e.g., from modal or define here
            return 'text-green-500';
        case "funny":
            return 'text-violet-400'; // Different yellow from Like maybe?
        case "Support":
            return 'text-blue-500';
        case "Insightful":
            return 'text-teal-400';
        // default:
        //     // Fallback color for unknown reaction types
        //     return 'text-gray-400';
    }
};


// --- CommentItem Component ---
function CommentItem({
    comment,
    currentUserId,
    onEditRequest,
    onDeleteRequest,
    // NEW PROPS for reactions:
    onReact,        // Function to add/update reaction: (commentId, reactionType) => void
    onUnreact,      // Function to remove reaction: (commentId) => void
    // Pass down the full list of reactions IF needed for the modal
    // allCommentReactions = [] // Default to empty array
}) {

    // --- State for UI elements specific to THIS comment ---
    const [isExpanded, setIsExpanded] = useState(false);
    const [showOptionsMenu, setShowOptionsMenu] = useState(false);
    const [showReactionPopup, setShowReactionPopup] = useState(false); // State for reaction popup
    const [showReactionsModal, setShowReactionsModal] = useState(false); // State for modal showing reactors
    const optionsMenuRef = useRef(null);
    const hidePopupTimer = useRef(null); // Timer for reaction popup delay
    // --- End Component State ---
    const { user } = useContext(AuthContext); // Get user context if needed directly here


    const [modalReactions, setModalReactions] = useState([]);
    const [modalLoading, setModalLoading] = useState(false);

    const openReactionsModal = async () => {
        if (totalReactions === 0) return; // Don't open if no reactions

        setShowReactionsModal(true); // Open the modal UI
        setModalLoading(true);      // Set loading state for modal

        try {
            console.log("Fetching detailed reactions via API..."); // <-- Add log
            const detailedReactions = await fetchReactionsForComment(comment.id); // Ensure this function is correctly imported/defined
            console.log("API Response Data:", detailedReactions); // <-- Log the raw response
            setModalReactions(Array.isArray(detailedReactions) ? detailedReactions : []);
        } catch (error) {
            console.error("Failed to fetch reactions for modal:", error); // <-- Log errors
            setModalReactions([]);
        } finally {
            setModalLoading(false);
        }
    };

    // --- Derived Data ---
    const MAX_COMMENT_LENGTH = 150;
    const fullText = comment.comment || "";
    const needsTruncation = fullText.length > MAX_COMMENT_LENGTH;
    const displayText = needsTruncation && !isExpanded
        ? fullText.slice(0, MAX_COMMENT_LENGTH) + "..."
        : fullText;

    // ** Crucially, rely on the comment prop for reaction data **
    const currentUserReaction = comment.my_reaction; // Assumes backend sends this!
    const reactionCounts = comment.reaction_counts || {}; // Assumes backend sends this!

    const isCommentAuthor = comment.author_id === currentUserId;
    const authorName = comment.author || "User";
    // --- End Derived Data ---


    // --- Handlers specific to THIS comment ---
    const toggleExpansion = () => setIsExpanded(!isExpanded);
    const toggleOptionsMenu = () => setShowOptionsMenu(!showOptionsMenu);

    // --- Reaction Popup Handlers (similar to ShowPost) ---
    const handleMouseEnterTrigger = () => {
        clearTimeout(hidePopupTimer.current);
        setShowReactionPopup(true);
    };

    const handleMouseLeaveArea = () => {
        hidePopupTimer.current = setTimeout(() => {
            setShowReactionPopup(false);
        }, 300);
    };

    const handleMouseEnterPopover = () => {
        clearTimeout(hidePopupTimer.current);
    };

    const handleReactionSelect = (reactionType) => {
        setShowReactionPopup(false); // Hide popup
        if (currentUserReaction === reactionType) {
             // If clicking the same reaction again, remove it
            onUnreact(comment.id);
        } else {
            // Otherwise, add or update the reaction
            onReact(comment.id, reactionType);
        }
    };

     // --- Main React Button Click Logic ---
    const handleReactButtonClick = () => {
        if (currentUserReaction) {
            // If already reacted, clicking the main button removes the reaction
            onUnreact(comment.id);
        } else {
            // If not reacted, clicking the main button defaults to "Like"
            onReact(comment.id, "Like");
        }
        // Hide popup if it was somehow open
        setShowReactionPopup(false);
    };


    // --- Effect for closing options menu on outside click ---
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target)) {
                setShowOptionsMenu(false);
            }
        };
        if (showOptionsMenu) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            clearTimeout(hidePopupTimer.current); // Cleanup timer on unmount
        };
    }, [showOptionsMenu]);
    // ---


    // --- Calculate Reaction Summary ---
    const totalReactions = Object.values(reactionCounts).reduce((sum, count) => sum + (count || 0), 0);
    const sortedTopReactions = Object.entries(reactionCounts)
        .filter(([_, count]) => count > 0)
        .sort((a, b) => b[1] - a[1]) // Sort descending by count
        .slice(0, 3); // Take top 3


    return (
        // Reuse background color from ShowPost post item for consistency
        <div className="mb-4 pb-4 border-b border-[#f0f0f0] last:border-0 bg-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            {/* Comment Header */}
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                    <Link to={`/profiles/${comment.author_id}`} className="shrink-0 block hover:opacity-80 transition-opacity">
                        <img
                            src={comment.author_profile_picture || DEFAULT_USER_AVATAR}
                            alt={authorName}
                            title={isCommentAuthor ? "You" : `${authorName}`}
                            className="w-12 h-12 rounded-full object-cover border-2 border-[#7a2226] p-0.5"
                            onError={(e) => { if (e.target.src !== DEFAULT_USER_AVATAR) e.target.src = DEFAULT_USER_AVATAR; }}
                        />
                    </Link>
                    <div className="">
                        <Link to={`/profiles/${comment.author_id}`} className="!no-underline  flex-shrink-0 block hover:opacity-80 transition-opacity">
                            <p className="font-semibold text-[#7a2226] hover:text-[#5a181a] transition-colors mb-0 mt-3">{isCommentAuthor ? "You" : `${authorName}`}</p>
                        </Link>
                        <p className="text-xs text-gray-500 ">
                            <TimeAgo timestamp={comment.created_on} />
                        </p>
                    </div>
                </div>
                {/* Edit/Delete Menu */}
                {isCommentAuthor && (
                    <div className="relative" ref={optionsMenuRef}>
                        <button onClick={toggleOptionsMenu} className="text-gray-500 hover:text-[#7a2226] p-1 rounded-full hover:bg-[#f8dada] transition-colors">
                            <MoreVertIcon className="w-6 h-6 "/>
                        </button>
                        {showOptionsMenu && (
                            <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-xl border border-[#f0f0f0] py-2 z-20">
                                <button
                                    onClick={() => { onEditRequest(comment); setShowOptionsMenu(false); }}
                                   className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-[#f8dada] w-full"
                                >
                                    <EditIcon className="w-4 h-4 mr-2 text-[#7a2226]"/> Edit
                                </button>
                                <button
                                    onClick={() => { onDeleteRequest(comment); setShowOptionsMenu(false); }}
                                   className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-[#f8dada] w-full"
                                >
                                    <DeleteIcon className="w-4 h-4 mr-2 text-red-600" /> Delete
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Comment Body with See more/less */}
            <div className="text-gray-800 mb-3 pl-2">
              <div className="text-gray-700 leading-relaxed">
                {isExpanded ? (
                    <>
                        <p className="inline">{displayText}</p>
                        {needsTruncation && (
                            <button
                                onClick={toggleExpansion}
                                className="ml-2 text-[#7a2226] hover:text-[#5a181a] font-medium text-sm"
                                aria-expanded={isExpanded}
                            >
                                See less
                            </button>
                        )}
                    </>
                ) : (
                    <>
                        <p className="inline">{displayText}</p>
                        {needsTruncation && (
                            <button
                                onClick={toggleExpansion}
                                 className="ml-2 text-[#7a2226] hover:text-[#5a181a] font-medium text-sm"
                                aria-expanded={isExpanded}
                            >
                                See more
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
            {/* Comment Attachments */}
            {comment.attachments?.length > 0 && (
                <div className="ml-10 mt-2 space-y-2 ">
                    {comment.attachments.map((attachment) => (
                        <div key={attachment.id} className="relative group">
                            {attachment.image ? (
                                <img
                                    src={attachment.image}
                                    alt="Comment attachment"
                                    className="max-w-xs rounded-xl border border-[#f0f0f0] shadow-sm"
                                />
                            ) : attachment.video ? ( // Check for video
                                <video
                                    src={attachment.video}
                                    controls
                                    playsInline
                                    className="max-w-xs rounded-xl border border-[#f0f0f0] shadow-sm"
                                    preload="metadata"
                                >
                                </video>
                            ) : null /* Handle other types if necessary */}
                        </div>
                    ))}
                </div>
            )}

            <div className="ml-4 mt-3">
                <div className="flex items-center gap-3">
                    {/* 1. Reaction Summary (Applying colors here) */}
                    <div
                        className={`flex items-center gap-1 text-sm${totalReactions > 0 ? 'cursor-pointer hover:underline text-gray-400' : 'text-gray-500'}`} // Make text gray if no reactions
                        onClick={openReactionsModal} // Use the correct handler
                        title={totalReactions > 0 ? "See who reacted" : "No reactions yet"}
                    >
                        
                        {/* Map over top reactions */}
                        {sortedTopReactions.map(([reactionName, count]) => {
                            const IconComponent = getReactionIconComponent(reactionName);
                            // *** GET AND APPLY COLOR CLASS ***
                            const colorClass = getReactionColorClass(reactionName);
                            return (
                                <IconComponent
                                    key={reactionName + count} // Use name+count for key stability
                                    // Apply base size/style AND the dynamic color class
                                    className={`w-5 h-5 text-[#7a2226]${colorClass}`}
                                />
                            );
                        })}
                       
                        {/* Display total count */}
                        {totalReactions > 0 && (
                             // Consistent styling for count text
                            <div className="ml-1 text-gray-400 ">
                                {totalReactions} 
                            </div>
                        )}
                        
                         {/* Optional: Text if zero reactions (instead of just gray text) */}
                        {totalReactions === 0 && (
                            <div className="text-gray-600 ml-1">No reactions</div>
                        )}
                    </div>

                    {/* 2. Reaction Button & Popup (No changes needed here) */}
                    {/* ... (button with its dynamic icon/text, popup div) ... */}
                    <hr className="my-2 border-gray-300" />
                    <div
                        className="relative "
                        onMouseEnter={handleMouseEnterTrigger}
                        onMouseLeave={handleMouseLeaveArea}
                    >
                        <button
                            onClick={handleReactButtonClick}
                            className={`flex items-center gap-1 text-gray-600 hover:text-[#7a2226] transition-colors ${
                                currentUserReaction
                                    ? getReactionColorClass(currentUserReaction) // Use helper for button color too!
                                    : 'text-gray-700'
                            }`}
                        >
                            {React.createElement(getReactionIconComponent(currentUserReaction), { className: "w-4 h-4 !bg-inherit " })}
                            <span className="text-sm font-medium">{currentUserReaction || "React"}</span>
                        </button>

                         {/* Reaction Popup... */}
                        {showReactionPopup && (
                            <div
                                onMouseEnter={handleMouseEnterPopover}
                                onMouseLeave={handleMouseLeaveArea}
                                className="absolute bottom-full left-0 mb-2 flex space-x-1 !bg-[#7a2226] shadow-lg rounded-full px-4 py-1.5 border border-gray-500 z-30"
                            >
                                {AVAILABLE_REACTIONS.map((reaction) => {
                                    const Icon = reaction.icon;
                                    // *** APPLY COLOR TO POPUP ICON TOO? (Optional but consistent) ***
                                    const iconColorClass = getReactionColorClass(reaction.name);
                                    return (
                                        <button
                                            key={reaction.name}
                                            onClick={(e) => { e.stopPropagation(); handleReactionSelect(reaction.name); }}
                                            className={'p-1 rounded-full !bg-[#7a2226] transition-transform transform hover:scale-125'}
                                            title={reaction.name}
                                        >
                                            {/* Apply color class to icon inside popup button */}
                                            <Icon className={`w-5 h-5 !bg-[#7a2226] ${iconColorClass}`} />
                                        </button>
                                    );
                                })}
                            </div>
                        )}

            

                </div> 

</div>
</div>
            {showReactionsModal && (
            <ReactionsCommentModal
                reactions={modalReactions} // Pass the fetched data
                isLoading={modalLoading}   // Pass the loading state
                onClose={() => {
                    setShowReactionsModal(false);
                    setModalReactions([]); // Clear data when closing
                }}
                commentId={comment.id}
            />
        )}
        </div>
    );
}

export { CommentItem }; 