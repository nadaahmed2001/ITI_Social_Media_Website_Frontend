import React, { useEffect, useState } from 'react';
import { fetchTracksForProgram } from '../services/api';  // Your API call
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box, Typography, List } from '@mui/material';

const TrackList = ({ programId, onSelectTrack }) => {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    async function loadTracks() {
      try {
        const trackData = await fetchTracksForProgram(programId);  // Fetch tracks for the selected program
        setTracks(trackData);
      } catch (error) {
        console.error('Failed to fetch tracks', error);
      }
    }
    if (programId) {
      loadTracks();
    }
  }, [programId]);

  return (
    <Box className="track-list" sx={{ maxWidth: '600px' }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: 'white' }}>
        Select Track
      </Typography>
      <List sx={{ p: 0, width: '100%' }}>
        {tracks.map(track => (
          <Box
            key={track.id}
            onClick={() => onSelectTrack(track)}
            sx={{
              mb: 2,
              bgcolor: 'rgba(40, 40, 40, 0.95)',
              borderRadius: 1,
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              px: 3,
              py: 2.5,
              '&:hover': {
                bgcolor: 'rgba(50, 50, 50, 0.95)'
              }
            }}
          >
            <Typography sx={{ color: 'white', fontWeight: 'medium' }}>
              {track.name}
            </Typography>
            <ArrowForwardIcon sx={{ color: 'white' }} />
          </Box>
        ))}
      </List>
    </Box>
  );
};

export default TrackList;