// TrackList.jsx
import React, { useEffect, useState } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { fetchTracksForProgram } from '../services/api';
import { Button } from '@mui/material';


const TrackList = ({ program, onSelectTrack }) => {
  const [tracks, setTracks] = useState([]);
  const programId = program.id;

  useEffect(() => {
    async function loadTracks() {
      try {
        const trackData = await fetchTracksForProgram(programId);
        setTracks(trackData);
      } catch (error) {
        console.error('Failed to fetch tracks', error);
      }
    }

    if (programId) {
      loadTracks();
    }
  }, [programId]);

  const descriptionBoxStyle = {
    marginBottom: '40px',
    marginTop: '130px',
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

  const titleStyle = {
    fontSize: '2.125rem',
    fontWeight: '600',
    marginBottom: '24px',
    color: '#464646',
    textAlign: 'center',
  };

  const listItemStyle = {
    padding: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.5s ease',
    background: '#fbfbfb',
    color: '#464646',
    fontSize: '1.5rem',
    fontWeight: '500',
    borderRadius: '13px',
    border: '1px solid #e8d9db',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    marginBottom: '10px',
  };

  const hoverStyle = {
    color: '#7a2226',
    background: '#ffe5e5',
  };

  return (
    <div>
      {/* Program Description Section */}
      {program.description && (
        <div style={descriptionBoxStyle}>
          {program.description}
        </div>
      )}

      {/* Track List Title */}
      <h3 style={titleStyle}>Tracks in "{program.name}"</h3>

      {/* List of Tracks */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tracks.map((track) => (
          <li
            key={track.id}
            onClick={() => onSelectTrack(track)}
            style={listItemStyle}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, listItemStyle)}
          >
            {track.name}
            <ArrowForwardIcon sx={{ color: '#464646', marginLeft: '50px' }} />
          </li>
        ))}
      </ul>
  {/* Add New Track Button */ }
  <div style={{ marginTop: '40px', textAlign: 'left' }}>
    <Button
      variant="contained"
      sx={{
        backgroundColor: '#9c3539',
        color: '#ffffff',
        padding: '10px 20px',
        borderRadius: '8px',
        textTransform: 'none',
        fontWeight: 500,
        fontSize: '1rem',
        '&:hover': {
          backgroundColor: '#7a2226',
        },
      }}
      onClick={() => console.log('Add New Track clicked')}
    >
      Add New Track
    </Button>
  </div>

    </div >
  );
};

export default TrackList;
