// pages/supervisor/BatchPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Typography, List, ListItem, ListItemText, Button, Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import Navbar from '../../components/ui/Navbar';
import BatchForm from './../../components/supervisor/BatchForm';
import { fetchBatches, getTrack, getProgram, getAccount, getPublicProfile } from '../../components/services/api';
import BatchPopup from '../../components/supervisor/BatchPopup';

const BatchPage = () => {
  const { programId, trackId } = useParams();
  //console.log("programId:", programId, "trackId:", trackId);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [filter, setFilter] = useState('active');
  const [openNewBatchModal, setOpenNewBatchModal] = useState(false);
  const [department, setDepartment] = useState('');

  // fetch the track with the given trackId
  const [track, setTrack] = useState(null);
  const getTrackDetails = async () => {
    try {
      const trackData = await getTrack(trackId);
      setTrack(trackData);
      //console.log('Track Details:', trackData);
    } catch (error) {
      console.error('Failed to fetch track', error);
    }
  };
  const [program, setProgram] = useState(null);
  const getProgramDetails = async () => {
    try {
      const programData = await getProgram(programId);
      setProgram(programData);
      // console.log('Program Details:', programData);
    } catch (error) {
      console.error('Failed to fetch program', error);
    }
  };

  // fetch batches for the given trackId
  const loadBatches = async () => {
    try {
      const batchData = await fetchBatches(trackId);
      setBatches(batchData);
    } catch (error) {
      console.error('Failed to fetch batches', error);
    }
  };


  async function loadDepartment() {
    try {
      const accountRes = await getAccount(); // Gets logged-in user's account
      const profileId = accountRes.data?.id;
      if (profileId) {
        const profileRes = await getPublicProfile(profileId);
        const dept = profileRes.data?.department;
        setDepartment(dept || ''); // Fallback if department is missing
      }
    } catch (error) {
      console.error('Failed to fetch department info:', error);
    }
  }



  useEffect(() => {
    // console.log("programId:", programId, "trackId:", trackId);
    if (trackId) {
      getTrackDetails();
      getProgramDetails();
      loadDepartment();
      loadBatches();
    }
  }, [trackId]);

  const filteredBatches = batches.filter(batch =>
    filter === 'active' ? batch.active : !batch.active
  );


  // ---------------------------- Style ----------------------------
  const titleStyle = {
    fontSize: '2.125rem',
    fontWeight: '600',
    marginTop: '160px',
    marginBottom: '24px',
    color: '#464646',
    textAlign: 'center',
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
  const descriptionBoxStyle = {
    marginBottom: '40px',
    
    padding: '20px 30px',
    background: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e8d9db',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    color: '#333',
    fontSize: '1.125rem',
    lineHeight: '1.7',
    fontWeight: '400',
  };

  return (
    <>
      {/* <Navbar /> */}
      <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f8fafc', color: 'black' }}>

        {/* Box containing sidebar and department box */}
        <Box >
          {/* Department Box */}
          {department && (
            <div style={departmentBoxStyle}>
              Department of {department}
            </div>
          )}
          {/* Sidebar */}
          <Box sx={{
            background: '#fbfbfb',
            color: 'white',
            paddingTop: '24px',
            padding: '16px',
            width: '60%',
            // height: '50%',
            marginLeft: '100px',
            minHeight: '75vh',
            marginTop: '20px',
            border: '1px solid #e8d9db',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '13px',
          }}>

            <Button
              fullWidth
              variant={filter === 'active' ? "contained" : "outlined"}
              sx={{
                mb: 2,
                backgroundColor: filter === 'active' ? '#7a2226' : 'transparent',
                color: filter === 'active' ? '#fff' : '#7a2226',
                borderColor: '#7a2226',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: '#9e363a',
                  color: '#fff',
                }
              }}
              onClick={() => setFilter('active')}
            >
              Active
            </Button>

            <Button
              fullWidth
              variant={filter === 'old' ? "contained" : "outlined"}
              sx={{
                mb: 2,
                backgroundColor: filter === 'old' ? '#7a2226' : 'transparent',
                color: filter === 'old' ? '#7a2226' : '#7a2226',
                borderColor: '#7a2226',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: '#9e363a',
                  color: '#fff',
                }
              }}
              onClick={() => setFilter('old')}
            >
              Old
            </Button>
            {/* Bottom part */}
            <Button
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: '#33ff90',
                color: 'black',
                fontWeight: 'bold',
                textTransform: 'none',
                borderRadius: '10px',
                mt: 2,
                '&:hover': { color: 'white' }
              }}
              onClick={() => setOpenNewBatchModal(true)}
            >
              Start New +
            </Button>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{
          flex: 1,
          p: 3,
          overflowY: 'auto'
        }}>
          <Typography variant="h4" sx={titleStyle}>
           "{track?.name}" Track -  {program?.name} Program
          </Typography>
          <Typography variant="h4" sx={descriptionBoxStyle}>
            {track?.description}
          </Typography>

          <Typography variant="h5" sx={{ mb: 4, fontWeight: '600', color: '#7a2226' }}>
            {filter === 'active' ? 'Active Batches' : 'Old Batches'}
          </Typography>

          <List>
            {filteredBatches.map((batch) => (
              <ListItem
                key={batch.id}
                onClick={() => setSelectedBatch(batch)}
                sx={{
                  bgcolor: '#ffffff',
                  mb: 2,
                  borderRadius: '13px',
                  cursor: 'pointer',
                  border: '1px solid #e8d9db',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  '&:hover': {
                    backgroundColor: '#ffe5e5',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <ListItemText
                  primary={batch.name}
                  slotProps={{
                    primary: {
                      sx: {
                        fontWeight: 500,
                        color: '#464646',
                        fontSize: '1.2rem'
                      }
                    }
                  }}
                />
              </ListItem>
            ))}
          </List>

          {selectedBatch && (
            <BatchPopup
              batch={selectedBatch}
              onClose={() => {
                setSelectedBatch(null);
                loadBatches(); //  Refresh batches
              }}
            />
          )}
        </Box>
      </Box>

      {/* New Batch Modal */}
      <Dialog open={openNewBatchModal} onClose={() => setOpenNewBatchModal(false)}>
        <DialogTitle sx={{ color: '#7B2326', fontWeight: 'bold', fontSize: '1.5rem' }}>Start New Batch</DialogTitle>
        <DialogContent>
          <BatchForm
            programId={programId}
            trackId={trackId}
            onSubmit={async () => {
              await loadBatches();
              setOpenNewBatchModal(false);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewBatchModal(false)} sx={{ color: 'black' }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BatchPage;
