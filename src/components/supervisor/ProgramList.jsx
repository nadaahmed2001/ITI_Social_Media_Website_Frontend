// components/supervisor/ProgramList.js

import React from 'react';

const ProgramList = ({ programs, onSelectProgram }) => {
  return (
    <div className="bg-[#7B2326] text-white pt-6 p-4 rounded-md">
       <h3 className="text-lg font-semibold mb-4">Programs</h3>
       <ul>
        {programs.map(program => (
          <li key={program.id} onClick={() => onSelectProgram(program)} className="cursor-pointer hover:underline" >
            {program.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProgramList;
