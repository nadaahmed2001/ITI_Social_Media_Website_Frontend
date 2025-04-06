// components/supervisor/TrackList.js

import React, { useEffect, useState } from 'react';
import { fetchTracksForProgram } from '../services/api';  // Your API call

const TrackList = ({ programId, onSelectTrack }) => {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    async function loadTracks() {
      try {
        const trackData = await fetchTracksForProgram(programId);  // Fetch tracks for the selected program
        setTracks(trackData);
        console.log("Tracks fetched:", trackData);  // Debugging
      } catch (error) {
        console.error('Failed to fetch tracks', error);
      }
    }
    if (programId) {
      loadTracks();
    }
  }, [programId]);

  return (
    <div className="track-list">
      <h3>Tracks</h3>
      <ul>
        {tracks.map(track => (
          <li key={track.id} onClick={() => onSelectTrack(track)}>
            {track.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrackList;
