// src/pages/FollowerListPage.jsx (Create this file)

import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getFollowers, getProfileById } from '../components/services/api'; // Adjust path
import AuthContext from '../contexts/AuthContext'; // Adjust path
import FollowButton from '../components/profiles/FollowButton'; // Adjust path
import {
    Typography, CircularProgress, Alert, Avatar, Box, Paper, Button,
    List, ListItem, ListItemAvatar, ListItemText, Divider
} from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';


const DEFAULT_USER_AVATAR = '../../src/assets/images/user-default.webp'; // Verify path

function FollowerListPage() {
    const { profileId } = useParams();
    const { user: loggedInUser } = useContext(AuthContext);

    const [listUsers, setListUsers] = useState([]);
    const [profileUsername, setProfileUsername] = useState(''); // To display "Followers of X"
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ currentPage: 1, hasNextPage: false });
    const navigate = useNavigate();

    // Fetch the profile being viewed (just for the username in title)
    useEffect(() => {
        getProfileById(profileId)
            .then(response => setProfileUsername(response.data?.username || 'User'))
            .catch(() => setProfileUsername('User')); // Handle error case
    }, [profileId]);

    // Function to load followers
    const loadFollowers = useCallback(async (page = 1) => {
        if (!profileId) return;
        setIsLoading(true); // Always show loading when fetching
        setError(null);
        try {
            const data = await getFollowers(profileId, page); // Call API
            // Ensure results is always an array
            const resultsData = data?.results ?? [];
            setListUsers(prev => page === 1 ? resultsData : [...prev, ...resultsData]);
            setPagination({
                currentPage: page,
                hasNextPage: data?.next !== null
            });
        } catch (err) {
            console.error("Failed to fetch followers:", err);
            setError("Could not load followers list.");
            if (page === 1) setListUsers([]);
        } finally {
            setIsLoading(false);
        }
    }, [profileId]);

    // Load first page on mount or when profileId changes
    useEffect(() => {
        loadFollowers(1);
    }, [loadFollowers]);

    // Handler for FollowButton toggle (optional: update button state locally)
    const handleFollowUpdateInList = (targetUserId, nowFollowing) => {
        // This is tricky because the button reflects loggedInUser -> listedUser,
        // not the profile owner -> listedUser.
        // We might just let the FollowButton handle its own state based on its API call result.
        // Or, if the API returns the updated user object, update it in the listUsers state.
        console.log(`Follow status changed for user ${targetUserId}. Now following: ${nowFollowing}`);
        // Example state update (if API returned updated user):
        // setListUsers(prev => prev.map(u => u.id === targetUserId ? {...u, is_following: nowFollowing} : u));
    };

    return (
        <Box sx={{ width: '80%', maxWidth: '950px', margin: 'auto', marginTop: 9, p: 2, pt: { xs: 12, md: 6 } }}>
            <Paper elevation={2} sx={{ p: { xs: 2, md: 3 }, backgroundColor: '#EDEDED', color: 'white', borderRadius: '10px' }}>
                <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: '600', color: '#191918', mb: 3 }}>
                    Followers of <Link to={`/profiles/${profileId}`} style={{fontWeight: 'bolder', color: '#7a2226', textDecoration: 'none' }}>@{profileUsername}</Link>
                </Typography>

                {isLoading && listUsers.length === 0 && (
                    <Box textAlign="center" py={5}><CircularProgress color="inherit" /></Box>
                )}
                {error && (
                    <Alert severity="error" variant="filled" sx={{ my: 2 }}>{error}</Alert>
                )}
                {!isLoading && !error && listUsers.length === 0 && (
                    <Typography sx={{ color: 'grey.500', textAlign: 'center', mt: 4 }}>
                        This user has no followers yet.
                    </Typography>
                )}

                {!error && listUsers.length > 0 && (
                    <List sx={{ width: '100%' }}>
                        {listUsers.map((listUser, index) => (
                            <React.Fragment key={listUser.id}>
                                <ListItem
                                    alignItems="center"
                                    secondaryAction={
                                        // Show FollowButton if logged in and not the listed user themselves
                                        loggedInUser && loggedInUser.id !== listUser.id && (
                                            <>
                                                <FollowButton
                                                    profileId={listUser.profile_id} // Pass the PROFILE ID of the user in the list
                                                    isInitiallyFollowing={listUser.is_following} // Use status from API
                                                    onFollowToggle={(nowFollowing) => handleFollowUpdateInList(listUser.id, nowFollowing)}
                                                />
                                                
                                                <Button
                                                variant="contained"
                                                size="small"
                                                startIcon={<ChatBubbleOutlineIcon />}
                                                onClick={() => navigate(`/messagesList/private/${listUser.id}`)} 
                                                sx={{
                                                    backgroundColor: '#555', 
                                                    color: 'white',
                                                    textTransform: 'none',
                                                    fontWeight: 'bold',
                                                    '&:hover': { backgroundColor: '#666' },
                                                    marginLeft: 2,
                                                }}
                                            >
                                                Message
                                            </Button>
                                            
                                            </>
                                            
                                        )
                                    }
                                    sx={{ paddingLeft: 0, paddingRight: 0 }}
                                >
                                    <ListItemAvatar>
                                        <Link to={`/profiles/${listUser.profile_id}`}>
                                            <Avatar
                                                alt={listUser.username}
                                                src={listUser.profile_picture || DEFAULT_USER_AVATAR}
                                                sx={{ width: 40, height: 40, border: '1px solid #555' }}
                                                imgProps={{ onError: (e) => { if (e.target.src !== DEFAULT_USER_AVATAR) e.target.src = DEFAULT_USER_AVATAR; } }}
                                            />
                                        </Link>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Link to={`/profiles/${listUser.profile_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                <Typography component="span" variant="body1" sx={{ color: '#191918', fontWeight: 'bold', fontSize: '1.2rem', textAlign: 'left', marginLeft: 1 }}>
                                                    {(listUser.first_name && listUser.last_name) ? (`${listUser.first_name} ${listUser.last_name}`) : (listUser.username)} 
                                                </Typography>
                                            </Link>
                                        }
                                        // Optional: Add secondary text like headline if available in MinimalUserSerializer
                                        secondary={listUser.headline ? listUser.headline : ''}
                                    />
                                </ListItem>
                                {index < listUsers.length - 1 && <Divider variant="inset" component="li" sx={{ borderColor: '#2E2E2F', maxWidth: '85%' , marginLeft: 'auto', marginRight: 'auto', marginTop: 1, marginBottom: 1}} />}
                            </React.Fragment>
                        ))}
                    </List>
                )}

                {/* Load More Button */}
                {pagination.hasNextPage && (
                    <Box display="flex" justifyContent="center" mt={3}>
                        <Button
                            variant="outlined"
                            onClick={() => loadFollowers(pagination.currentPage + 1)}
                            disabled={isLoading}
                            sx={{ color: '#ccc', borderColor: '#555', '&:hover': { borderColor: '#777', backgroundColor: 'rgba(255, 255, 255, 0.08)' } }}
                        >
                            {isLoading ? <CircularProgress size={24} color="inherit"/> : 'Load More'}
                        </Button>
                    </Box>
                )}
            </Paper>
        </Box>
    );
}

export default FollowerListPage;