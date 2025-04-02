// src/components/UserProfile/SkillsManagement.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { getSkills, addSkill, updateSkill, deleteSkill } from '../../../services/api';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import './SkillsManagement.css'; // Create this CSS file

const SkillsManagement = ({ profileId }) => { // profileId might not be needed if API uses token
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Add Form State
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillDescription, setNewSkillDescription] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState('');

  // Edit State
  const [editingSkill, setEditingSkill] = useState(null); // { id, name, description }
  const [isUpdating, setIsUpdating] = useState(false);
  const [editError, setEditError] = useState('');

  // Delete State
  const [deletingId, setDeletingId] = useState(null); // Track which skill is being deleted

  // Fetch skills
  const fetchSkills = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await getSkills();
      // Sort skills alphabetically for consistent order
      const sortedSkills = response.data.sort((a, b) => a.name.localeCompare(b.name));
      setSkills(sortedSkills);
    } catch (err) {
      console.error("Failed to fetch skills:", err);
      setError('Could not load skills.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  // --- Handlers ---

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) {
      setAddError('Skill name cannot be empty.');
      return;
    }
    // Optional: Client-side check for duplicates (API should handle definitively)
    if (skills.some(skill => skill.name.toLowerCase() === newSkillName.trim().toLowerCase())) {
        setAddError('A skill with this name already exists.');
        return;
    }

    setIsAdding(true);
    setAddError('');
    try {
      await addSkill({ name: newSkillName.trim(), description: newSkillDescription.trim() });
      setNewSkillName(''); // Clear form
      setNewSkillDescription('');
      await fetchSkills(); // Re-fetch the list to include the new skill and keep it sorted
    } catch (err) {
      console.error("Add skill error:", err.response?.data || err.message);
      setAddError(err.response?.data?.detail || err.response?.data?.name?.[0] || 'Failed to add skill.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    // Simple confirmation
    if (!window.confirm('Are you sure you want to delete this skill?')) {
      return;
    }
    setDeletingId(skillId); // Show loading/disabled state on the specific item
    setError(''); // Clear general errors
    try {
      await deleteSkill(skillId);
      setSkills(prevSkills => prevSkills.filter(skill => skill.id !== skillId)); // Update list locally
       // Or optionally: await fetchSkills(); // Re-fetch
    } catch (err) {
      console.error("Delete skill error:", err.response?.data || err.message);
       // Show error near the item or globally
      setError(`Failed to delete skill: ${err.response?.data?.detail || err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleStartEdit = (skill) => {
    setEditingSkill({ ...skill }); // Set the skill to be edited
    setEditError(''); // Clear previous edit errors
  };

  const handleCancelEdit = () => {
    setEditingSkill(null);
  };

   const handleEditChange = (e) => {
    const { name, value } = e.target;
     if (editingSkill) {
        setEditingSkill(prev => ({ ...prev, [name]: value }));
     }
   };

  const handleUpdateSkill = async (e) => {
     e.preventDefault();
     if (!editingSkill || !editingSkill.name.trim()) {
         setEditError('Skill name cannot be empty.');
         return;
     }
     // Optional: Client-side check for duplicates (excluding self)
     if (skills.some(skill => skill.id !== editingSkill.id && skill.name.toLowerCase() === editingSkill.name.trim().toLowerCase())) {
         setEditError('Another skill with this name already exists.');
         return;
     }


    setIsUpdating(true);
    setEditError('');
    try {
        const { id, name, description } = editingSkill;
        await updateSkill(id, { name: name.trim(), description: description.trim() });
        setEditingSkill(null); // Close edit form
        await fetchSkills(); // Re-fetch to ensure data consistency and sorting
    } catch (err) {
        console.error("Update skill error:", err.response?.data || err.message);
        setEditError(err.response?.data?.detail || err.response?.data?.name?.[0] || 'Failed to update skill.');
    } finally {
        setIsUpdating(false);
    }
  };


  // --- Render Logic ---

  const renderSkillItem = (skill) => {
      const isBeingDeleted = deletingId === skill.id;

       // Render Edit Form Inline
       if (editingSkill && editingSkill.id === skill.id) {
           return (
               <li key={skill.id} className="skill-item editing">
                   <form onSubmit={handleUpdateSkill} className="edit-skill-form">
                       <input
                           type="text"
                           name="name"
                           value={editingSkill.name}
                           onChange={handleEditChange}
                           placeholder="Skill Name"
                           required
                           disabled={isUpdating}
                           className="edit-input"
                       />
                       {/* <textarea
                           name="description"
                           value={editingSkill.description || ''}
                           onChange={handleEditChange}
                           placeholder="Description (Optional)"
                           disabled={isUpdating}
                           rows={2}
                           className="edit-textarea"
                       /> */}
                       {editError && <p className="error-message inline-error">{editError}</p>}
                       <div className="edit-actions">
                           <button type="submit" className="action-button save-button" disabled={isUpdating}>
                               <SaveIcon fontSize="small"/> {isUpdating ? 'Saving...' : 'Save'}
                           </button>
                           <button type="button" className="action-button cancel-button" onClick={handleCancelEdit} disabled={isUpdating}>
                               <CancelIcon fontSize="small"/> Cancel
                           </button>
                       </div>
                   </form>
               </li>
           );
       }

       // Render Normal Display Item
       return (
           <li key={skill.id} className={`skill-item ${isBeingDeleted ? 'deleting' : ''}`}>
               <div className="skill-details">
                   <span className="skill-name">{skill.name}</span>
                   {skill.description && <p className="skill-description">{skill.description}</p>}
               </div>
               <div className="skill-actions">
                   <button
                       className="action-button edit-button"
                       onClick={() => handleStartEdit(skill)}
                       disabled={isBeingDeleted || !!editingSkill} // Disable if deleting this or editing another
                       title="Edit Skill"
                   >
                       <EditIcon fontSize="small" />
                   </button>
                   <button
                       className="action-button delete-button"
                       onClick={() => handleDeleteSkill(skill.id)}
                       disabled={isBeingDeleted || !!editingSkill} // Disable if deleting this or editing another
                       title="Delete Skill"
                   >
                       {isBeingDeleted ? <span className="spinner small"></span> : <DeleteIcon fontSize="small" />}
                   </button>
               </div>
           </li>
       );
  };


  return (
    <div className="skills-management-container form-section"> {/* Reuse form-section style */}
      <h3>My Skills</h3>

      {/* Add Skill Form */}
      <form onSubmit={handleAddSkill} className="add-skill-form">
        <h4>Add New Skill</h4>
        {addError && <p className="error-message">{addError}</p>}
        <div className="add-form-inputs">
          <input
            type="text"
            value={newSkillName}
            onChange={(e) => { setNewSkillName(e.target.value); setAddError(''); }}
            placeholder="New skill name (e.g., React, Python)"
            required
            disabled={isAdding}
          />
           {/* <textarea
            value={newSkillDescription}
            onChange={(e) => setNewSkillDescription(e.target.value)}
            placeholder="Description (Optional)"
            rows={2}
            disabled={isAdding}
          /> */}
        </div>
        <button type="submit" className="submit-button add-button" disabled={isAdding}>
            <AddCircleOutlineIcon fontSize="small"/> {isAdding ? 'Adding...' : 'Add Skill'}
            </button>
        </form>

        {/* Skills List */}
        <div className="skills-list-section">
            <h4>Existing Skills</h4>
            {isLoading && <p className="loading-text">Loading skills...</p>}
            {error && <p className="error-message">{error}</p>}
            {!isLoading && !error && skills.length === 0 && (
            <p className="no-data-text">You haven't added any skills yet.</p>
            )}
            {!isLoading && !error && skills.length > 0 && (
            <ul className="skills-list">
                {skills.map(renderSkillItem)}
            </ul>
            )}
        </div>
        </div>
    );
    };

export default SkillsManagement;