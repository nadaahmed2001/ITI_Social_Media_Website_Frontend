//components/supervisor/TrackForm.jsx
import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { createTrack } from '../services/api'; // We'll add this function

const TrackForm = ({ programId, onSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTrack({ name, description, program: programId });
      onSuccess(); // refresh or close modal
    } catch (error) {
      console.error('Failed to create track', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="Track Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <TextField
        label="Track Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        rows={3}
        required
      />
      <Button type="submit" variant="contained" sx={{ backgroundColor: '#7a2226' }}>
        Add Track
      </Button>
    </Box>
  );
};

export default TrackForm;
