// src/pages/ProjectPage.jsx (Create this file)
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProject, likeProject, unlikeProject } from '../components/services/api'; // Adjust path
import AuthContext from '../contexts/AuthContext'; // Adjust path
import ProjectReviews from '../components/projects/ProjectReviews'; // We'll create this next
import {
    Typography, CircularProgress, Alert, Avatar, Box, Paper, Button, Chip, IconButton
} from '@mui/material';
import { FaGithub, FaLinkedin, FaGlobe } from 'react-icons/fa'; // Example social icons
import LanguageIcon from '@mui/icons-material/Language';
import GitHubIcon from '@mui/icons-material/GitHub';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'; // Like outline
import FavoriteIcon from '@mui/icons-material/Favorite'; // Like filled
import TimeAgo from '../components/TimeAgo'; 
import { Divider } from '@mui/material';


const DEFAULT_USER_AVATAR = '../../src/assets/images/user-default.webp'; // Verify path
const DEFAULT_PROJECT_IMAGE = '../../src/assets/images/project-default.jpg'; // Verify path (or use a placeholder service)


function ProjectPage() {
    const { projectId } = useParams(); // Get project ID (UUID) from URL
    const { user: loggedInUser } = useContext(AuthContext);

    const [project, setProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for like button interaction
    const [isLiked, setIsLiked] = useState(false);
    const [likeId, setLikeId] = useState(null); // Store the ID of the like object if liked
    const [likeCount, setLikeCount] = useState(0);
    const [isLikeLoading, setIsLikeLoading] = useState(false);

    // Fetch project details
    const fetchProjectDetails = useCallback(async () => {
        if (!projectId) {
            setError("No project ID provided.");
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            // API endpoint should be /api/projects/<uuid:pk>/
            const response = await getProject(projectId);
            console.log("Project details received:", response.data);
            setProject(response.data);
            // Initialize like state based on fetched data
            setIsLiked(!!response.data?.current_user_like_id); // Check if like ID exists
            setLikeId(response.data?.current_user_like_id || null);
            setLikeCount(response.data?.likes_count || 0);
        } catch (err) {
            setError("Failed to load project details.");
            console.error("Error fetching project:", err.response?.data || err.message || err);
            setProject(null);
        } finally {
            setIsLoading(false);
        }
    }, [projectId]);

    // Fetch data on mount
    useEffect(() => {
        fetchProjectDetails();
    }, [fetchProjectDetails]);

    // Handler for toggling like status
    const handleLikeToggle = async () => {
        if (!loggedInUser) {
            alert("Please log in to like projects."); // Or redirect to login
            return;
        }
        if (isLikeLoading || !project) return;

        setIsLikeLoading(true);
        const currentlyLiked = isLiked; // State before action

        try {
            if (currentlyLiked) {
                await unlikeProject(project.id);
                setIsLiked(false);
                setLikeId(null);
                setLikeCount(prev => Math.max(0, prev - 1)); // Optimistic update
            } else {
                const response = await likeProject(project.id);
                setIsLiked(true);
                setLikeId(response.like_id); // Store like ID from response
                setLikeCount(prev => prev + 1); // Optimistic update
            }
        } catch (error) {
            console.error("Failed to toggle like:", error);
            alert(`Failed to ${currentlyLiked ? 'unlike' : 'like'} project.`);
            // Optional: Revert optimistic update on error
            // setIsLiked(currentlyLiked);
            // setLikeCount(prev => currentlyLiked ? prev + 1 : Math.max(0, prev - 1));
        } finally {
            setIsLikeLoading(false);
        }
    };


    // --- Render Logic ---
    if (isLoading) {
        return ( <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh"> <CircularProgress /> </Box> );
    }
    if (error) {
        return ( <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh" px={2}> <Alert severity="error" variant="filled">{error}</Alert> </Box> );
    }
    if (!project) {
        return ( <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh"> <Typography>Project not found.</Typography> </Box> );
    }

    return (
        <Box sx={{ maxWidth: '400px',   margin: '30px', p: 2, pt: { xs: 12, md: 6 }  }}>
             <div className="">
            <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, backgroundColor: '#e0e0e0', color: '#191918', borderRadius: '12px' }}>

                {/* Project Header */}
                <Box mb={4}>
                    <Typography variant="h6" component="h6" sx={{ fontWeight: 'bold', color: '#191918', mb: 1 }}>
                        {project.title}
                    </Typography>
                    {/* Author Info */}
                    <Box display="flex" alignItems="center" gap={1.5} mb={0}>
                         <Link to={`/profiles/${project.owner?.id}`} style={{ textDecoration: 'none' }}>
                            <Avatar
                                src={project.owner?.profile_picture || DEFAULT_USER_AVATAR}
                                alt={project.owner?.username}
                                sx={{ width: 28, height: 28 }}
                            />
                         </Link>
                         <Typography variant="body2" sx={{ color: 'grey.900' }}>
                            By <Link to={`/profiles/${project.owner?.id}`} style={{ color: '#7a2226', textDecoration: 'none', fontWeight: 'medium' }}>
                                { (project.owner?.first_name && project.owner?.last_name) ? `${project.owner.first_name} ${project.owner.last_name}` : project.owner?.username || 'Unknown User'}
                                </Link>
                        </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: 'grey.900', mb:2, ml:5 }}>
                            Posted <TimeAgo timestamp={project.created} />
                        </Typography>
                    {/* Tags */}
                    {project.tags && project.tags.length > 0 && (
                        <Box display="flex" flexWrap="wrap" gap={1} mb={2} ml={2}>
                            {project.tags.map(tag => (
                                <Chip key={tag.id} label={tag.name} size="small" sx={{ backgroundColor: '#444', color: '#ccc', fontSize: '0.75rem' }} />
                            ))}
                        </Box>
                    )}
                </Box>

                {/* Featured Image */}
                {project.featured_image && (
                    <Box mb={4} sx={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #444' }}>
                        <img
                            src={project.featured_image}
                            alt={`${project.title} preview`}
                            style={{ display: 'block', width: '100%', maxHeight: '500px', objectFit: 'contain', backgroundColor: '#1f1f1f' }}
                            onError={(e) => { if(e.target.src !== DEFAULT_PROJECT_IMAGE) e.target.src = DEFAULT_PROJECT_IMAGE; }}
                        />
                    </Box>
                )}

                {/* Description & Links */}
                <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4} mb={4}>
                    <Box flexGrow={1}>
                        <Typography variant="h6" sx={{  fontWeight: 'bold', color: '#7a2226', mb: 1 }}>Description</Typography>
                        <Typography variant="body2" sx={{ color: 'grey.900', whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                            {project.description || 'No description provided.'}
                        </Typography>
                    </Box>
                    <Box flexShrink={0} width={{ xs: '100%', md: '250px' }}>
                        <Typography variant="h6" sx={{   fontWeight: 'bold', color: '#7a2226', mb: 2 }}>Links</Typography>
                        <Box display="flex" flexDirection="column" gap={1.5}>
                            {project.demo_link && (
                                <Button variant="outlined" size="small" href={project.demo_link} target="_blank" startIcon={<LanguageIcon />} sx={{ maxWidth:'150px', justifyContent: 'flex-start', color: '#191918', borderColor: '#555' }}>
                                    Live Demo
                                </Button>
                            )}
                            {project.source_link && (
                                <Button variant="outlined" size="small" href={project.source_link} target="_blank" startIcon={<GitHubIcon />} sx={{  maxWidth:'150px', justifyContent: 'flex-start', color: '#191918', borderColor: '#555' }}>
                                    Source Code
                                </Button>
                            )}
                            {/* Like Button */}
                            <Button
                                variant={isLiked ? "contained" : "outlined"}
                                size="small"
                                color={isLiked ? "error" : "inherit"} // Use error color when liked
                                disabled={!loggedInUser || isLikeLoading} // Disable if not logged in or loading
                                onClick={handleLikeToggle}
                                startIcon={
                                    isLikeLoading ? <CircularProgress size={16} color="inherit"/> :
                                    (isLiked ? <FavoriteIcon fontSize="small"/> : <FavoriteBorderIcon fontSize="small"/>)
                                }
                                sx={{
                                    justifyContent: 'flex-start',
                                    borderColor: isLiked ? undefined : '#555', // Only show border if not liked
                                    color: isLiked ? 'white' : '#191918',
                                    backgroundColor: isLiked ? '#191918' : undefined, // Red background when liked
                                    maxWidth:'150px',
                                    '&:hover': {
                                        backgroundColor: isLiked ? '#c82333' : 'rgba(255, 255, 255, 0.08)',
                                        borderColor: isLiked ? undefined : '#777',
                                       
                                    }
                                }}
                            >
                                {isLiked ? 'Liked' : 'Like'} ({likeCount})
                            </Button>
                        </Box>
                    </Box>
                </Box>

                {/* Divider */}
                <Divider sx={{ borderColor: '#444', my: 4 }} />

                {/* Reviews Section */}
                <ProjectReviews projectId={project.id} projectOwnerId={project.owner?.id} />

            </Paper>
            </div>
        </Box>
    );
}

export default ProjectPage;
