// components/supervisor/ProgramList.js

import React from 'react';

const ProgramList = ({ programs, onSelectProgram }) => {
  const containerStyle = {
    background: '#282828',
    color: 'white',
    paddingTop: '24px',
    padding: '16px',
    borderRadius: '8px',
    width: '300px',
    marginLeft: '100px',
    minHeight: '85vh',
    marginTop: '100px',
  };

  const titleStyle = {
    fontSize: '1.125rem', // text-lg
    fontWeight: '600', // font-semibold
    marginBottom: '16px',
  };

  const listItemStyle = {
    padding: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.5s ease',
    background: '#282828',
  };

  const hoverStyle = {
    color: '#333',
    background: '#7a2226',
  };

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>Programs</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {programs.map((program) => (
          <li
            key={program.id}
            onClick={() => onSelectProgram(program)}
            style={listItemStyle}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, listItemStyle)}
          >
            {program.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProgramList;
