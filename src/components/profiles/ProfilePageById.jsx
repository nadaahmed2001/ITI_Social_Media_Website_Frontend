// import React, { useState, useEffect, useCallback } from 'react';
// import { useParams, Link } from 'react-router-dom'; // Import useParams and Link
// import { getPublicProfile, getMyProjects } from '../services/api'; // Adjust path to your api.js
// import AuthContext from '../../contexts/AuthContext'; // To get the current user

// // Import Icons (adjust paths/sources if needed)
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import GitHubIcon from '@mui/icons-material/GitHub'; // Keep if used in renderProjects
// import LanguageIcon from '@mui/icons-material/Language'; // Keep if used in renderProjects
// import { FaGithub, FaLinkedin, FaGlobe, FaHackerrank } from 'react-icons/fa';
// import { SiLeetcode } from 'react-icons/si';

// import './ProfilePageById.css';

// const DEFAULT_PROJECT_IMAGE = '../src/assets/images/user-default.webp';
// const DEFAULT_AVATAR = '../src/assets/images/user-default.webp';

// // New Profile Page Component
// const ProfilePageById = () => {
//     const { profileId } = useParams(); 

//     const [profileData, setProfileData] = useState(null);
//     const [projectsData, setProjectsData] = useState([]);
//     const [isLoadingProfile, setIsLoadingProfile] = useState(true);
//     const [isLoadingProjects, setIsLoadingProjects] = useState(true);
//     const [error, setError] = useState('');

//     // Fetch Profile Data based on URL ID
//     const fetchProfile = useCallback(async () => {
//         // Removed check for prop, now relies on useParams
//         if (!profileId) {
//             setError("Profile ID not found in URL.");
//             setIsLoadingProfile(false);
//             setIsLoadingProjects(false);
//             return;
//         }
//         setIsLoadingProfile(true);
//         setError('');
//         try {
//             // Use getPublicProfile with ID from URL params
//             const response = await getPublicProfile(profileId);
//             setProfileData(response.data);
//         } catch (err) {
//             console.error(`Failed to fetch public profile for ID ${profileId}:`, err);
//             if (err.response?.status === 404) {
//                 setError('Profile not found.');
//             } else {
//                 setError('Could not load profile data.');
//             }
//             setProfileData(null); // Ensure profile data is cleared on error
//         } finally {
//             setIsLoadingProfile(false);
//         }
//     }, [profileId]); // Dependency is the ID from the URL

//     // Fetch Projects associated with the viewed profile ID
//     const fetchProjects = useCallback(async () => {
//         if (!profileId) {
//             // Don't try to load projects if there's no profile ID
//             setIsLoadingProjects(false);
//             return;
//         }
//         setIsLoadingProjects(true);
//         // Clear specific project errors if re-fetching profile
//         // setError(''); // Might clear profile error, be careful
//         try {
//             // Use getMyProjects (which takes owner ID) with the profileId from URL params
//             const response = await getMyProjects(profileId);
//             setProjectsData(response.data || []);
//         } catch (err) {
//             console.error(`Failed to fetch projects for profile ID ${profileId}:`, err);
//             // Set a specific error or just log it, don't overwrite profile error potentially
//             // setError('Could not load projects.'); 
//             setProjectsData([]);
//         } finally {
//             setIsLoadingProjects(false);
//         }
//     }, [profileId]); // Dependency is the ID from the URL


//     // Trigger fetches when profileId from URL changes
//     useEffect(() => {
//         fetchProfile();
//         fetchProjects();
//     }, [fetchProfile, fetchProjects]); // fetchProfile/fetchProjects depend on profileId


//     // --- Rendering Functions (Copied from ViewPublicProfile, check for needed data) ---
    

//     const renderLinks = () => {
//         if (!profileData) return null;
//         // Ensure profileData has the link fields (github_url, leetcode_username, etc.)
//         const links = [
//             { url: profileData.github_url, icon: <FaGithub />, label: 'GitHub Profile' },
//             { url: profileData.leetcode_username ? `https://leetcode.com/${profileData.leetcode_username}` : null, icon: <SiLeetcode />, label: 'LeetCode Profile' },
//             { url: profileData.hackerrank_username ? `https://www.hackerrank.com/${profileData.hackerrank_username}` : null, icon: <FaHackerrank />, label: 'HackerRank Profile' },
//             { url: profileData.linkedin_url, icon: <FaLinkedin />, label: 'LinkedIn Profile' },
//             { url: profileData.website_url, icon: <FaGlobe />, label: 'Personal Website/Portfolio' },
//         ].filter(link => link.url);

//         if (links.length === 0) return null;

//         return (
//             <div className="profile-section links-section">
//                 <h3>Links</h3>
//                 {/* Using icon-links class from your CSS */}
//                 <ul className="links-list icon-links">
//                     {links.map((link, index) => (
//                         <li key={index} className="link-item">
//                             <a href={link.url} target="_blank" rel="noopener noreferrer" title={link.label}>
//                                 {link.icon}
//                             </a>
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         );
//     };

//     const renderSkills = () => {
//         if (!profileData || (!profileData.main_skills?.length && !profileData.other_skills?.length)) {
//             return null;
//         }

//         return (
//             <div className="profile-section skills-section">
//                 <h3>Skills</h3>
//                 {profileData.main_skills?.length > 0 && (

//                     <div className="skills-subsection">
//                         <ul className="other-skills-list">

//                             {profileData.main_skills.map(skill => (
//                                 <li key={skill.id} className="other-skill-item">
//                                     <span className="main-skill-name">{skill.name}</span>
//                                     {skill.description && <p className="main-skill-description">{skill.description}</p>}
//                                 </li>
//                             ))}

//                             {profileData.other_skills.map(skill => (
//                                 <li key={skill.id} className="other-skill-item">{skill.name}</li>
//                             ))}

//                         </ul>
//                     </div>
//                 )}
//             </div>
//         );
//     };

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
//                 <div className="profile-section projects-section">
//                     <h3>Projects</h3>
//                     <p className="no-data-text">No projects to display yet.</p>
//                 </div>
//             );
//         }

//         // If projects exist, render the list
//         return (
//             <div className="profile-section projects-section">
//                 <h3>Projects</h3>
//                 <ul className="projects-list">
//                     {projectsData.map(project => (
//                         // Use project ID for the list item key
//                         <li key={project.id} className="project-item-card">

//                             {/* Project Image */}
//                             <div className="project-image-container">
//                                 <img
//                                     src={project.featured_image || DEFAULT_PROJECT_IMAGE}
//                                     alt={`${project.title} preview`}
//                                     className="project-image"
//                                     onError={(e) => { if (e.target.src !== DEFAULT_PROJECT_IMAGE) e.target.src = DEFAULT_PROJECT_IMAGE; }}
//                                 />
//                             </div>

//                             {/* Project Text Content */}
//                             <div className="project-details-content">
//                                 {/* Title */}
//                                 <h4>{project.title || 'Untitled Project'}</h4>

//                                 {/* Description */}
//                                 {project.description && (
//                                     <p className="project-description">{project.description}</p>
//                                 )}

//                                 {/* Tags - Map directly over nested tag objects */}
//                                 {Array.isArray(project.tags) && project.tags.length > 0 && (
//                                     <div className="project-tags">
//                                         {project.tags.map(tag => (
//                                             // Use tag.id for key and tag.name for display
//                                             <span key={tag.id} className="project-tag">{tag.name}</span>
//                                         ))}
//                                     </div>
//                                 )}

//                                 {/* Contributors - Map over nested contributor objects */}
//                                 {Array.isArray(project.contributors) && project.contributors.length > 0 && (
//                                     <div className="project-contributors">
//                                         <h5>Contributors:</h5>
//                                         <ul className="contributors-list">
//                                             {project.contributors.map(contributor => (
//                                                 <li key={contributor.id} className="contributor-item"><Link to={`/profiles/${contributor.id}`} title={`View ${contributor.username}'s profile`}><img src={contributor.profile_picture || DEFAULT_AVATAR} alt={contributor.username} title={contributor.username} className="contributor-avatar small" onError={(e) => { if (e.target.src !== DEFAULT_AVATAR) e.target.src = DEFAULT_AVATAR; }} /></Link></li>))}</ul></div>
//                                 )}

//                                 {/* Project Links */}
//                                 <div className="project-links">
//                                     {project.demo_link && (
//                                         <a href={project.demo_link} target="_blank" rel="noopener noreferrer" className="project-link-button demo">
//                                             <LanguageIcon fontSize="small" /> Demo
//                                         </a>
//                                     )}
//                                     {project.source_link && (
//                                         <a href={project.source_link} target="_blank" rel="noopener noreferrer" className="project-link-button source">
//                                             <GitHubIcon fontSize="small" /> Source
//                                         </a>
//                                     )}
//                                 </div>
//                             </div>
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         );
//     };
//     // --- End Rendering Functions ---


//     // --- Main Return Logic ---
//     if (isLoadingProfile) {
//         // Consistent loading state
//         return <div className="loading-text profile-page-container section-container">Loading profile...</div>;
//     }

//     // If there was an error fetching the profile, or if data is null after loading
//     if (error || !profileData) {
//         return <div className="mt[100px] error-message main-error profile-page-container section-container">{error || 'Profile data not found.'}</div>;
//     }

//     // Profile data loaded successfully, render the profile
//     // Construct full name, handle cases where one might be missing
//     const fullName = [profileData.first_name, profileData.last_name].filter(Boolean).join(' ') || profileData.username;

//     return (
//         // Changed outer container class name
//         <div className="!mt-[100px] profile-page-container section-container">
//             {/* Removed H2 title from ViewPublicProfile */}
//             {/* Display specific error if projects failed but profile loaded */}
//             {/* {error && <p className="error-message">{error}</p>}  */}

//             {/* --- Profile Header (same structure as ViewPublicProfile) --- */}
//             <div className="profile-header">
//                 <img
//                     src={profileData.profile_picture || DEFAULT_AVATAR}
//                     alt={`${fullName}'s profile`}
//                     className="profile-avatar"
//                     onError={(e) => { if (e.target.src !== DEFAULT_AVATAR) e.target.src = DEFAULT_AVATAR; }}
//                 />
//                 <div className="profile-info">
//                     <h3 className="profile-fullname">{fullName}</h3>
//                     <p className="profile-username">@{profileData.username}</p>
//                     {profileData.headline && <p className="profile-headline">{profileData.headline}</p>}
//                     {profileData.location && <p className="profile-location">{profileData.location}</p>}
//                 </div>


//                 {/* TODO: Add Follow/Message button here, check if profileId !== loggedInUserId */}
//                 {/* <div className="profile-actions"> <FollowButton targetUserId={profileId} /> </div> */}
            
//             </div>


//             {/* New section for ITI status / history */}
//             {profileData.is_student && profileData.iti_history?.length > 0 && (
//                 <div className="profile-section iti-history-section">
//                     <h3>History/Status with ITI</h3>

//                     {profileData.iti_history.map((entry, index) => (
//                         <div key={index} className="iti-history-box">
//                             <p><strong>Program:</strong> {entry.program}</p>
//                             <p><strong>Track:</strong> {entry.track || 'N/A'}</p>
//                             <p><strong>Start Date:</strong> {entry.start_date}</p>
//                             <p><strong>Status:</strong> {entry.status}</p>
//                         </div>
//                     ))}

//                 </div>
//             )}

//             {profileData.is_supervisor && (
//                 <div className="profile-section supervisor-info-section">
//                     <h3>Supervisor Role</h3>
//                     {profileData.department && (
//                         <div className="supervisor-department">
//                             <span className="badge">Department: {profileData.department}</span>
//                         </div>
//                     )}
//                     {profileData.supervised_tracks?.length > 0 && (
//                         <div className="supervised-tracks-box">
//                             <h4>Supervising Tracks</h4>
//                             <ul className="supervised-tracks-list">
//                                 {profileData.supervised_tracks.map((track, idx) => (
//                                     <li key={idx}>{track}</li>
//                                 ))}
//                             </ul>
//                         </div>
//                     )}
//                 </div>
//             )}


//             {/* --- Bio --- */}
//             {profileData.bio && (
//                 <div className="profile-section bio-section">
//                     <h3>Bio</h3>
//                     <p>{profileData.bio}</p>
//                 </div>
//             )}

//             {/* --- Links --- */}
//             {renderLinks()}

//             {/* --- Skills --- */}
//             {renderSkills()}

//             {/* --- Projects --- */}
//             {renderProjects()}

//         </div> // End profile-page-container
//     );
// };

// export default ProfilePageById;



// ==================================================================================================================
// ==================================================================================================================
// ==================================================================================================================



import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProfileById ,  getMyProjects} from '../../components/services/api';
import FollowButton from './FollowButton';
import AuthContext from '../../contexts/AuthContext'; // Adjust path as needed
import { Typography, CircularProgress, Alert, Avatar, Box, Paper, Button } from '@mui/material';
import { FaGithub, FaLinkedin, FaGlobe, FaHackerrank } from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';
import LanguageIcon from '@mui/icons-material/Language';
import GitHubIcon from '@mui/icons-material/GitHub';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'; // <-- Import Message Icon

import './ProfilePageById.css';


// Default avatar
const DEFAULT_USER_AVATAR = '../../src/assets/images/user-default.webp'; 
const DEFAULT_PROJECT_IMAGE = '../src/assets/images/user-default.webp';


function ProfilePageById() {
    const { profileId } = useParams();
    // Get user AND loading state from AuthContext
    const { user: loggedInUser, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();


    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Loading state for *this profile's* data
    const [error, setError] = useState(null);

    const [projectsData, setProjectsData] = useState([]);
    const [isLoadingProjects, setIsLoadingProjects] = useState(true);

    // Callback to fetch profile data
    const fetchProfile = useCallback(async () => {
        if (!profileId) {
            setError("No profile ID provided.");
            setIsLoading(false);
            return;
        }
        // Don't reset isLoading here if auth is still loading
        if (!authLoading) setIsLoading(true); // Only set loading true if auth is ready
        setError(null);
        console.log(`Fetching profile for ID: ${profileId}`);
        try {
            const response = await getProfileById(profileId);
            console.log("Profile data received:", response.data);
            setProfileData(response.data);
        } catch (err) {
            setError("Failed to load profile. It might not exist or there was a server error.");
            console.error("Error fetching profile:", err.response?.data || err.message || err);
            setProfileData(null);
        } finally {
            // Only set loading false if auth is also done loading
            if (!authLoading) setIsLoading(false);
        }
    }, [profileId, authLoading]); // Add authLoading as a dependency

    // Fetch data on mount and when profileId or authLoading status changes
    useEffect(() => {
        // Only fetch profile data if auth isn't loading
        if (!authLoading) {
            fetchProfile();
        } else {
             // If auth is loading, set profile loading true as well
            setIsLoading(true);
        }
    }, [fetchProfile, authLoading]); // Depend on authLoading

    const fetchProjects = useCallback(async () => {
                if (!profileId) {
                    // Don't try to load projects if there's no profile ID
                    setIsLoadingProjects(false);
                    return;
                }
                setIsLoadingProjects(true);
                // Clear specific project errors if re-fetching profile
                // setError(''); // Might clear profile error, be careful
                try {
                    // Use getMyProjects (which takes owner ID) with the profileId from URL params
                    const response = await getMyProjects(profileId);
                    setProjectsData(response.data || []);
                } catch (err) {
                    console.error(`Failed to fetch projects for profile ID ${profileId}:`, err);
                    // Set a specific error or just log it, don't overwrite profile error potentially
                    // setError('Could not load projects.'); 
                    setProjectsData([]);
                } finally {
                    setIsLoadingProjects(false);
                }
            }, [profileId]); // Dependency is the ID from the URL
        
        
            // Trigger fetches when profileId from URL changes
            useEffect(() => {
                fetchProfile();
                fetchProjects();
            }, [fetchProfile, fetchProjects]); // fetchProfile/fetchProjects depend on profileId

    // Handler for optimistic UI update
    const handleFollowUpdate = useCallback((followed) => {
        setProfileData(prev => {
            if (!prev) return null;
            const change = followed ? 1 : -1;
            return {
                ...prev,
                is_following: followed,
                followers_count: Math.max(0, (prev.followers_count ?? 0) + change)
            };
        });
    }, []);


    const renderLinks = () => {
                if (!profileData) return null;
                // Ensure profileData has the link fields (github_url, leetcode_username, etc.)
                const links = [
                    { url: profileData.github_url, icon: <FaGithub />, label: 'GitHub Profile' },
                    { url: profileData.leetcode_username ? `https://leetcode.com/${profileData.leetcode_username}` : null, icon: <SiLeetcode />, label: 'LeetCode Profile' },
                    { url: profileData.hackerrank_username ? `https://www.hackerrank.com/${profileData.hackerrank_username}` : null, icon: <FaHackerrank />, label: 'HackerRank Profile' },
                    { url: profileData.linkedin_url, icon: <FaLinkedin />, label: 'LinkedIn Profile' },
                    { url: profileData.website_url, icon: <FaGlobe />, label: 'Personal Website/Portfolio' },
                ].filter(link => link.url);
        
                if (links.length === 0) return null;
        
                return (
                    <div className="profile-section links-section">
                        <h3>Links</h3>
                        {/* Using icon-links class from your CSS */}
                        <ul className="links-list icon-links">
                            {links.map((link, index) => (
                                <li key={index} className="link-item">
                                    <a href={link.url} target="_blank" rel="noopener noreferrer" title={link.label}>
                                        {link.icon}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            };
        
            const renderSkills = () => {
                if (!profileData || (!profileData.main_skills?.length && !profileData.other_skills?.length)) {
                    return null;
                }
        
                return (
                    <div className="profile-section skills-section">
                        <h3>Skills</h3>
                        {profileData.main_skills?.length > 0 && (
        
                            <div className="skills-subsection">
                                <ul className="other-skills-list">
        
                                    {profileData.main_skills.map(skill => (
                                        <li key={skill.id} className="other-skill-item">
                                            <span className="main-skill-name">{skill.name}</span>
                                            {skill.description && <p className="main-skill-description">{skill.description}</p>}
                                        </li>
                                    ))}
        
                                    {profileData.other_skills.map(skill => (
                                        <li key={skill.id} className="other-skill-item">{skill.name}</li>
                                    ))}
        
                                </ul>
                            </div>
                        )}
                    </div>
                );
            };
        
            const renderProjects = () => {
                // Use loading state specific to projects
                if (isLoadingProjects && projectsData.length === 0) {
                    return (
                        <div className="profile-section projects-section">
                            <h3>Projects</h3>
                            <p className='loading-text small'>Loading projects...</p>
                        </div>
                    );
                }
        
                // Don't render the section if there are no projects after loading
                if (!isLoadingProjects && projectsData.length === 0) {
                    // return null; 
                    return (
                        <div className="profile-section projects-section">
                            <h3>Projects</h3>
                            <p className="no-data-text">No projects to display yet.</p>
                        </div>
                    );
                }
        
                // If projects exist, render the list
                return (
                    <div className="profile-section projects-section">
                        <h3>Projects</h3>
                        <ul className="projects-list">
                            {projectsData.map(project => (
                                // Use project ID for the list item key
                                <li key={project.id} className="project-item-card">
        
                                    {/* Project Image */}
                                    <div className="project-image-container">
                                        <img
                                            src={project.featured_image || DEFAULT_PROJECT_IMAGE}
                                            alt={`${project.title} preview`}
                                            className="project-image"
                                            onError={(e) => { if (e.target.src !== DEFAULT_PROJECT_IMAGE) e.target.src = DEFAULT_PROJECT_IMAGE; }}
                                        />
                                    </div>
        
                                    {/* Project Text Content */}
                                    <div className="project-details-content">
                                        {/* Title */}
                                        <h4>{project.title || 'Untitled Project'}</h4>
        
                                        {/* Description */}
                                        {project.description && (
                                            <p className="project-description">{project.description}</p>
                                        )}
        
                                        {/* Tags - Map directly over nested tag objects */}
                                        {Array.isArray(project.tags) && project.tags.length > 0 && (
                                            <div className="project-tags">
                                                {project.tags.map(tag => (
                                                    // Use tag.id for key and tag.name for display
                                                    <span key={tag.id} className="project-tag">{tag.name}</span>
                                                ))}
                                            </div>
                                        )}
        
                                        {/* Contributors - Map over nested contributor objects */}
                                        {Array.isArray(project.contributors) && project.contributors.length > 0 && (
                                            <div className="project-contributors">
                                                <h5>Contributors:</h5>
                                                <ul className="contributors-list">
                                                    {project.contributors.map(contributor => (
                                                        <li key={contributor.id} className="contributor-item"><Link to={`/profiles/${contributor.id}`} title={`View ${contributor.username}'s profile`}><img src={contributor.profile_picture || DEFAULT_USER_AVATAR} alt={contributor.username} title={contributor.username} className="contributor-avatar small" onError={(e) => { if (e.target.src !== DEFAULT_USER_AVATAR) e.target.src = DEFAULT_USER_AVATAR; }} /></Link></li>))}</ul></div>
                                        )}
        
                                        {/* Project Links */}
                                        <div className="project-links">
                                            {project.demo_link && (
                                                <a href={project.demo_link} target="_blank" rel="noopener noreferrer" className="project-link-button demo">
                                                    <LanguageIcon fontSize="small" /> Demo
                                                </a>
                                            )}
                                            {project.source_link && (
                                                <a href={project.source_link} target="_blank" rel="noopener noreferrer" className="project-link-button source">
                                                    <GitHubIcon fontSize="small" /> Source
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            };

    // Show loading if either the profile data OR the auth context is loading
    if (isLoading || authLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress color="inherit" />
                <Typography sx={{ ml: 2, color: 'text.secondary' }}>
                    {authLoading ? "Authenticating..." : "Loading Profile..."}
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh" px={2}>
                <Alert severity="error" variant="filled" sx={{ width: '100%', maxWidth: 'md' }}>{error}</Alert>
            </Box>
        );
    }

    if (!profileData) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <Typography sx={{ color: 'text.secondary' }}>Profile not found.</Typography>
            </Box>
        );
    }

    // Now we can safely check loggedInUser because authLoading is false
    const isOwnProfile = loggedInUser?.id === profileData.id;
    console.log("Logged In User Context:", loggedInUser); // Debug Log
    console.log("Profile Data:", profileData); // Debug Log
    console.log("Is Own Profile:", isOwnProfile); // Debug Log


    return (
        <Box sx={{ maxWidth: '1000px', margin: 'auto', marginTop: '80px' , p: 2, pt: { xs: 12, md: 6 } }}>
            <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, backgroundColor: '#292928', color: 'white', borderRadius: '12px' }}>
                {/* Profile Header */}
                <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} alignItems={{xs: 'center', sm: 'flex-start'}} mb={2}>
                   {/* Avatar */}
                    <Avatar
                        src={profileData.profile_picture || DEFAULT_USER_AVATAR}
                        alt={profileData.username}
                        sx={{ width: { xs: 80, sm: 100, md: 120 }, height: { xs: 80, sm: 100, md: 120 }, mb: { xs: 2, sm: 0 }, mr: { sm: 3 }, border: '3px solid #7a2226', flexShrink: 0 }}
                        imgProps={{ onError: (e) => { if (e.target.src !== DEFAULT_USER_AVATAR) e.target.src = DEFAULT_USER_AVATAR; } }}
                    />
                    {/* Info Box */}
                    <Box flexGrow={1} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                        {/* Name, Headline, Location */}
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 0.5 }}> {profileData.username || 'User'} </Typography>
                        <Typography variant="body1" sx={{ color: 'grey.400', mb: 1 }}> {profileData.headline || 'No headline'} </Typography>
                        <Typography variant="body2" sx={{ color: 'grey.500', mb: 2 }}> {profileData.location || 'Location not specified'} </Typography>

                        {/* Follow Counts */}
                        <Box display="flex" flexWrap="wrap" gap={{ xs: 2, sm: 3 }} mb={2}>
                            <Typography variant="body2" sx={{ color: 'grey.300', cursor: 'pointer', '&:hover': { color: 'white'} }}>
                                <strong className="text-white">{profileData.followers_count ?? 0}</strong> Followers
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'grey.300', cursor: 'pointer', '&:hover': { color: 'white'} }}>
                                <strong className="text-white">{profileData.following_count ?? 0}</strong> Following
                            </Typography>
                        </Box>

                        {/* Follow/Edit Button Area */}
                        <Box sx={{ mt: 1, display: 'flex', gap: 1, alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start'} }}>
                            {isOwnProfile ? (
                                // Show Edit button if own profile
                                <Button variant="outlined" component={Link} to="/profile" size="small" sx={{ borderColor: '#7a2226', color: '#7a2226', '&:hover': { borderColor: '#9a2d31', backgroundColor: 'rgba(122, 34, 38, 0.1)' } }}>
                                    Edit Profile Settings
                                </Button>
                            ) : (
                                // Show Follow and Message buttons if not own profile and logged in
                                loggedInUser && profileData.id && profileData.user ? ( // Check profileData.user exists for messaging
                                    <>
                                        <FollowButton
                                            profileId={profileData.id}
                                            isInitiallyFollowing={profileData.is_following}
                                            onFollowToggle={handleFollowUpdate}
                                        />
                                        {/* Message Button */}
                                        <Button
                                            variant="contained"
                                            size="small"
                                            startIcon={<ChatBubbleOutlineIcon />}
                                            onClick={() => navigate(`/messagesList/private/${profileData.user}`)} // Navigate using USER ID
                                            sx={{
                                                backgroundColor: '#555', // Example secondary action color
                                                color: 'white',
                                                textTransform: 'none',
                                                fontWeight: 'bold',
                                                '&:hover': { backgroundColor: '#666' }
                                            }}
                                        >
                                            Message
                                        </Button>
                                    </>
                                ) : (
                                    // Optional: Show Login button if not logged in
                                    !loggedInUser && <Button component={Link} to="/login" size="small" variant="contained" color="primary">Login to interact</Button>
                                )
                            )}
                        </Box>
                    </Box>
                </Box>

            {/* --- Bio --- */}
            {profileData.bio && (
                <div className="profile-section bio-section">
                    <h3>Bio</h3>
                    <p>{profileData.bio}</p>
                </div>
            )}

            {/* --- Links --- */}
            {renderLinks()}

            {/* --- Skills --- */}
            {renderSkills()}

            {/* --- Projects --- */}
            {renderProjects()}

            </Paper>
        </Box>
    );
}

export default ProfilePageById;