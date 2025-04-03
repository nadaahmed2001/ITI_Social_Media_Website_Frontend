import React from 'react';
import { Link } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; 
import './EmailChangeSuccess.css'; 

function EmailChangeSuccess() {
    return (
        <div className="email-confirm-container">
            <div className="email-confirm-box">
            <CheckCircleOutlineIcon className="success-icon" />
            <h2>Email Changed Successfully!</h2>
            <p>Your email address has been updated.</p>
            <p>You can now use your new email address to log in.</p>
            <Link to="/profile" className="success-link-button"> 
                Go to Profile
            </Link>
            </div>
        </div>
    );
}

export default EmailChangeSuccess;