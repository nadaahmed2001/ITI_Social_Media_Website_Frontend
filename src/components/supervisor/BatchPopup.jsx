// components/supervisor/BatchPopup.js

import React from 'react';

const BatchPopup = ({ batch }) => {
  return (
    <div className="bg-[#7B2326] text-white pt-6 p-4 rounded-md shadow-md max-w-sm">
      <h4 className="text-xl font-bold mb-2" >{batch.name}</h4>
      <p className="mb-1" >Status: {batch.active ? 'Active' : 'Ended'}</p>
      <p>Started: {batch.created_at}</p>
    </div>
  );
};

export default BatchPopup;
