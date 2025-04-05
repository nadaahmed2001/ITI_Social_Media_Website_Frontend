import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Typography, List, ListItem, ListItemText, Button, Paper, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import Navbar from '../../components/ui/Navbar';
import BatchForm from './../../components/supervisor/BatchForm';
import { fetchBatches, 
  // endBatch 
} from '../../components/services/api';

const BatchPage = () => {
  const { trackId } = useParams();
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

  // Filter batches based on "Active" or "Old"
  const filteredBatches = batches.filter(batch => 
    filter === 'active' ? batch.active : !batch.active
  );

  // Open "Start New Batch" Modal
  const handleOpenNewBatch = () => {
    setOpenNewBatchModal(true);
  };

  // Close Modal
  const handleCloseNewBatch = () => {
    setOpenNewBatchModal(false);
  };

  // Refresh batches after creating a new batch
  const refreshBatches = async () => {
    const batchData = await fetchBatches(trackId);
    setBatches(batchData);
    handleCloseNewBatch();
  };

  // // End Batch
  // const handleEndBatch = async (batchId) => {
  //   try {
  //     await endBatch(batchId);
  //     setBatches(batches.map(batch => 
  //       batch.id === batchId ? { ...batch, active: false } : batch
  //     ));
  //   } catch (error) {
  //     console.error('Failed to end batch', error);
  //   }
  // };

  return (
    <>
      <Navbar />
      <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#1E1E1E', color: 'white' }}>
        {/* Sidebar */}
        <Box sx={{ width: 240, p: 2, borderRight: '1px solid rgba(255,255,255,0.1)' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Batches</Typography>

          <Button variant="contained" sx={{ bgcolor: filter === 'active' ? '#fff' : 'transparent', color: filter === 'active' ? '#000' : '#fff', mb: 2 }} onClick={() => setFilter('active')}>
            Active
          </Button>
          <Button variant="contained" sx={{ bgcolor: filter === 'old' ? '#FFEB3B' : 'transparent', color: filter === 'old' ? '#000' : '#fff', mb: 2 }} onClick={() => setFilter('old')}>
            Old
          </Button>

          {/* Start New Batch Button */}
          <Button variant="contained" sx={{ mt: 3, bgcolor: '#FFEB3B', color: 'black', fontWeight: 'bold', '&:hover': { bgcolor: '#FDD835' } }} onClick={handleOpenNewBatch}>
            Start New +
          </Button>
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1, p: 3, overflowY: 'auto' }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            {filter === 'active' ? 'Active Batches' : 'Old Batches'}
          </Typography>

          <List>
            {filteredBatches.map((batch) => (
              <ListItem key={batch.id} onClick={() => setSelectedBatch(batch)} sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 2, borderRadius: 1, cursor: 'pointer' }}>
                <ListItemText primary={batch.name} />
              </ListItem>
            ))}
          </List>

          {/* Batch Details */}
          {selectedBatch && (
            <Paper sx={{ p: 3, mt: 2, bgcolor: '#333', color: 'white' }}>
              <Typography variant="h6">{selectedBatch.name}</Typography>
              <Typography>Started: {selectedBatch.startDate}</Typography>
              <Typography>Ends: {selectedBatch.endDate}</Typography>

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="outlined" color="inherit">Download</Button>
                {/* {selectedBatch.active && (
                  <Button variant="contained" color="error" onClick={() => handleEndBatch(selectedBatch.id)}>End Now</Button>
                )} */}
              </Box>
            </Paper>
          )}
        </Box>
      </Box>

      {/* New Batch Modal */}
      <Dialog open={openNewBatchModal} onClose={handleCloseNewBatch}>
        <DialogTitle>Start New Batch</DialogTitle>
        <DialogContent>
          <BatchForm trackId={trackId} onSubmit={refreshBatches} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewBatch} color="secondary">Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BatchPage;
