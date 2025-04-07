import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    getMyProjects,
    addProject,    
    updateProject, 
    deleteProject,
    getContributors,
    addContributor,
    removeContributor,
    getAllTags
} from '../../services/api';

// Import necessary Icons
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import ImageIcon from '@mui/icons-material/Image'; // For placeholder
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'; // For remove button
import CloudUploadIcon from '@mui/icons-material/CloudUpload'; // For widget trigger button

import './ProjectsManagement.css'; 

// Initial empty state for the project form
const initialProjectFormState = {
    title: '',
    description: '',
    demo_link: '',
    source_link: '',
    tags: '', // Comma-separated string of names
    // featured_image URL handled by separate state
};

// Define default paths (ADJUST THESE PATHS)
const DEFAULT_AVATAR = '/images/profiles/user-default.png';
const DEFAULT_PROJECT_IMAGE = '/images/projects/default.jpg';

// --- CLOUDINARY CONFIG (Use Environment Variables!) ---
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dsaznefnt"; 
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "ITIHub_profile_pics"; 
// --- End Cloudinary Config ---


const ProjectsManagement = ({ profileId }) => {
    // --- State ---
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [availableTags, setAvailableTags] = useState([]);
    const [isLoadingTags, setIsLoadingTags] = useState(true);

    // Project Add/Edit Modal State
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [projectFormData, setProjectFormData] = useState(initialProjectFormState);
    const [projectModalError, setProjectModalError] = useState('');
    const [isSavingProject, setIsSavingProject] = useState(false);

    // --- Project Image State (Widget approach) ---
    const [projectImageUrl, setProjectImageUrl] = useState(null); // Holds URL from widget or initial edit state
    const [projectImageChanged, setProjectImageChanged] = useState(false); // Track if URL changed via widget/clear
    const projectWidgetRef = useRef(null); // Ref for Cloudinary widget instance
    // --- Removed file input state ---

    // Delete Project State
    const [deletingProjectId, setDeletingProjectId] = useState(null);

    // Contributor Modal State (Now used)
    const [isContributorModalOpen, setIsContributorModalOpen] = useState(false);
    const [managingContributorsForProject, setManagingContributorsForProject] = useState(null);
    const [contributorsList, setContributorsList] = useState([]);
    const [isContributorsLoading, setIsContributorsLoading] = useState(false);
    const [addContributorUsername, setAddContributorUsername] = useState('');
    const [isAddingContributor, setIsAddingContributor] = useState(false);
    const [isRemovingContributorUsername, setIsRemovingContributorUsername] = useState(null);
    const [contributorError, setContributorError] = useState('');

    // --- Fetch Projects (Using getMyProjects) ---
    const fetchProjects = useCallback(async () => {
        if (!profileId) { setError("Cannot load projects without a Profile ID."); setIsLoading(false); return; }
        setIsLoading(true); setError('');
        try {
            const response = await getMyProjects(profileId);
            const userProjects = response.data || [];
            userProjects.sort((a, b) => new Date(b.created) - new Date(a.created));
            setProjects(userProjects);
        } catch (err) { console.error("Failed to fetch projects:", err); setError('Could not load your projects.'); setProjects([]); }
        finally { setIsLoading(false); }
    }, [profileId]);

    // --- Fetch Tags ---
    const fetchTags = useCallback(async () => {
        setIsLoadingTags(true);
        try {
            const response = await getAllTags();
            setAvailableTags(response.data || []);
            console.log("Fetched Available Tags:", response.data); // DEBUG: Log fetched tags
        } catch (err) { console.error("Failed to fetch tags:", err); /* Handle non-critical error */ }
        finally { setIsLoadingTags(false); }
    }, []);


    useEffect(() => {
        if (window.cloudinary) {
            projectWidgetRef.current = window.cloudinary.createUploadWidget({
                cloudName: CLOUDINARY_CLOUD_NAME,
                uploadPreset: CLOUDINARY_UPLOAD_PRESET,
                folder: 'project_images', // Optional folder
                sources: ['local', 'url'],
                multiple: false,
            }, (widgetError, result) => {
                if (!widgetError && result && result.event === "success") {
                    setProjectModalError('');
                    setProjectImageUrl(result.info.secure_url); // Set state with Cloudinary URL
                    setProjectImageChanged(true); // Mark change
                } else if (widgetError) {
                    console.error('Project Widget Error:', widgetError);
                    setProjectModalError("Project image upload failed.");
                }
            });
        } else {
            console.error("Cloudinary script not loaded for project widget");
        }
    }, []); // Run once

    // --- useEffect for Initial Data Loading ---
    useEffect(() => { fetchProjects(); fetchTags(); }, [fetchProjects, fetchTags]);


    // --- Project Modal Handlers ---
    const openModalForAdd = () => {
        setEditingProject(null); setProjectFormData(initialProjectFormState);
        setProjectImageUrl(null); // Clear image URL
        setProjectImageChanged(false); // Reset changed flag
        setProjectModalError(''); setIsProjectModalOpen(true);
    };

    const openModalForEdit = (project) => {
        console.log("Opening Edit Modal For Project:", project); // DEBUG
        setEditingProject(project);
        let tagsString = ''; // Default to empty

        // Prioritize using nested tag objects if backend sends them
        const tagsSource = project.tags || []; // Use 'tags' field from project data

        if (Array.isArray(tagsSource) && tagsSource.length > 0) {
            // Check if the first element looks like a tag object {id, name}
            if (typeof tagsSource[0] === 'object' && tagsSource[0] !== null && tagsSource[0].hasOwnProperty('name')) {
                console.log("Mapping tags from nested objects."); // DEBUG
                tagsString = tagsSource
                    .map(tag => tag.name) // Get the name from each object
                    .filter(Boolean)     // Ensure names are not empty/null
                    .join(', ');         // Join with comma and space
            }
            // Fallback: If tagsSource is array of IDs AND availableTags lookup list is ready
            else if (availableTags.length > 0) {
                console.log("Mapping tags using ID lookup."); // DEBUG
                tagsString = tagsSource.map(tagId => {
                    const foundTag = availableTags.find(tag => String(tag.id) === String(tagId)); // Compare as strings
                    return foundTag ? foundTag.name : ''; // Use name if found, else empty string
                }).filter(Boolean).join(', ');
            }
            // Fallback if lookup list isn't ready or data format unexpected
            else {
                 console.warn("Tags are likely IDs, but availableTags list is empty. Cannot map names."); // DEBUG
                 // Optionally show IDs as a last resort, but it's not ideal UX
                 // tagsString = tagsSource.join(', ');
            }
        } else {
             console.log("Project has no tags or 'tags' field is not a non-empty array."); // DEBUG
        }

        console.log("Setting projectFormData tags to:", tagsString); // DEBUG

        setProjectFormData({
            title: project.title || '',
            description: project.description || '',
            demo_link: project.demo_link || '',
            source_link: project.source_link || '',
            tags: tagsString, // Set the generated string of names
        });
        setProjectImageUrl(project.featured_image || null); // Keep image logic
        setProjectImageChanged(false); // Reset image changed flag
        setProjectModalError('');
        setIsProjectModalOpen(true);
    };
    // --- End REVISED openModalForEdit ---


    const closeProjectModal = () => {
        if (isSavingProject) return;
        setIsProjectModalOpen(false); setEditingProject(null); setProjectModalError('');
        setProjectImageUrl(null); setProjectImageChanged(false); // Clear image state
    };

    const handleProjectModalChange = (e) => {
        const { name, value } = e.target; setProjectFormData(prev => ({ ...prev, [name]: value })); setProjectModalError('');
    };

    // --- Project Image Handlers (Widget approach) ---
    const openProjectImageWidget = () => { // Renamed from trigger...
        if (projectWidgetRef.current) {
            setProjectModalError(''); projectWidgetRef.current.open();
        } else { setProjectModalError("Image upload service is not ready."); }
    };
    const handleClearProjectImage = () => {
        if (!projectImageUrl) return;
        if (window.confirm("Mark image for removal? Changes saved when you update project.")) {
            setProjectImageUrl(null); setProjectImageChanged(true); setProjectModalError('');
        }
    };

    // --- handleProjectModalSubmit (Sends JSON with URL) ---
    const handleProjectModalSubmit = async (e) => {
        e.preventDefault();
        if (!projectFormData.title.trim()) { setProjectModalError('Project title required.'); return; }
        // Check if any changes were made (optional, prevents save if only image was opened/closed)
        // const otherFieldsChanged = JSON.stringify({title:..., desc:...}) !== JSON.stringify({title: editingProject?.title,...});
        // if (!projectImageChanged && !otherFieldsChanged) return; // Or show message

        setIsSavingProject(true); setProjectModalError('');

        // --- Create JSON Payload ---
        const payload = {
            title: projectFormData.title.trim(),
            description: projectFormData.description.trim(),
            demo_link: projectFormData.demo_link.trim() || null,
            source_link: projectFormData.source_link.trim() || null,
            // Backend serializer expects 'tag_names' key with list of names
            tag_names: projectFormData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        };

        // Conditionally add 'featured_image' to payload ONLY if it changed
        if (projectImageChanged) {
            payload.featured_image = projectImageUrl; // Send URL string or null
        }

        try {
            // Ensure addProject/updateProject in api.js send JSON
            if (editingProject) {
                await updateProject(editingProject.id, payload);
            } else {
                await addProject(payload);
            }
            closeProjectModal(); await fetchProjects();
        } catch (err) {
            console.error("Save project error:", err); const errors = err.response?.data; let errorMessage = 'Failed to save.';
            if (typeof errors === 'object' && errors !== null) { errorMessage = Object.entries(errors).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(',') : v}`).join('; '); }
            else if (typeof errors === 'string') { errorMessage = errors; }
            setProjectModalError(errorMessage);
        } finally { setIsSavingProject(false); }
    }; // --- End handleProjectModalSubmit ---

    // --- Delete Project Handler (Uses deleteProject) ---
    const handleDeleteProject = async (projectId) => {
        if (!window.confirm('Delete this project permanently?')) return;
        setDeletingProjectId(projectId); setError('');
        try {
            await deleteProject(projectId); // <-- Use imported function
            await fetchProjects();
        } catch (err) { console.error("Delete project error:", err); setError(err.response?.data?.detail || 'Failed to delete.'); }
        finally { setDeletingProjectId(null); }
    };

    // --- Contributor Modal Handlers (Use imported functions) ---
    const fetchProjectContributors = useCallback(async (projectId) => {
        if (!projectId) return;
        setIsContributorsLoading(true); setContributorError('');
        try {
            const response = await getContributors(projectId); // <-- Use imported function
            setContributorsList(response.data || []);
        } catch (err) { console.error("Fetch contributors error:", err); setContributorError("Load failed."); setContributorsList([]); }
        finally { setIsContributorsLoading(false); }
    }, []); // fetchProjectContributors definition

    const openContributorsModal = (project) => {
        if (!project || !project.id) return;
        setManagingContributorsForProject({ id: project.id, title: project.title });
        setIsContributorModalOpen(true); setContributorsList([]); setAddContributorUsername(''); setContributorError('');
        fetchProjectContributors(project.id); // Call fetcher
    };

    const closeContributorsModal = () => {
        if (isAddingContributor || isContributorsLoading) return;
        setIsContributorModalOpen(false); setManagingContributorsForProject(null); setContributorError(''); setAddContributorUsername(''); setIsRemovingContributorUsername(null);
    };

    const handleAddContributor = async (e) => {
        e.preventDefault();
        if (!addContributorUsername.trim() || !managingContributorsForProject) return;
        const usernameToAdd = addContributorUsername.trim(); const projectId = managingContributorsForProject.id;
        if (contributorsList.some(c => c.username.toLowerCase() === usernameToAdd.toLowerCase())) { setContributorError(`"${usernameToAdd}" already added.`); return; }
        setIsAddingContributor(true); setContributorError('');
        try {
            await addContributor(projectId, usernameToAdd); // <-- Use imported function
            setAddContributorUsername(''); await fetchProjectContributors(projectId);
        } catch (err) { console.error("Add contributor error:", err); setContributorError(err.response?.data?.message || `No user found with this username.`); }
        finally { setIsAddingContributor(false); }
    };

    const handleRemoveContributor = async (usernameToRemove) => {
        if (!usernameToRemove || !managingContributorsForProject) return;
        const projectId = managingContributorsForProject.id;
        if (!window.confirm(`Remove ${usernameToRemove}?`)) return;
        setIsRemovingContributorUsername(usernameToRemove); setContributorError('');
        try {
            await removeContributor(projectId, usernameToRemove); // <-- Use imported function
            await fetchProjectContributors(projectId);
        } catch (err) { console.error("Remove contributor error:", err); setContributorError(err.response?.data?.message || `Failed to remove.`); }
        finally { setIsRemovingContributorUsername(null); }
    };

    // --- Render Project List ---
    const renderProjectList = () => {
        const initialLoading = isLoading || isLoadingTags;
        if (initialLoading && projects.length === 0) return <p className="loading-text">Loading projects...</p>;
        if (error && projects.length === 0) return <p className="error-message">{error}</p>;
        if (!isLoading && projects.length === 0) return <p className="no-data-text">No projects yet.</p>;

        return (
            <ul className="projects-manage-list">
                {projects.map(project => {
                    const isDeletingThis = deletingProjectId === project.id;
                    const isActionBlocked = isLoading || isSavingProject || !!deletingProjectId;
                    return (
                        <li key={project.id} className={`project-manage-item ${isDeletingThis ? 'deleting' : ''}`}>
                            <div className="project-manage-info">
                                <span className="project-manage-title">{project.title}</span>
                                {project.description && <p className="project-manage-desc">{project.description.substring(0, 100)}{project.description.length > 100 ? '...' : ''}</p>}
                            </div>
                            <div className="project-manage-actions">
                                {/* Contributor Button - Calls openContributorsModal */}
                                <button className="action-button contributors-button" onClick={() => openContributorsModal(project)} disabled={isActionBlocked} title="Manage Contributors" > <PeopleIcon fontSize="small" /> </button>
                                {/* Edit Button - Calls openModalForEdit */}
                                <button className="action-button edit-button" onClick={() => openModalForEdit(project)} disabled={isActionBlocked} title="Edit Project" > <EditIcon fontSize="small" /> </button>
                                {/* Delete Button - Calls handleDeleteProject */}
                                <button className="action-button delete-button" onClick={() => handleDeleteProject(project.id)} disabled={isDeletingThis || isActionBlocked} title="Delete Project" >
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
            <button className="submit-button add-button" style={{ marginBottom: '25px' }} onClick={openModalForAdd} disabled={isLoading || !!deletingProjectId || isSavingProject}>
                Add Project
            </button>
            {error && projects.length > 0 && <p className="error-message">{error}</p>}
            {renderProjectList()}

            {/* --- Project Add/Edit Modal --- */}
            {isProjectModalOpen && (
                <div className="modal-overlay" onClick={closeProjectModal}>
                    <div className="modal-content project-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h4>{editingProject ? 'Edit Project' : 'Add New Project'}</h4>
                            <button className="modal-close-button" onClick={closeProjectModal} disabled={isSavingProject}>&times;</button>
                        </div>
                        <form onSubmit={handleProjectModalSubmit} className="modal-form">
                            {projectModalError && <p className="error-message modal-error">{projectModalError}</p>}
                            {/* Text Inputs */}
                            <div className="form-group"> <label htmlFor="title">Project Title *</label> <input type="text" id="title" name="title" value={projectFormData.title} onChange={handleProjectModalChange} required disabled={isSavingProject} /> </div>
                            <div className="form-group"> <label htmlFor="description">Description</label> <textarea id="description" name="description" value={projectFormData.description} onChange={handleProjectModalChange} rows="4" disabled={isSavingProject}></textarea> </div>
                            <div className="form-group"> <label htmlFor="demo_link">Demo Link</label> <input type="url" id="demo_link" name="demo_link" placeholder="https://..." value={projectFormData.demo_link} onChange={handleProjectModalChange} disabled={isSavingProject} /> </div>
                            <div className="form-group"> <label htmlFor="source_link">Source Code Link</label> <input type="url" id="source_link" name="source_link" placeholder="https://github.com/..." value={projectFormData.source_link} onChange={handleProjectModalChange} disabled={isSavingProject} /> </div>
                            <div className="form-group"> <label htmlFor="tags">Tags (comma-separated names)</label> <input type="text" id="tags" name="tags" placeholder="e.g., react, django, javascript" value={projectFormData.tags} onChange={handleProjectModalChange} disabled={isSavingProject} /> </div>
                            {/* Image Input Section */}
                            <div className="form-group">
                                <label>Featured Image</label>
                                <div className="project-image-modal-preview-area">
                                    {/* Display based on projectImageUrl state */}
                                    {projectImageUrl ? (
                                        <img src={projectImageUrl} alt="Project preview" className="project-image-modal-preview" onError={(e) => { if(e.target.src !== DEFAULT_PROJECT_IMAGE) e.target.src = DEFAULT_PROJECT_IMAGE; }}/>
                                    ) : (
                                        <div className="project-image-modal-placeholder"><ImageIcon /></div>
                                    )}
                                    {/* No hidden input */}
                                    <div className="project-image-modal-buttons">
                                         {/* Button triggers widget */}
                                        <button type="button" onClick={openProjectImageWidget} disabled={isSavingProject}>
                                            <CloudUploadIcon fontSize='small' sx={{mr: 0.5}}/> Choose / Upload
                                        </button>
                                         {/* Show remove button only if there's an image */}
                                        {projectImageUrl && (
                                            <button type="button" className="remove-button" onClick={handleClearProjectImage} disabled={isSavingProject} title="Mark image for removal">
                                                <DeleteForeverIcon fontSize="small"/> Remove
                                            </button>
                                        )}
                                    </div>
                                </div>
                                 {/* Indicate if change is pending */}
                                {projectImageChanged && <p className="selected-file-info">{projectImageUrl ? "New image selected" : "Image marked for removal"}</p>}
                            </div>
                            {/* Modal Actions */}
                            <div className="modal-actions">
                                <button type="button" className="cancel-button" onClick={closeProjectModal} disabled={isSavingProject}>Cancel</button>
                                <button type="submit" className="submit-button save-button" disabled={isSavingProject}> {isSavingProject ? 'Saving...' : (editingProject ? 'Update Project' : 'Add Project')} </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- Contributors Modal (Ensure this JSX is present) --- */}
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
                                    <input type="text" id="contributorUsername" placeholder="Enter username..." value={addContributorUsername} onChange={(e) => setAddContributorUsername(e.target.value)} disabled={isAddingContributor || isContributorsLoading} required />
                                    <button type="submit" className="add-contributor-button" disabled={!addContributorUsername.trim() || isAddingContributor || isContributorsLoading}>
                                        {isAddingContributor ? <span className="spinner small"></span> : <PersonAddIcon fontSize="small"/>} {isAddingContributor ? 'Adding...' : 'Add'}
                                    </button>
                                </div>
                            </div>
                        </form>
                         {/* Current Contributors List */}
                        <div className="current-contributors-section">
                            <h5>Current Contributors</h5>
                            {isContributorsLoading && <p className="loading-text small">Loading...</p>}
                            {!isContributorsLoading && contributorsList.length === 0 && (<p className="no-data-text small">No contributors added yet.</p>)}
                            {!isContributorsLoading && contributorsList.length > 0 && (
                                <ul className='contributors-modal-list'>
                                    {contributorsList.map(c => {
                                        const isRemovingThis = isRemovingContributorUsername === c.username;
                                        return (
                                            <li key={c.id || c.username} className={`contributor-modal-item ${isRemovingThis ? 'removing' : ''}`}>
                                                <img src={c.profile_picture || DEFAULT_AVATAR} alt={c.username} className="contributor-avatar small" onError={(e) => { if(e.target.src !== DEFAULT_AVATAR) e.target.src = DEFAULT_AVATAR; }}/>
                                                <span className='contributor-modal-username'>{c.username}</span>
                                                <button className='remove-contributor-button' onClick={() => handleRemoveContributor(c.username)} disabled={isRemovingThis || isAddingContributor || (isRemovingContributorUsername && !isRemovingThis)} title={`Remove ${c.username}`} >
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
        </div> 
    );
};

export default ProjectsManagement;