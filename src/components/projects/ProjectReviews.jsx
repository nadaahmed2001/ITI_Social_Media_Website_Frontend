// src/components/projects/ProjectReviews.jsx (Create this file)
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { getProjectReviews, addProjectReview, updateProjectReview, deleteProjectReview } from '../services/api'; // Adjust path
import AuthContext from '../../contexts/AuthContext'; // Adjust path
import TimeAgo from '../TimeAgo'; // Adjust path
import {
    Typography, CircularProgress, Alert, Avatar, Box, Button, TextField,
    List, ListItem, ListItemAvatar, ListItemText, Divider, IconButton, Pagination, Rating // Added Rating
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt'; // Filled Up
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt'; // Filled Down
import {Paper} from '@mui/material';
import {Link} from 'react-router-dom'


const DEFAULT_USER_AVATAR = '../../src/assets/images/user-default.webp'; // Verify path

function ProjectReviews({ projectId, projectOwnerId }) {
    const { user: loggedInUser } = useContext(AuthContext);
    const currentUserId = loggedInUser?.id; // Assuming User ID is needed

    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 0 });

    // State for the review form
    const [reviewBody, setReviewBody] = useState('');
    const [reviewVote, setReviewVote] = useState(null); // 'up', 'down', or null
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [editingReview, setEditingReview] = useState(null); // Holds the review being edited

    // Fetch reviews function
    const loadReviews = useCallback(async (page = 1) => {
        if (!projectId) return;
        setIsLoading(true); setError(null);
        try {
            const data = await getProjectReviews(projectId, page);
            setReviews(data.results || []);
            const pageSize = 10; // Match backend
            setPagination({
                currentPage: page,
                totalPages: Math.ceil((data.count || 0) / pageSize)
            });
        } catch (err) {
            setError("Could not load reviews."); console.error(err); setReviews([]);
        } finally {
            setIsLoading(false);
        }
    }, [projectId]);

    // Load reviews on mount or when project ID changes
    useEffect(() => {
        loadReviews(1);
    }, [loadReviews]);

    const handlePageChange = (event, value) => {
        if (value !== pagination.currentPage) {
            loadReviews(value);
        }
    };

    // Handle form submission (Add or Edit)
    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!reviewBody.trim() && !reviewVote) {
            setSubmitError("Please write a comment or select a vote.");
            return;
        }
        if (!loggedInUser) {
            setSubmitError("You must be logged in to leave a review.");
            return; // Or redirect
        }

        setIsSubmitting(true); setSubmitError('');
        const reviewData = { body: reviewBody.trim(), vote: reviewVote };

        try {
            if (editingReview) {
                // Update existing review
                await updateProjectReview(projectId, editingReview.id, reviewData);
                // Update review in the list locally
                setReviews(prev => prev.map(r => r.id === editingReview.id ? { ...r, ...reviewData, reviewer: r.reviewer } : r)); // Keep reviewer data
                setEditingReview(null); // Exit edit mode
            } else {
                // Add new review
                const newReview = await addProjectReview(projectId, reviewData);
                // Prepend new review (ensure API returns reviewer info)
                 if (!newReview.reviewer && loggedInUser) { // Add reviewer info if missing
                     newReview.reviewer = {
                         id: loggedInUser.id,
                         username: loggedInUser.username,
                         profile_picture: loggedInUser.profile?.profile_picture,
                         profile_id: loggedInUser.profile?.id
                     };
                 }
                setReviews(prev => [newReview, ...prev]);
                 // Reset pagination if needed, or just update count? For simplicity, maybe refetch page 1 later
            }
            // Reset form
            setReviewBody('');
            setReviewVote(null);
        } catch (err) {
            console.error("Failed to submit review:", err);
            setSubmitError(err.response?.data?.detail || err.response?.data?.non_field_errors?.[0] || "Failed to save review.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle starting an edit
    const handleEditClick = (review) => {
        setEditingReview(review);
        setReviewBody(review.body || '');
        setReviewVote(review.vote || null);
        setSubmitError(''); // Clear previous errors
        // Optional: scroll to form
    };

    // Handle cancelling an edit
    const handleCancelEdit = () => {
        setEditingReview(null);
        setReviewBody('');
        setReviewVote(null);
        setSubmitError('');
    };

    // Handle deleting a review
    const handleDeleteReview = async (reviewId) => {
        if (!reviewId || !window.confirm("Are you sure you want to delete your review?")) return;

        // Add loading state for deletion if needed
        try {
            await deleteProjectReview(projectId, reviewId);
            setReviews(prev => prev.filter(r => r.id !== reviewId)); // Remove from list
        } catch (error) {
            console.error("Failed to delete review:", error);
            alert("Could not delete review.");
        }
    };

    // Determine if the current user has already reviewed
    const userHasReviewed = reviews.some(review => review.reviewer?.id === loggedInUser?.id);
    const canShowForm = loggedInUser && (!userHasReviewed || !!editingReview); // Show if logged in AND (haven't reviewed OR editing)

    return (
        <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#191918', mb: 2 }}>Reviews & Feedback</Typography>

            {/* --- Review Submission Form --- */}
            {canShowForm && (
                <Paper elevation={1} sx={{ p: 2, mb: 4, backgroundColor: 'white', borderRadius: '8px' }}>
                    <Typography variant="subtitle1" sx={{ color: '#191918', mb: 1.5 }}>
                        {editingReview ? `Editing Your Review` : `Leave a Review`}
                    </Typography>
                    <Box component="form" onSubmit={handleReviewSubmit}>
                        <TextField
                            fullWidth multiline rows={3}
                            placeholder="Share your thoughts on this project..."
                            value={reviewBody}
                            onChange={(e) => setReviewBody(e.target.value)}
                            variant="filled"
                            sx={{
                                mb: 1.5,
                                textarea: { color: '#191918' },
                                '.MuiFilledInput-root': { backgroundColor: 'rgba(255,255,255,0.09)' },
                            }}
                        />
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                             {/* Vote Buttons */}
                             <Box display="flex" gap={1}>
                                 <IconButton
                                     onClick={() => setReviewVote(prev => prev === 'up' ? null : 'up')}
                                     color={reviewVote === 'up' ? 'success' : 'inherit'}
                                     sx={{ border: '1px solid', borderColor: reviewVote === 'up' ? 'success.main' : 'grey.700', p: 0.8 }}
                                     title="Recommend (Up Vote)"
                                 >
                                     {reviewVote === 'up' ? <ThumbUpAltIcon fontSize="small"/> : <ThumbUpAltOutlinedIcon fontSize="small"/>}
                                 </IconButton>
                                 <IconButton
                                     onClick={() => setReviewVote(prev => prev === 'down' ? null : 'down')}
                                     color={reviewVote === 'down' ? 'error' : 'inherit'}
                                     sx={{ border: '1px solid', borderColor: reviewVote === 'down' ? 'error.main' : 'grey.700', p: 0.8 }}
                                     title="Not Recommended (Down Vote)"
                                 >
                                     {reviewVote === 'down' ? <ThumbDownAltIcon fontSize="small"/> : <ThumbDownAltOutlinedIcon fontSize="small"/>}
                                 </IconButton>
                             </Box>
                             {/* Submit/Cancel Buttons */}
                            <Box>
                                {editingReview && (
                                    <Button onClick={handleCancelEdit} disabled={isSubmitting} sx={{ mr: 1, color: 'grey.400' }}>
                                        Cancel Edit
                                    </Button>
                                )}
                                <Button type="submit" variant="contained" disabled={isSubmitting || (!reviewBody.trim() && !reviewVote)} sx={{backgroundColor: '#7a2226', '&:hover': {backgroundColor: '#5a181b'}}}>
                                    {isSubmitting ? <CircularProgress size={24} color="inherit"/> : (editingReview ? 'Update Review' : 'Submit Review')}
                                </Button>
                            </Box>
                        </Box>
                         {submitError && <Alert severity="error" sx={{ mt: 2 }}>{submitError}</Alert>}
                    </Box>
                </Paper>
            )}
            {!loggedInUser && (
                 <Alert severity="info" sx={{ mb: 3 }}>Please <Link to="/login" style={{color: 'lightblue'}}>log in</Link> to leave a review.</Alert>
            )}
            {loggedInUser && userHasReviewed && !editingReview && (
                 <Typography variant="body2" sx={{ color: 'grey.400', fontStyle: 'italic', mb: 3 }}>You have already reviewed this project.</Typography>
            )}


            {/* --- Review List --- */}
            {isLoading && reviews.length === 0 && ( <Box textAlign="center" py={3}><CircularProgress size={30} color="inherit" /></Box> )}
            {error && !isLoading && ( <Alert severity="warning" variant="outlined" sx={{ my: 2 }}>{error}</Alert> )}
            {!isLoading && !error && reviews.length === 0 && !canShowForm && ( // Show only if form isn't shown either
                <Typography sx={{ color: 'grey.500', textAlign: 'center', mt: 3 }}> No reviews yet. </Typography>
            )}

            {!error && reviews.length > 0 && (
                <List sx={{ width: '100%' }}>
                    {reviews.map((review, index) => (
                        <React.Fragment key={review.id}>
                            <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                                <ListItemAvatar sx={{ mt: 0.5 }}>
                                    <Link to={`/profiles/${review.reviewer?.profile_id}`}>
                                        <Avatar
                                            alt={review.reviewer?.username}
                                            src={review.reviewer?.profile_picture || DEFAULT_USER_AVATAR}
                                            sx={{ width: 36, height: 36 }}
                                        />
                                    </Link>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Box>
                                                <Link to={`/profiles/${review.reviewer?.profile_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                    <Typography component="span" variant="body2" sx={{ fontWeight: 'medium', color: 'white' }}>
                                                        {review.reviewer?.username || 'Unknown User'}
                                                    </Typography>
                                                </Link>
                                                <Typography component="span" variant="caption" sx={{ color: 'grey.500', ml: 1 }}>
                                                   ・ <TimeAgo timestamp={review.created} />
                                                </Typography>
                                            </Box>
                                            {/* Edit/Delete buttons */}
                                            {loggedInUser?.id === review.reviewer?.id && (
                                                <Box>
                                                    <IconButton size="small" onClick={() => handleEditClick(review)} title="Edit Review">
                                                        <EditIcon fontSize="inherit" sx={{ color: 'grey.500', '&:hover': { color: 'white'} }}/>
                                                    </IconButton>
                                                    <IconButton size="small" onClick={() => handleDeleteReview(review.id)} title="Delete Review">
                                                        <DeleteIcon fontSize="inherit" sx={{ color: 'grey.500', '&:hover': { color: 'red'} }}/>
                                                    </IconButton>
                                                </Box>
                                            )}
                                        </Box>
                                    }
                                    secondary={
                                        <>
                                            {/* Display Vote */}
                                            {review.vote && (
                                                <Box display="flex" alignItems="center" my={0.5}>
                                                    {review.vote === 'up' ?
                                                        <ThumbUpAltIcon fontSize="inherit" sx={{ color: 'success.light', mr: 0.5 }} /> :
                                                        <ThumbDownAltIcon fontSize="inherit" sx={{ color: 'error.light', mr: 0.5 }} />
                                                    }
                                                    <Typography variant="caption" sx={{ fontWeight: 'medium', color: review.vote === 'up' ? 'success.light' : 'error.light' }}>
                                                        {review.vote === 'up' ? 'Recommends' : 'Doesn\'t Recommend'}
                                                    </Typography>
                                                </Box>
                                            )}
                                            {/* Display Body */}
                                            <Typography component="p" variant="body2" sx={{ color: 'grey.300', whiteSpace: 'pre-wrap' }}>
                                                {review.body}
                                            </Typography>
                                        </>
                                    }
                                />
                            </ListItem>
                            {index < reviews.length - 1 && <Divider variant="inset" component="li" sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />}
                        </React.Fragment>
                    ))}
                </List>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={3}>
                    <Pagination
                        count={pagination.totalPages}
                        page={pagination.currentPage}
                        onChange={handlePageChange}
                        color="secondary"
                        sx={{ '& .MuiPaginationItem-root': { color: 'white' } }}
                    />
                </Box>
            )}
        </Box>
    );
}

export default ProjectReviews;
