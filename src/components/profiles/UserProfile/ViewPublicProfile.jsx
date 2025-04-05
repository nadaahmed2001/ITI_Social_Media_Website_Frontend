// {/* ================= TODO: Adding more fields, batch, department track, join date ================ */}
// import React, { useState, useEffect, useCallback } from 'react';
// import { getPublicProfile, getMyProjects,} from '../../../services/api'; 
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import GitHubIcon from '@mui/icons-material/GitHub';
// import LanguageIcon from '@mui/icons-material/Language'; 
// import { FaGithub, FaLinkedin, FaGlobe, FaHackerrank } from 'react-icons/fa'; 
// import { SiLeetcode } from 'react-icons/si'; 
// import { Link } from 'react-router-dom'; // For internal links

// import './ViewPublicProfile.css';

// const DEFAULT_PROJECT_IMAGE = '../../src/assets/images/user-default.webp'; 
// const DEFAULT_AVATAR = '../../src/assets/images/user-default.webp'; 

// const ViewPublicProfile = ({ profileId }) => {
//     const [profileData, setProfileData] = useState(null);
//     const [projectsData, setProjectsData] = useState([]); // Stores the *filtered* projects
//     const [isLoadingProfile, setIsLoadingProfile] = useState(true);
//     const [isLoadingProjects, setIsLoadingProjects] = useState(true);
//     const [error, setError] = useState('');

//     const fetchProfile = useCallback(async () => {
//         if (!profileId) {
//         setError("Profile ID is missing.");
//         setIsLoadingProfile(false);
//         setIsLoadingProjects(false); 
//         return;
//         }
//         setIsLoadingProfile(true);
//         setError('');
//         try {
//         const response = await getPublicProfile(profileId);
//         setProfileData(response.data);
//         } catch (err) {
//         console.error("Failed to fetch public profile:", err);
//         setError('Could not load profile data.');
//         } finally {
//         setIsLoadingProfile(false);
//         }
//     }, [profileId]);

//     const fetchProjects = useCallback(async () => {
//         if (!profileId) {
//             setError("Cannot load projects without a Profile ID."); setIsLoadingProjects(false); return;
//         }
//         setIsLoadingProjects(true); setError('');
//         try {
//             // --- Call the filtered API endpoint ---
//             const response = await getMyProjects(profileId);
//             // --- No client-side filter needed ---
//             setProjectsData(response.data || []); // Directly set the response data
//         } catch (err) {
//             console.error("Failed to fetch projects:", err); setError('Could not load your projects.'); setProjectsData([]);
//         } finally { setIsLoadingProjects(false); }
//     }, [profileId]);
    
    
//     useEffect(() => {
//         fetchProfile();
//         fetchProjects();
//     }, [fetchProfile, fetchProjects ]);


// const renderLinks = () => {
//     if (!profileData) return null;

//     const links = [
//     { url: profileData.github_url, icon: <FaGithub />, label: 'GitHub Profile' }, 
//     { url: profileData.leetcode_username ? `https://leetcode.com/${profileData.leetcode_username}` : null, icon: <SiLeetcode />, label: 'LeetCode Profile' },
//     { url: profileData.hackerrank_username ? `https://www.hackerrank.com/${profileData.hackerrank_username}` : null, icon: <FaHackerrank />, label: 'HackerRank Profile' },
//     { url: profileData.linkedin_url, icon: <FaLinkedin />, label: 'LinkedIn Profile' },
//     { url: profileData.website_url, icon: <FaGlobe />, label: 'Personal Website/Portfolio' },
//       // ========== TODO:Add others like twitter_url, stackoverflow_url =============
//     ].filter(link => link.url); // Only show links that have a valid URL

//     if (links.length === 0) return null; // Don't render section if no links

        
//     return (
//         <div className="profile-section links-section">
//             <h3>Links</h3>
//             <ul className="links-list icon-links"> 
//             {links.map((link, index) => (
//                 <li key={index} className="link-item">
//                 <a
//                     href={link.url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     title={link.label}
//                 >
//                     {link.icon}
//                 </a>
//                 </li>
//             ))}
//             </ul>
//         </div>
//     );
//     };
//     const renderSkills = () => {
//         if (!profileData || (!profileData.main_skills?.length && !profileData.other_skills?.length)) {
//         return null;
//         }

//         return (
//         <div className="profile-section skills-section">
//             <h3>Skills</h3>
//             {profileData.main_skills?.length > 0 && (
            
//             <div className="skills-subsection">
//                 <ul className="other-skills-list">

//                 {profileData.main_skills.map(skill => (
//                     <li key={skill.id} className="other-skill-item">
//                     <span className="main-skill-name">{skill.name}</span>
//                     {skill.description && <p className="main-skill-description">{skill.description}</p>}
//                     </li>
//                 ))}
                
//                 {profileData.other_skills.map(skill => (
//                     <li key={skill.id} className="other-skill-item">{skill.name}</li>
//                 ))}
                
//                 </ul>
//             </div>
//             )}
//         </div>
//         );
//     };

//     // --- Render Projects ---
//     const renderProjects = () => {
//         // Use loading state specific to projects
//         if (isLoadingProjects && projectsData.length === 0) {
//             return (
//                 <div className="profile-section projects-section">
//                     <h3>Projects</h3>
//                     <p className='loading-text small'>Loading projects...</p>
//                 </div>
//             );
//         }
    
//         // Don't render the section if there are no projects after loading
//         if (!isLoadingProjects && projectsData.length === 0) {
//             // return null; 
//             return (
//               <div className="profile-section projects-section">
//                 <h3>Projects</h3>
//                 <p className="no-data-text">No projects to display yet.</p>
//               </div>
//             );
//         }
    
//         // If projects exist, render the list
//         return (
//         <div className="profile-section projects-section">
//             <h3>Projects</h3>
//             <ul className="projects-list">
//             {projectsData.map(project => (
//                 // Use project ID for the list item key
//                 <li key={project.id} className="project-item-card">
    
//                     {/* Project Image */}
//                     <div className="project-image-container">
//                         <img
//                             src={project.featured_image || DEFAULT_PROJECT_IMAGE}
//                             alt={`${project.title} preview`}
//                             className="project-image"
//                             onError={(e) => { if (e.target.src !== DEFAULT_PROJECT_IMAGE) e.target.src = DEFAULT_PROJECT_IMAGE; }}
//                         />
//                     </div>
    
//                     {/* Project Text Content */}
//                     <div className="project-details-content">
//                         {/* Title */}
//                         <h4>{project.title || 'Untitled Project'}</h4>
    
//                         {/* Description */}
//                         {project.description && (
//                             <p className="project-description">{project.description}</p>
//                         )}
    
//                         {/* Tags - Map directly over nested tag objects */}
//                         {Array.isArray(project.tags) && project.tags.length > 0 && (
//                             <div className="project-tags">
//                                 {project.tags.map(tag => (
//                                     // Use tag.id for key and tag.name for display
//                                     <span key={tag.id} className="project-tag">{tag.name}</span>
//                                 ))}
//                             </div>
//                         )}
    
//                         {/* Contributors - Map over nested contributor objects */}
//                         {Array.isArray(project.contributors) && project.contributors.length > 0 && (
//                             <div className="project-contributors">
//                                 <h5>Contributors:</h5>
//                                 <ul className="contributors-list">
//                                     {project.contributors.map(contributor => (
//                                         <li key={contributor.id} className="contributor-item"><Link to={`/profiles/${contributor.id}`} title={`View ${contributor.username}'s profile`}><img src={contributor.profile_picture || DEFAULT_AVATAR} alt={contributor.username} title={contributor.username} className="contributor-avatar small" onError={(e) => { if(e.target.src !== DEFAULT_AVATAR) e.target.src = DEFAULT_AVATAR;}}/></Link></li>))}</ul></div>
//                         )}
    
//                         {/* Project Links */}
//                         <div className="project-links">
//                             {project.demo_link && (
//                                 <a href={project.demo_link} target="_blank" rel="noopener noreferrer" className="project-link-button demo">
//                                     <LanguageIcon fontSize="small"/> Demo
//                                 </a>
//                             )}
//                             {project.source_link && (
//                                 <a href={project.source_link} target="_blank" rel="noopener noreferrer" className="project-link-button source">
//                                     <GitHubIcon fontSize="small"/> Source
//                                 </a>
//                             )}
//                         </div>
//                     </div> 
//                 </li>
//             ))}
//             </ul>
//         </div>
//         );
//     }; 
    

//     if (isLoadingProfile) {
//         return <div className="loading-text section-container">Loading profile view...</div>;
//     }

//     if (error && !profileData) { // Show error only if profile loading failed critically
//         return <div className="error-message main-error section-container">{error}</div>;
//     }

//     if (!profileData) {
//         return <div className="loading-text section-container">Profile data not found.</div>;
//     }

//     // Construct full name, handle cases where one might be missing
//     const fullName = [profileData.first_name, profileData.last_name].filter(Boolean).join(' ') || profileData.username;
//     console.log(profileData.profile_picture)

//     return (
//         <div className="view-public-profile-container section-container">
//         <h2><AccountCircleIcon /> Public Profile View</h2>
//         {error && <p className="error-message">{error}</p>} 

//         {/* --- Profile Header --- */}
//         <div className="profile-header">
//             <img
//             src={ profileData.profile_picture || DEFAULT_AVATAR } 
//             alt={`${fullName}'s profile`}
//             className="profile-avatar"
//             />
//             <div className="profile-info">
//             <h3 className="profile-fullname">{fullName}</h3>
//             <p className="profile-username">@{profileData.username}</p>
//             {profileData.headline && <p className="profile-headline">{profileData.headline}</p>}
//             {profileData.location && <p className="profile-location">{profileData.location}</p>}
//             </div>
//             {/* Optional: Add Follow/Message buttons (disabled/hidden for own profile) */}
//             {/* <div className="profile-actions"> <button disabled>Follow</button> </div> */}
//         </div>

//         {/* --- Bio --- */}
//         {profileData.bio && (
//             <div className="profile-section bio-section">
//             <h3>Bio</h3>
//             <p>{profileData.bio}</p>
//             </div>
//         )}

//         {/* --- Links --- */}
//         {renderLinks()}

//         {/* --- Skills --- */}
//         {renderSkills()}

//         {/* --- Projects --- */}
//         {renderProjects()}

//         </div>
//     );
//     };

// export default ViewPublicProfile;

// src/components/profiles/UserProfile/ViewPublicProfile.jsx (Adjust path)
import React, { useState, useEffect, useCallback } from 'react';
import { getPublicProfile, getMyProjects } from '../../../services/api'; // Adjust path
import { Link } from 'react-router-dom';

// --- Icons ---
// Using a mix of react-icons for brands and heroicons for generic
import { FaGithub, FaLinkedin, FaHackerrank } from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';
import { GlobeAltIcon, CodeBracketIcon, UserCircleIcon, MapPinIcon, IdentificationIcon, BuildingLibraryIcon, TagIcon, UsersIcon, LinkIcon } from '@heroicons/react/24/outline'; // Heroicons v2
// --- End Icons ---

// Define default paths (ADJUST THESE PATHS to your /public folder)
const DEFAULT_PROJECT_IMAGE = '../../src/assets/images/user-default.webp'; 
const DEFAULT_AVATAR = '../../src/assets/images/user-default.webp'; 
const ViewPublicProfile = ({ profileId }) => {
    const [profileData, setProfileData] = useState(null);
    const [projectsData, setProjectsData] = useState([]);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [isLoadingProjects, setIsLoadingProjects] = useState(true);
    const [error, setError] = useState('');

    // --- Data Fetching Callbacks (Unchanged) ---
    const fetchProfile = useCallback(async () => {
        if (!profileId) { setError("Profile ID missing."); setIsLoadingProfile(false); return; }
        setIsLoadingProfile(true); setError('');
        try { const response = await getPublicProfile(profileId); setProfileData(response.data); }
        catch (err) { console.error("Fetch profile error:", err); setError('Could not load profile data.'); }
        finally { setIsLoadingProfile(false); }
    }, [profileId]);

    const fetchProjects = useCallback(async () => {
        if (!profileId) { setError(e => e ? `${e} Cannot load projects.` : 'Cannot load projects.'); setIsLoadingProjects(false); return; }
        setIsLoadingProjects(true);
        try {
            const response = await getMyProjects(profileId);
            setProjectsData(response.data?.results || response.data || []);
        } catch (err) { console.error("Fetch projects error:", err); setError(e => e ? `${e} Could not load projects.` : 'Could not load projects.'); setProjectsData([]); }
        finally { setIsLoadingProjects(false); }
    }, [profileId]);

    useEffect(() => { fetchProfile(); fetchProjects(); }, [fetchProfile, fetchProjects]);

    // --- Render Helpers ---
    const renderLinks = () => {
        if (!profileData) return null;
        const links = [
            { url: profileData.github_url, icon: <FaGithub className="w-5 h-5" />, label: 'GitHub' },
            { url: profileData.linkedin_url, icon: <FaLinkedin className="w-5 h-5" />, label: 'LinkedIn' },
            { url: profileData.leetcode_username ? `https://leetcode.com/${profileData.leetcode_username}` : null, icon: <SiLeetcode className="w-5 h-5" />, label: 'LeetCode' },
            { url: profileData.hackerrank_username ? `https://www.hackerrank.com/${profileData.hackerrank_username}` : null, icon: <FaHackerrank className="w-5 h-5" />, label: 'HackerRank' },
            { url: profileData.website_url, icon: <GlobeAltIcon className="w-5 h-5" />, label: 'Website' },
        ].filter(link => link.url);

        if (links.length === 0) return null;

        return (
            <div className="pt-4 mt-4 border-t border-gray-200"> {/* Section Structure */}
                <h3 className="text-base font-semibold text-gray-800 mb-3">Links</h3> {/* Title */}
                <div className="flex flex-wrap gap-3"> {/* Links container */}
                    {links.map((link, index) => (
                        <a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={link.label}
                            className="p-2 inline-block text-neutral-600 bg-neutral-100 hover:bg-neutral-200 hover:text-neutral-800 rounded-full transition-colors duration-150" // Icon button style
                        >
                            {link.icon}
                        </a>
                    ))}
                </div>
            </div>
        );
    };

    const renderSkills = () => {
        // Use data structure returned by your API (assuming fields like 'main_skills'/'other_skills' or just 'skills')
        // This example assumes a single 'skills' array like [{id, name, description}, ...]
        const skills = profileData?.skills || profileData?.main_skills || profileData?.other_skills || []; // Adjust based on actual API response key

        if (!profileData || skills.length === 0) return null;

        return (
             <div className="pt-4 mt-4 border-t border-gray-200"> {/* Section Structure */}
                <h3 className="text-base font-semibold text-gray-800 mb-3">Skills</h3> {/* Title */}
                <div className="flex flex-wrap gap-2"> {/* Tags container */}
                    {skills.map(skill => (
                        <span key={skill.id} className="skill-tag-tailwind" title={skill.description || ''}>
                            {skill.name}
                        </span>
                    ))}
                </div>
            </div>
        );
    };

    const renderProjects = () => {
        const isLoading = isLoadingProjects; // Use specific loading state
        if (isLoading && projectsData.length === 0) {
             return <div className="pt-4 mt-4 border-t border-gray-200"><h3 className="section-title-tailwind">Projects</h3><p className="text-sm text-neutral-500 mt-2">Loading projects...</p></div>;
        }
        if (!isLoading && projectsData.length === 0) {
             return <div className="pt-4 mt-4 border-t border-gray-200"><h3 className="section-title-tailwind">Projects</h3><p className="text-sm text-neutral-500 mt-2">No projects to display yet.</p></div>;
        }

        return (
            <div className="pt-4 mt-4 border-t border-gray-200"> {/* Section Structure */}
                <h3 className="text-base font-semibold text-gray-800 mb-3">Projects</h3> {/* Title */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3"> {/* Grid Layout */}
                    {projectsData.map(project => (
                        <div key={project.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm flex flex-col"> {/* Card */}
                            {/* Project Image */}
                             <img
                                src={project.featured_image || DEFAULT_PROJECT_IMAGE}
                                alt={`${project.title} preview`}
                                className="w-full h-40 object-cover bg-gray-100" // Image styling
                                onError={(e) => { if (e.target.src !== DEFAULT_PROJECT_IMAGE) e.target.src = DEFAULT_PROJECT_IMAGE; }}
                            />
                            {/* Project Content */}
                            <div className="p-4 flex flex-col flex-grow">
                                <h4 className="font-semibold text-lg mb-1 text-gray-900">{project.title || 'Untitled Project'}</h4>
                                {project.description && <p className="text-sm text-gray-600 mb-3 flex-grow">{project.description}</p>}
                                {/* Tags */}
                                {Array.isArray(project.tags) && project.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {project.tags.map(tag => (<span key={tag.id} className="skill-tag-tailwind">{tag.name}</span>))}
                                    </div>
                                )}
                                {/* Contributors */}
                                {Array.isArray(project.contributors) && project.contributors.length > 0 && (
                                    <div className="mb-3">
                                        <h5 className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Contributors</h5>
                                        <div className="flex flex-wrap gap-2 items-center">
                                            {project.contributors.map(contributor => (
                                                <Link key={contributor.id} to={`/profiles/${contributor.id}`} title={contributor.username} className="block rounded-full overflow-hidden border border-gray-300 hover:opacity-80 transition-opacity">
                                                    <img
                                                        src={contributor.profile_picture || DEFAULT_AVATAR}
                                                        alt={contributor.username}
                                                        className="w-6 h-6 object-cover" // Avatar size
                                                        onError={(e) => { if(e.target.src !== DEFAULT_AVATAR) e.target.src = DEFAULT_AVATAR; }}
                                                    />
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {/* Links */}
                                <div className="flex space-x-4 mt-auto pt-3 border-t border-gray-100"> {/* Push links to bottom */}
                                    {project.demo_link && (
                                        <a href={project.demo_link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1">
                                           <GlobeAltIcon className="w-4 h-4"/> Demo
                                        </a>
                                    )}
                                    {project.source_link && (
                                        <a href={project.source_link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1">
                                           <CodeBracketIcon className="w-4 h-4"/> Source
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // --- Main Render ---
    if (isLoadingProfile) { return <div className="text-center p-10 text-gray-500">Loading profile...</div>; }
    // Use a more styled error message container if needed
    if (error && !profileData) { return <div className="p-6"><div className="p-4 text-red-700 bg-red-100 border border-red-300 rounded-md">{error}</div></div>; }
    if (!profileData) { return <div className="text-center p-10 text-gray-500">Profile not found.</div>; }

    const fullName = [profileData.first_name, profileData.last_name].filter(Boolean).join(' ') || profileData.username;

    return (
        // Container for the whole view public profile content
        <div className="view-profile-container p-6 bg-white border border-gray-200 rounded-md shadow-sm">
            {/* Non-critical error display */}
            {error && <p className="p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md">{error}</p>}

            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pb-5 mb-5 border-b border-gray-200">
                <img
                    src={profileData.profile_picture || DEFAULT_AVATAR}
                    alt={`${fullName}'s profile`}
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 flex-shrink-0 shadow-sm"
                    onError={(e) => { if (e.target.src !== DEFAULT_AVATAR) e.target.src = DEFAULT_AVATAR; }}
                />
                <div className="text-center sm:text-left">
                    <h2 className="text-2xl font-bold font-title text-gray-900">{fullName}</h2> {/* Using font-title */}
                    <p className="text-sm text-gray-500">@{profileData.username}</p>
                    {profileData.headline && <p className="text-md text-gray-700 mt-1">{profileData.headline}</p>}
                    {profileData.location && (
                         <p className="text-sm text-gray-500 mt-1 inline-flex items-center gap-1">
                             <MapPinIcon className="w-4 h-4 inline-block"/> {profileData.location}
                        </p>
                     )}
                </div>
            </div>

            {/* Render sections */}
            {profileData.bio && (
                <div className="pt-4 mb-4"> {/* Use margin bottom instead of border */}
                    <h3 className="text-base font-semibold text-gray-800 mb-2">About Me</h3>
                    <p className="text-gray-700 whitespace-pre-wrap text-sm">{profileData.bio}</p>
                </div>
            )}
            {renderLinks()}
            {renderSkills()}
            {renderProjects()}

        </div>
    );
};

// Add these base styles to your global CSS (e.g., index.css) if you want to use @apply
/*
@layer components {
  .profile-section-tailwind { @apply pt-4 mt-4 border-t border-gray-200; }
  .section-title-tailwind { @apply text-base font-semibold text-gray-800 mb-3; }
  .skill-tag-tailwind { @apply inline-block bg-neutral-100 text-neutral-700 text-xs font-medium px-3 py-1 rounded-full hover:bg-neutral-200 transition-colors; }
  .project-card-tailwind { @apply border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm flex flex-col; }
}
*/

// Alternatively, just use the utility classes directly in the JSX as shown above.

export default ViewPublicProfile;