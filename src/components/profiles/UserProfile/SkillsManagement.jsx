// src/components/UserProfile/SkillsManagement.jsx (Adjust path)
import React, { useState, useEffect, useCallback } from 'react';
import { getSkills, addSkill, deleteSkill } from '../../../services/api'; // Adjust path

// Import Icons
import { TagIcon, PlusIcon, XCircleIcon } from '@heroicons/react/24/outline'; // Use Tag for section title
const SkillsManagement = ({ profileId }) => {
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(''); // General fetch/delete errors
  const [newSkillName, setNewSkillName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState(''); // Error specific to adding
  const [deletingId, setDeletingId] = useState(null);

  // --- Fetch skills ---
  const fetchSkills = useCallback(async () => {
    setIsLoading(true); setError('');
    try {
      const response = await getSkills(); // Assumes API gets skills for logged-in user via token
      setSkills(response.data || []);
    } catch (err) { console.error("Fetch skills error:", err); setError('Could not load skills.'); }
    finally { setIsLoading(false); }
  }, []); // No dependency needed if API uses token auth

  useEffect(() => { fetchSkills(); }, [fetchSkills]);

  // --- Handlers ---
  const handleAddSkill = async (e) => {
    e.preventDefault();
    const trimmedName = newSkillName.trim();
    if (!trimmedName) { setAddError('Skill name cannot be empty.'); return; }
    if (skills.some(skill => skill.name.toLowerCase() === trimmedName.toLowerCase())) {
        setAddError('This skill already exists.'); return;
    }
    setIsAdding(true); setAddError('');
    try {
      await addSkill({ name: trimmedName }); // Only send name
      setNewSkillName(''); // Clear form
      await fetchSkills(); // Refresh list
    } catch (err) {
      console.error("Add skill error:", err);
      setAddError(err.response?.data?.detail || err.response?.data?.name?.[0] || 'Failed to add skill.');
    } finally { setIsAdding(false); }
  };

  const handleDeleteSkill = async (skillId, skillName) => {
    if (!window.confirm(`Remove skill "${skillName}"?`)) return;
    setDeletingId(skillId); setError('');
    try {
      await deleteSkill(skillId);
      setSkills(prevSkills => prevSkills.filter(skill => skill.id !== skillId));
    } catch (err) {
      console.error("Delete skill error:", err);
      setError(`Failed to delete skill: ${err.response?.data?.detail || 'Error'}`);
    } finally { setDeletingId(null); }
  };

  // --- Render Logic ---
  return (
    // Section Container
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Section Title */}
      <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
        <TagIcon className="w-5 h-5 mr-2 text-primary-600" /> Skills
      </h3>

      {/* Add Skill Form */}
      <form onSubmit={handleAddSkill} className="mb-6">
        <label htmlFor="newSkillName" className="block text-sm font-medium text-gray-700 mb-1">Add New Skill</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            id="newSkillName"
            value={newSkillName}
            onChange={(e) => { setNewSkillName(e.target.value); setAddError(''); }}
            placeholder="Enter skill name (e.g., React)"
            required
            disabled={isAdding}
            className="flex-grow block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:opacity-60 disabled:bg-gray-100"
          />
          <button type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-60"
            disabled={isAdding || !newSkillName.trim()}
          >
            {isAdding ? ( <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> ) : <PlusIcon className="w-5 h-5 -ml-1 mr-1" />}
            Add
          </button>
        </div>
        {addError && <p className="text-red-600 text-xs mt-1">{addError}</p>}
      </form>

      {/* Skills List Area */}
      <div className="skills-list-section">
        <h4 className="text-base font-medium text-gray-700 mb-3">Your Skills</h4>
        {/* Loading/Error/Empty states */}
        {isLoading && <p className="text-sm text-gray-500">Loading skills...</p>}
        {!isLoading && error && <p className="text-sm text-red-600">{error}</p>}
        {!isLoading && !error && skills.length === 0 && (
          <p className="text-sm text-gray-500">No skills added yet.</p>
        )}
        {/* Render skills as tags */}
        {!isLoading && !error && skills.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {skills.map(skill => {
                const isDeletingThis = deletingId === skill.id;
                return (
                    <li key={skill.id} className={`skill-tag-item ${isDeletingThis ? 'opacity-50' : ''}`} title={skill.description || skill.name} >
                        <span className="skill-tag-name">{skill.name}</span>
                        <button
                            type="button"
                            className="remove-skill-button"
                            onClick={() => handleDeleteSkill(skill.id, skill.name)}
                            disabled={isDeletingThis || isAdding}
                            title={`Remove ${skill.name}`}
                            aria-label={`Remove ${skill.name}`}
                        >
                            {isDeletingThis ? <svg className="animate-spin h-4 w-4 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            : <XCircleIcon className="w-4 h-4" />} {/* Use Heroicon X */}
                        </button>
                    </li>
                );
            })}
          </ul>
        )}
      </div>
      {/* Add these utility component styles to your global CSS or index.css @layer components */}
      {/*
        @layer components {
          .skill-tag-item { @apply inline-flex items-center bg-primary-100 text-primary-800 rounded-full pl-3 pr-1 py-1 text-sm font-medium transition-opacity; }
          .skill-tag-name { @apply mr-1; }
          .remove-skill-button { @apply ml-1 flex-shrink-0 p-0.5 rounded-full inline-flex items-center justify-center text-primary-500 hover:bg-primary-200 hover:text-primary-700 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed; }
          .remove-skill-button svg { @apply h-4 w-4; }
        }
      */}
    </div>
  );
};

export default SkillsManagement;