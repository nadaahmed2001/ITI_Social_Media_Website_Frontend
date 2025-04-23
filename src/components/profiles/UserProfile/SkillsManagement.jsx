import React, { useState, useEffect, useCallback } from 'react';
import { getSkills, addSkill, deleteSkill } from '../../services/api';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CircularProgress from '@mui/material/CircularProgress'; // For loading spinner



import './SkillsManagement.css'; // Ensure CSS is imported

const SkillsManagement = ({ profileId }) => { // profileId might not be strictly needed by API but good practice
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(''); // General fetch/delete errors

  // Add Form State
  const [newSkillName, setNewSkillName] = useState('');
  // Optional: Keep description if your addSkill API/model uses it
  // const [newSkillDescription, setNewSkillDescription] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState(''); // Error specific to adding

  // Delete State (track ID being deleted for visual feedback)
  const [deletingId, setDeletingId] = useState(null);

  // --- Fetch skills ---
  const fetchSkills = useCallback(async () => {
    setIsLoading(true); setError('');
    try {
      const response = await getSkills(); // Assumes API gets skills for logged-in user
      setSkills(response.data || []);
    } catch (err) {
      console.error("Failed to fetch skills:", err); setError('Could not load skills.');
    } finally { setIsLoading(false); }
  }, []); // No dependency needed if API uses token auth

  useEffect(() => { fetchSkills(); }, [fetchSkills]);

  // --- Handlers ---

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) { setAddError('Skill name cannot be empty.'); return; }
    if (skills.some(skill => skill.name.toLowerCase() === newSkillName.trim().toLowerCase())) {
        setAddError('This skill already exists.'); return;
    }
    setIsAdding(true); setAddError('');
    try {
      // Assuming addSkill API takes name and optional description
      await addSkill({ name: newSkillName.trim() /*, description: newSkillDescription.trim() */ });
      setNewSkillName(''); // Clear form
      // setNewSkillDescription('');
      await fetchSkills(); // Refresh list
    } catch (err) {
      console.error("Add skill error:", err.response?.data || err.message);
      setAddError(err.response?.data?.detail || err.response?.data?.name?.[0] || 'Failed to add skill.');
    } finally { setIsAdding(false); }
  };

  const handleDeleteSkill = async (skillId, skillName) => {
    // Optional confirmation
    if (!window.confirm(`Are you sure you want to delete the skill "${skillName}"?`)) { return; }

    setDeletingId(skillId); setError(''); // Clear general errors, set deleting state
    try {
      await deleteSkill(skillId);
      // Update list locally for instant feedback - or refetch
      setSkills(prevSkills => prevSkills.filter(skill => skill.id !== skillId));
      // await fetchSkills(); // Option: refetch instead of local update
    } catch (err) {
      console.error("Delete skill error:", err.response?.data || err.message);
      setError(`Failed to delete skill: ${err.response?.data?.detail || err.message}`);
    } finally { setDeletingId(null); } // Clear deleting state
  };

  // --- Render Logic ---
  return (
    // Using general section class, assuming it provides dark background etc.
    <div className="skills-management-container form-section">
      {/* Section Title - Assuming h3 is styled correctly by parent/global CSS */}
      <h3 className="skills-title">Skills</h3>

      {/* Add Skill Form */}
      <form onSubmit={handleAddSkill} className="add-skill-form">
        {/* Optional: Add h4 heading */}
        {/* <h4>Add New Skill</h4> */}
        {addError && <p className="error-message">{addError}</p>}
        <div className="add-form-inputs">
          <input
            type="text"
            value={newSkillName}
            onChange={(e) => { setNewSkillName(e.target.value); setAddError(''); }}
            placeholder="Enter new skill name..." // Clearer placeholder
            required
            disabled={isAdding}
          />
          
        </div>
        <button type="submit" className="submit-button add-skill-button bg-red-900 hover:!bg-red-800 text-white font-semibold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled={isAdding}>
          {isAdding ? 'Adding...' : 'Add Skill'}
        </button>
      </form>

      {/* Skills List Area */}
      <div className="skills-list-section">
        {/* Display loading/error/empty states */}
        {isLoading && <p className="loading-text">Loading skills...</p>}
        {!isLoading && error && <p className="error-message">{error}</p>}
        {!isLoading && !error && skills.length === 0 && (
          <p className="no-data-text">No skills added yet.</p>
        )}

        {/* Render skills as tags */}
        {!isLoading && !error && skills.length > 0 && (
          <ul className="skills-tag-list">
            {skills.map(skill => {
                const isDeletingThis = deletingId === skill.id;
                return (
                    <li
                      key={skill.id}
                      className={`skill-tag-item ${isDeletingThis ? 'deleting' : ''}`}
                      title={skill.description || skill.name} // Show description on hover maybe
                    >
                        <span className="skill-tag-name">{skill.name}</span>
                        <button
                            className="remove-skill-button"
                            onClick={() => handleDeleteSkill(skill.id, skill.name)}
                            disabled={isDeletingThis || isAdding} // Disable if deleting this or adding new
                            title={`Remove ${skill.name}`}
                            aria-label={`Remove ${skill.name}`}
                        >
                            {/* Show spinner if deleting this one */}
                            {isDeletingThis ? <CircularProgress size={14} color="inherit"/> : <span className="remove-icon-wrapper"> X </span>}
                          
                        </button>
                    </li>
                );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SkillsManagement;