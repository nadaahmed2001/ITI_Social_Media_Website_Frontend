import React, { useState, useEffect, useCallback } from 'react';
import { fetchSavedPosts } from '../../services/api'; // Adjust path as needed
import ShowPost from '../../posts/ShowPost'; // Or your PostCard component
import { CircularProgress, Typography, Alert, Button } from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark'; // <-- Import the icon

function SavedPosts() {
    // State moved from parent component
    const [savedPosts, setSavedPosts] = useState([]);
    const [isLoadingSaved, setIsLoadingSaved] = useState(false);
    const [savedPostsError, setSavedPostsError] = useState(null);
    const [savedPostsPagination, setSavedPostsPagination] = useState({ currentPage: 1, hasNextPage: false });

    // Function to fetch saved posts, moved from parent
    const loadSavedPosts = useCallback(async (page = 1) => {
        // Only set loading true if fetching page 1 initially
        if (page === 1) {
            setIsLoadingSaved(true);
            setSavedPosts([]); // Clear previous results when loading page 1
        }
        // For subsequent pages, you might want a different loading indicator
        // setIsLoadingMore(true); // Example for a different indicator

        setSavedPostsError(null);
        try {
            const data = await fetchSavedPosts(page);
            setSavedPosts(prev => page === 1 ? (data.results || []) : [...prev, ...(data.results || [])]);
            setSavedPostsPagination({
                currentPage: page,
                hasNextPage: data.next !== null
            });
        } catch (err) {
            console.error("Failed to fetch saved posts:", err);
            setSavedPostsError("Could not load saved posts.");
            if (page === 1) setSavedPosts([]); // Ensure posts are cleared on initial load error
        } finally {
             if (page === 1) setIsLoadingSaved(false);
             // setIsLoadingMore(false);
        }
    }, []); // useCallback dependency array is empty as it doesn't depend on props/state here

    // Effect to load data on component mount
    useEffect(() => {
        console.log("SavedPosts component mounted, fetching posts...");
        loadSavedPosts(1); // Load the first page on mount
    }, [loadSavedPosts]); // Depend on the memoized loadSavedPosts function


    // Placeholder function for handling deletion/unsaving within this component's context
    // This might need adjustment based on how unsaving works (e.g., calling unsavePost API)
    const handlePostInteractionUpdate = (updatedPostId) => {
        // Option 1: Refetch the current page after unsaving
        // loadSavedPosts(savedPostsPagination.currentPage);

        // Option 2: Just remove from the list optimistically
         setSavedPosts(prev => prev.filter(p => p.id !== updatedPostId));
         console.log(`Post ${updatedPostId} removed/unsaved from list.`);
    };


    return (
        // Added overflow-hidden to containing div if needed, depending on layout
        <div className="overflow-hidden">
            {/* --- Updated Typography for Title --- */}
            <Typography
                variant="h5"
                component="h2"
                gutterBottom // Adds margin-bottom based on variant
                sx={{
                    color: '#ffffff',
                    // borderBottom: '1px solid #444', // REMOVED direct border
                    ml: 4,
                    pb: 1, // Keep padding for space below text before the pseudo-border
                    mb: 3,
                    mt: 10,
                    position: 'relative', // Needed for absolute positioning of pseudo-element
                    display: 'inline-flex', // Use inline-flex to size container to content + icon
                    alignItems: 'center', // Vertically align icon and text
                    width: '55%', // Allow container to size naturally
                    borderBottom: '1px solid #444',
                }}
            >
                {/* Icon added before the text */}
                <BookmarkIcon sx={{ mr: 1, fontSize: '1.1em' }} /> {/* Adjust margin and size */}
                Saved Posts
            </Typography>
            {/* --- End Updated Typography --- */}


            {/* Initial Loading State */}
            {isLoadingSaved && savedPosts.length === 0 && (
                <div className="text-center py-6">
                    <CircularProgress color="inherit" />
                    <Typography sx={{ color: 'grey.400', mt: 1 }}>Loading Saved Posts...</Typography>
                </div>
            )}

            {/* Error State */}
            {savedPostsError && (
                <Alert severity="error" variant="filled" sx={{ my: 2, mx: 4 }}>{savedPostsError}</Alert> // Added margin
            )}

            {/* Empty State (after loading, no error) */}
            {!isLoadingSaved && !savedPostsError && savedPosts.length === 0 && (
                <Typography sx={{ color: 'grey.500', textAlign: 'center', mt: 4, mx: 4 }}>
                    You haven't saved any posts yet.
                </Typography>
            )}

            {/* Display Posts */}
            {!savedPostsError && savedPosts.length > 0 && (
                // Added horizontal padding to match title margin
                <div className="space-y-6 max-w-3xl ml-6 ">
                    {savedPosts.map(post => (
                        <ShowPost
                            key={post.id}
                            postData={post}
                            onDeletePost={handlePostInteractionUpdate}
                        />
                    ))}
                </div>
            )}

            {/* Load More Button */}
            {savedPostsPagination.hasNextPage && (
                <div className="flex justify-center mt-6 mb-4"> {/* Added bottom margin */}
                    <Button
                        variant="contained"
                        onClick={() => loadSavedPosts(savedPostsPagination.currentPage + 1)}
                        disabled={isLoadingSaved} // Consider a separate isLoadingMore state
                        sx={{
                            backgroundColor: '#555',
                            '&:hover': { backgroundColor: '#666' },
                            '&:disabled': { backgroundColor: '#444', color: '#888' }
                        }}
                    >
                        {/* Show spinner only if loading more, not initial load */}
                        {isLoadingSaved && savedPostsPagination.currentPage > 1 ? <CircularProgress size={24} color="inherit"/> : 'Load More'}
                    </Button>
                </div>
            )}
        </div>
    );
}


export default SavedPosts;