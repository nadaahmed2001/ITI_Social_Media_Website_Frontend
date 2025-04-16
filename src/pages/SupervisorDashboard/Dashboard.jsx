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
        <Box>
          <ProgramList programs={programs} onSelectProgram={handleProgramSelect} />
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