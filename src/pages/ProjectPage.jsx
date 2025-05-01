// src/pages/ProjectPage.jsx (Create this file)
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProject, likeProject, unlikeProject } from '../components/services/api'; // Adjust path
import AuthContext from '../contexts/AuthContext'; // Adjust path
import ProjectReviews from '../components/projects/ProjectReviews'; // We'll create this next
import {
    Typography, CircularProgress, Alert, Avatar, Box, Paper, Button, Chip, IconButton , styled
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

//

const HeroSection = styled(Box)(({ theme, imageUrl }) => ({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '300px',
    marginBottom: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    backgroundImage: imageUrl ? `url(${imageUrl})` : `url(${DEFAULT_PROJECT_IMAGE})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark overlay for better text contrast
    },
}));

const GlassPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Frosted glass effect
    backdropFilter: 'blur(10px)',
    border: `1px solid rgba(255, 255, 255, 0.2)`,
    borderRadius: theme.shape.borderRadius * 2,
    color: '#f5f5f5', // Light text for dark background
}));

const AccentTypography = styled(Typography)(({ theme }) => ({
    color: theme.palette.secondary.main, // Use a vibrant secondary color
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
}));

const LinkButton = styled(Button)(({ theme }) => ({
    justifyContent: 'flex-start',
    color: theme.palette.info.light,
    borderColor: theme.palette.info.dark,
 
}));

const LikeButton = styled(Button)(({ theme, isLiked }) => ({
    justifyContent: 'flex-start',
    color: isLiked ? theme.palette.grey[900] : theme.palette.grey[400], // Text color
    backgroundColor: isLiked ? theme.palette.grey[400] : 'transparent', // Background color
    borderColor: isLiked ? 'transparent' : theme.palette.grey[400],
    '&:hover': {
      backgroundColor: isLiked ? theme.palette.grey[300] : theme.palette.grey[300], // Lighter gray on hover
      color: theme.palette.common.white,
      borderColor: 'transparent',
    },
    '&:disabled': {
      color: theme.palette.grey[500],
      backgroundColor: theme.palette.grey[200],
      borderColor: theme.palette.grey[300],
    },
  }));


//
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
        <Box sx={{ mt: { xs: 8, md: 12 }, px: 2, display: 'flex', justifyContent: 'center' }}>
            <Box maxWidth="700px" width="100%">
                {/* Hero Section */}
                {project.featured_image && (
                    <HeroSection imageUrl={project.featured_image}>
                        <Typography variant="h4" component="h1" align="center" sx={{ color: 'white', fontWeight: 'bold', position: 'relative', zIndex: 1 }}>
                            {project.title}
                        </Typography>
                    </HeroSection>
                )}

                {/* Main Content */}
                <GlassPaper elevation={12}>
                    {/* Author Info */}
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                        <Box display="flex" alignItems="center" gap={2}>
                            <Link to={`/profiles/${project.owner?.id}`} style={{ textDecoration: 'none' }}>
                                <Avatar
                                    src={project.owner?.profile_picture || DEFAULT_USER_AVATAR}
                                    alt={project.owner?.username}
                                    sx={{ width: 40, height: 40 }}
                                />
                            </Link>
                            <Typography variant="subtitle1" sx={{ color: 'gray' }}>
                                By <Link to={`/profiles/${project.owner?.id}`} style={{ color: 'gray', textDecoration: 'none', fontWeight: 'bold' }}>
                                    { (project.owner?.first_name && project.owner?.last_name) ? `${project.owner.first_name} ${project.owner.last_name}` : project.owner?.username || 'Unknown User'}
                                </Link>
                            </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: 'grey.900' }}>
                            Posted <TimeAgo timestamp={project.created}/>
                        </Typography>
                    </Box>

                    {/* Tags */}
                    {project.tags && project.tags.length > 0 && (
                        <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
                            {project.tags.map(tag => (
                                <Chip key={tag.id} label={tag.name} size="small" sx={{ backgroundColor: '#333', color: '#eee', fontSize: '0.8rem' }} />
                            ))}
                        </Box>
                    )}

                    {/* Description */}
                    <Box mb={4}>
                        <AccentTypography variant="h6" component="h2" sx={{ color: '#7a2226' }} >Description</AccentTypography>
                        <Typography variant="body1" sx={{ color: 'grey.800', whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                            {project.description || 'No description provided.'}
                        </Typography>
                    </Box>

                    {/* Links & Actions */}
                    <Box display="flex" flexDirection={{  xs: 'column', md: 'row' }} gap={2} alignItems="flex-start" mb={4}>
                        <Box>
                            <AccentTypography variant="h6" component="h3"  sx={{ color: '#7a2226' }} >Links</AccentTypography>
                            <Box display="flex" flexDirection="column" gap={1.5}>
                                {project.demo_link && (
                                    <LinkButton size="small" href={project.demo_link} target="_blank" startIcon={<LanguageIcon className='text-[#7a2226]' />} fullWidth sx={{ maxWidth: '200px',  color: '#1f2937' }}>
                                        Live Demo
                                    </LinkButton>
                                )}
                                {project.source_link && (
                                    <LinkButton size="small" href={project.source_link} target="_blank" startIcon={<GitHubIcon className='text-[#7a2226]'/>} fullWidth sx={{ maxWidth: '200px',  color: '#1f2937' }}>
                                        Source Code
                                    </LinkButton>
                                )}
                            </Box>
                        </Box>

                        {/* Like Button */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: { xs: 2, md: 0 } }}>
                            <LikeButton
                                isLiked={isLiked}
                                size="small"
                                disabled={!loggedInUser || isLikeLoading}
                                onClick={handleLikeToggle}
                                startIcon={
                                    isLikeLoading ? <CircularProgress size={16} color="black"/> :
                                    (isLiked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" className='text-[#7a2226]'/>)
                                }
                            >
                                {isLiked ? 'Liked' : 'Like'} ({likeCount})
                            </LikeButton>
                        </Box>
                    </Box>
                    <hr></hr>
                    {/* Divider */}
                    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 4 }} />

                    {/* Reviews Section */}
                    <AccentTypography variant="h6" component="h2" sx={{color:'#7a2226'}}>Reviews</AccentTypography>
                    <ProjectReviews projectId={project.id} projectOwnerId={project.owner?.id} />

                </GlassPaper>
            </Box>
        </Box>
    );
}

export default ProjectPage;
