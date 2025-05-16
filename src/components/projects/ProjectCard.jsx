import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Box, Paper, Chip, Avatar, IconButton, Tooltip } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LanguageIcon from '@mui/icons-material/Language';
import GitHubIcon from '@mui/icons-material/GitHub';
import AuthContext from '../../contexts/AuthContext'; // Adjust path

const DEFAULT_PROJECT_IMAGE = '../../src/assets/images/user-default.webp'; // Adjust path
const DEFAULT_USER_AVATAR = '../../src/assets/images/user-default.webp'; // Adjust path

// Receive like toggle handler as prop
function ProjectCard({ project, onLikeToggle }) {
  const { user } = useContext(AuthContext);
  const isLoggedIn = !!user;

  // Extract necessary data, providing defaults
  const {
    id,
    title = "Untitled Project",
    description = "",
    featured_image = DEFAULT_PROJECT_IMAGE,
    owner = {}, // Default to empty object if owner is null/undefined
    tags = [],
    likes_count = 0,
    current_user_like_id = null, // ID of the like if user liked it
    demo_link,
    source_link
  } = project || {}; // Default to empty object if project itself is null

  const handleLikeClick = (e) => {
      e.preventDefault(); // Prevent link navigation if clicking like button inside a link
      e.stopPropagation();
      if (!isLoggedIn) {
          alert("Please log in to like projects."); // Or redirect/show modal
          return;
      }
      // Call the handler passed from the parent (ProjectFeedPage)
      if (onLikeToggle) {
          onLikeToggle(id, !!current_user_like_id); // Pass project ID and current like status
      }
  };

  return (
    <Paper
        elevation={2}
        sx={{
            backgroundColor: '#eeeeee',
            color: 'white',
            borderRadius: '10px',
            overflow: 'hidden', // Clip image corners
            height: '100%', // Make card fill grid item height
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)'
            }
        }}
    >
      <Link to={`/projects/${id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        <Box sx={{ height: 160, overflow: 'hidden', position: 'relative', backgroundColor:'#1f1f1f' }}>
          <img
            src={featured_image || DEFAULT_PROJECT_IMAGE}
            alt={`${title} preview`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { if (e.target.src !== DEFAULT_PROJECT_IMAGE) e.target.src = DEFAULT_PROJECT_IMAGE; }}
          />
        </Box>
      </Link>
      <Box p={2} flexGrow={1} display="flex" flexDirection="column"> {/* Content padding & grow */}
        {/* Title */}
        <Link to={`/projects/${id}`} style={{ textDecoration: 'none', color: ' #212121'}}>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 'medium', color: '#212121', mb: 1, '&:hover': { color: '#7a2226' } }}>
            {title}
            </Typography>
        </Link>

        {/* Owner Info */}
        <Box display="flex" alignItems="center" gap={1} mb={1.5}>
           <Link to={`/profiles/${owner?.id}`} onClick={(e) => e.stopPropagation()}>
                <Avatar src={owner?.profile_picture || DEFAULT_USER_AVATAR} sx={{ width: 24, height: 24 }} />
           </Link>
           <Link to={`/profiles/${owner?.id}`} style={{ textDecoration: 'none' }}>
                <Typography variant="caption" sx={{ color: 'grey.800', '&:hover': { color: '#7a2226' } }}>
                    {owner?.username || 'Unknown'}
                </Typography>
           </Link>
        </Box>

        {/* Description Snippet */}
        <Typography variant="body2" sx={{ color: 'grey.800', mb: 2, flexGrow: 1, // Allow description to take space
            display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {description || "No description."}
        </Typography>

        {/* Tags */}
        {tags.length > 0 && (
          <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
            {tags.slice(0, 4).map(tag => ( // Show limited tags
              <Chip key={tag.id} label={tag.name} size="small" sx={{ backgroundColor: '#555', color: '#ddd', fontSize: '0.7rem' }} />
            ))}
          </Box>
        )}

        {/* Footer: Links & Likes */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mt="auto"> {/* Push to bottom */}
            {/* Project Links */}
            <Box display="flex" gap={1}>
                {demo_link && (
                    <Tooltip title="Live Demo">
                        <IconButton size="small" href={demo_link} target="_blank" sx={{ color: '#aaa', '&:hover': { color: 'white'} }}>
                            <LanguageIcon fontSize="small"/>
                        </IconButton>
                    </Tooltip>
                )}
                 {source_link && (
                    <Tooltip title="Source Code">
                        <IconButton size="small" href={source_link} target="_blank" sx={{ color: '#aaa', '&:hover': { color: 'white'} }}>
                            <GitHubIcon fontSize="small"/>
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
             {/* Like Button & Count */}
             <Box display="flex" alignItems="center">
                <Tooltip title={isLoggedIn ? (current_user_like_id ? 'Unlike' : 'Like') : 'Login to like'}>
                    {/* Span needed for tooltip when button is disabled */}
                    <span>
                        <IconButton
                            size="small"
                            onClick={handleLikeClick}
                            disabled={!isLoggedIn} // Disable if not logged in
                            sx={{
                                color: current_user_like_id ? 'error.main' : '#aaa',
                                '&:hover': { color: current_user_like_id ? 'error.dark' : 'white' }
                            }}
                        >
                            {current_user_like_id ? <FavoriteIcon fontSize="small"/> : <FavoriteBorderIcon fontSize="small"/>}
                        </IconButton>
                    </span>
                </Tooltip>
                <Typography variant="caption" sx={{ color: '#aaa', ml: 0.5 }}>
                    {likes_count}
                </Typography>
             </Box>
        </Box>
      </Box>
    </Paper>
  );
}

export default ProjectCard;