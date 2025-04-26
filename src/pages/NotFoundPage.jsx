// src/pages/NotFoundPage.jsx (Example file path)
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      {/* Optional: SVG Illustration */}
      <svg
        className="w-32 h-32 text-red-500 mb-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5} // Thinner stroke
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 14a.5.5 0 01.5-.5h5a.5.5 0 010 1h-5a.5.5 0 01-.5-.5z" // Simple "confused face"
        />
         {/* Question Mark */}
         <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 6v.01M12 10a2 2 0 100 4 2 2 0 000-4z"
            transform="translate(0 -1)" // Move question mark up slightly
         />
      </svg>

      <h1 className="text-4xl md:text-6xl font-bold text-red-500 mb-4">
        404
      </h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-300 mb-3">
        Page Not Found
      </h2>
      <p className="text-md md:text-lg text-gray-400 mb-8 text-center max-w-md">
        Oops! Looks like the page you were searching for has vanished into the digital void.
      </p>
      <Link
        to="/Home" // Link to your homepage route
        className="px-6 py-3 bg-[#7a2226] text-white font-semibold rounded-lg shadow-md hover:bg-[#5a181b] transition-colors duration-200 ease-in-out text-decoration-none" // Added text-decoration-none
      >
        Go Back Home
      </Link>
    </div>
  );
}

export default NotFoundPage;
