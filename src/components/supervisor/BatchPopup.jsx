// components/supervisor/BatchPopup.js

import React from 'react';

const BatchPopup = ({ batch }) => {
  return (
    <div className="batch-popup">
      <h4>{batch.name}</h4>
      <p>Status: {batch.active ? 'Active' : 'Ended'}</p>
      <p>Started: {batch.created_at}</p>
    </div>
  );
};

export default BatchPopup;
