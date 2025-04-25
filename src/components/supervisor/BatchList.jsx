// components/supervisor/BatchList.js
import React, { useEffect, useState } from 'react';
import { fetchBatchesForTrack } from '../services/api';
import BatchPopup from './BatchPopup';
import { Box, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';

const BatchList = ({ trackId }) => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);

  useEffect(() => {
    async function loadBatches() {
      try {
        const batchesData = await fetchBatchesForTrack(trackId);
        setBatches(batchesData);
      } catch (error) {
        console.error('Failed to fetch batches:', error);
      }
    }

    if (trackId) {
      loadBatches();
    }
  }, [trackId]);

  return (
    <Box sx={{
      background: '#fbfbfb',
      padding: '16px',
      marginLeft: '100px',
      marginTop: '20px',
      borderRadius: '13px',
      border: '1px solid #e8d9db',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      maxWidth: '500px'
    }}>
      <Typography variant="h5" sx={{ fontWeight: 600, color: '#464646', mb: 2 }}>Batches</Typography>
      <List>
        {batches.map(batch => (
          <ListItem
            key={batch.id}
            onClick={() => setSelectedBatch(batch)}
            sx={{
              bgcolor: '#ffffff',
              mb: 1,
              borderRadius: '13px',
              border: '1px solid #e8d9db',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
              cursor: 'pointer',
              '&:hover': { backgroundColor: '#ffe5e5' }
            }}
          >
            <ListItemText primary={batch.name} secondary={batch.active ? 'Active' : 'Ended'} />
          </ListItem>
        ))}
      </List>
      {selectedBatch && (
        <BatchPopup batch={selectedBatch} onClose={() => setSelectedBatch(null)} />
      )}
    </Box>
  );
};

export default BatchList;
