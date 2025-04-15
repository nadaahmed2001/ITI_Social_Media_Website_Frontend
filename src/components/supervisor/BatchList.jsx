// components/supervisor/BatchList.js

import React, { useEffect, useState } from 'react';
import { fetchBatchesForTrack } from '../services/api';
import BatchPopup from './BatchPopup';

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
    <div className="batch-list bg-[#7B2326] text-white pt-6 p-4 rounded-md shadow-md max-w-md">
      <h3 className="text-lg font-semibold mb-4">Batches</h3>
      <ul className="space-y-2">
        {batches.map(batch => (
          <li key={batch.id} onClick={() => setSelectedBatch(batch)}>
            {batch.name} - {batch.active ? 'Active' : 'Ended'}
          </li>
        ))}
      </ul>
      {selectedBatch && <BatchPopup batch={selectedBatch} />}
    </div>
  );
};

export default BatchList;
