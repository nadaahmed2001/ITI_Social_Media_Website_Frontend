// components/supervisor/BatchPopup.js

import React, { useState } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { updateBatch } from '../services/api';

const BatchPopup = ({ batch, onClose }) => {
  const [isEnding, setIsEnding] = useState(false);
  const [ended, setEnded] = useState(!batch.active);

  const handleEndBatch = async () => {
    try {
      setIsEnding(true);
      await updateBatch(batch.id, { active: false });
      setEnded(true);
      setTimeout(onClose, 1000); // Give user feedback before closing
    } catch (error) {
      console.error('Failed to end batch', error);
    } finally {
      setIsEnding(false);
    }
  };

  return (
    <Paper sx={{
      mt: 4,
      p: 3,
      borderRadius: '16px',
      border: '1px solid #e8d9db',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      maxWidth: '500px',
      background: '#fff'
    }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#464646', mb: 1 }}>
        {batch.name}
      </Typography>
      <Typography>Status: <strong>{ended ? 'Ended' : 'Active'}</strong></Typography>
      <Typography>Started: {new Date(batch.created_at).toLocaleDateString()}</Typography>

      {!ended && (
        <Button
          variant="contained"
          sx={{
            mt: 3,
            backgroundColor: '#9c3539',
            color: 'white',
            '&:hover': { backgroundColor: '#7a2226' },
          }}
          onClick={handleEndBatch}
          disabled={isEnding}
        >
          {isEnding ? 'Ending...' : 'End Batch'}
        </Button>
      )}

      <Button
        sx={{ mt: 2, ml: 2, color: '#464646', textTransform: 'none' }}
        onClick={onClose}
      >
        Close
      </Button>
    </Paper>
  );
};

export default BatchPopup;
