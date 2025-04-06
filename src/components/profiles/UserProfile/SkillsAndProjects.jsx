// src/components/UserProfile/SkillsAndProjects.jsx
import React from 'react';
import BuildIcon from '@mui/icons-material/Build';
import SkillsManagement from './SkillsManagement';
import ProjectsManagement from './ProjectsManagement'; // Import the placeholder
import './SkillsAndProjects.css'; // Create this CSS file

const SkillsAndProjects = ({ profileId }) => {
  return (
    <div className="skills-projects-container section-container">
      <h2><BuildIcon /> Skills & Projects</h2>

      {/* Render Skills Management Section */}
      <SkillsManagement profileId={profileId} />

      {/* Render Projects Management Section */}
      <ProjectsManagement profileId={profileId} />
    </div>
  );
};

export default SkillsAndProjects;