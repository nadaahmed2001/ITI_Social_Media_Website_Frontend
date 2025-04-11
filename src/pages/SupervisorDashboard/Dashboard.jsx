//Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // For navigation
import { fetchPrograms } from '../../components/services/api';
import ProgramList from '../../components/supervisor/ProgramList';
import TrackList from '../../components/supervisor/TrackList';
import Navbar from '../../components/ui/Navbar';

const Dashboard = () => {
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const navigate = useNavigate(); // For navigation

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
    // Redirect to batches page when a track is selected
    if (selectedProgram) {
      navigate(`/batches/${selectedProgram.id}/${track.id}`);
    } else {
      console.warn("No program selected to navigate to batches.");
      // Optionally handle the case where no program is selected
    }
  };

  return (
    <>
      {/* <Navbar /> */}
      <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#1E1E1E', color: 'black' }}>
        {/* Sidebar */}
        <Box sx={{ width: 240, p: 2, borderRight: '1px solid rgba(255,255,255,0.1)' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Programs</Typography>
          <List>
            {programs.map((program) => (
              <ListItem
                key={program.id}
                onClick={() => handleProgramSelect(program)}
                sx={{
                  mb: 1,
                  bgcolor: selectedProgram?.id === program.id ? '#FFEB3B' : 'transparent',
                  color: selectedProgram?.id === program.id ? 'black' : 'black',
                  borderRadius: 1,
                  cursor: 'pointer',
                  px: 2
                }}
              >
                <ListItemText primary={program.name} />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1, p: 3, overflowY: 'auto' }}>
          {selectedProgram && (
            <>
              <Typography variant="h5" sx={{ mb: 3 }}>Tracks in {selectedProgram.name}</Typography>
              {/* Pass the handleTrackSelect function */}
              <TrackList programId={selectedProgram.id} onSelectTrack={handleTrackSelect} />
            </>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;