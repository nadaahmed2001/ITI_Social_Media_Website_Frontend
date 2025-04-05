// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import {
//     getMyProjects,
//     addProject,    
//     updateProject, 
//     deleteProject,
//     getContributors,
//     addContributor,
//     removeContributor,
//     getAllTags
// } from '../../../services/api'; 

// // Import necessary Icons
// import AddIcon from '@mui/icons-material/Add';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import PeopleIcon from '@mui/icons-material/People';
// import PersonAddIcon from '@mui/icons-material/PersonAdd';
// import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
// import ImageIcon from '@mui/icons-material/Image'; // For placeholder
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever'; // For remove button
// import CloudUploadIcon from '@mui/icons-material/CloudUpload'; // For widget trigger button

// import './ProjectsManagement.css'; 

// // Initial empty state for the project form
// const initialProjectFormState = {
//     title: '',
//     description: '',
//     demo_link: '',
//     source_link: '',
//     tags: '', // Comma-separated string of names
//     // featured_image URL handled by separate state
// };

// // Define default paths (ADJUST THESE PATHS)
// const DEFAULT_AVATAR = '/images/profiles/user-default.png';
// const DEFAULT_PROJECT_IMAGE = '/images/projects/default.jpg';

// // --- CLOUDINARY CONFIG (Use Environment Variables!) ---
// const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dsaznefnt"; 
// const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "ITIHub_profile_pics"; 
// // --- End Cloudinary Config ---


// const ProjectsManagement = ({ profileId }) => {
//     // --- State ---
//     const [projects, setProjects] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [availableTags, setAvailableTags] = useState([]);
//     const [isLoadingTags, setIsLoadingTags] = useState(true);

//     // Project Add/Edit Modal State
//     const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
//     const [editingProject, setEditingProject] = useState(null);
//     const [projectFormData, setProjectFormData] = useState(initialProjectFormState);
//     const [projectModalError, setProjectModalError] = useState('');
//     const [isSavingProject, setIsSavingProject] = useState(false);

//     // --- Project Image State (Widget approach) ---
//     const [projectImageUrl, setProjectImageUrl] = useState(null); // Holds URL from widget or initial edit state
//     const [projectImageChanged, setProjectImageChanged] = useState(false); // Track if URL changed via widget/clear
//     const projectWidgetRef = useRef(null); // Ref for Cloudinary widget instance
//     // --- Removed file input state ---

//     // Delete Project State
//     const [deletingProjectId, setDeletingProjectId] = useState(null);

//     // Contributor Modal State (Now used)
//     const [isContributorModalOpen, setIsContributorModalOpen] = useState(false);
//     const [managingContributorsForProject, setManagingContributorsForProject] = useState(null);
//     const [contributorsList, setContributorsList] = useState([]);
//     const [isContributorsLoading, setIsContributorsLoading] = useState(false);
//     const [addContributorUsername, setAddContributorUsername] = useState('');
//     const [isAddingContributor, setIsAddingContributor] = useState(false);
//     const [isRemovingContributorUsername, setIsRemovingContributorUsername] = useState(null);
//     const [contributorError, setContributorError] = useState('');

//     // --- Fetch Projects (Using getMyProjects) ---
//     const fetchProjects = useCallback(async () => {
//         if (!profileId) { setError("Cannot load projects without a Profile ID."); setIsLoading(false); return; }
//         setIsLoading(true); setError('');
//         try {
//             const response = await getMyProjects(profileId);
//             const userProjects = response.data || [];
//             userProjects.sort((a, b) => new Date(b.created) - new Date(a.created));
//             setProjects(userProjects);
//         } catch (err) { console.error("Failed to fetch projects:", err); setError('Could not load your projects.'); setProjects([]); }
//         finally { setIsLoading(false); }
//     }, [profileId]);

//     // --- Fetch Tags ---
//     const fetchTags = useCallback(async () => {
//         setIsLoadingTags(true);
//         try {
//             const response = await getAllTags();
//             setAvailableTags(response.data || []);
//             console.log("Fetched Available Tags:", response.data); // DEBUG: Log fetched tags
//         } catch (err) { console.error("Failed to fetch tags:", err); /* Handle non-critical error */ }
//         finally { setIsLoadingTags(false); }
//     }, []);


//     useEffect(() => {
//         if (window.cloudinary) {
//             projectWidgetRef.current = window.cloudinary.createUploadWidget({
//                 cloudName: CLOUDINARY_CLOUD_NAME,
//                 uploadPreset: CLOUDINARY_UPLOAD_PRESET,
//                 folder: 'project_images', // Optional folder
//                 sources: ['local', 'url'],
//                 multiple: false,
//             }, (widgetError, result) => {
//                 if (!widgetError && result && result.event === "success") {
//                     setProjectModalError('');
//                     setProjectImageUrl(result.info.secure_url); // Set state with Cloudinary URL
//                     setProjectImageChanged(true); // Mark change
//                 } else if (widgetError) {
//                     console.error('Project Widget Error:', widgetError);
//                     setProjectModalError("Project image upload failed.");
//                 }
//             });
//         } else {
//             console.error("Cloudinary script not loaded for project widget");
//         }
//     }, []); // Run once

//     // --- useEffect for Initial Data Loading ---
//     useEffect(() => { fetchProjects(); fetchTags(); }, [fetchProjects, fetchTags]);


//     // --- Project Modal Handlers ---
//     const openModalForAdd = () => {
//         setEditingProject(null); setProjectFormData(initialProjectFormState);
//         setProjectImageUrl(null); // Clear image URL
//         setProjectImageChanged(false); // Reset changed flag
//         setProjectModalError(''); setIsProjectModalOpen(true);
//     };

//     const openModalForEdit = (project) => {
//         console.log("Opening Edit Modal For Project:", project); // DEBUG
//         setEditingProject(project);
//         let tagsString = ''; // Default to empty

//         // Prioritize using nested tag objects if backend sends them
//         const tagsSource = project.tags || []; // Use 'tags' field from project data

//         if (Array.isArray(tagsSource) && tagsSource.length > 0) {
//             // Check if the first element looks like a tag object {id, name}
//             if (typeof tagsSource[0] === 'object' && tagsSource[0] !== null && tagsSource[0].hasOwnProperty('name')) {
//                 console.log("Mapping tags from nested objects."); // DEBUG
//                 tagsString = tagsSource
//                     .map(tag => tag.name) // Get the name from each object
//                     .filter(Boolean)     // Ensure names are not empty/null
//                     .join(', ');         // Join with comma and space
//             }
//             // Fallback: If tagsSource is array of IDs AND availableTags lookup list is ready
//             else if (availableTags.length > 0) {
//                 console.log("Mapping tags using ID lookup."); // DEBUG
//                 tagsString = tagsSource.map(tagId => {
//                     const foundTag = availableTags.find(tag => String(tag.id) === String(tagId)); // Compare as strings
//                     return foundTag ? foundTag.name : ''; // Use name if found, else empty string
//                 }).filter(Boolean).join(', ');
//             }
//             // Fallback if lookup list isn't ready or data format unexpected
//             else {
//                  console.warn("Tags are likely IDs, but availableTags list is empty. Cannot map names."); // DEBUG
//                  // Optionally show IDs as a last resort, but it's not ideal UX
//                  // tagsString = tagsSource.join(', ');
//             }
//         } else {
//              console.log("Project has no tags or 'tags' field is not a non-empty array."); // DEBUG
//         }

//         console.log("Setting projectFormData tags to:", tagsString); // DEBUG

//         setProjectFormData({
//             title: project.title || '',
//             description: project.description || '',
//             demo_link: project.demo_link || '',
//             source_link: project.source_link || '',
//             tags: tagsString, // Set the generated string of names
//         });
//         setProjectImageUrl(project.featured_image || null); // Keep image logic
//         setProjectImageChanged(false); // Reset image changed flag
//         setProjectModalError('');
//         setIsProjectModalOpen(true);
//     };
//     // --- End REVISED openModalForEdit ---


//     const closeProjectModal = () => {
//         if (isSavingProject) return;
//         setIsProjectModalOpen(false); setEditingProject(null); setProjectModalError('');
//         setProjectImageUrl(null); setProjectImageChanged(false); // Clear image state
//     };

//     const handleProjectModalChange = (e) => {
//         const { name, value } = e.target; setProjectFormData(prev => ({ ...prev, [name]: value })); setProjectModalError('');
//     };

//     // --- Project Image Handlers (Widget approach) ---
//     const openProjectImageWidget = () => { // Renamed from trigger...
//         if (projectWidgetRef.current) {
//             setProjectModalError(''); projectWidgetRef.current.open();
//         } else { setProjectModalError("Image upload service is not ready."); }
//     };
//     const handleClearProjectImage = () => {
//         if (!projectImageUrl) return;
//         if (window.confirm("Mark image for removal? Changes saved when you update project.")) {
//             setProjectImageUrl(null); setProjectImageChanged(true); setProjectModalError('');
//         }
//     };

//     // --- handleProjectModalSubmit (Sends JSON with URL) ---
//     const handleProjectModalSubmit = async (e) => {
//         e.preventDefault();
//         if (!projectFormData.title.trim()) { setProjectModalError('Project title required.'); return; }
//         // Check if any changes were made (optional, prevents save if only image was opened/closed)
//         // const otherFieldsChanged = JSON.stringify({title:..., desc:...}) !== JSON.stringify({title: editingProject?.title,...});
//         // if (!projectImageChanged && !otherFieldsChanged) return; // Or show message

//         setIsSavingProject(true); setProjectModalError('');

//         // --- Create JSON Payload ---
//         const payload = {
//             title: projectFormData.title.trim(),
//             description: projectFormData.description.trim(),
//             demo_link: projectFormData.demo_link.trim() || null,
//             source_link: projectFormData.source_link.trim() || null,
//             // Backend serializer expects 'tag_names' key with list of names
//             tag_names: projectFormData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
//         };

//         // Conditionally add 'featured_image' to payload ONLY if it changed
//         if (projectImageChanged) {
//             payload.featured_image = projectImageUrl; // Send URL string or null
//         }

//         try {
//             // Ensure addProject/updateProject in api.js send JSON
//             if (editingProject) {
//                 await updateProject(editingProject.id, payload);
//             } else {
//                 await addProject(payload);
//             }
//             closeProjectModal(); await fetchProjects();
//         } catch (err) {
//             console.error("Save project error:", err); const errors = err.response?.data; let errorMessage = 'Failed to save.';
//             if (typeof errors === 'object' && errors !== null) { errorMessage = Object.entries(errors).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(',') : v}`).join('; '); }
//             else if (typeof errors === 'string') { errorMessage = errors; }
//             setProjectModalError(errorMessage);
//         } finally { setIsSavingProject(false); }
//     }; // --- End handleProjectModalSubmit ---

//     // --- Delete Project Handler (Uses deleteProject) ---
//     const handleDeleteProject = async (projectId) => {
//         if (!window.confirm('Delete this project permanently?')) return;
//         setDeletingProjectId(projectId); setError('');
//         try {
//             await deleteProject(projectId); // <-- Use imported function
//             await fetchProjects();
//         } catch (err) { console.error("Delete project error:", err); setError(err.response?.data?.detail || 'Failed to delete.'); }
//         finally { setDeletingProjectId(null); }
//     };

//     // --- Contributor Modal Handlers (Use imported functions) ---
//     const fetchProjectContributors = useCallback(async (projectId) => {
//         if (!projectId) return;
//         setIsContributorsLoading(true); setContributorError('');
//         try {
//             const response = await getContributors(projectId); // <-- Use imported function
//             setContributorsList(response.data || []);
//         } catch (err) { console.error("Fetch contributors error:", err); setContributorError("Load failed."); setContributorsList([]); }
//         finally { setIsContributorsLoading(false); }
//     }, []); // fetchProjectContributors definition

    // const openContributorsModal = (project) => {
    //     if (!project || !project.id) return;
    //     setManagingContributorsForProject({ id: project.id, title: project.title });
    //     setIsContributorModalOpen(true); setContributorsList([]); setAddContributorUsername(''); setContributorError('');
    //     fetchProjectContributors(project.id); // Call fetcher
    // };

    // const closeContributorsModal = () => {
    //     if (isAddingContributor || isContributorsLoading) return;
    //     setIsContributorModalOpen(false); setManagingContributorsForProject(null); setContributorError(''); setAddContributorUsername(''); setIsRemovingContributorUsername(null);
    // };

    // const handleAddContributor = async (e) => {
    //     e.preventDefault();
    //     if (!addContributorUsername.trim() || !managingContributorsForProject) return;
    //     const usernameToAdd = addContributorUsername.trim(); const projectId = managingContributorsForProject.id;
    //     if (contributorsList.some(c => c.username.toLowerCase() === usernameToAdd.toLowerCase())) { setContributorError(`"${usernameToAdd}" already added.`); return; }
    //     setIsAddingContributor(true); setContributorError('');
    //     try {
    //         await addContributor(projectId, usernameToAdd); // <-- Use imported function
    //         setAddContributorUsername(''); await fetchProjectContributors(projectId);
    //     } catch (err) { console.error("Add contributor error:", err); setContributorError(err.response?.data?.message || `No user found with this username.`); }
    //     finally { setIsAddingContributor(false); }
    // };

    // const handleRemoveContributor = async (usernameToRemove) => {
    //     if (!usernameToRemove || !managingContributorsForProject) return;
    //     const projectId = managingContributorsForProject.id;
    //     if (!window.confirm(`Remove ${usernameToRemove}?`)) return;
    //     setIsRemovingContributorUsername(usernameToRemove); setContributorError('');
    //     try {
    //         await removeContributor(projectId, usernameToRemove); // <-- Use imported function
    //         await fetchProjectContributors(projectId);
    //     } catch (err) { console.error("Remove contributor error:", err); setContributorError(err.response?.data?.message || `Failed to remove.`); }
    //     finally { setIsRemovingContributorUsername(null); }
    // };

//     // --- Render Project List ---
//     const renderProjectList = () => {
//         const initialLoading = isLoading || isLoadingTags;
//         if (initialLoading && projects.length === 0) return <p className="loading-text">Loading projects...</p>;
//         if (error && projects.length === 0) return <p className="error-message">{error}</p>;
//         if (!isLoading && projects.length === 0) return <p className="no-data-text">No projects yet.</p>;

//         return (
//             <ul className="projects-manage-list">
//                 {projects.map(project => {
//                     const isDeletingThis = deletingProjectId === project.id;
//                     const isActionBlocked = isLoading || isSavingProject || !!deletingProjectId;
//                     return (
//                         <li key={project.id} className={`project-manage-item ${isDeletingThis ? 'deleting' : ''}`}>
//                             <div className="project-manage-info">
//                                 <span className="project-manage-title">{project.title}</span>
//                                 {project.description && <p className="project-manage-desc">{project.description.substring(0, 100)}{project.description.length > 100 ? '...' : ''}</p>}
//                             </div>
//                             <div className="project-manage-actions">
//                                 {/* Contributor Button - Calls openContributorsModal */}
//                                 <button className="action-button contributors-button" onClick={() => openContributorsModal(project)} disabled={isActionBlocked} title="Manage Contributors" > <PeopleIcon fontSize="small" /> </button>
//                                 {/* Edit Button - Calls openModalForEdit */}
//                                 <button className="action-button edit-button" onClick={() => openModalForEdit(project)} disabled={isActionBlocked} title="Edit Project" > <EditIcon fontSize="small" /> </button>
//                                 {/* Delete Button - Calls handleDeleteProject */}
//                                 <button className="action-button delete-button" onClick={() => handleDeleteProject(project.id)} disabled={isDeletingThis || isActionBlocked} title="Delete Project" >
//                                     {isDeletingThis ? <span className="spinner small red"></span> : <DeleteIcon fontSize="small" />}
//                                 </button>
//                             </div>
//                         </li>
//                     );
//                 })}
//             </ul>
//         );
//     };

//     // --- Main Return ---
//     return (
//         <div className="projects-management-container form-section">
//             <h3>My Projects</h3>
//             <button className="submit-button add-button" style={{ marginBottom: '25px' }} onClick={openModalForAdd} disabled={isLoading || !!deletingProjectId || isSavingProject}>
//                 Add Project
//             </button>
//             {error && projects.length > 0 && <p className="error-message">{error}</p>}
//             {renderProjectList()}

//             {/* --- Project Add/Edit Modal --- */}
//             {isProjectModalOpen && (
//                 <div className="modal-overlay" onClick={closeProjectModal}>
//                     <div className="modal-content project-modal" onClick={e => e.stopPropagation()}>
//                         <div className="modal-header">
//                             <h4>{editingProject ? 'Edit Project' : 'Add New Project'}</h4>
//                             <button className="modal-close-button" onClick={closeProjectModal} disabled={isSavingProject}>&times;</button>
//                         </div>
//                         <form onSubmit={handleProjectModalSubmit} className="modal-form">
//                             {projectModalError && <p className="error-message modal-error">{projectModalError}</p>}
//                             {/* Text Inputs */}
//                             <div className="form-group"> <label htmlFor="title">Project Title *</label> <input type="text" id="title" name="title" value={projectFormData.title} onChange={handleProjectModalChange} required disabled={isSavingProject} /> </div>
//                             <div className="form-group"> <label htmlFor="description">Description</label> <textarea id="description" name="description" value={projectFormData.description} onChange={handleProjectModalChange} rows="4" disabled={isSavingProject}></textarea> </div>
//                             <div className="form-group"> <label htmlFor="demo_link">Demo Link</label> <input type="url" id="demo_link" name="demo_link" placeholder="https://..." value={projectFormData.demo_link} onChange={handleProjectModalChange} disabled={isSavingProject} /> </div>
//                             <div className="form-group"> <label htmlFor="source_link">Source Code Link</label> <input type="url" id="source_link" name="source_link" placeholder="https://github.com/..." value={projectFormData.source_link} onChange={handleProjectModalChange} disabled={isSavingProject} /> </div>
//                             <div className="form-group"> <label htmlFor="tags">Tags (comma-separated names)</label> <input type="text" id="tags" name="tags" placeholder="e.g., react, django, javascript" value={projectFormData.tags} onChange={handleProjectModalChange} disabled={isSavingProject} /> </div>
//                             {/* Image Input Section */}
//                             <div className="form-group">
//                                 <label>Featured Image</label>
//                                 <div className="project-image-modal-preview-area">
//                                     {/* Display based on projectImageUrl state */}
//                                     {projectImageUrl ? (
//                                         <img src={projectImageUrl} alt="Project preview" className="project-image-modal-preview" onError={(e) => { if(e.target.src !== DEFAULT_PROJECT_IMAGE) e.target.src = DEFAULT_PROJECT_IMAGE; }}/>
//                                     ) : (
//                                         <div className="project-image-modal-placeholder"><ImageIcon /></div>
//                                     )}
//                                     {/* No hidden input */}
//                                     <div className="project-image-modal-buttons">
//                                          {/* Button triggers widget */}
//                                         <button type="button" onClick={openProjectImageWidget} disabled={isSavingProject}>
//                                             <CloudUploadIcon fontSize='small' sx={{mr: 0.5}}/> Choose / Upload
//                                         </button>
//                                          {/* Show remove button only if there's an image */}
//                                         {projectImageUrl && (
//                                             <button type="button" className="remove-button" onClick={handleClearProjectImage} disabled={isSavingProject} title="Mark image for removal">
//                                                 <DeleteForeverIcon fontSize="small"/> Remove
//                                             </button>
//                                         )}
//                                     </div>
//                                 </div>
//                                  {/* Indicate if change is pending */}
//                                 {projectImageChanged && <p className="selected-file-info">{projectImageUrl ? "New image selected" : "Image marked for removal"}</p>}
//                             </div>
//                             {/* Modal Actions */}
//                             <div className="modal-actions">
//                                 <button type="button" className="cancel-button" onClick={closeProjectModal} disabled={isSavingProject}>Cancel</button>
//                                 <button type="submit" className="submit-button save-button" disabled={isSavingProject}> {isSavingProject ? 'Saving...' : (editingProject ? 'Update Project' : 'Add Project')} </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}

//             {/* --- Contributors Modal (Ensure this JSX is present) --- */}
//             {isContributorModalOpen && managingContributorsForProject && (
//                 <div className="modal-overlay" onClick={closeContributorsModal}>
//                     <div className="modal-content contributor-modal" onClick={e => e.stopPropagation()}>
//                         <div className="modal-header">
//                             <h4>Manage Contributors</h4>
//                             <span className='modal-subtitle'>For: {managingContributorsForProject.title}</span>
//                             <button className="modal-close-button" onClick={closeContributorsModal} disabled={isAddingContributor || isContributorsLoading}>&times;</button>
//                         </div>
//                         {contributorError && <p className="error-message modal-error">{contributorError}</p>}
//                         {/* Add Contributor Form */}
//                         <form onSubmit={handleAddContributor} className="contributor-add-form">
//                             <div className="form-group">
//                                 <label htmlFor="contributorUsername">Add by Username</label>
//                                 <div className="add-contributor-input-group">
//                                     <input type="text" id="contributorUsername" placeholder="Enter username..." value={addContributorUsername} onChange={(e) => setAddContributorUsername(e.target.value)} disabled={isAddingContributor || isContributorsLoading} required />
//                                     <button type="submit" className="add-contributor-button" disabled={!addContributorUsername.trim() || isAddingContributor || isContributorsLoading}>
//                                         {isAddingContributor ? <span className="spinner small"></span> : <PersonAddIcon fontSize="small"/>} {isAddingContributor ? 'Adding...' : 'Add'}
//                                     </button>
//                                 </div>
//                             </div>
//                         </form>
//                          {/* Current Contributors List */}
//                         <div className="current-contributors-section">
//                             <h5>Current Contributors</h5>
//                             {isContributorsLoading && <p className="loading-text small">Loading...</p>}
//                             {!isContributorsLoading && contributorsList.length === 0 && (<p className="no-data-text small">No contributors added yet.</p>)}
//                             {!isContributorsLoading && contributorsList.length > 0 && (
//                                 <ul className='contributors-modal-list'>
//                                     {contributorsList.map(c => {
//                                         const isRemovingThis = isRemovingContributorUsername === c.username;
//                                         return (
//                                             <li key={c.id || c.username} className={`contributor-modal-item ${isRemovingThis ? 'removing' : ''}`}>
//                                                 <img src={c.profile_picture || DEFAULT_AVATAR} alt={c.username} className="contributor-avatar small" onError={(e) => { if(e.target.src !== DEFAULT_AVATAR) e.target.src = DEFAULT_AVATAR; }}/>
//                                                 <span className='contributor-modal-username'>{c.username}</span>
//                                                 <button className='remove-contributor-button' onClick={() => handleRemoveContributor(c.username)} disabled={isRemovingThis || isAddingContributor || (isRemovingContributorUsername && !isRemovingThis)} title={`Remove ${c.username}`} >
//                                                 {isRemovingThis ? <span className="spinner small red"></span> : <PersonRemoveIcon fontSize="small"/>}
//                                                 </button>
//                                             </li>
//                                         );
//                                     })}
//                                 </ul>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div> 
//     );
// };

// export default ProjectsManagement;

import React, { useState, useEffect, useCallback, useRef } from 'react';
// Ensure API functions are correct and paths adjusted
import {
    getMyProjects,    // Uses owner filter
    addProject,       // Sends JSON
    updateProject,    // Sends JSON
    deleteProject,
    getContributors,
    addContributor,
    removeContributor,
    getAllTags
} from '../../../services/api';

// Import Heroicons v2 (Outline)
import {
    PlusIcon, PencilIcon, TrashIcon, UsersIcon, UserPlusIcon, UserMinusIcon,
    PhotoIcon, ArrowUpTrayIcon, XCircleIcon, XMarkIcon, BuildingOfficeIcon
} from '@heroicons/react/24/outline';

// --- Define Constants ---
const initialProjectFormState = {
    title: '', description: '', demo_link: '', source_link: '', tags: '',
};
// Adjust paths relative to your /public folder
const DEFAULT_AVATAR = '/images/profiles/user-default.png';
const DEFAULT_PROJECT_IMAGE = '/images/projects/default.jpg';

// --- CLOUDINARY CONFIG (Use Environment Variables!) ---
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dsaznefnt"; 
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "ITIHub_profile_pics"; 
// --- End Cloudinary Config ---

// --- Reusable Tailwind Input Components ---
const InputField = ({ id, name, label, type = 'text', value, onChange, error, disabled, required, placeholder }) => (
  <div>
    <label htmlFor={id || name} className="block text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
    <input type={type} id={id || name} name={name} value={value || ''} onChange={onChange} disabled={disabled} required={required} placeholder={placeholder || ''}
      className={`block w-full border ${error ? 'border-red-400' : 'border-gray-300'} rounded-md shadow-sm px-3 py-2 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-60 disabled:bg-gray-100 transition`} />
    {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
  </div>
);
const TextareaField = ({ id, name, label, rows = 4, value, onChange, error, disabled, required, placeholder }) => (
    <div>
      <label htmlFor={id || name} className="block text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
      <textarea id={id || name} name={name} rows={rows} value={value || ''} onChange={onChange} disabled={disabled} required={required} placeholder={placeholder || ''}
        className={`block w-full border ${error ? 'border-red-400' : 'border-gray-300'} rounded-md shadow-sm px-3 py-2 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-60 disabled:bg-gray-100 transition resize-vertical min-h-[100px]`} />
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
// --- End Reusable Components ---


const ProjectsManagement = ({ profileId }) => {
    // --- State ---
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [availableTags, setAvailableTags] = useState([]);
    const [isLoadingTags, setIsLoadingTags] = useState(true);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [projectFormData, setProjectFormData] = useState(initialProjectFormState);
    const [projectModalError, setProjectModalError] = useState('');
    const [isSavingProject, setIsSavingProject] = useState(false);
    const [projectImageUrl, setProjectImageUrl] = useState(null); // Use URL state for widget
    const [projectImageChanged, setProjectImageChanged] = useState(false);
    const projectWidgetRef = useRef(null); // Ref for project image widget
    const [deletingProjectId, setDeletingProjectId] = useState(null);
    const [isContributorModalOpen, setIsContributorModalOpen] = useState(false);
    const [managingContributorsForProject, setManagingContributorsForProject] = useState(null);
    const [contributorsList, setContributorsList] = useState([]);
    const [isContributorsLoading, setIsContributorsLoading] = useState(false);
    const [addContributorUsername, setAddContributorUsername] = useState('');
    const [isAddingContributor, setIsAddingContributor] = useState(false);
    const [isRemovingContributorUsername, setIsRemovingContributorUsername] = useState(null);
    const [contributorError, setContributorError] = useState('');

    // --- Fetching Logic ---
    const fetchProjects = useCallback(async () => {
        if (!profileId) { setError("Profile ID missing."); setIsLoading(false); return; }
        setIsLoading(true); setError('');
        try {
            const response = await getMyProjects(profileId); // Use filtered fetch
            // Handle potential pagination from backend
            const userProjects = response.data?.results || response.data || [];
            userProjects.sort((a, b) => new Date(b.created) - new Date(a.created));
            setProjects(userProjects);
        } catch (err) { console.error("Fetch projects error:", err); setError('Could not load projects.'); setProjects([]); }
        finally { setIsLoading(false); }
    }, [profileId]);

    const fetchTags = useCallback(async () => {
        setIsLoadingTags(true);
        try { const response = await getAllTags(); setAvailableTags(response.data || []); }
        catch (err) { console.error("Fetch tags error:", err); /* Non-critical error */ }
        finally { setIsLoadingTags(false); }
    }, []);

    useEffect(() => { fetchProjects(); fetchTags(); }, [fetchProjects, fetchTags]);

    // --- Cloudinary Widget Init ---
     useEffect(() => {
        if (window.cloudinary) {
            projectWidgetRef.current = window.cloudinary.createUploadWidget({
                cloudName: CLOUDINARY_CLOUD_NAME, uploadPreset: CLOUDINARY_UPLOAD_PRESET,
                folder: 'project_images', sources: ['local', 'url'], multiple: false,
            }, (widgetError, result) => {
                if (!widgetError && result && result.event === "success") {
                    setProjectModalError(''); setProjectImageUrl(result.info.secure_url); setProjectImageChanged(true);
                } else if (widgetError) { console.error('Project Widget Error:', widgetError); setProjectModalError("Image upload failed."); }
            });
        } else { console.error("Cloudinary script not loaded"); }
    }, []);

    // --- Project Modal Handlers ---
    const openModalForAdd = () => {
        setEditingProject(null); setProjectFormData(initialProjectFormState);
        setProjectImageUrl(null); setProjectImageChanged(false);
        setProjectModalError(''); setIsProjectModalOpen(true);
    };
    const openModalForEdit = (project) => {
        setEditingProject(project);
        let tagsString = '';
        const tagsSource = project.tags || []; // Assuming backend sends nested tags {id, name}
        if (Array.isArray(tagsSource) && tagsSource.length > 0 && tagsSource[0].name) {
             tagsString = tagsSource.map(tag => tag.name).filter(Boolean).join(', ');
        } // Add fallback for IDs if needed and availableTags are loaded

        setProjectFormData({ title: project.title || '', description: project.description || '', demo_link: project.demo_link || '', source_link: project.source_link || '', tags: tagsString, });
        setProjectImageUrl(project.featured_image || null); // Use URL field from backend
        setProjectImageChanged(false);
        setProjectModalError(''); setIsProjectModalOpen(true);
    };
    const closeProjectModal = () => {
        if (isSavingProject) return; setIsProjectModalOpen(false); setEditingProject(null); setProjectModalError(''); setProjectImageUrl(null); setProjectImageChanged(false);
    };
    const handleProjectModalChange = (e) => { const { name, value } = e.target; setProjectFormData(prev => ({ ...prev, [name]: value })); setProjectModalError(''); };
    const openProjectImageWidget = () => { if (projectWidgetRef.current) { setProjectModalError(''); projectWidgetRef.current.open(); } else { setProjectModalError("Upload service not ready."); }};
    const handleClearProjectImage = () => { if (!projectImageUrl) return; if (window.confirm("Mark image for removal? Saved on Update.")) { setProjectImageUrl(null); setProjectImageChanged(true); setProjectModalError(''); }};

    // Project Submit (Sends JSON with URL)
    const handleProjectModalSubmit = async (e) => {
        console.log("--- handleProjectModalSubmit TRIGGERED! ---"); // <-- ADD THIS
        e.preventDefault();
        if (!projectFormData.title.trim()) {
            setProjectModalError('Project title required.'); return;
        }
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
        // --- Log Payload before sending ---
        console.log("Payload being sent:", JSON.stringify(payload, null, 2)); // <-- ADD THIS

        try {
            // Ensure addProject/updateProject in api.js send JSON
            console.log("Calling API:", editingProject ? `updateProject(${editingProject.id})` : "addProject"); // <-- ADD THIS
            if (editingProject) {
                await updateProject(editingProject.id, payload);
            } else {
                await addProject(payload);
            }
            console.log("API call successful"); // <-- ADD THIS
            closeProjectModal();
            await fetchProjects();
        } catch (err) {
            console.error("Save project error (Full Error Object):", err); // <-- Log full error
            console.error("Save project error response data:", err.response?.data); // <-- Log specific backend response
            const errors = err.response?.data;
            let errorMessage = 'Failed to save project.';
             if (typeof errors === 'object' && errors !== null) {
                errorMessage = Object.entries(errors).map(([k, v]) => `${k}: ${Array.isArray(v)?v.join(','):v}`).join('; ');
             } else if (typeof errors === 'string') { errorMessage = errors; }
            setProjectModalError(errorMessage);
        } finally {
             console.log("Setting isSavingProject: false"); // <-- ADD THIS
            setIsSavingProject(false);
        }
    };

    // --- Delete Project Handling ---
    const handleDeleteProject = async (projectId) => {
                if (!window.confirm('Delete this project permanently?')) return;
                setDeletingProjectId(projectId); setError('');
                try {
                    await deleteProject(projectId); // <-- Use imported function
                    await fetchProjects();
                } catch (err) { console.error("Delete project error:", err); setError(err.response?.data?.detail || 'Failed to delete.'); }
                finally { setDeletingProjectId(null); }
            };

    // --- Contributor Modal Handlers ---
    const fetchProjectContributors = useCallback(async (projectId) => {
                if (!projectId) return;
                setIsContributorsLoading(true); setContributorError('');
                try {
                    const response = await getContributors(projectId); // <-- Use imported function
                    setContributorsList(response.data || []);
                } catch (err) { console.error("Fetch contributors error:", err); setContributorError("Load failed."); setContributorsList([]); }
                finally { setIsContributorsLoading(false); }
            }, []);
            
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
        if (initialLoading && projects.length === 0) return <p className="text-sm text-gray-500 py-4 text-center">Loading projects...</p>;
        if (error && projects.length === 0) return <div className="error-message">{error}</div>; // Use styled alert div
        if (!isLoading && projects.length === 0) return <p className="text-sm text-gray-500 py-4 text-center">No projects added yet.</p>;

        return ( <ul className="space-y-3"> {projects.map(project => { const isDeletingThis = deletingProjectId === project.id; const isActionBlocked = isLoading || isSavingProject || !!deletingProjectId; return ( <li key={project.id} className={`border border-gray-200 rounded-md transition-opacity duration-300 ${isDeletingThis ? 'opacity-40' : ''}`}> <div className="flex items-center justify-between p-3 hover:bg-gray-50"> <div className="flex-grow mr-4 overflow-hidden"> <span className="block font-medium text-gray-800 truncate">{project.title}</span> {project.description && <p className="text-xs text-gray-500 truncate">{project.description}</p>} </div> <div className="project-manage-actions flex items-center flex-shrink-0 space-x-2"> <button onClick={() => openContributorsModal(project)} disabled={isActionBlocked} title="Manage Contributors" className="p-1 text-gray-400 hover:text-primary-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"> <UsersIcon className="w-5 h-5"/> </button> <button onClick={() => openModalForEdit(project)} disabled={isActionBlocked} title="Edit Project" className="p-1 text-gray-400 hover:text-primary-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"> <PencilIcon className="w-5 h-5"/> </button> <button onClick={() => handleDeleteProject(project.id)} disabled={isDeletingThis || isActionBlocked} title="Delete Project" className="p-1 text-red-500 hover:text-red-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"> {isDeletingThis ? <svg className="animate-spin h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle><path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor" className="opacity-75"></path></svg> : <TrashIcon className="w-5 h-5" />} </button> </div> </div> </li> ); })} </ul> );
    }; // End renderProjectList

    // --- Main Return ---
    return (
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm"> {/* Section Container */}
            {/* Header */}
            <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-5 pb-3 border-b border-gray-100">
                <BuildingOfficeIcon className="w-5 h-5 mr-2 text-primary-600" /> My Projects
            </h3>
            {/* Add Project Button */}
            <div className="mb-6">
                <button onClick={openModalForAdd} disabled={isLoading || !!deletingProjectId || isSavingProject} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-60">
                    <PlusIcon className="w-5 h-5 mr-1 -ml-1" /> Add New Project
                </button>
            </div>
             {/* Error Display Area */}
             {error && projects.length > 0 && <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md">{error}</div>}
             {/* Render List */}
            {renderProjectList()}

            {/* --- Project Add/Edit Modal (Tailwind + Widget) --- */}
            {isProjectModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300" onClick={closeProjectModal}>
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto flex flex-col" onClick={e => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-4 border-b border-gray-200 flex-shrink-0">
                            <h4 className="text-lg font-semibold text-gray-900">{editingProject ? 'Edit Project' : 'Add New Project'}</h4>
                            <button onClick={closeProjectModal} disabled={isSavingProject} className="p-1 text-gray-400 rounded-md hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"> <XMarkIcon className="w-6 h-6"/> </button>
                        </div>
                        {/* Modal Form */}
                        <form onSubmit={handleProjectModalSubmit} className="p-6 space-y-4 overflow-y-auto flex-grow">
                            {projectModalError && <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md">{projectModalError}</div>}
                            {/* Reusable InputField components */}
                            <InputField label="Project Title" name="title" value={projectFormData.title} onChange={handleProjectModalChange} required disabled={isSavingProject} error={projectModalError && projectModalError.toLowerCase().includes('title')} />
                            <TextareaField label="Description" name="description" value={projectFormData.description} onChange={handleProjectModalChange} rows={4} disabled={isSavingProject} />
                            <InputField label="Demo Link" name="demo_link" type="url" placeholder="https://..." value={projectFormData.demo_link} onChange={handleProjectModalChange} disabled={isSavingProject} />
                            <InputField label="Source Code Link" name="source_link" type="url" placeholder="https://github.com/..." value={projectFormData.source_link} onChange={handleProjectModalChange} disabled={isSavingProject} />
                            <InputField label="Tags (comma-separated names)" name="tags" placeholder="e.g., react, api, documentation" value={projectFormData.tags} onChange={handleProjectModalChange} disabled={isSavingProject} />

                             {/* Image Input Section (Widget Trigger) */}
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Featured Image</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 bg-gray-100 border border-gray-300 rounded-md flex items-center justify-center overflow-hidden flex-shrink-0">
                                        {projectImageUrl ? <img src={projectImageUrl} alt="Preview" className="w-full h-full object-cover"/> : <PhotoIcon className="w-10 h-10 text-gray-400"/>}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        {/* Button to open Cloudinary Widget */}
                                        <button type="button" onClick={openProjectImageWidget} disabled={isSavingProject} className="px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-60 inline-flex items-center gap-1">
                                           <ArrowUpTrayIcon className="w-4 h-4"/> Choose/Upload
                                        </button>
                                        {/* Button to mark for removal */}
                                        {projectImageUrl && ( <button type="button" onClick={handleClearProjectImage} disabled={isSavingProject} className="px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-60 flex items-center gap-1"> <TrashIcon className="w-4 h-4"/> Remove </button> )}
                                    </div>
                                </div>
                                {projectImageChanged && <p className="text-xs text-gray-500 mt-1 italic">{projectImageUrl ? "New image selected." : "Image marked for removal."} Save to apply.</p>}
                            </div>
                        </form>
                         {/* Modal Actions */}
                         <div className="flex justify-end gap-3 p-4 border-t border-gray-200 flex-shrink-0 bg-gray-50 rounded-b-lg">
                            <button type="button" onClick={closeProjectModal} disabled={isSavingProject} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-60"> Cancel </button>
                            {/* Trigger form submit */}
                            <button type="submit" form="projectModalForm" /* Need to add id="projectModalForm" to form tag */ disabled={isSavingProject} className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-60">
                                {isSavingProject ? <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" /*...*/></svg> : null}
                                {isSavingProject ? 'Saving...' : (editingProject ? 'Update Project' : 'Add Project')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Contributors Modal (Tailwind Styled) --- */}
            {isContributorModalOpen && managingContributorsForProject && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300" onClick={closeContributorsModal}>
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto flex flex-col" onClick={e => e.stopPropagation()}>
                        {/* Header */}
                        <div className="flex justify-between items-center p-4 border-b border-gray-200 flex-shrink-0">
                            <h4 className="text-lg font-semibold text-gray-900">Manage Contributors</h4>
                            <button onClick={closeContributorsModal} disabled={isAddingContributor || isContributorsLoading} className="p-1 text-gray-400 rounded-md hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"> <XMarkIcon className="w-6 h-6"/> </button>
                        </div>
                        <p className='px-4 pt-2 text-sm text-gray-500 flex-shrink-0'>For project: <span className='font-medium'>{managingContributorsForProject.title}</span></p>
                        {/* Add Form */}
                        <form onSubmit={handleAddContributor} className="p-4 border-b border-gray-100 flex-shrink-0">
                            {contributorError && <div className="mb-3 p-2 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md">{contributorError}</div>}
                            <label htmlFor="contributorUsername" className="block text-sm font-medium text-gray-700 mb-1">Add by Username</label>
                            <div className="flex gap-2">
                                <input type="text" id="contributorUsername" placeholder="Enter username..." value={addContributorUsername} onChange={(e) => {setAddContributorUsername(e.target.value); setContributorError('');}} disabled={isAddingContributor || isContributorsLoading} required className="flex-grow block w-full border border-gray-300 rounded-md shadow-sm px-3 py-1.5 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:opacity-60"/>
                                <button type="submit" className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-60" disabled={!addContributorUsername.trim() || isAddingContributor || isContributorsLoading}>
                                    {isAddingContributor ? <svg className="animate-spin h-5 w-5 text-white" /*...*/></svg> : <UserPlusIcon className="w-5 h-5"/>}
                                    <span className='ml-1 hidden sm:inline'>{isAddingContributor ? '' : 'Add'}</span>
                                </button>
                            </div>
                    </form>
                    {/* List */}
                        <div className="current-contributors-section p-4 flex-grow overflow-y-auto">
                            <h5 className="text-sm font-medium text-gray-600 mb-2">Current Contributors</h5>
                            {isContributorsLoading && <p className="text-sm text-gray-500">Loading...</p>}
                            {!isContributorsLoading && contributorsList.length === 0 && ( <p className="text-sm text-gray-500 italic">No contributors added yet.</p> )}
                            {!isContributorsLoading && contributorsList.length > 0 && (
                                <ul className='space-y-2'>
                                    {contributorsList.map(c => {
                                        const isRemovingThis = isRemovingContributorUsername === c.username;
                                        return ( <li key={c.id || c.username} className={`flex items-center justify-between p-2 rounded hover:bg-gray-50 ${isRemovingThis ? 'opacity-50' : ''}`}> <div className='flex items-center gap-2 overflow-hidden'> <img src={c.profile_picture || DEFAULT_AVATAR} alt={c.username} className="w-7 h-7 rounded-full object-cover border border-gray-300 flex-shrink-0" onError={(e) => { if(e.target.src !== DEFAULT_AVATAR) e.target.src = DEFAULT_AVATAR; }}/> <span className='text-sm text-gray-800 truncate'>{c.username}</span> </div> <button className='p-1 text-red-500 hover:text-red-700 rounded disabled:opacity-50 flex-shrink-0' onClick={() => handleRemoveContributor(c.username)} disabled={isRemovingThis || isAddingContributor || isRemovingContributorUsername} title={`Remove ${c.username}`}> {isRemovingThis ? <svg className="animate-spin h-4 w-4 text-red-500" /*...*/></svg> : <UserMinusIcon className="w-5 h-5"/>} </button> </li> );
                                    })}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div> // End Main Container
    );
};

export default ProjectsManagement;