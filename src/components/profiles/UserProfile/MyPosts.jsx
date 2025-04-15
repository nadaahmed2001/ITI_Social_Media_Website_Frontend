import React, { useState, useEffect, useCallback, useContext } from 'react';
import { fetchMyPosts, deletePost } from '../../services/api'; // Adjust path, ensure fetchMyPosts exists
import AuthContext from '../../../contexts/AuthContext'; // To confirm user ID if needed
import ShowPost from '../../posts/ShowPost'; // Re-use ShowPost component
import { CircularProgress, Typography, Alert, Button } from '@mui/material';
import FeedIcon from '@mui/icons-material/Feed'; // Icon for the title

function MyPosts() {
    const { user } = useContext(AuthContext); // Get current user if needed

    // State for user's own posts
    const [myPosts, setMyPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ currentPage: 1, hasNextPage: false });

    // Function to fetch user's posts
    const loadMyPosts = useCallback(async (page = 1) => {
        if (page === 1) {
            setIsLoading(true);
            setMyPosts([]); // Clear previous results on first page load
        }
        // else { setIsLoadingMore(true); } // Optional: separate loading state for pagination

        setError(null);
        try {
            // Assuming fetchMyPosts handles pagination and returns { results, next, ... }
            const data = await fetchMyPosts(page);
            const resultsData = data?.results ?? []; // Handle potential missing results
            setMyPosts(prev => page === 1 ? resultsData : [...prev, ...resultsData]);
            setPagination({
                currentPage: page,
                hasNextPage: data?.next !== null
            });
        } catch (err) {
            console.error("Failed to fetch user's posts:", err);
            setError("Could not load your posts.");
            if (page === 1) setMyPosts([]);
        } finally {
             if (page === 1) setIsLoading(false);
             // else setIsLoadingMore(false);
        }
    }, []); // Empty dependency array if fetchMyPosts doesn't rely on props/state here

    // Effect to load data on component mount
    useEffect(() => {
        console.log("MyPosts component mounted, fetching posts...");
        loadMyPosts(1); // Load the first page
    }, [loadMyPosts]);

    // Handler for when a post is deleted (called by ShowPost)
    const handlePostDeletion = useCallback((deletedPostId) => {
        setMyPosts(prev => prev.filter(p => p.id !== deletedPostId));
        console.log(`Post ${deletedPostId} removed from My Posts list.`);
        // Optionally, could call deletePost API here if ShowPost doesn't handle it,
        // but it's better if ShowPost handles its own deletion via its modal.
        // This handler just updates the list UI.
    }, []);


    return (
        <div className="overflow-hidden">
            {/* Title */}
            <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{
                    color: '#ffffff',
                    ml: 4,
                    pb: 1,
                    mb: 3,
                    mt: 10,
                    position: 'relative',
                    display: 'inline-flex',
                    alignItems: 'center',
                    width: 'auto',
                    '&::after': { // Optional: reuse border style from Saved Posts
                        content: '""', position: 'absolute', bottom: 0,
                        left: 0, width: '80%', height: '1px', backgroundColor: '#444',
                    }
                }}
            >
                <FeedIcon sx={{ mr: 1, fontSize: '1.1em' }} /> {/* My Posts Icon */}
                My Posts
            </Typography>

            {/* Initial Loading State */}
            {isLoading && myPosts.length === 0 && (
                <div className="text-center py-6">
                    <CircularProgress color="inherit" />
                    <Typography sx={{ color: 'grey.400', mt: 1 }}>Loading Your Posts...</Typography>
                </div>
            )}

            {/* Error State */}
            {error && (
                <Alert severity="error" variant="filled" sx={{ my: 2, mx: 4 }}>{error}</Alert>
            )}

            {/* Empty State */}
            {!isLoading && !error && myPosts.length === 0 && (
                <Typography sx={{ color: 'grey.500', textAlign: 'center', mt: 4, mx: 4 }}>
                    You haven't created any posts yet.
                </Typography>
            )}

            {/* Display Posts */}
            {!error && myPosts.length > 0 && (
                <div className="space-y-6 max-w-3xl ml-6">
                    {myPosts.map(post => (
                        <ShowPost
                            key={post.id}
                            postData={post}
                            // Pass the deletion handler so ShowPost can update this list
                            onDeletePost={handlePostDeletion}
                        />
                    ))}
                </div>
            )}

            {/* Load More Button */}
            {pagination.hasNextPage && (
                <div className="flex justify-center mt-6 mb-4">
                    <Button
                        variant="contained"
                        onClick={() => loadMyPosts(pagination.currentPage + 1)}
                        disabled={isLoading} // Disable if initial load or more is loading
                        sx={{
                            backgroundColor: '#555',
                            '&:hover': { backgroundColor: '#666' },
                            '&:disabled': { backgroundColor: '#444', color: '#888' }
                        }}
                    >
                        {isLoading && pagination.currentPage > 0 ? <CircularProgress size={24} color="inherit"/> : 'Load More'}
                    </Button>
                </div>
            )}
        </div>
    );
}

export default MyPosts;