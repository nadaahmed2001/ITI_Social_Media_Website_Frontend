import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom'; 
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'; 
import './EmailChangeFailed.css'; 

function EmailChangeFailed() {
  const location = useLocation(); // Hook to get location object
  const [failureReason, setFailureReason] = useState('An unknown error occurred.');

  useEffect(() => {
    // Parse query parameters when component mounts
    const searchParams = new URLSearchParams(location.search);
    const reason = searchParams.get('reason'); // Get 'reason' parameter

    if (reason === 'expired') {
      setFailureReason('The email confirmation link has expired. Please try changing your email again.');
    } else if (reason === 'invalid') {
      setFailureReason('The email confirmation link is invalid or has already been used.');
    } else {
      setFailureReason('Something went wrong while trying to confirm your email change.');
    }
  }, [location.search]); // Re-run if the search query changes

  return (
    <div className="email-confirm-container">
      <div className="email-confirm-box failure">
        <ErrorOutlineIcon className="failure-icon" /> 
        <h2>Email Change Failed</h2>
        <p>{failureReason}</p> 
        <p>
            Please return to your profile settings to initiate the process again or contact support if the problem persists.
        </p>
        <Link to="/profile" className="failure-link-button"> 
            Go to Profile Settings
        </Link>
      </div>
    </div>
  );
}

export default EmailChangeFailed;