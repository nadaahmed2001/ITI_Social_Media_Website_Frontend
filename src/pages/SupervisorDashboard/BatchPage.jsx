// pages/supervisor/BatchPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Typography, List, ListItem, ListItemText, Button, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import Navbar from '../../components/ui/Navbar';
import BatchForm from './../../components/supervisor/BatchForm';
import { fetchBatches } from '../../components/services/api';
import BatchPopup from '../../components/supervisor/BatchPopup';

const BatchPage = () => {
  const { programId, trackId } = useParams();
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [filter, setFilter] = useState('active');
  const [openNewBatchModal, setOpenNewBatchModal] = useState(false);

  const loadBatches = async () => {
    try {
      const batchData = await fetchBatches(trackId);
      setBatches(batchData);
    } catch (error) {
      console.error('Failed to fetch batches', error);
    }
  };

  useEffect(() => {
    loadBatches();
  }, [trackId]);

  const filteredBatches = batches.filter(batch =>
    filter === 'active' ? batch.active : !batch.active
  );

  return (
    <>
      <Navbar />
      <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f8fafc', color: 'black' }}>
        <Box sx={{
          background: '#fbfbfb',
          padding: '16px',
          marginLeft: '100px',
          minHeight: '75vh',
          marginTop: '20px',
          border: '1px solid #e8d9db',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: '13px',
        }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'black' }}>Batches</Typography>

          <Button variant="contained" sx={{ bgcolor: filter === 'active' ? '#000' : 'transparent', color: 'white', mt: 5 }} onClick={() => setFilter('active')}>
            Active
          </Button>
          <Button variant="contained" sx={{ bgcolor: filter === 'old' ? '#7B2326' : 'transparent', color: 'white', mt: 5 }} onClick={() => setFilter('old')}>
            Old
          </Button>

          <Button variant="contained" sx={{ mt: 3, bgcolor: '#7B2326', color: 'white', fontWeight: 'bold', '&:hover': { bgcolor: '#9B3A3D' } }} onClick={() => setOpenNewBatchModal(true)}>
            Start New +
          </Button>
        </Box>

        <Box sx={{ flex: 1, p: 3, overflowY: 'auto' }}>
          <Typography variant="h5" sx={{ mb: 3, color: 'black' }}>
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
                }}
              >
                <ListItemText primary={batch.name} sx={{ color: '#464646', fontWeight: 500 }} />
              </ListItem>
            ))}
          </List>

          {selectedBatch && (
            <BatchPopup
              batch={selectedBatch}
              onClose={() => {
                setSelectedBatch(null);
                loadBatches(); // 🔄 Refresh on close
              }}
            />
          )}
        </Box>
      </Box>

      <Dialog open={openNewBatchModal} onClose={() => setOpenNewBatchModal(false)}>
        <DialogTitle sx={{ color: '#7B2326', fontWeight: 'bold', fontSize: '1.5rem' }}>Start New Batch</DialogTitle>
        <DialogContent>
          <BatchForm programId={programId} trackId={trackId} onSubmit={async () => {
            await loadBatches();
            setOpenNewBatchModal(false);
          }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewBatchModal(false)} sx={{ color: 'black' }}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BatchPage;
