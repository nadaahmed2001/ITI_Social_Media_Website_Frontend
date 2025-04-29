import React from 'react';

const CustomCircularProgress = () => {
  return (
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        backgroundColor: '#292928', // solid background
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 44 44"
        xmlns="http://www.w3.org/2000/svg"
        stroke="#7a2226"
      >
        <g fill="none" fillRule="evenodd" strokeWidth="4">
          <circle cx="22" cy="22" r="20" strokeOpacity=".2" />
          <path d="M36 22c0-7.732-6.268-14-14-14">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 22 22"
              to="360 22 22"
              dur="1s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      </svg>
    </div>
  );
};

export default CustomCircularProgress;
