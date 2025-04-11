import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom'; // Import useParams and Link
import { getPublicProfile, getMyProjects } from '../services/api'; // Adjust path to your api.js

// Import Icons (adjust paths/sources if needed)
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GitHubIcon from '@mui/icons-material/GitHub'; // Keep if used in renderProjects
import LanguageIcon from '@mui/icons-material/Language'; // Keep if used in renderProjects
import { FaGithub, FaLinkedin, FaGlobe, FaHackerrank } from 'react-icons/fa'; 
import { SiLeetcode } from 'react-icons/si'; 

import './ProfilePageById.css'; 

const DEFAULT_PROJECT_IMAGE = '../src/assets/images/user-default.webp'; 
const DEFAULT_AVATAR = '../src/assets/images/user-default.webp'; 

// New Profile Page Component
const ProfilePageById = () => {
    // --- Get profileId from URL ---
    const { profileId } = useParams(); // Use react-router's hook
    // ---

    const [profileData, setProfileData] = useState(null);
    const [projectsData, setProjectsData] = useState([]); 
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [isLoadingProjects, setIsLoadingProjects] = useState(true);
    const [error, setError] = useState('');

    // Fetch Profile Data based on URL ID
    const fetchProfile = useCallback(async () => {
        // Removed check for prop, now relies on useParams
        if (!profileId) { 
            setError("Profile ID not found in URL.");
            setIsLoadingProfile(false);
            setIsLoadingProjects(false); 
            return;
        }
        setIsLoadingProfile(true);
        setError('');
        try {
            // Use getPublicProfile with ID from URL params
            const response = await getPublicProfile(profileId); 
            setProfileData(response.data);
        } catch (err) {
            console.error(`Failed to fetch public profile for ID ${profileId}:`, err);
            if (err.response?.status === 404) {
                setError('Profile not found.');
            } else {
                setError('Could not load profile data.');
            }
            setProfileData(null); // Ensure profile data is cleared on error
        } finally {
            setIsLoadingProfile(false);
        }
    }, [profileId]); // Dependency is the ID from the URL

    // Fetch Projects associated with the viewed profile ID
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
    }, [fetchProfile, fetchProjects ]); // fetchProfile/fetchProjects depend on profileId


    // --- Rendering Functions (Copied from ViewPublicProfile, check for needed data) ---

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
                                        <li key={contributor.id} className="contributor-item"><Link to={`/profiles/${contributor.id}`} title={`View ${contributor.username}'s profile`}><img src={contributor.profile_picture || DEFAULT_AVATAR} alt={contributor.username} title={contributor.username} className="contributor-avatar small" onError={(e) => { if(e.target.src !== DEFAULT_AVATAR) e.target.src = DEFAULT_AVATAR;}}/></Link></li>))}</ul></div>
                        )}
    
                        {/* Project Links */}
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
                    </div> 
                </li>
            ))}
            </ul>
        </div>
        );
    }; 
    // --- End Rendering Functions ---
    

    // --- Main Return Logic ---
    if (isLoadingProfile) {
        // Consistent loading state
        return <div className="loading-text profile-page-container section-container">Loading profile...</div>; 
    }

    // If there was an error fetching the profile, or if data is null after loading
    if (error || !profileData) { 
        return <div className="error-message main-error profile-page-container section-container">{error || 'Profile data not found.'}</div>;
    }

    // Profile data loaded successfully, render the profile
    // Construct full name, handle cases where one might be missing
    const fullName = [profileData.first_name, profileData.last_name].filter(Boolean).join(' ') || profileData.username;

    return (
        // Changed outer container class name
        <div className="profile-page-container section-container"> 
            {/* Removed H2 title from ViewPublicProfile */}
            {/* Display specific error if projects failed but profile loaded */}
            {/* {error && <p className="error-message">{error}</p>}  */}

            {/* --- Profile Header (same structure as ViewPublicProfile) --- */}
            <div className="profile-header">
                <img
                    src={ profileData.profile_picture || DEFAULT_AVATAR } 
                    alt={`${fullName}'s profile`}
                    className="profile-avatar"
                    onError={(e) => { if (e.target.src !== DEFAULT_AVATAR) e.target.src = DEFAULT_AVATAR; }}
                />
                <div className="profile-info">
                    <h3 className="profile-fullname">{fullName}</h3>
                    <p className="profile-username">@{profileData.username}</p>
                    {profileData.headline && <p className="profile-headline">{profileData.headline}</p>}
                    {profileData.location && <p className="profile-location">{profileData.location}</p>}
                </div>
                {/* TODO: Add Follow/Message button here, check if profileId !== loggedInUserId */}
                {/* <div className="profile-actions"> <FollowButton targetUserId={profileId} /> </div> */}
            </div>

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

        </div> // End profile-page-container
    );
};

export default ProfilePageById;