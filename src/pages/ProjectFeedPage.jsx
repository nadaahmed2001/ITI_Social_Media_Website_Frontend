import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { fetchProjectFeed, likeProject, unlikeProject } from '../components/services/api';
import AuthContext from '../contexts/AuthContext';
import ProjectCard from '../components/projects/ProjectCard';
import {
    Typography, CircularProgress, Alert, Box, Paper, Button, Pagination,
    Select, MenuItem, FormControl, InputLabel, Grid
} from '@mui/material';

function ProjectFeedPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    // State for feed data
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for pagination and sorting
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [ordering, setOrdering] = useState('-created');

    const loadFeed = useCallback(async (page = 1, sortOrder = '-created') => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchProjectFeed(sortOrder, page);
            setProjects(data.results || []);
            const pageSize = 12;
            setTotalPages(Math.ceil((data.count || 0) / pageSize));
            setCurrentPage(page);
            setOrdering(sortOrder);

            const currentParams = new URLSearchParams(searchParams);
            currentParams.set('page', page.toString());
            currentParams.set('ordering', sortOrder);
            navigate(`?${currentParams.toString()}`, { replace: true });

        } catch (err) {
            console.error("Failed to fetch project feed:", err);
            setError("Could not load project feed.");
            setProjects([]);
        } finally {
            setIsLoading(false);
        }
    }, [navigate, searchParams]);

    useEffect(() => {
        const initialPage = parseInt(searchParams.get('page') || '1', 10);
        const initialOrdering = searchParams.get('ordering') || '-created';
        setCurrentPage(initialPage);
        setOrdering(initialOrdering);
        loadFeed(initialPage, initialOrdering);
    }, [searchParams, loadFeed]);

    const handlePageChange = (event, value) => {
        if (value !== currentPage) {
            loadFeed(value, ordering);
        }
    };

    const handleSortChange = (event) => {
        const newOrdering = event.target.value;
        if (newOrdering !== ordering) {
            loadFeed(1, newOrdering);
        }
    };

    const handleLikeToggle = useCallback(async (projectId, currentlyLiked) => {
        if (!user) return;

        setProjects(prevProjects => prevProjects.map(p => {
            if (p.id === projectId) {
                return {
                    ...p,
                    current_user_like_id: currentlyLiked ? null : Date.now(),
                    likes_count: currentlyLiked ? Math.max(0, p.likes_count - 1) : p.likes_count + 1,
                };
            }
            return p;
        }));

        try {
            if (currentlyLiked) {
                await unlikeProject(projectId);
            } else {
                await likeProject(projectId);
            }
        } catch (error) {
            console.error("Like toggle failed, reverting optimistic update", error);
            loadFeed(currentPage, ordering);
            alert("Failed to update like status.");
        }
    }, [user, loadFeed, currentPage, ordering]);

    return (
        <Box sx={{ 
            maxWidth: '1200px', 
            margin: 'auto', 
            mt: 6,  
            p: 2, 
            pt: { xs: 12, md: 6 },
            backgroundColor: 'white'
        }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
                <Typography variant="h4" component="h1" sx={{ color: 'grey.900', fontWeight: 600 }}>
                    Project Feed
                </Typography>
                
                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel id="sort-select-label" sx={{ color: 'grey.700' }}>Sort By</InputLabel>
                    <Select
                        labelId="sort-select-label"
                        value={ordering}
                        label="Sort By"
                        onChange={handleSortChange}
                        sx={{
                            color: 'grey.900',
                            '.MuiOutlinedInput-notchedOutline': { borderColor: 'grey.300' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'grey.400' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#7a2226' },
                            '.MuiSvgIcon-root': { color: 'grey.700' },
                            bgcolor: 'white'
                        }}
                        MenuProps={{ 
                            PaperProps: { 
                                sx: { 
                                    backgroundColor: 'white', 
                                    color: 'grey.900',
                                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
                                } 
                            } 
                        }}
                    >
                        <MenuItem value="-created">Latest</MenuItem>
                        <MenuItem value="likes">Most Liked</MenuItem>
                        <MenuItem value="created">Oldest</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {isLoading && projects.length === 0 && (
                <Box textAlign="center" py={10}>
                    <CircularProgress sx={{ color: '#7a2226' }} />
                </Box>
            )}
            
            {error && (
                <Alert severity="error" sx={{ my: 2 }}>
                    {error}
                </Alert>
            )}
            
            {!isLoading && !error && projects.length === 0 && (
                <Paper elevation={2} sx={{ 
                    p: 4, 
                    textAlign: 'center', 
                    backgroundColor: 'grey.50', 
                    borderRadius: '8px' 
                }}>
                    <Typography sx={{ color: 'grey.700' }}>
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
                                onLikeToggle={handleLikeToggle}
        
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
                        color="primary"
                        sx={{ 
                            '& .MuiPaginationItem-root': { 
                                color: 'grey.900',
                                borderColor: 'grey.300',
                                '&.Mui-selected': {
                                    backgroundColor: '#7a2226',
                                    color: 'white'
                                }
                            } 
                        }}
                    />
                </Box>
            )}
        </Box>
    );
}

export default ProjectFeedPage;