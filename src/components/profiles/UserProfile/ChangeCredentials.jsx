// src/components/UserProfile/ChangeCredentials.js
import React, { useState } from 'react';
import { changeEmail, changePassword } from '../../../services/api'; // Assuming these exist in api.js
import EmailIcon from '@mui/icons-material/Email';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import './ChangeCredentials.css'; // We will create this CSS file

const ChangeCredentials = () => {
  // Email State
  const [emailData, setEmailData] = useState({ newEmail: '', confirmEmail: '' });
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // --- Handlers ---

  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailData(prev => ({ ...prev, [name]: value }));
    setEmailError(''); // Clear error on change
    setEmailSuccess(''); // Clear success on change
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    setPasswordError(''); // Clear error on change
    setPasswordSuccess(''); // Clear success on change
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setEmailSuccess('');

    if (emailData.newEmail !== emailData.confirmEmail) {
      setEmailError('New emails do not match.');
      return;
    }
    // Basic email format check (consider a more robust library if needed)
    if (!/\S+@\S+\.\S+/.test(emailData.newEmail)) {
       setEmailError('Please enter a valid email address.');
       return;
    }


    setIsEmailLoading(true);
    try {
      // !! Assumes backend endpoint '/api/users/change-email/' exists
      // !! Backend should verify user (e.g., require password or send confirmation link)
      await changeEmail({ email: emailData.newEmail });
      setEmailSuccess('Email change request initiated. Please check your inbox if confirmation is required.'); // Adjust message based on backend flow
      setEmailData({ newEmail: '', confirmEmail: '' }); // Clear form
    } catch (err) {
      console.error("Email change error:", err.response?.data || err.message);
      setEmailError(err.response?.data?.detail || err.response?.data?.email?.[0] || 'Failed to change email.');
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!passwordData.currentPassword) {
        setPasswordError('Current password is required.');
        return;
    }
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    if (passwordData.newPassword.length < 8) { // Example: Basic length check
        setPasswordError('New password must be at least 8 characters long.');
        return;
    }
     if (passwordData.newPassword === passwordData.currentPassword) {
        setPasswordError('New password cannot be the same as the current password.');
        return;
    }


    setIsPasswordLoading(true);
    try {
       // !! Assumes backend endpoint '/api/users/change-password/' exists
      await changePassword({
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
      });
      setPasswordSuccess('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' }); // Clear form
    } catch (err) {
      console.error("Password change error:", err.response?.data || err.message);
      // Provide specific feedback if possible (e.g., incorrect current password)
      const errorDetail = err.response?.data?.detail || err.response?.data?.current_password?.[0] || err.response?.data?.new_password?.[0];
      setPasswordError(errorDetail || 'Failed to change password.');
    } finally {
      setIsPasswordLoading(false);
    }
  };

  // --- Render Helper ---
   const renderInput = (form, name, label, type = 'text', handler, value, disabled) => (
    <div className="form-group">
      <label htmlFor={`${form}-${name}`}>{label}</label>
      <input
        type={type}
        id={`${form}-${name}`}
        name={name}
        value={value}
        onChange={handler}
        required // Add basic required validation
        disabled={disabled}
      />
    </div>
  );


  return (
    <div className="change-credentials-container section-container">
      <h2><VpnKeyIcon /> Change Email / Password</h2>

      {/* --- Change Email Form --- */}
      <form onSubmit={handleEmailSubmit} className="form-section">
        <h3><EmailIcon fontSize="small"/> Change Email Address</h3>
        {emailError && <p className="error-message">{emailError}</p>}
        {emailSuccess && <p className="success-message">{emailSuccess}</p>}

        {renderInput('email', 'newEmail', 'New Email Address', 'email', handleEmailChange, emailData.newEmail, isEmailLoading)}
        {renderInput('email', 'confirmEmail', 'Confirm New Email Address', 'email', handleEmailChange, emailData.confirmEmail, isEmailLoading)}

        {/* Optional: Add current password field if backend requires it for email change */}
        {/* renderInput('email', 'currentPasswordForEmail', 'Current Password', 'password', handleEmailChange, emailData.currentPasswordForEmail, isEmailLoading) */}


        <button type="submit" className="submit-button" disabled={isEmailLoading}>
          {isEmailLoading ? 'Updating Email...' : 'Update Email'}
        </button>
        <p className="form-note">Note: Changing your email might require confirmation via your new email address.</p>
      </form>

      {/* --- Change Password Form --- */}
      <form onSubmit={handlePasswordSubmit} className="form-section">
        <h3><VpnKeyIcon fontSize="small"/> Change Password</h3>
         {passwordError && <p className="error-message">{passwordError}</p>}
         {passwordSuccess && <p className="success-message">{passwordSuccess}</p>}

        {renderInput('password', 'currentPassword', 'Current Password', 'password', handlePasswordChange, passwordData.currentPassword, isPasswordLoading)}
        {renderInput('password', 'newPassword', 'New Password', 'password', handlePasswordChange, passwordData.newPassword, isPasswordLoading)}
        {renderInput('password', 'confirmNewPassword', 'Confirm New Password', 'password', handlePasswordChange, passwordData.confirmNewPassword, isPasswordLoading)}


        <button type="submit" className="submit-button" disabled={isPasswordLoading}>
          {isPasswordLoading ? 'Updating Password...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
};

export default ChangeCredentials;