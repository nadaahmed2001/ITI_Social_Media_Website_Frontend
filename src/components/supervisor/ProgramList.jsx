//ProgramList.js
import React from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


const ProgramList = ({ programs, onSelectProgram }) => {
  const containerStyle = {
    background: '#fbfbfb',
    color: 'white',
    paddingTop: '24px',
    padding: '16px',
    width: '60%',
    // height: '50%',
    marginLeft: '100px',
    minHeight: '75vh',
    marginTop: '20px',
    border: '1px solid #e8d9db',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '13px',

  };

  const titleStyle = {
    fontSize: '2.125rem', // text-lg
    fontWeight: '600', // font-semibold
    marginBottom: '16px',
    color: '#464646',
  };

  const listItemStyle = {
    padding: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.5s ease',
    background: '#f9f9f9',
    color: '#464646',
    fontSize: '1.125rem',
    fontWeight: '300',
  };

  const hoverStyle = {
    color: '#7a2226',
    background: '#ffe5e5',
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
            <ArrowForwardIcon sx={{ color: '#464646', marginLeft: '50px' }} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProgramList;
