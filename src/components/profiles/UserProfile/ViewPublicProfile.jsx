// src/components/UserProfile/ViewPublicProfile.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { getPublicProfile, getAllProjects, getAllTags } from '../../../services/api'; // Assuming getMyProjects is in api.js
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LinkIcon from '@mui/icons-material/Link';
import CodeIcon from '@mui/icons-material/Code';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language'; // For website url
import { FaGithub, FaLinkedin, FaGlobe, FaHackerrank } from 'react-icons/fa'; // Using FontAwesome set
import { SiLeetcode } from 'react-icons/si'; // Using SimpleIcons set for LeetCode
import ImageIcon from '@mui/icons-material/Image';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person'; 
import Link from '@mui/material/Link';
// Add other icons if needed (LeetCode, HackerRank etc.)

import './ViewPublicProfile.css';

const DEFAULT_PROJECT_IMAGE = '/images/projects/default.jpg'; // Example default project image
const DEFAULT_AVATAR = '/images/profiles/user-default.png'; // Default user avatar

const ViewPublicProfile = ({ profileId }) => {
    const [profileData, setProfileData] = useState(null);
    const [projectsData, setProjectsData] = useState([]); // Stores the *filtered* projects
    const [availableTags, setAvailableTags] = useState([]); // State to store all tags {id, name}
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [isLoadingProjects, setIsLoadingProjects] = useState(true);
    const [isLoadingTags, setIsLoadingTags] = useState(true); // Loading state for tags
    const [error, setError] = useState('');

    const fetchProfile = useCallback(async () => {
        if (!profileId) {
        setError("Profile ID is missing.");
        setIsLoadingProfile(false);
        setIsLoadingProjects(false); // Stop projects loading too
        return;
        }
        setIsLoadingProfile(true);
        setError('');
        try {
        const response = await getPublicProfile(profileId);
        setProfileData(response.data);
        } catch (err) {
        console.error("Failed to fetch public profile:", err);
        setError('Could not load profile data.');
        } finally {
        setIsLoadingProfile(false);
        }
    }, [profileId]);

    const fetchProjects = useCallback(async () => {
        if (!profileId) return;
        setIsLoadingProjects(true);
        // Clear project-specific errors if needed
        try {
            const response = await getAllProjects(); // Fetch ALL projects
            const allProjects = response.data || [];
            // Filter projects client-side based on the owner field matching profileId
            const userProjects = allProjects.filter(project => project.owner === profileId);
            setProjectsData(userProjects); // Set state with the filtered list
        } catch (err) {
            console.error("Failed to fetch projects:", err);
            setError(prev => prev ? `${prev} Could not load projects.` : 'Could not load projects.');
        } finally {
            setIsLoadingProjects(false);
        }
      }, [profileId]); // Depends on profileId for filtering
    
    

    const fetchTags = useCallback(async () => {
        setIsLoadingTags(true);
        try {
            const response = await getAllTags();
            setAvailableTags(response.data || []);
        } catch (err) {
            console.error("Failed to fetch tags:", err);
            // Non-critical error, maybe just log it or add minor note to error state
            setError(prev => prev ? `${prev} Could not load tag names.` : 'Could not load tag names.');
        } finally {
            setIsLoadingTags(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
        fetchProjects();
        fetchTags(); // Fetch tags as well
      }, [fetchProfile, fetchProjects, fetchTags]); // Add fetchTags dependency

  // --- Render Helpers ---

  const renderLinks = () => {
    if (!profileData) return null;

    // Define links with react-icons components
    const links = [
      { url: profileData.github_url, icon: <FaGithub />, label: 'GitHub Profile' }, // Added label for accessibility/tooltip
      // Assuming leetcode_username field stores the username
      { url: profileData.leetcode_username ? `https://leetcode.com/${profileData.leetcode_username}` : null, icon: <SiLeetcode />, label: 'LeetCode Profile' },
      // Assuming hackerrank_username field stores the username
      { url: profileData.hackerrank_username ? `https://www.hackerrank.com/${profileData.hackerrank_username}` : null, icon: <FaHackerrank />, label: 'HackerRank Profile' },
      { url: profileData.linkedin_url, icon: <FaLinkedin />, label: 'LinkedIn Profile' },
      { url: profileData.website_url, icon: <FaGlobe />, label: 'Personal Website/Portfolio' },
      // Add others like twitter_url, stackoverflow_url if needed
    ].filter(link => link.url); // Only show links that have a valid URL

    if (links.length === 0) return null; // Don't render section if no links

        
    return (
        <div className="profile-section links-section">
          <h3>Links</h3>
          <ul className="links-list icon-links"> {/* Add class for specific styling */}
            {links.map((link, index) => (
              <li key={index} className="link-item">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={link.label} // Use label for tooltip
                >
                  {link.icon}
                  {/* Label removed for icon-only look like the target image */}
                  {/* <span>{link.label}</span> */}
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
                <h4>Main Skills</h4>
                <ul className="main-skills-list">
                {profileData.main_skills.map(skill => (
                    <li key={skill.id} className="main-skill-item">
                    <span className="main-skill-name">{skill.name}</span>
                    {skill.description && <p className="main-skill-description">{skill.description}</p>}
                    </li>
                ))}
                </ul>
            </div>
            )}
            {profileData.other_skills?.length > 0 && (
            <div className="skills-subsection">
                {/* <h4>Other Skills</h4> */}
                <ul className="other-skills-list">
                {profileData.other_skills.map(skill => (
                    <li key={skill.id} className="other-skill-item">{skill.name}</li>
                ))}

                {profileData.main_skills.map(skill => (
                    <li key={skill.id} className="other-skill-item"> </li> ))}
                </ul>
            </div>
            )}
        </div>
        );
    };

    const renderProjects = () => {
        const isLoading = isLoadingProjects || isLoadingTags;
        if (isLoading && projectsData.length === 0) return <p className='loading-text small'>Loading projects...</p>;

        // If not loading but still no projects (after filtering), don't render the section
        if (!isLoading && projectsData.length === 0) {
            // Optionally show a "No projects yet" message if desired within the section
            // return <div className="profile-section projects-section"><h3>Projects</h3><p className="no-data-text">No projects added yet.</p></div>;
             return null; // Or just render nothing
        }

        const getTagName = (tagId) => {
            const tag = availableTags.find(t => t.id === tagId);
            return tag ? tag.name : 'Tag?'; // Shorter fallback
        };

        return (
        <div className="profile-section projects-section">
            <h3>Projects</h3>
            <ul className="projects-list">
            {projectsData.map(project => (
                <li key={project.id} className="project-item-card">
                    {/* --- Project Image --- */}
                    <div className="project-image-container">
                        <img
                            src={project.featured_image || DEFAULT_PROJECT_IMAGE}
                            alt={`${project.title} preview`}
                            className="project-image"
                            onError={(e) => { if (e.target.src !== DEFAULT_PROJECT_IMAGE) e.target.src = DEFAULT_PROJECT_IMAGE; }}
                        />
                    </div>

                    {/* --- Project Details --- */}
                    <div className="project-details-content">
                        <h4>{project.title}</h4>
                        {project.description && <p className="project-description">{project.description}</p>}

                        {/* --- Tags --- */}
                        {project.tags && project.tags.length > 0 && !isLoadingTags && (
                            <div className="project-tags">
                                {project.tags.map(tagId => (
                                    <span key={tagId} className="project-tag">{getTagName(tagId)}</span>
                                ))}
                            </div>
                        )}
                         {isLoadingTags && project.tags?.length > 0 && <p className='loading-text tiny'>Loading tags...</p>}


                        {/* --- Contributors --- */}
                        {/* Ensure project.contributors is an array and has items */}
                        {Array.isArray(project.contributors) && project.contributors.length > 0 && (
                            <div className="project-contributors">
                                <h5>Contributors:</h5>
                                <ul className="contributors-list">
                                    {project.contributors.map(contributor => (
                                        <li key={contributor} className="contributor-item">
                                            {/* Link to the contributor's profile page */}
                                            <Link to={`/profiles/${contributor}`} title={`View ${project.contributors.usename}'s profile`}>
                                                <img
                                                    src={contributor.profile_image || DEFAULT_AVATAR}
                                                    alt={contributor.username}
                                                    className="contributor-avatar"
                                                    onError={(e) => { if(e.target.src !== DEFAULT_AVATAR) e.target.src = DEFAULT_AVATAR; }}
                                                />
                                                <span className="contributor-username">{contributor.username}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* --- Links --- */}
                        <div className="project-links">
                             {project.demo_link && (
                                <a href={project.demo_link} target="_blank" rel="noopener noreferrer" className="project-link-button demo">
                                <LanguageIcon fontSize="small"/> Demo
                                </a>
                             )}
                             {project.source_link && (
                                <a href={project.source_link} target="_blank" rel="noopener noreferrer" className="project-link-button source">
                                <GitHubIcon fontSize="small"/> Source
                                </a>
                             )}
                        </div>
                    </div> {/* End project-details-content */}
                </li>
            ))}
            </ul>
        </div>
        );
    };


  // --- Main Render ---

    if (isLoadingProfile) {
        return <div className="loading-text section-container">Loading profile view...</div>;
    }

    if (error && !profileData) { // Show error only if profile loading failed critically
        return <div className="error-message main-error section-container">{error}</div>;
    }

    if (!profileData) {
        return <div className="loading-text section-container">Profile data not found.</div>;
    }

    // Construct full name, handle cases where one might be missing
    const fullName = [profileData.first_name, profileData.last_name].filter(Boolean).join(' ') || profileData.username;

    return (
        <div className="view-public-profile-container section-container">
        <h2><AccountCircleIcon /> Public Profile View</h2>
        {error && <p className="error-message">{error}</p>} {/* Show non-critical errors here */}

        {/* --- Profile Header --- */}
        <div className="profile-header">
            <img
            src={profileData.profile_image || '/path/to/your/default-user.png'} // Use default if no image
            alt={`${fullName}'s profile`}
            className="profile-avatar"
            />
            <div className="profile-info">
            <h3 className="profile-fullname">{fullName}</h3>
            <p className="profile-username">@{profileData.username}</p>
            {profileData.headline && <p className="profile-headline">{profileData.headline}</p>}
            {profileData.location && <p className="profile-location">{profileData.location}</p>}
            </div>
            {/* Optional: Add Follow/Message buttons (disabled/hidden for own profile) */}
            {/* <div className="profile-actions"> <button disabled>Follow</button> </div> */}
        </div>

        {/* --- Bio --- */}
        {profileData.bio && (
            <div className="profile-section bio-section">
            <h3>About</h3>
            <p>{profileData.bio}</p>
            </div>
        )}

        {/* --- Links --- */}
        {renderLinks()}

        {/* --- Skills --- */}
        {renderSkills()}

        {/* --- Projects --- */}
        {renderProjects()}

        </div>
    );
    };

export default ViewPublicProfile;