import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchUserPosts, getProfileById } from '../components/services/api'; // Adjust path
import ShowPost from '../components/posts/ShowPost'; // Reuse ShowPost
import { Typography, CircularProgress, Alert, Box, Paper, Button, Pagination } from '@mui/material';

function UserPostsPage() {
    const { profileId } = useParams(); // Get profile ID from URL

    // State for posts and loading/error
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profileUsername, setProfileUsername] = useState(''); // To display "Posts by X"

    // State for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalResults, setTotalResults] = useState(0);

    // Fetch profile username for the title
    useEffect(() => {
        if (profileId) {
            getProfileById(profileId)
                .then(response => setProfileUsername(response.data?.username || 'User'))
                .catch(() => setProfileUsername('User'));
        }
    }, [profileId]);

    // Function to load user's posts
    const loadPosts = useCallback(async (page = 1) => {
        if (!profileId) return; // Should have profileId from URL

        setIsLoading(true);
        setError(null);
        try {
            // Fetch posts using the profile's associated USER ID.
            // We need to get the user ID from the profile data first.
            // Let's assume profileData was fetched or passed, or fetch it here.
            // For simplicity here, we'll assume profileData might be fetched,
            // but ideally, the API endpoint should accept profile ID or user ID.
            // **Modification needed if API expects user ID instead of profile ID**
            // If API expects USER ID, fetch profile first, then use profileData.user
            // const profileResponse = await getProfileById(profileId);
            // const userId = profileResponse.data?.user;
            // if (!userId) throw new Error("User ID not found for profile");
            // const data = await fetchUserPosts(userId, page); // Use USER ID

            // *** Assuming fetchUserPosts can accept PROFILE ID directly for simplicity ***
            // *** OR that your getMyProjects function actually gets posts by profile ID ***
            // *** Adjust API call as needed ***
            const data = await fetchUserPosts(profileId, page); // Using profileId directly - CHECK BACKEND

            const resultsData = data?.results ?? [];
            setPosts(prev => page === 1 ? resultsData : [...prev, ...resultsData]);
            setTotalResults(data.count || 0);
            const pageSize = 10; // Match backend pagination page size
            setTotalPages(Math.ceil((data.count || 0) / pageSize));
            setCurrentPage(page);

        } catch (err) {
            console.error("Failed to fetch user's posts:", err);
            setError("Could not load posts.");
            if (page === 1) setPosts([]);
        } finally {
            setIsLoading(false);
        }
    }, [profileId]); // Dependency on profileId

    // Load first page on mount or when profileId changes
    useEffect(() => {
        loadPosts(1);
    }, [loadPosts]); // Depend on the memoized loadPosts function

    const handlePageChange = (event, value) => {
        if (value !== currentPage) {
            loadPosts(value);
        }
    };

     // Handler to remove post from list if deleted within ShowPost
     const handlePostDeletion = useCallback((deletedPostId) => {
        setPosts(prev => prev.filter(p => p.id !== deletedPostId));
        setTotalResults(prev => Math.max(0, prev - 1));
    }, []);

    return (
        <Box sx={{ maxWidth: '800px', margin: 'auto', p: 2, pt: { xs: 12, md: 6 } }}>
             <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'white', mb: 3 }}>
                Posts by <Link to={`/profiles/${profileId}`} style={{ color: '#7a2226', textDecoration: 'none' }}>@{profileUsername}</Link>
            </Typography>

            {isLoading && posts.length === 0 && (
                <Box textAlign="center" py={5}><CircularProgress color="inherit" /></Box>
            )}
            {error && (
                <Alert severity="error" variant="filled" sx={{ my: 2 }}>{error}</Alert>
            )}
            {!isLoading && !error && posts.length === 0 && (
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center', backgroundColor: '#3a3a3a', borderRadius: '8px' }}>
                    <Typography sx={{ color: 'grey.400' }}>
                        This user hasn't posted anything yet.
                    </Typography>
                </Paper>
            )}

            {!error && posts.length > 0 && (
                <>
                    <Typography sx={{ color: 'grey.400', mb: 2 }}>Found {totalResults} post(s)</Typography>
                    <Box className="space-y-6">
                        {posts.map((post) => (
                            <ShowPost
                                key={post.id}
                                postData={post}
                                onDeletePost={handlePostDeletion}
                            />
                        ))}
                    </Box>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <Box display="flex" justifyContent="center" mt={4}>
                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="secondary" // Or primary
                                sx={{ '& .MuiPaginationItem-root': { color: 'white' } }}
                            />
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
}

export default UserPostsPage;
