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
      // 1️⃣ Create the batch first
      const newBatch = await createBatch({
        name: batchName,
        program_id: programId,
        track_id: trackId
      });

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
    <form onSubmit={handleSubmit}>
      <label>
        Batch Name
        <input type="text" value={batchName} onChange={(e) => setBatchName(e.target.value)} required />
      </label>

      <label>
        Upload CSV (National IDs)
        <input type="file" accept=".csv" onChange={handleFileChange} required />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Batch"}
      </button>
    </form>
  );
};

export default BatchForm;
