//BatchForm.jsx
import React, { useState } from 'react';
import { createBatch, uploadBatchCSV } from '../services/api';

const BatchForm = ({ trackId, programId, onSubmit }) => {
  const [batchName, setBatchName] = useState('');
  const [csvFile, setCsvFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      // Send correct values to create a batch
      const newBatch = await createBatch(batchName, programId, trackId);
  
      // If batch creation is successful and CSV is uploaded
      if (newBatch?.id && csvFile) {
        await uploadBatchCSV(newBatch.id, csvFile);
      }
  
      alert("Batch Created Successfully!");
      onSubmit(); // Refresh batch list
    } catch (error) {
      alert("Failed to create batch. Check console.");
      console.error("Batch creation error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-[#7B2326] text-white p-6 rounded-md shadow-md max-w-md space-y-4" >
      <label className="block mb-2 text-sm font-medium text-gray-900">
        Batch Name
        <input type="text" value={batchName} onChange={(e) => setBatchName(e.target.value)} required  className="w-full mt-1 p-2 rounded bg-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-gray-300" />
      </label>

      <label className="block mb-2 text-sm font-medium text-gray-900">
        Upload CSV (National IDs)
        <input type="file" accept=".csv" onChange={handleFileChange} required className="w-full mt-1 p-2 rounded bg-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-red-600"/>
      </label>

      <button type="submit" disabled={loading} className="bg-gray-300 text-[#7B2326] font-semibold py-2 px-4 rounded hover:bg-gray-500 disabled:opacity-60 disabled:cursor-not-allowed">
        {loading ? "Creating..." : "Create Batch"}
      </button>
    </form>
  );
};

export default BatchForm;
