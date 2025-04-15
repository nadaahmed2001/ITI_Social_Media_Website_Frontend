import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Typography, List, ListItem, ListItemText, Button, Paper, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import Navbar from '../../components/ui/Navbar';
import BatchForm from './../../components/supervisor/BatchForm';
import { fetchBatches } from '../../components/services/api';

const BatchPage = () => {
  const { programId,trackId } = useParams();
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [filter, setFilter] = useState('active'); 
  const [openNewBatchModal, setOpenNewBatchModal] = useState(false);

  useEffect(() => {
    async function loadBatches() {
      try {
        const batchData = await fetchBatches(trackId);
        setBatches(batchData);
      } catch (error) {
        console.error('Failed to fetch batches', error);
      }
    }
    loadBatches();
  }, [trackId]);

  const filteredBatches = batches.filter(batch => 
    filter === 'active' ? batch.active : !batch.active
  );

  const handleOpenNewBatch = () => {
    setOpenNewBatchModal(true);
  };

  const handleCloseNewBatch = () => {
    setOpenNewBatchModal(false);
  };

  const refreshBatches = async () => {
    const batchData = await fetchBatches(trackId);
    setBatches(batchData);
    handleCloseNewBatch();
  };

  return (
    <>
      <Navbar />
      <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#1E1E1E', color: 'black' }}>
        <Box sx={{ width: 240, p: 2, borderRight: '1px solid rgba(255,255,255,0.1)' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'black' }}>Batches</Typography>

          <Button variant="contained" sx={{ bgcolor: filter === 'active' ? '#000' : 'transparent', color: 'white', mt: 5 }} onClick={() => setFilter('active')}>
            Active
          </Button>
          <Button variant="contained" sx={{ bgcolor: filter === 'old' ? '#7B2326' : 'transparent', color: 'white', mt: 5 }} onClick={() => setFilter('old')}>
            Old
          </Button>

          <Button variant="contained" sx={{ mt: 3, bgcolor: '#7B2326', color: 'white', fontWeight: 'bold', '&:hover': { bgcolor: '#9B3A3D' } }} onClick={handleOpenNewBatch}>
            Start New +
          </Button>
        </Box>

        <Box sx={{ flex: 1, p: 3, overflowY: 'auto' }}>
          <Typography variant="h5" sx={{ mb: 3, color: 'black' }}>
            {filter === 'active' ? 'Active Batches' : 'Old Batches'}
          </Typography>

          <List>
            {filteredBatches.map((batch) => (
              <ListItem key={batch.id} onClick={() => setSelectedBatch(batch)} sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 2, borderRadius: 1, cursor: 'pointer' }}>
                <ListItemText primary={batch.name} sx={{ color: 'black' }} />
              </ListItem>
            ))}
          </List>

          {/* {selectedBatch && (
            <Paper sx={{ p: 3, mt: 2, bgcolor: '#333', color: 'black' }}>
              <Typography variant="h6" sx={{ color: 'black' }}>{selectedBatch.name}</Typography>
              <Typography sx={{ color: 'black' }}>Started: {selectedBatch.startDate}</Typography>
              <Typography sx={{ color: 'black' }}>Ends: {selectedBatch.endDate}</Typography>

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="outlined" sx={{ color: 'black', borderColor: 'black' }}>Download students' National-IDs</Button>
              </Box>
            </Paper>
          )} */}
        </Box>
      </Box>

      <Dialog open={openNewBatchModal} onClose={handleCloseNewBatch}>
        <DialogTitle sx={{ color: '#7B2326', fontWeight: 'bold', fontSize: '1.5rem' }}>Start New Batch</DialogTitle>
        <DialogContent>
          <BatchForm programId={programId} trackId={trackId} onSubmit={refreshBatches} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewBatch} sx={{ color: 'black' }}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BatchPage;
