// components/supervisor/ProgramList.js

import React from 'react';

const ProgramList = ({ programs, onSelectProgram }) => {
  return (
    <div className="program-list">
      <h3>Programs</h3>
      <ul>
        {programs.map(program => (
          <li key={program.id} onClick={() => onSelectProgram(program)}>
            {program.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProgramList;
