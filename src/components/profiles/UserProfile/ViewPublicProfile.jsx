//Component to view a public profile of a user
//ViewPublicProfile.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  getPublicProfile,
  getMyProjects,
} from "../../../components/services/api";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import GitHubIcon from "@mui/icons-material/GitHub";
import LanguageIcon from "@mui/icons-material/Language";
import { FaGithub, FaLinkedin, FaGlobe, FaHackerrank } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { Link } from "react-router-dom"; // For internal links
import { Box, Typography } from "@mui/material";
import "./ViewPublicProfile.css";

const DEFAULT_PROJECT_IMAGE = "../../src/assets/images/user-default.webp";
const DEFAULT_AVATAR = "../../src/assets/images/user-default.webp";

const ViewPublicProfile = ({ profileId }) => {
  const [profileData, setProfileData] = useState(null);
  const [projectsData, setProjectsData] = useState([]); // Stores the *filtered* projects
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [error, setError] = useState("");

  const fetchProfile = useCallback(async () => {
    if (!profileId) {
      setError("Profile ID is missing.");
      setIsLoadingProfile(false);
      setIsLoadingProjects(false);
      return;
    }
    setIsLoadingProfile(true);
    setError("");
    try {
      const response = await getPublicProfile(profileId);
      setProfileData(response.data);
    } catch (err) {
      console.error("Failed to fetch public profile:", err);
      setError("Could not load profile data.");
    } finally {
      setIsLoadingProfile(false);
    }
  }, [profileId]);

  const fetchProjects = useCallback(async () => {
    if (!profileId) {
      setError("Cannot load projects without a Profile ID.");
      setIsLoadingProjects(false);
      return;
    }
    setIsLoadingProjects(true);
    setError("");
    try {
      // --- Call the filtered API endpoint ---
      const response = await getMyProjects(profileId);
      // --- No client-side filter needed ---
      if (response.data && Array.isArray(response.data)) {
        // Case 1: The API returns the array directly
        setProjectsData(response.data);
    } else if (response.data && typeof response.data === 'object' && Array.isArray(response.data.results)) {
        // Case 2: The API returns an object, with the array nested under 'results' (common for paginated data)
        setProjectsData(response.data.results);
    }
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setError("Could not load your projects.");
      setProjectsData([]);
    } finally {
      setIsLoadingProjects(false);
    }
  }, [profileId]);

  useEffect(() => {
    fetchProfile();
    fetchProjects();
  }, [fetchProfile, fetchProjects]);

  const renderLinks = () => {
    if (!profileData) return null;

    const links = [
      {
        url: profileData.github_url,
        icon: <FaGithub />,
        label: "GitHub Profile",
      },
      {
        url: profileData.leetcode_username
          ? `https://leetcode.com/${profileData.leetcode_username}`
          : null,
        icon: <SiLeetcode />,
        label: "LeetCode Profile",
      },
      {
        url: profileData.hackerrank_username
          ? `https://www.hackerrank.com/${profileData.hackerrank_username}`
          : null,
        icon: <FaHackerrank />,
        label: "HackerRank Profile",
      },
      {
        url: profileData.linkedin_url,
        icon: <FaLinkedin />,
        label: "LinkedIn Profile",
      },
      {
        url: profileData.website_url,
        icon: <FaGlobe />,
        label: "Personal Website/Portfolio",
      },
      // ========== TODO:Add others like twitter_url, stackoverflow_url =============
    ].filter((link) => link.url); // Only show links that have a valid URL

    if (links.length === 0) return null; // Don't render section if no links

    return (
      <div className="profile-section links-section">
        <h3>Links</h3>
        <ul className="links-list icon-links">
          {links.map((link, index) => (
            <li key={index} className="link-item">
              <a
                className="icon"
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                title={link.label}
              >
                {link.icon}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  const renderSkills = () => {
    if (
      !profileData ||
      (!profileData.main_skills?.length && !profileData.other_skills?.length)
    ) {
      return null;
    }

    return (
      <div className="profile-section skills-section !bg-white">
        <h3 className="!font-bold">Skills</h3>
        {profileData.main_skills?.length > 0 && (
          <div className="skills-subsection">
            <ul className="other-skills-list !bg-white">
              {profileData.main_skills.map((skill) => (
                <li key={skill.id} className="other-skill-item ">
                  <span className="main-skill-name">{skill.name}</span>
                  {skill.description && (
                    <p className="main-skill-description">
                      {skill.description}
                    </p>
                  )}
                </li>
              ))}

              {profileData.other_skills.map((skill) => (
                <li key={skill.id} className="other-skill-item">
                  {skill.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  // --- Render Projects ---
  const renderProjects = () => {
    // Use loading state specific to projects
    if (isLoadingProjects) {
      return (
        <div className="profile-section projects-section">
          <h3>Projects</h3>
          <p className="loading-text small">Loading projects...</p>
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
      <div className="profile-section projects-section !bg-white">
        <h3 className="!font-bold">Projects</h3>
        {projectsData?.length > 0 && (
          <ul className="projects-list ">
            {projectsData?.map((project) => (
              // Use project ID for the list item key
              <li key={project.id} className="project-item-card !bg-[#ededed]">
                {/* Project Image */}
                <div className="project-image-container">
                  <img
                    src={project.featured_image || DEFAULT_PROJECT_IMAGE}
                    alt={`${project.title} preview`}
                    className="project-image"
                    onError={(e) => {
                      if (e.target.src !== DEFAULT_PROJECT_IMAGE)
                        e.target.src = DEFAULT_PROJECT_IMAGE;
                    }}
                  />
                </div>

                {/* Project Text Content */}
                <div className="project-details-content">
                  {/* Title */}
                  <Link
                    to={`/projects/${project.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <h4 className="!text-gray-900">
                      {project.title || "Untitled Project"}
                    </h4>
                  </Link>

                  {/* Description */}
                  {/* {project.description && (
                    <p className="project-description !text-gray-900">
                      {project.description}
                    </p>
                  )} */}

                  {/* Tags - Map directly over nested tag objects */}
                  {Array.isArray(project.tags) && project.tags.length > 0 && (
                    <div className="project-tags">
                      {project.tags.map((tag) => (
                        // Use tag.id for key and tag.name for display
                        <span key={tag.id} className="project-tag">
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Contributors - Map over nested contributor objects */}
                  {Array.isArray(project.contributors) &&
                    project.contributors.length > 0 && (
                      <div className="project-contributors">
                        <h5>Contributors:</h5>
                        <ul className="contributors-list">
                          {project.contributors.map((contributor) => (
                            <li
                              key={contributor.id}
                              className="contributor-item"
                            >
                              <Link
                                to={`/profiles/${contributor.id}`}
                                title={`View ${contributor.username}'s profile`}
                              >
                                <img
                                  src={
                                    contributor.profile_picture ||
                                    DEFAULT_AVATAR
                                  }
                                  alt={contributor.username}
                                  title={contributor.username}
                                  className="contributor-avatar small"
                                  onError={(e) => {
                                    if (e.target.src !== DEFAULT_AVATAR)
                                      e.target.src = DEFAULT_AVATAR;
                                  }}
                                />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  {/* Project Links */}
                  <div className="project-links">
                    {project.demo_link && (
                      <a
                        href={project.demo_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link-button demo"
                      >
                        <LanguageIcon fontSize="small text-gray-200" />{" "}
                        <span className="text-gray-200">Demo</span>
                      </a>
                    )}
                    {project.source_link && (
                      <a
                        href={project.source_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link-button source"
                      >
                        <GitHubIcon fontSize="small" /> Source
                      </a>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  if (isLoadingProfile) {
    return (
      <div className="loading-text section-container mt-[100px]">
        Loading profile view...
      </div>
    );
  }

  if (error && !profileData) {
    // Show error only if profile loading failed critically
    return (
      <div className="error-message main-error section-container mt-[100px]">
        {error}
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="loading-text section-container">
        Profile data not found.
      </div>
    );
  }

  // Construct full name, handle cases where one might be missing
  const fullName =
    [profileData.first_name, profileData.last_name].filter(Boolean).join(" ") ||
    profileData.username;
  console.log(profileData.profile_picture);

  return (
    <div className="view-public-profile-container section-container !bg-[#ededed] rounded-xl shadow-md !mt-[70px] max-w-[80%]">
      <h2>
        <AccountCircleIcon className="icon" />
        <span className="text-gray-900">View Public Profile</span>
      </h2>
      {error && <p className="error-message">{error}</p>}

      {/* --- Profile Header --- */}
      <div className="profile-header !bg-[#ededed]">
        <img
          src={profileData.profile_picture || DEFAULT_AVATAR}
          alt={`${fullName}'s profile`}
          className="profile-avatar"
        />
        <div className="profile-info !bg-[#ededed]">
          <h3 className="!text-gray-900">{fullName}</h3>
          <p className="!text-gray-900">@{profileData.username}</p>
          {profileData.headline && (
            <p className="!text-gray-900">{profileData.headline}</p>
          )}
          {profileData.location && (
            <p className="!text-gray-900">{profileData.location}</p>
          )}
          <Box
            display="flex"
            flexGrow={1}
            flexWrap="wrap"
            gap={{ xs: 2, sm: 3 }}
            mb={1}
          >
            <Typography
              variant="body2"
              sx={{
                color: "grey.900",
                cursor: "pointer",
                "&:hover": { color: "white" },
              }}
            >
              <Link
                to={
                  profileData.id ? `/profiles/${profileData.id}/followers` : "#"
                } // Link only if ID exists
                className="flex-1 no-underline text-center !text-gray-900"
                style={{ textDecoration: "none" }}
              >
                <strong className="!text-[#7B2227]">
                  {profileData.followers_count ?? 0}
                </strong>{" "}
                Followers
              </Link>
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "grey.900",
                cursor: "pointer",
                "&:hover": { color: "white" },
              }}
            >
              <Link
                to={
                  profileData.id ? `/profiles/${profileData.id}/following` : "#"
                } // Link only if ID exists
                className="flex-1 no-underline text-center !text-gray-900"
                style={{ textDecoration: "none" }}
              >
                <strong className="!text-[#7B2227]">
                  {profileData.following_count ?? 0}
                </strong>{" "}
                Following
              </Link>
            </Typography>
          </Box>
        </div>
      </div>

      {/* New section for ITI status / history */}
      {profileData.is_student && profileData.iti_history?.length > 0 && (
        <div className="profile-section iti-history-section">
          <h3>History/Status with ITI</h3>
          {profileData.iti_history.map((entry, index) => (
            <div key={index} className="iti-history-box">
              <p>
                <strong>Program:</strong> {entry.program}
              </p>
              <p>
                <strong>Track:</strong> {entry.track || "N/A"}
              </p>
              <p>
                <strong>Start Date:</strong> {entry.start_date}
              </p>
              <p>
                <strong>Status:</strong> {entry.status}
              </p>
            </div>
          ))}
        </div>
      )}

      {profileData.is_supervisor && (
        <div className="profile-section supervisor-info-section !bg-white">
          <h3 className="!font-bold">Supervisor Role</h3>
          {profileData.department && (
            <div className="supervisor-department !bg-white">
              <span className="badge !bg-white !text-gray-900">
                Department: {profileData.department}
              </span>
            </div>
          )}
          {profileData.supervised_tracks?.length > 0 && (
            <div className="supervised-tracks-box !bg-white">
              <h4 className="!text-[#7A2226] !font-bold">Supervising Tracks</h4>
              <ul className="supervised-tracks-list !text-gray-900 font-bold">
                {profileData.supervised_tracks.map((track, idx) => (
                  <li key={idx}>{track}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      {/* --- Bio --- */}
      {profileData.bio && (
        <div className="profile-section bio-section !bg-white">
          <h3 className="!font-bold">Bio</h3>
          <p className="!text-gray-900">{profileData.bio}</p>
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
