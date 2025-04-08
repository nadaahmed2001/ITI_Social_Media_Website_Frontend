// src/pages/PostsPage.jsx (or similar path)

import React, { useState, useEffect, useCallback , useContext} from 'react';
import axios from 'axios';
// import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import  EmojiPicker from '../components/posts/EmojiPicker';
import { MediaSlider } from '../components/posts/MediaSlider';
import CreatePost from '../components/posts/CreatePost'
// import { MediaUploader } from '../components/posts/MediaUploader'
// --- CORRECTED IMPORTS ---
// REMOVED: import UserContext from '../context/UserContext'
import { useUser } from '../context/UserContext'; // KEEP CORRECT named import of the HOOK
// --- END CORRECTION ---

const ITEMS_PER_PAGE = 10;
const DEFAULT_AVATAR = '../../src/assets/user-default.webp';


const useInfiniteScroll = ({ loadMore, threshold = 100 }) => {
    useEffect(() => {
        const handleScroll = () => {
            const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
            if (scrollHeight - (scrollTop + clientHeight) < threshold) {
                loadMore();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadMore, threshold]);
};



const PostItem = ({ post }) => {
    const [expanded, setExpanded] = useState(false);
    const [showFullContent, setShowFullContent] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentPage, setCommentPage] = useState(1);
    const [hasMoreComments, setHasMoreComments] = useState(true);
    

    const MAX_PREVIEW_LENGTH = 300;
    const fullContent = post.body || comment.comment || ""; // Get the full text
    const needsTruncation = fullContent.length > MAX_PREVIEW_LENGTH;
    const displayedContent = showFullContent ? post.body : post.body.slice(0, MAX_PREVIEW_LENGTH);


    const fetchComments = async (pageNumber) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/posts/${post.id}/comments/?page=${pageNumber}`);
            const newComments = response.data.results;
            console.log(newComments)
            
            setComments(prev => [...prev, ...newComments]);
            setHasMoreComments(response.data.next !== null);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleReact = async (reactionType) => {
        try {
            await axios.post(`http://127.0.0.1:8000/api/posts/${post.id}/react/${reactionType}/`);
            // Update local state or refetch
        } catch (error) {
            console.error('Reaction error:', error);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
            {/* Author Info */}
            <div className="flex items-start space-x-2 mb-4">
                <img 
                    src={DEFAULT_AVATAR} 
                    className="w-10 h-10 rounded-full"
                    // alt={post.author.first_name}
                />
                <div>
                    {/* <h3 className="font-medium text-sm">
                        {post.author.first_name} {post.author.last_name}
                    </h3> */}
                    <p className="text-xs text-gray-500">
                        {new Date(post.created_on).toLocaleDateString()}
                    </p>
                </div>
            </div>

            {/* Post Content */}
            <div className="content-area mb-4 text-sm text-gray-700"> {/* Container for text + button */}
                <p className="whitespace-pre-wrap leading-relaxed"> {/* Paragraph ONLY for the text */}
                {displayedContent}
                {/* Conditionally show "...See more" inline ONLY when truncated */}
                {needsTruncation && !showFullContent && (
                    <button
                    type="button"
                    onClick={() => setShowFullContent(true)}
                    // Light theme, purple accent, inline appearance
                    className="text-red-500 hover:text-red-700 font-medium hover:underline mt-1 text-xs" // Added block, mt-1, maybe smaller text
                    >
                    ...See more
                    </button>
                )}
                </p>

                {/* Conditionally show "See less" button as a BLOCK element AFTER the text paragraph */}
                {needsTruncation && showFullContent && (
                <button
                    type="button"
                    onClick={() => setShowFullContent(false)}
                    // Light theme, purple accent, block display, margin-top
                    className="block text-red-500 hover:text-red-700 font-medium hover:underline mt-1 text-xs" // Added block, mt-1, maybe smaller text
                >
                    See less
                </button>
                )}
            </div>
                    
            
            {/* Media Attachments */}
            {Array.isArray(post.attachments) && post.attachments.length > 0 && (
                <div className="mt-2 -mx-4 sm:mx-0"> {/* Adjust margins if needed */}
                    {/* Use the MediaSlider component */}
                    <MediaSlider attachments={post.attachments} />
                </div>
            )}

            {/* Reactions */}
            <div className="flex items-center space-x-4 mb-4">
                <div className="flex space-x-1">
                    {Object.entries(post.reaction_counts).map(([type, count]) => (
                        <button 
                            key={type}
                            onClick={() => handleReact(type)}
                            className="px-2 py-1 rounded-md hover:bg-gray-100"
                        >
                            {type} ({count})
                        </button>
                    ))}
                </div>
            </div>

            {/* Comments Section */}
            <div className="border-t pt-4">
                {comments.map(comment => (
                    <CommentItem 
                        key={comment.id}
                        comment={comment}
                        postId={post.id}
                    />
                ))}
                
                {hasMoreComments && (
                    <button
                        onClick={() => {
                            setCommentPage(prev => prev + 1);
                            fetchComments(commentPage + 1);
                        }}
                        className="text-sm text-primary-500 hover:underline"
                    >
                        Load more comments
                    </button>
                )}
            </div>
        </div>
    );
};


const CommentItem = ({ comment, postId }) => {
    const { currentUser } = useContext(UserContext);
    const [expanded, setExpanded] = useState(false);
    const MAX_COMMENT_PREVIEW = 200;
    
    const displayedContent = expanded ? comment.comment : 
        comment.comment.slice(0, MAX_COMMENT_PREVIEW);

    return (
        <div className="flex space-x-2 mb-3">
            <img 
                src={comment.author.profile_picture} 
                className="w-8 h-8 rounded-full"
                alt={comment.author.username}
            />
            <div className="flex-1 bg-gray-100 rounded-lg p-2">
                <div className="flex justify-between">
                    <h4 className="text-sm font-medium">
                        {comment.author.username}
                    </h4>
                    {comment.author.id === currentUser?.id && (
                        <div className="flex space-x-2">
                            <button className="text-xs hover:text-primary-500">Edit</button>
                            <button className="text-xs hover:text-primary-500">Delete</button>
                        </div>
                    )}
                </div>
                <p className="text-sm mt-1">
                    {displayedContent}
                    {comment.comment.length > MAX_COMMENT_PREVIEW && (
                        <button 
                            onClick={() => setExpanded(!expanded)}
                            className="text-primary-500 hover:underline ml-1"
                        >
                            {expanded ? 'See less' : 'See more'}
                        </button>
                    )}
                </p>
                {comment.attachments.length > 0 && (
                    <img 
                        src={comment.attachments[0].url} 
                        className="mt-2 max-w-xs rounded-md"
                        alt="Comment attachment"
                    />
                )}
            </div>
        </div>
    );
};


const PostsPage = () => {

    const [sortBy, setSortBy] = useState('recent');
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    

    const { currentUser } = useUser(); // Call the hook here
    console.log("PostsPage currentUser:", currentUser); // Should now log the user object or null

    // const fetchPosts = useCallback(async (pageNumber) => {
    //     try {
    //         const response = await axios.get(`http://127.0.0.1:8000/api/posts/?page=${pageNumber}&sort=${sortBy}`);
    //         const newPosts = response.data.results;
            
    //         setPosts(prev => [...prev, ...newPosts]);
    //         setHasMore(response.data.next !== null);
    //     } catch (error) {
    //         console.error('Error fetching posts:', error);
    //     }
    // }, [sortBy]);

    const fetchPosts = useCallback(async (pageNumber) => {
        // ... your fetchPosts logic using axios ...
        // Note: axios doesn't automatically use the apiClient interceptor
        // unless you import and use the configured 'apiClient' instance
        // or manually add the Authorization header here.
        try {
            const token = localStorage.getItem('access_token'); // Get token
            const response = await axios.get(`http://127.0.0.1:8000/api/posts/?page=${pageNumber}&sort=${sortBy}`, {
                 headers: token ? { 'Authorization': `Bearer ${token}` } : {} // Add header manually if not using apiClient
            });
            const newPosts = response.data.results || []; // Safer access
            console.log(newPosts);
            setPosts(prev => pageNumber === 1 ? newPosts : [...prev, ...newPosts]); // Replace on page 1, append otherwise
            setHasMore(response.data.next !== null);
        } catch (error) { console.error('Error fetching posts:', error); }
        // finally { setIsLoadingPosts(false); }
    }, [sortBy]); // Add other dependencies like apiClient if used



    // Infinite scroll hook
    useInfiniteScroll({
        loadMore: () => {
            if (hasMore) {
                setPage(prev => prev + 1);
            }
        },
        threshold: 200
    });

    useEffect(() => {
        setPosts([]);
        setPage(1);
        fetchPosts(1);
    }, [sortBy]);

    useEffect(() => {
        fetchPosts(page);
    }, [page]);

    return (
        
        <div className="max-w-2xl mx-auto">
            {/* Sorting Controls */}
            <div className="mb-4 flex justify-end">
                <select 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border rounded-md px-3 py-1 text-sm"
                >
                    <option value="recent">Most Recent</option>
                    <option value="relevant">Most Relevant</option>
                </select>
            </div>

            {/* Create Post Component */}
            {currentUser && <CreatePost currentUserAvatar={currentUser?.profile_picture} />}

            {/* <CreatePost /> */}

            {/* Posts List */}
            {posts.map(post => (
                <PostItem 
                    key={post.id} 
                    post={post} 
                />
            ))}

            {!hasMore && (
                <div className="text-center text-gray-500 py-4">
                    No more posts to load
                </div>
            )}
        </div>
    );
};

export default PostsPage