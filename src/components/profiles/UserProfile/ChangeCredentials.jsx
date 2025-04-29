import React, { useState } from 'react';
import { changeEmail, changePassword } from '../../services/api';
import EmailIcon from '@mui/icons-material/Email';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import './ChangeCredentials.css';

const ChangeCredentials = () => {
  const [emailData, setEmailData] = useState({
    newEmail: '',
    confirmEmail: '',
    currentPassword: '' 
  });
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');

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
    setEmailError('');
    setEmailSuccess('');
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    setPasswordError('');
    setPasswordSuccess('');
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setEmailSuccess('');

    // Frontend Validations
    if (emailData.newEmail !== emailData.confirmEmail) {
      setEmailError('New emails do not match.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(emailData.newEmail)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    // Check if current password was entered for email change
    if (!emailData.currentPassword) {
        setEmailError('Please enter your current password to change email.');
        return;
    }

    setIsEmailLoading(true);

    const payload = {
        new_email: emailData.newEmail,
        confirm_new_email: emailData.confirmEmail,
        current_password: emailData.currentPassword // Send password from email form state
    };

    try {
      await changeEmail(payload); // Send the correct payload
      setEmailSuccess('Email Confirmation Link Sent. Please check your inbox!'); 
      // Clear form including the password field used for verification
      setEmailData({ newEmail: '', confirmEmail: '', currentPassword: '' });
    } catch (err) {
      console.error("Email change error:", err.response?.data || err.message);
      // Display specific errors from backend if available
      const errors = err.response?.data;
      let errorMessage = 'Failed to change email.';
      if (typeof errors === 'object' && errors !== null) {
          // Handle potential field errors or just show detail if present
          errorMessage = errors.detail || errors.new_email?.[0] || errors.current_password?.[0] || errors.confirm_new_email?.[0] || 'An error occurred.';
      } else if (typeof errors === 'string') {
          errorMessage = errors;
      }
      setEmailError(errorMessage);
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
    if (passwordData.newPassword.length < 8) { 
        setPasswordError('New password must be at least 8 characters long.');
        return;
    }
    if (passwordData.newPassword === passwordData.currentPassword) {
        setPasswordError('New password cannot be the same as the current password.');
        return;
    }


    setIsPasswordLoading(true);
    try {
      await changePassword({
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
        confirm_new_password: passwordData.confirmNewPassword, 
      });
      setPasswordSuccess('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      // ERROR LOGGING & HANDLING 
      console.error("Password change raw error:", err); 
      console.error("Password change backend response data:", err.response?.data); 

      const errors = err.response?.data;
      let errorMessage = 'Failed to change password.';

      if (typeof errors === 'object' && errors !== null) {
          // Extract specific field errors or non-field errors or detail
          const fieldErrors = [
              errors.current_password?.[0],
              errors.new_password?.[0],
              errors.confirm_new_password?.[0],
              errors.non_field_errors?.[0], // DRF often uses this
              errors.detail
          ].filter(Boolean); // Get the first available error message

          if (fieldErrors.length > 0) {
              errorMessage = fieldErrors[0]; 
          } else {
              // Fallback if structure is unexpected
              errorMessage = JSON.stringify(errors);
          }
      } else if (typeof errors === 'string') {
          errorMessage = errors;
      }

      setPasswordError(errorMessage); 
    } finally {
      setIsPasswordLoading(false);
    }
  };
  // --- Render Helper ---
  const renderInput = (form, name, label, type = 'text', handler, value, disabled, required = true) => ( 
    <div className="form-group">
      <label htmlFor={`${form}-${name}`}>{label}{required ? ' *' : ''}</label> 
      <input
        type={type}
        id={`${form}-${name}`}
        name={name} 
        value={value}
        onChange={handler}
        required={required} 
        disabled={disabled}
        
      />
    </div>
  );

  return (
    <div className="change-credentials-container section-container">
      <h2><VpnKeyIcon className='text-[#7a2226]' /> <span className='text-gray-900'>Change Email / Password</span></h2>

      {/* --- Change Email Form --- */}
      <form onSubmit={handleEmailSubmit} className="form-section">
        <h3><EmailIcon fontSize="small"/> Change Email Address</h3>
        {emailError && <p className="error-message">{emailError}</p>}
        {emailSuccess && <p className="success-message">{emailSuccess}</p>}

        {renderInput('email', 'newEmail', 'New Email Address', 'email', handleEmailChange, emailData.newEmail, isEmailLoading)}
        {renderInput('email', 'confirmEmail', 'Confirm New Email Address', 'email', handleEmailChange, emailData.confirmEmail, isEmailLoading)}
        {renderInput('email', 'currentPassword', 'Current Password', 'password', handleEmailChange, emailData.currentPassword, isEmailLoading)}

        <button type="submit" className=" bg-red-900 hover:!bg-red-800 text-white font-semibold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled={isEmailLoading}>
          {isEmailLoading ? 'Updating Email...' : 'Update Email'}
        </button>
        
      </form>

      <form onSubmit={handlePasswordSubmit} className="form-section">
        <h3><VpnKeyIcon fontSize="small"/> Change Password</h3>
        {passwordError && <p className="error-message">{passwordError}</p>}
        {passwordSuccess && <p className="success-message">{passwordSuccess}</p>}

        {renderInput('password', 'currentPassword', 'Current Password', 'password', handlePasswordChange, passwordData.currentPassword, isPasswordLoading)}
        {renderInput('password', 'newPassword', 'New Password', 'password', handlePasswordChange, passwordData.newPassword, isPasswordLoading)}
        {renderInput('password', 'confirmNewPassword', 'Confirm New Password', 'password', handlePasswordChange, passwordData.confirmNewPassword, isPasswordLoading)}

        <button type="submit" className="submit-button bg-red-900 hover:!bg-red-800 !text-white font-semibold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled={isPasswordLoading}>
          {isPasswordLoading ? 'Updating Password...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
};

export default ChangeCredentials;