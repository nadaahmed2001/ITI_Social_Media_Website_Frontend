import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchPrograms, getAccount, getPublicProfile } from '../../components/services/api';
import ProgramList from '../../components/supervisor/ProgramList';
import TrackList from '../../components/supervisor/TrackList';
import Navbar from '../../components/ui/Navbar';

const Dashboard = () => {
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const accountRes = await getAccount();
        const profileId = accountRes.data?.id;

        if (profileId) {
          const profileRes = await getPublicProfile(profileId);
          const dept = profileRes.data?.department;
          setDepartment(dept || '');

          const programsData = await fetchPrograms();
          setPrograms(programsData || []);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setError('Unable to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

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
    marginTop: '50px',
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
        <Box>
          {department ? (
            <div style={departmentBoxStyle}>Department of {department}</div>
          ) : (
            !loading && (
              <Typography sx={{ ml: 10, mt: 10, color: 'gray' }}>
                No department found for this user.
              </Typography>
            )
          )}

          {!loading && programs.length === 0 && (
            <Typography sx={{ ml: 10, mt: 2, color: 'gray' }}>
              No programs available to display.
            </Typography>
          )}

          <ProgramList programs={programs} onSelectProgram={handleProgramSelect} />
        </Box>

        <Box sx={{ flex: 1, p: 3, overflowY: 'auto' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" align="center" sx={{ mt: 10 }}>
              {error}
            </Typography>
          ) : selectedProgram ? (
            <>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  color: '#333',
                  mb: 3,
                  textAlign: 'center',
                  marginTop: '130px',
                }}
              >
                {selectedProgram.name} Program
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
                mt: 10,
              }}
            >
              <Typography
                variant="h4"
                sx={{ fontWeight: 600, color: '#7a2226', mb: 2 }}
              >
                👋 Welcome!
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: '#555', fontWeight: 400, maxWidth: '600px' }}
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
