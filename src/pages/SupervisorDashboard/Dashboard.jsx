//Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchPrograms, getAccount, getPublicProfile } from '../../components/services/api';
import ProgramList from '../../components/supervisor/ProgramList';
import TrackList from '../../components/supervisor/TrackList';
import Navbar from '../../components/ui/Navbar';

const Dashboard = () => {
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [department, setDepartment] = useState('');

  const navigate = useNavigate();

  
  useEffect(() => {
    async function loadData() {
      try {
        const accountRes = await getAccount();
        const profileId = accountRes.data?.id;
  
        if (profileId) {
          const profileRes = await getPublicProfile(profileId);
          const dept = profileRes.data?.department;
          setDepartment(dept || '');
  
          // Now that department is loaded, fetch programs
          const programsData = await fetchPrograms();
          setPrograms(programsData);
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    }
    //load depatment then programs
    loadData();
  }, []);
  
  const handleProgramSelect = (program) => {
    setSelectedProgram(program);
  };

  const handleTrackSelect = (track) => {
    if (selectedProgram) {
      navigate(`/batches/${selectedProgram.id}/${track.id}`);
    } else {
      console.warn("No program selected to navigate to batches.");
    }
  };

  const departmentBoxStyle = {
    marginLeft: '100px',
    marginTop: '100px',
    padding: '16px 24px',
    background: 'linear-gradient(to right, #7a2226, #9e363a)',
    color: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    fontSize: '1.25rem',
    fontWeight: '600',
    letterSpacing: '0.5px',
    transition: 'all 0.3s ease',
  };

  return (
    <>
      {/* <Navbar /> */}
      <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f8fafc', color: 'black' }}>
        {/* Sidebar and department box */}
        <Box>
          {department && (
            <div style={departmentBoxStyle}>
              Department of {department}
            </div>
          )}

          <ProgramList programs={programs} onSelectProgram={handleProgramSelect} />
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1, p: 3, overflowY: 'auto' }}>
          {selectedProgram ? (
            <>
              <Typography variant="h5" sx={{ mb: 3 }}>
                Tracks in {selectedProgram.name}
              </Typography>
              <TrackList program={selectedProgram} onSelectTrack={handleTrackSelect} />
            </>
          ) : (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                flexDirection: 'column',
                
                marginTop: '50px',
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  color: '#7a2226',
                  mb: 2,
                  animation: 'fadeIn 1s ease-in-out',
                }}
              >
                👋 Welcome!
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: '#555',
                  fontWeight: 400,
                  maxWidth: '600px',
                  animation: 'fadeIn 1.2s ease-in-out',
                }}
              >
                Select a program from the left panel to view its tracks and details.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>


    </>
  );
};

export default Dashboard;