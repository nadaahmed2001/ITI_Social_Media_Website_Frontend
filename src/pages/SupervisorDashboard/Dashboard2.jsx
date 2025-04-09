import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchPrograms } from '../../components/services/api';
import { ArrowRight } from 'lucide-react'; // For the arrow icon

// Mock TrackList component (since the actual implementation is not provided)
const TrackList = ({ programId, onSelectTrack }) => {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    // Replace this with your actual track fetching logic based on programId
    const loadTracks = async (programId) => {
      // Simulate fetching tracks based on programId
      if (programId === 1) { // Example: Program ID 1
        setTracks([
          { id: 101, name: 'Full Stack Web Development' },
          { id: 102, name: 'Mobile App Development' },
          { id: 103, name: 'Data Science' },
        ]);
      } else if (programId === 2) { // Example: Program ID 2
        setTracks([
          { id: 201, name: 'UI/UX Design' },
          { id: 202, name: 'Digital Marketing' },
        ]);
      } else {
        setTracks([]);
      }
    };

    loadTracks(programId);
  }, [programId]);

  return (
    <List>
      {tracks.map((track) => (
        <ListItem
          key={track.id}
          onClick={() => onSelectTrack(track)}
          sx={listItemStyle}
        >
          <ListItemText primary={track.name} />
          <ArrowRight style={{ width: 20, height: 20, color: 'white' }} /> {/* Added arrow icon */}
        </ListItem>
      ))}
    </List>
  );
};

// Mock Navbar component (since the actual implementation is not provided)
const Navbar = () => {
  return (
    <Box sx={{
        height: 64, // Typical navbar height
        bgcolor: '#2a2a2a', // Darker background
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        paddingX: 3,
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        Dashboard
      </Typography>
    </Box>
  );
};

// Styles for TrackList Items
const listItemStyle = {
  mb: 2,
  bgcolor: 'transparent',
  color: 'white',
  borderRadius: 1,
  cursor: 'pointer',
  px: 2,
  py: 1.5, // Increased vertical padding
  display: 'flex', // Use flexbox for alignment
  justifyContent: 'space-between', // Space between text and icon
  alignItems: 'center', // Vertically center text and icon
  transition: 'background-color 0.2s ease', // Smooth transition
  '&:hover': { // Hover effect
    bgcolor: 'rgba(255,255,255,0.1)', // Slightly lighter background on hover
  },
};

const Dashboard = () => {
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadPrograms() {
      try {
        const programsData = await fetchPrograms();
        setPrograms(programsData);
      } catch (error) {
        console.error('Failed to fetch programs', error);
      }
    }
    loadPrograms();
  }, []);

  const handleProgramSelect = (program) => {
    setSelectedProgram(program);
  };

  const handleTrackSelect = (track) => {
    navigate(`/batches/${track.id}`);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: '#1E1E1E', color: 'white' }}>
      <Navbar />
      <Box sx={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        <Box sx={{ width: 240, p: 3, borderRight: '1px solid rgba(255,255,255,0.1)' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, fontSize: 18 }}>Programs</Typography>
          <List>
            {programs.map((program) => (
              <ListItem
                key={program.id}
                onClick={() => handleProgramSelect(program)}
                sx={{
                  mb: 2,
                  bgcolor: selectedProgram?.id === program.id ? '#FFEB3B' : 'transparent',
                  color: selectedProgram?.id === program.id ? 'black' : 'white',
                  borderRadius: 1,
                  cursor: 'pointer',
                  px: 2,
                  py: 1.5, // Increased vertical padding for better visual separation
                  transition: 'background-color 0.2s ease', // Smooth transition for hover effect
                  '&:hover': {
                    bgcolor: selectedProgram?.id === program.id ? '#f2d74e' : 'rgba(255,255,255,0.1)', // Lighter yellow on hover for selected, slight lighten for others
                  },
                }}
              >
                <ListItemText primary={program.name} />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1, p: 4, overflowY: 'auto' }}>
          {selectedProgram && (
            <>
              <Typography variant="h5" sx={{ mb: 3, fontSize: 24, fontWeight: 'semibold' }}>Tracks in {selectedProgram.name}</Typography>
              <TrackList programId={selectedProgram.id} onSelectTrack={handleTrackSelect} />
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
