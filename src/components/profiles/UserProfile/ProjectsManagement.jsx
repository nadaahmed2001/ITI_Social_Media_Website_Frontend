// src/components/UserProfile/ProjectsManagement.jsx
import React, { useState, useEffect, useCallback } from 'react';
// Adjust the path based on your actual project structure
import {
    getAllProjects,
    addProject,
    updateProject,
    deleteProject,
    getContributors,
    addContributor,
    removeContributor
} from '../../../services/api'; // Import API functions

// Import necessary Icons
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PersonIcon from '@mui/icons-material/Person';

import './ProjectsManagement.css'; // Create/Update this CSS file

// Initial empty state for the project form
const initialProjectFormState = {
    title: '',
    description: '',
    demo_link: '',
    source_link: '',
    tags: '', // Comma-separated string for simplicity initially
    // featured_image: null // Omit image handling for now
};

// Define default avatar path (adjust if necessary)
const DEFAULT_AVATAR = '/images/profiles/user-default.png';

const ProjectsManagement = ({ profileId }) => {
    // --- State ---
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Project Add/Edit Modal State (Corrected Names)
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [projectFormData, setProjectFormData] = useState(initialProjectFormState);
    const [projectModalError, setProjectModalError] = useState('');
    const [isSavingProject, setIsSavingProject] = useState(false);

    // Delete Project State
    const [deletingProjectId, setDeletingProjectId] = useState(null);

    // Contributor Modal State
    const [isContributorModalOpen, setIsContributorModalOpen] = useState(false);
    const [managingContributorsForProject, setManagingContributorsForProject] = useState(null);
    const [contributorsList, setContributorsList] = useState([]);
    const [isContributorsLoading, setIsContributorsLoading] = useState(false);
    const [addContributorUsername, setAddContributorUsername] = useState('');
    const [isAddingContributor, setIsAddingContributor] = useState(false);
    const [isRemovingContributorUsername, setIsRemovingContributorUsername] = useState(null);
    const [contributorError, setContributorError] = useState('');

    // --- Fetch Projects (Filter Client-Side) ---
    const fetchProjects = useCallback(async () => {
        if (!profileId) {
            setError("Cannot load projects without a Profile ID.");
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const response = await getAllProjects();
            const allProjects = response.data || [];
            const userProjects = allProjects.filter(p => p.owner === profileId);
            // Sort projects, e.g., by creation date descending
            userProjects.sort((a, b) => new Date(b.created) - new Date(a.created));
            setProjects(userProjects);
        } catch (err) {
            console.error("Failed to fetch projects:", err);
            setError('Could not load your projects. Please try again.');
            setProjects([]);
        } finally {
            setIsLoading(false);
        }
    }, [profileId]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);


    // --- Project Modal Handlers (Using Corrected Names) ---
    const openModalForAdd = () => {
        setEditingProject(null);
        setProjectFormData(initialProjectFormState);
        setProjectModalError('');
        setIsProjectModalOpen(true);
    };

    const openModalForEdit = (project) => {
        setEditingProject(project);
        // Assuming project.tags is an array of IDs from the backend
        const tagsString = Array.isArray(project.tags) ? project.tags.join(', ') : '';
        setProjectFormData({
            title: project.title || '',
            description: project.description || '',
            demo_link: project.demo_link || '',
            source_link: project.source_link || '',
            tags: tagsString, // Display IDs for now; ideally fetch names
        });
        setProjectModalError('');
        setIsProjectModalOpen(true);
    };

    const closeProjectModal = () => { // Renamed
        if (isSavingProject) return;
        setIsProjectModalOpen(false);
        setEditingProject(null);
        setProjectModalError('');
    };

    const handleProjectModalChange = (e) => { // Renamed
        const { name, value } = e.target;
        setProjectFormData(prev => ({ ...prev, [name]: value }));
        setProjectModalError('');
    };

    const handleProjectModalSubmit = async (e) => { // Renamed
        e.preventDefault();
        if (!projectFormData.title.trim()) {
            setProjectModalError('Project title is required.');
            return;
        }

        setIsSavingProject(true); // Use corrected state
        setProjectModalError(''); // Use corrected state

        const payload = {
            title: projectFormData.title.trim(),
            description: projectFormData.description.trim(),
            demo_link: projectFormData.demo_link.trim() || null,
            source_link: projectFormData.source_link.trim() || null,
            tags: projectFormData.tags.split(',')
                        .map(tag => tag.trim())
                        .filter(Boolean), // Send array of tag names
        };

        try {
            if (editingProject) {
                await updateProject(editingProject.id, payload);
            } else {
                await addProject(payload);
            }
            closeProjectModal(); // Use corrected function name
            await fetchProjects(); // Refresh list
        } catch (err) {
            console.error("Failed to save project:", err.response?.data || err.message);
            const errors = err.response?.data;
            let errorMessage = 'Failed to save project.';
            if (typeof errors === 'object' && errors !== null) {
                 errorMessage = Object.entries(errors)
                    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                    .join(' ');
            } else if (typeof errors === 'string') {
                errorMessage = errors;
            }
            setProjectModalError(errorMessage); // Use corrected state setter
        } finally {
            setIsSavingProject(false); // Use corrected state setter
        }
    };

    // --- Delete Project Handling ---
    const handleDeleteProject = async (projectId) => {
        if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            return;
        }
        setDeletingProjectId(projectId);
        setError('');
        try {
            await deleteProject(projectId);
            await fetchProjects(); // Refresh list
        } catch (err) {
            console.error("Failed to delete project:", err.response?.data || err.message);
            setError(err.response?.data?.detail || 'Failed to delete project.');
        } finally {
            setDeletingProjectId(null);
        }
    };

    // --- Contributor Modal Handlers ---
    const fetchProjectContributors = useCallback(async (projectId) => {
        if (!projectId) return;
        setIsContributorsLoading(true);
        setContributorError('');
        try {
            const response = await getContributors(projectId);
            setContributorsList(response.data || []);
        } catch (err) {
            console.error("Failed to fetch contributors:", err);
            setContributorError("Could not load contributors.");
            setContributorsList([]);
        } finally {
            setIsContributorsLoading(false);
        }
    }, []);

    const openContributorsModal = (project) => {
        if (!project || !project.id) return;
        setManagingContributorsForProject({ id: project.id, title: project.title });
        setIsContributorModalOpen(true);
        setContributorsList([]);
        setAddContributorUsername('');
        setContributorError('');
        fetchProjectContributors(project.id);
    };

    const closeContributorsModal = () => {
        if (isAddingContributor || isContributorsLoading) return; // Prevent closing during loading
        setIsContributorModalOpen(false);
        setManagingContributorsForProject(null);
        setContributorError('');
        setAddContributorUsername('');
        setIsRemovingContributorUsername(null);
    };

    const handleAddContributor = async (e) => {
        e.preventDefault();
        if (!addContributorUsername.trim() || !managingContributorsForProject) return;
        const usernameToAdd = addContributorUsername.trim();
        const projectId = managingContributorsForProject.id;

        if (contributorsList.some(c => c.username.toLowerCase() === usernameToAdd.toLowerCase())) {
             setContributorError(`"${usernameToAdd}" is already a contributor.`); return;
        }
        setIsAddingContributor(true); setContributorError('');
        try {
            await addContributor(projectId, usernameToAdd);
            setAddContributorUsername('');
            await fetchProjectContributors(projectId);
        } catch (err) {
            console.error("Add contributor error:", err.response?.data || err.message);
            setContributorError(err.response?.data?.message || err.response?.data?.detail || `Failed to add "${usernameToAdd}".`);
        } finally { setIsAddingContributor(false); }
    };

    const handleRemoveContributor = async (usernameToRemove) => {
        if (!usernameToRemove || !managingContributorsForProject) return;
        const projectId = managingContributorsForProject.id;
        if (!window.confirm(`Are you sure you want to remove ${usernameToRemove} as a contributor?`)) { return; }

        setIsRemovingContributorUsername(usernameToRemove); setContributorError('');
        try {
            await removeContributor(projectId, usernameToRemove);
            await fetchProjectContributors(projectId);
        } catch (err) {
            console.error("Remove contributor error:", err.response?.data || err.message);
            setContributorError(err.response?.data?.message || err.response?.data?.detail || `Failed to remove "${usernameToRemove}".`);
        } finally { setIsRemovingContributorUsername(null); }
    };

    // --- Render Logic ---
    const renderProjectList = () => {
        if (isLoading) return <p className="loading-text">Loading projects...</p>;
        // Show fetch error only if list is empty
        if (error && projects.length === 0) return <p className="error-message">{error}</p>;
        if (!isLoading && projects.length === 0) {
            return <p className="no-data-text">You haven't added any projects yet. Click "Add New Project" to start!</p>;
        }

        return (
            <ul className="projects-manage-list">
                {projects.map(project => {
                    const isDeletingThis = deletingProjectId === project.id;
                    // Use corrected state name isSavingProject
                    const isActionBlocked = isLoading || isSavingProject || !!deletingProjectId;

                    return (
                        <li key={project.id} className={`project-manage-item ${isDeletingThis ? 'deleting' : ''}`}>
                            <div className="project-manage-info">
                                <span className="project-manage-title">{project.title}</span>
                                {project.description && <p className="project-manage-desc">{project.description.substring(0, 100)}{project.description.length > 100 ? '...' : ''}</p>}
                            </div>
                            <div className="project-manage-actions">
                                <button
                                    className="action-button contributors-button"
                                    onClick={() => openContributorsModal(project)}
                                    disabled={isActionBlocked} // Correct check
                                    title="Manage Contributors" >
                                    <PeopleIcon fontSize="small" />
                                </button>
                                <button
                                    className="action-button edit-button"
                                    onClick={() => openModalForEdit(project)}
                                    disabled={isActionBlocked} // Correct check
                                    title="Edit Project" >
                                    <EditIcon fontSize="small" />
                                </button>
                                <button
                                    className="action-button delete-button"
                                    onClick={() => handleDeleteProject(project.id)}
                                    disabled={isDeletingThis || isActionBlocked} // Correct check
                                    title="Delete Project" >
                                    {isDeletingThis ? <span className="spinner small red"></span> : <DeleteIcon fontSize="small" />}
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>
        );
    };


    // --- Main Return ---
    return (
        <div className="projects-management-container form-section">
            <h3>My Projects</h3>

            <button
                className="submit-button add-button"
                style={{ marginBottom: '25px' }}
                onClick={openModalForAdd}
                // Use corrected state name isSavingProject
                disabled={isLoading || !!deletingProjectId || isSavingProject}
            >
               <AddIcon fontSize="small"/> Add New Project
            </button>

            {/* Display general fetch error if projects did load but an error exists */}
            {error && projects.length > 0 && <p className="error-message">{error}</p>}

            {renderProjectList()}

            {/* --- Project Add/Edit Modal (Using Corrected Names) --- */}
            {isProjectModalOpen && (
                <div className="modal-overlay" onClick={closeProjectModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h4>{editingProject ? 'Edit Project' : 'Add New Project'}</h4>
                            {/* Use corrected state name */}
                            <button className="modal-close-button" onClick={closeProjectModal} disabled={isSavingProject}>&times;</button>
                        </div>
                        {/* Use corrected handler */}
                        <form onSubmit={handleProjectModalSubmit} className="modal-form">
                             {/* Use corrected state name */}
                            {projectModalError && <p className="error-message modal-error">{projectModalError}</p>}

                             {/* Use corrected change handler and saving state */}
                            <div className="form-group">
                                <label htmlFor="title">Project Title *</label>
                                <input type="text" id="title" name="title" value={projectFormData.title} onChange={handleProjectModalChange} required disabled={isSavingProject} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea id="description" name="description" value={projectFormData.description} onChange={handleProjectModalChange} rows="4" disabled={isSavingProject}></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="demo_link">Demo Link</label>
                                <input type="url" id="demo_link" name="demo_link" placeholder="https://..." value={projectFormData.demo_link} onChange={handleProjectModalChange} disabled={isSavingProject} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="source_link">Source Code Link</label>
                                <input type="url" id="source_link" name="source_link" placeholder="https://github.com/..." value={projectFormData.source_link} onChange={handleProjectModalChange} disabled={isSavingProject} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="tags">Tags (comma-separated)</label>
                                <input type="text" id="tags" name="tags" placeholder="e.g., react, django, javascript" value={projectFormData.tags} onChange={handleProjectModalChange} disabled={isSavingProject} />
                            </div>

                            <div className="modal-actions">
                                 {/* Use corrected close handler and saving state */}
                                <button type="button" className="cancel-button" onClick={closeProjectModal} disabled={isSavingProject}>Cancel</button>
                                <button type="submit" className="submit-button save-button" disabled={isSavingProject}>
                                     {/* Use corrected saving state */}
                                    {isSavingProject ? 'Saving...' : (editingProject ? 'Update Project' : 'Add Project')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- Contributors Modal --- */}
            {isContributorModalOpen && managingContributorsForProject && (
                 <div className="modal-overlay" onClick={closeContributorsModal}>
                    <div className="modal-content contributor-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h4>Manage Contributors</h4>
                            <span className='modal-subtitle'>For: {managingContributorsForProject.title}</span>
                            <button className="modal-close-button" onClick={closeContributorsModal} disabled={isAddingContributor || isContributorsLoading}>&times;</button>
                        </div>

                        {contributorError && <p className="error-message modal-error">{contributorError}</p>}

                        {/* Add Contributor Form */}
                        <form onSubmit={handleAddContributor} className="contributor-add-form">
                            <div className="form-group">
                                 <label htmlFor="contributorUsername">Add by Username</label>
                                 <div className="add-contributor-input-group">
                                    <input
                                        type="text"
                                        id="contributorUsername"
                                        placeholder="Enter username..."
                                        value={addContributorUsername}
                                        onChange={(e) => setAddContributorUsername(e.target.value)}
                                        disabled={isAddingContributor || isContributorsLoading}
                                        required
                                    />
                                    <button type="submit" className="add-contributor-button" disabled={!addContributorUsername.trim() || isAddingContributor || isContributorsLoading}>
                                        {isAddingContributor ? <span className="spinner small"></span> : <PersonAddIcon fontSize="small"/>}
                                        {isAddingContributor ? 'Adding...' : 'Add'}
                                    </button>
                                 </div>
                            </div>
                        </form>

                         {/* Current Contributors List */}
                         <div className="current-contributors-section">
                            <h5>Current Contributors</h5>
                            {isContributorsLoading && <p className="loading-text small">Loading...</p>}
                            {!isContributorsLoading && contributorsList.length === 0 && (
                                <p className="no-data-text small">No contributors added yet.</p>
                            )}
                            {!isContributorsLoading && contributorsList.length > 0 && (
                                <ul className='contributors-modal-list'>
                                    {contributorsList.map(c => {
                                        const isRemovingThis = isRemovingContributorUsername === c.username;
                                        return (
                                            <li key={c.id || c.username} className={`contributor-modal-item ${isRemovingThis ? 'removing' : ''}`}>
                                                 <img
                                                    src={c.profile_image || DEFAULT_AVATAR}
                                                    alt={c.username}
                                                    className="contributor-avatar small"
                                                    onError={(e) => { if(e.target.src !== DEFAULT_AVATAR) e.target.src = DEFAULT_AVATAR; }}
                                                />
                                                <span className='contributor-modal-username'>{c.username}</span>
                                                <button
                                                    className='remove-contributor-button'
                                                    onClick={() => handleRemoveContributor(c.username)}
                                                    disabled={isRemovingThis || isAddingContributor || (isRemovingContributorUsername && !isRemovingThis)}
                                                    title={`Remove ${c.username}`}
                                                >
                                                    {isRemovingThis ? <span className="spinner small red"></span> : <PersonRemoveIcon fontSize="small"/>}
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                         </div>
                    </div>
                 </div>
            )}
            {/* --- End Contributors Modal --- */}

        </div> // End container
    );
};

export default ProjectsManagement;