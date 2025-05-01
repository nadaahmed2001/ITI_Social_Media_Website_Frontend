import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { fetchProjectFeed, likeProject, unlikeProject } from '../components/services/api'; // Adjust path
import AuthContext from '../contexts/AuthContext'; // Adjust path
import ProjectCard from '../components/projects/ProjectCard'; // Adjust path
import {
    Typography, CircularProgress, Alert, Box, Paper, Button, Pagination,
    Select, MenuItem, FormControl, InputLabel, Grid
} from '@mui/material';

function ProjectFeedPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext); // Get logged-in user status

    // State for feed data
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for pagination and sorting
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [ordering, setOrdering] = useState('-created'); // Default sort: latest

    // Function to fetch the feed
    const loadFeed = useCallback(async (page = 1, sortOrder = '-created') => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchProjectFeed(sortOrder, page);
            setProjects(data.results || []);
            const pageSize = 12; // Match backend pagination
            setTotalPages(Math.ceil((data.count || 0) / pageSize));
            setCurrentPage(page);
            setOrdering(sortOrder); // Ensure local state matches fetched order

            // Update URL params (optional, good for bookmarking/sharing)
            const currentParams = new URLSearchParams(searchParams);
            currentParams.set('page', page.toString());
            currentParams.set('ordering', sortOrder);
            // Use replace to avoid bloating browser history on sort/page change
            navigate(`?${currentParams.toString()}`, { replace: true });

        } catch (err) {
            console.error("Failed to fetch project feed:", err);
            setError("Could not load project feed.");
            setProjects([]);
        } finally {
            setIsLoading(false);
        }
    }, [navigate, searchParams]); // Add navigate/searchParams dependencies

    // Load feed based on URL params on initial mount and when params change
    useEffect(() => {
        const initialPage = parseInt(searchParams.get('page') || '1', 10);
        const initialOrdering = searchParams.get('ordering') || '-created';
        setCurrentPage(initialPage); // Set state from URL
        setOrdering(initialOrdering);
        loadFeed(initialPage, initialOrdering);
    }, [searchParams, loadFeed]); // Rerun if URL params change


    // --- Handlers ---
    const handlePageChange = (event, value) => {
        if (value !== currentPage) {
            loadFeed(value, ordering); // Fetch new page with current sort order
        }
    };

    const handleSortChange = (event) => {
        const newOrdering = event.target.value;
        if (newOrdering !== ordering) {
            loadFeed(1, newOrdering); // Fetch page 1 with new sort order
        }
    };

    // Handler for like toggle (passed down to ProjectCard)
    // Implements optimistic update for the feed list
    const handleLikeToggle = useCallback(async (projectId, currentlyLiked) => {
        if (!user) return; // Should be handled by button, but double-check

        // --- Optimistic Update ---
        setProjects(prevProjects => prevProjects.map(p => {
            if (p.id === projectId) {
                return {
                    ...p,
                    current_user_like_id: currentlyLiked ? null : Date.now(), // Simulate like/unlike
                    likes_count: currentlyLiked ? Math.max(0, p.likes_count - 1) : p.likes_count + 1,
                };
            }
            return p;
        }));
        // --- End Optimistic Update ---

        try {
            if (currentlyLiked) {
                await unlikeProject(projectId);
            } else {
                await likeProject(projectId);
            }
            // Optional: Refetch after API call to ensure data consistency
            // loadFeed(currentPage, ordering);
        } catch (error) {
            console.error("Like toggle failed, reverting optimistic update", error);
            // Revert UI on error by refetching
            loadFeed(currentPage, ordering);
            alert("Failed to update like status.");
        }
    }, [user, loadFeed, currentPage, ordering]); // Include dependencies


    // --- Render ---
    return (
        <Box sx={{ maxWidth: '1200px', margin: 'auto', mt: 6,  p: 2, pt: { xs: 12, md: 6 } }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
                <Typography variant="h4" component="h1" sx={{ color: 'white' }}>
                    Project Feed
                </Typography>
                {/* Sorting Dropdown */}
                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel id="sort-select-label" sx={{color: 'grey.400'}}>Sort By</InputLabel>
                    <Select
                        labelId="sort-select-label"
                        value={ordering}
                        label="Sort By"
                        onChange={handleSortChange}
                         sx={{
                            color: 'white',
                            '.MuiOutlinedInput-notchedOutline': { borderColor: 'grey.600' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#888' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#7a2226' },
                            '.MuiSvgIcon-root': { color: 'grey.400' },
                            bgcolor: '#3a3a3a' // Match filter background
                        }}
                        MenuProps={{ PaperProps: { sx: { backgroundColor: '#333', color: 'white' } } }}
                    >
                        <MenuItem value="-created">Latest</MenuItem>
                        <MenuItem value="likes">Most Liked</MenuItem>
                        <MenuItem value="created">Oldest</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {isLoading && projects.length === 0 && (
                <Box textAlign="center" py={10}><CircularProgress color="inherit" /></Box>
            )}
            {error && (
                <Alert severity="error" variant="filled" sx={{ my: 2 }}>{error}</Alert>
            )}
            {!isLoading && !error && projects.length === 0 && (
                <Paper elevation={2} sx={{ p: 4, textAlign: 'center', backgroundColor: '#3a3a3a', borderRadius: '8px' }}>
                    <Typography sx={{ color: 'grey.400' }}>
                        No projects found. Be the first to add one!
                    </Typography>
                </Paper>
            )}

            {/* Project Grid */}
            {!isLoading && !error && projects.length > 0 && (
                <Grid container spacing={3}>
                    {projects.map((project) => (
                        <Grid item key={project.id} xs={12} sm={6} md={4} lg={3}>
                            <ProjectCard
                                project={project}
                                onLikeToggle={handleLikeToggle} // Pass the handler
                            />
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Pagination Controls */}
            {!isLoading && totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={5} mb={3}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="secondary" // Or primary
                        sx={{ '& .MuiPaginationItem-root': { color: 'white', borderColor: '#555' } }}
                    />
                </Box>
            )}
        </Box>
    );
}

export default ProjectFeedPage;
