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

const DEFAULT_USER_AVATAR = '../../src/assets/images/user-default.webp';

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
        <div className="mb-1 pb-4 border-b !border-[#181819] last:border-0 !bg-[#292928]">
            {/* Comment Header */}
            <div className="flex items-start justify-between mb-2 !bg-[#292928]">
                <div className="flex items-center space-x-2 !bg-[#292928]">
                    <Link to={`/profiles/${comment.author_id}`} className="!bg-[#292928] flex-shrink-0 block hover:opacity-80 transition-opacity">
                        <img
                            src={comment.author_profile_picture || DEFAULT_USER_AVATAR}
                            alt={authorName}
                            title={isCommentAuthor ? "You" : `${authorName}`}
                            className="w-10 h-10 rounded-full object-cover border border-gray-200"
                            onError={(e) => { if (e.target.src !== DEFAULT_USER_AVATAR) e.target.src = DEFAULT_USER_AVATAR; }}
                        />
                    </Link>
                    <div className="!bg-[#292928]">
                        <Link to={`/profiles/${comment.author_id}`} className="!no-underline !bg-[#292928] flex-shrink-0 block hover:opacity-80 transition-opacity">
                            <p className="font-bold text-medium !text-[#7a2226] mb-0 pt-2 !bg-[#292928] !no-underline ">{isCommentAuthor ? "You" : `${authorName}`}</p>
                        </Link>
                        <p className="text-xs text-white !bg-[#292928]">
                            <TimeAgo timestamp={comment.created_on} />
                        </p>
                    </div>
                </div>
                {/* Edit/Delete Menu */}
                {isCommentAuthor && (
                    <div className="relative !bg-[#292928]" ref={optionsMenuRef}>
                        <button onClick={toggleOptionsMenu} className="!text-[#be8a8d]] text-gray-500 hover:text-gray-700 !bg-[#292928]">
                            <MoreVertIcon className="w-5 h-5 !bg-[#292928] !text-[#7a2226]" />
                        </button>
                        {showOptionsMenu && (
                            <div className="absolute right-0 mt-2 w-40 !bg-[#292928] rounded-md shadow-lg py-1 z-20">
                                <button
                                    onClick={() => { onEditRequest(comment); setShowOptionsMenu(false); }}
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                    <EditIcon className="w-4 h-4 mr-2 text-primary-600" /> Edit
                                </button>
                                <button
                                    onClick={() => { onDeleteRequest(comment); setShowOptionsMenu(false); }}
                                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                >
                                    <DeleteIcon className="w-4 h-4 mr-2" /> Delete
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Comment Body with See more/less */}
            <div className="!text-justify text-gray-800 mb-3 !bg-[#292928] px-8">
                {isExpanded ? (
                    <>
                        <p className="text-white !bg-[#292928]">{displayText}</p>
                        {needsTruncation && (
                            <button
                                onClick={toggleExpansion}
                                className="mt-0 text-[#A52B2B] hover:underline focus:outline-none font-medium text-xs !bg-[#292928]"
                                aria-expanded={isExpanded}
                            >
                                See less
                            </button>
                        )}
                    </>
                ) : (
                    <>
                        <p className="!bg-[#292928] inline text-white">{displayText}</p>
                        {needsTruncation && (
                            <button
                                onClick={toggleExpansion}
                                className="ml-1 text-[#A52B2B] hover:underline focus:outline-none font-medium text-xs !bg-[#292928]"
                                aria-expanded={isExpanded}
                            >
                                See more
                            </button>
                        )}
                    </>
                )}
            </div>

            {/* Comment Attachments */}
            {comment.attachments?.length > 0 && (
                <div className="ml-10 mt-2 space-y-2 !bg-[#292928]">
                    {comment.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center !bg-[#292928] mt-3">
                            {attachment.image ? (
                                <img
                                    src={attachment.image}
                                    alt="Comment attachment"
                                    className="max-w-xs rounded-md"
                                />
                            ) : attachment.video ? ( // Check for video
                                <video
                                    src={attachment.video}
                                    controls
                                    playsInline
                                    className="w-full h-auto block max-h-[75vh] bg-black max-w-xs rounded-md"
                                    preload="metadata"
                                >
                                </video>
                            ) : null /* Handle other types if necessary */}
                        </div>
                    ))}
                </div>
            )}

            <div className="ml-10 mt-2 !bg-[#292928]">
                <div className="!bg-inherit"> {/* Simple wrapper, inherits background */}
                    {/* 1. Reaction Summary (Appears on top) */}
                    <div
                        className="!bg-[#292928] flex items-center gap-1 text-xs text-gray-400 cursor-pointer hover:underline mb-3" /* Added mb-1 for spacing below */
                        // onClick={() => totalReactions > 0 && setShowReactionsModal(true)}
                        onClick={openReactionsModal} // <-- Make sure this line uses the function directly

                        title={totalReactions > 0 ? "See who reacted" : ""}
                    >
                        {sortedTopReactions.map(([reactionName, count]) => {
                            const IconComponent = getReactionIconComponent(reactionName);
                            return <IconComponent key={reactionName + count} className="w-4 h-4 !bg-inherit" />; // Use inherit or transparent bg
                        })}
                        {totalReactions == 1 ? (
                            <span className="!bg-[#292928] ml-1">1 Reaction</span>
                        ) : (
                            <span className="!bg-[#292928] ml-1">{totalReactions} Reactions</span>
                        )
                        }
                    </div>

                    {/* 2. Reaction Button & Popup (Appears below the summary) */}
                    <div
                        className="relative !bg-inherit" // Relative container for popup positioning, inherit background
                        onMouseEnter={handleMouseEnterTrigger}
                        onMouseLeave={handleMouseLeaveArea}
                    >
                        <button
                            onClick={handleReactButtonClick}
                            className={`!bg-[#181819] inline-flex items-center gap-1 text-xs font-medium py-1.5 px-4 rounded transition-colors duration-200 ${ // Use inline-flex if you want button width to fit content
                                currentUserReaction
                                    ? 'text-yellow-400' // Or specific color based on reaction
                                    : 'text-gray-400 hover:text-gray-100 hover:bg-gray-700'
                            }`}
                        >
                            {/* Dynamically render icon based on current reaction */}
                            {React.createElement(getReactionIconComponent(currentUserReaction), { className: "w-4 h-4 !bg-inherit" })}
                            <span className="!bg-inherit">{currentUserReaction || "React"}</span>
                        </button>

                        {/* Reaction Popup (Conditionally Rendered) */}
                        {showReactionPopup && (
                            <div
                                onMouseEnter={handleMouseEnterPopover}
                                onMouseLeave={handleMouseLeaveArea}
                                // Positioning: Choose left-0 or right-0 depending on desired alignment relative to button
                                className="absolute bottom-full left-0 mb-2 flex space-x-1 !bg-[#7a2226] shadow-lg rounded-full px-4 py-1.5 border border-gray-500 z-30"
                            >
                                {AVAILABLE_REACTIONS.map((reaction) => {
                                    const Icon = reaction.icon;
                                    return (
                                        <button
                                            key={reaction.name}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleReactionSelect(reaction.name);
                                            }}
                                            className={'p-1 rounded-full !bg-[#7a2226] transition-transform transform hover:scale-125'}
                                            title={reaction.name}
                                        >
                                            <Icon className="w-5 h-5 !bg-[#7a2226]" />
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div> 

                </div> 

            </div>

            {/* Modal for showing reactors */}
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