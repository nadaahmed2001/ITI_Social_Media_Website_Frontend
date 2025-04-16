import React, { useState, useEffect, useContext } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { followUser, unfollowUser } from '../../components/services/api';
import AuthContext from '../../contexts/AuthContext'; 




function FollowButton({ profileId, isInitiallyFollowing, onFollowToggle }) {
  const { user } = useContext(AuthContext); // Get current logged-in user
  const [isFollowing, setIsFollowing] = useState(isInitiallyFollowing);
  const [isLoading, setIsLoading] = useState(false);

// Update internal state if the initial prop changes (e.g., parent refetches data)
  useEffect(() => {
      setIsFollowing(isInitiallyFollowing);
  }, [isInitiallyFollowing]);

  // Don't show button if no user logged in or if viewing own profile
  if (!user || !profileId || user.profile?.id === profileId) {
      return null;
  }

  const handleClick = async () => {
      if (!profileId) return; // Safety check
      setIsLoading(true);
      try {
      let result;
      if (isFollowing) {
          result = await unfollowUser(profileId);
          setIsFollowing(false);
          if (onFollowToggle) onFollowToggle(false); // Notify parent: now NOT following
          console.log('Unfollow successful:', result);
      } else {
          result = await followUser(profileId);
          setIsFollowing(true);
          if (onFollowToggle) onFollowToggle(true); // Notify parent: now IS following
          console.log('Follow successful:', result);
      }
      } catch (error) {
      console.error("Follow/Unfollow action failed:", error);
      // Optional: Show an error message to the user via toast/alert
      // Revert state if API call failed? Or rely on parent refetch?
      setIsFollowing(isInitiallyFollowing); // Example revert (might cause flicker)
      } finally {
      setIsLoading(false);
      }
  };

  return (
      <Button
      variant={isFollowing ? "outlined" : "contained"}
      // Example using primary/secondary, adjust as needed
      color={isFollowing ? "secondary" : "primary"}
      size="small"
      onClick={handleClick}
      disabled={isLoading}
      sx={{
          minWidth: '100px', // Give button consistent width
          textTransform: 'none', // Prevent uppercase text
          fontWeight: 'bold',
          transition: 'background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease',
          // Example specific colors (adjust to your theme)
          '&.MuiButton-containedPrimary': {
              backgroundColor: '#7a2226', // Your accent color for Follow
              '&:hover': { backgroundColor: '#5a181b' }
          },
          '&.MuiButton-outlinedSecondary': {
              borderColor: '#aaa', // Example border for Following
              color: '#aaa', // Example text color for Following
              '&:hover': { borderColor: '#ccc', backgroundColor: 'rgba(200, 200, 200, 0.1)' }
          },
      }}
      startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : null}
      >
      {isLoading ? '...' : (isFollowing ? 'Following' : 'Follow')}
      </Button>
  );
  }


  export default FollowButton;