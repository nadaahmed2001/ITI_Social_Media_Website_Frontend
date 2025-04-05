// src/components/UserProfile/SkillsAndProjects.jsx (Adjust path)
import React from 'react';
import SkillsManagement from './SkillsManagement'; // Import Tailwind version
import ProjectsManagement from './ProjectsManagement'; // Import Tailwind version
import { WrenchScrewdriverIcon } from '@heroicons/react/24/outline'; // Example icon

const SkillsAndProjects = ({ profileId }) => {
  return (
    // Main container for this section - Use theme background implicitly or set bg-white
    <div className="skills-projects-container space-y-8"> {/* Add vertical space */}
      {/* Section Header */}
      <h2 className="flex items-center text-xl font-semibold font-title text-gray-800 pb-3 border-b border-gray-200">
          <WrenchScrewdriverIcon className="w-6 h-6 mr-2 text-primary-600"/> {/* Use theme primary color */}
           Skills & Projects
      </h2>

      {/* Render Skills Management Section */}
      {/* Pass profileId if needed by SkillAPI, though often it uses logged-in user context */}
      <SkillsManagement profileId={profileId} />

      {/* Render Projects Management Section */}
      <ProjectsManagement profileId={profileId} />
    </div>
  );
};

export default SkillsAndProjects;