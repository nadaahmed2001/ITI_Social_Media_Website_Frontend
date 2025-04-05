// import React, { useState } from 'react';
// import { changeEmail, changePassword } from '../../../services/api';
// import EmailIcon from '@mui/icons-material/Email';
// import VpnKeyIcon from '@mui/icons-material/VpnKey';
// import './ChangeCredentials.css';

// const ChangeCredentials = () => {
//   const [emailData, setEmailData] = useState({
//     newEmail: '',
//     confirmEmail: '',
//     currentPassword: '' 
//   });
//   const [isEmailLoading, setIsEmailLoading] = useState(false);
//   const [emailError, setEmailError] = useState('');
//   const [emailSuccess, setEmailSuccess] = useState('');

//   const [passwordData, setPasswordData] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmNewPassword: '',
//   });
//   const [isPasswordLoading, setIsPasswordLoading] = useState(false);
//   const [passwordError, setPasswordError] = useState('');
//   const [passwordSuccess, setPasswordSuccess] = useState('');

//   // --- Handlers ---

//   const handleEmailChange = (e) => {
//     const { name, value } = e.target;
//     setEmailData(prev => ({ ...prev, [name]: value }));
//     setEmailError('');
//     setEmailSuccess('');
//   };

//   const handlePasswordChange = (e) => {
//     const { name, value } = e.target;
//     setPasswordData(prev => ({ ...prev, [name]: value }));
//     setPasswordError('');
//     setPasswordSuccess('');
//   };

//   const handleEmailSubmit = async (e) => {
//     e.preventDefault();
//     setEmailError('');
//     setEmailSuccess('');

//     // Frontend Validations
//     if (emailData.newEmail !== emailData.confirmEmail) {
//       setEmailError('New emails do not match.');
//       return;
//     }
//     if (!/\S+@\S+\.\S+/.test(emailData.newEmail)) {
//       setEmailError('Please enter a valid email address.');
//       return;
//     }
//     // Check if current password was entered for email change
//     if (!emailData.currentPassword) {
//         setEmailError('Please enter your current password to change email.');
//         return;
//     }

//     setIsEmailLoading(true);

//     const payload = {
//         new_email: emailData.newEmail,
//         confirm_new_email: emailData.confirmEmail,
//         current_password: emailData.currentPassword // Send password from email form state
//     };

//     try {
//       await changeEmail(payload); // Send the correct payload
//       setEmailSuccess('Email Confirmation Link Sent. Please check your inbox!'); 
//       // Clear form including the password field used for verification
//       setEmailData({ newEmail: '', confirmEmail: '', currentPassword: '' });
//     } catch (err) {
//       console.error("Email change error:", err.response?.data || err.message);
//       // Display specific errors from backend if available
//       const errors = err.response?.data;
//       let errorMessage = 'Failed to change email.';
//       if (typeof errors === 'object' && errors !== null) {
//           // Handle potential field errors or just show detail if present
//           errorMessage = errors.detail || errors.new_email?.[0] || errors.current_password?.[0] || errors.confirm_new_email?.[0] || 'An error occurred.';
//       } else if (typeof errors === 'string') {
//           errorMessage = errors;
//       }
//       setEmailError(errorMessage);
//     } finally {
//       setIsEmailLoading(false);
//     }
//   };

//   const handlePasswordSubmit = async (e) => {
//     e.preventDefault();
//     setPasswordError('');
//     setPasswordSuccess('');

//     if (!passwordData.currentPassword) {
//         setPasswordError('Current password is required.');
//         return;
//     }
//     if (passwordData.newPassword !== passwordData.confirmNewPassword) {
//       setPasswordError('New passwords do not match.');
//       return;
//     }
//     if (passwordData.newPassword.length < 8) { 
//         setPasswordError('New password must be at least 8 characters long.');
//         return;
//     }
//     if (passwordData.newPassword === passwordData.currentPassword) {
//         setPasswordError('New password cannot be the same as the current password.');
//         return;
//     }


//     setIsPasswordLoading(true);
//     try {
//       await changePassword({
//         current_password: passwordData.currentPassword,
//         new_password: passwordData.newPassword,
//         confirm_new_password: passwordData.confirmNewPassword, 
//       });
//       setPasswordSuccess('Password changed successfully!');
//       setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
//     } catch (err) {
//       // ERROR LOGGING & HANDLING 
//       console.error("Password change raw error:", err); 
//       console.error("Password change backend response data:", err.response?.data); 

//       const errors = err.response?.data;
//       let errorMessage = 'Failed to change password.';

//       if (typeof errors === 'object' && errors !== null) {
//           // Extract specific field errors or non-field errors or detail
//           const fieldErrors = [
//               errors.current_password?.[0],
//               errors.new_password?.[0],
//               errors.confirm_new_password?.[0],
//               errors.non_field_errors?.[0], // DRF often uses this
//               errors.detail
//           ].filter(Boolean); // Get the first available error message

//           if (fieldErrors.length > 0) {
//               errorMessage = fieldErrors[0]; 
//           } else {
//               // Fallback if structure is unexpected
//               errorMessage = JSON.stringify(errors);
//           }
//       } else if (typeof errors === 'string') {
//           errorMessage = errors;
//       }

//       setPasswordError(errorMessage); 
//     } finally {
//       setIsPasswordLoading(false);
//     }
//   };
//   // --- Render Helper ---
//   const renderInput = (form, name, label, type = 'text', handler, value, disabled, required = true) => ( 
//     <div className="form-group">
//       <label htmlFor={`${form}-${name}`}>{label}{required ? ' *' : ''}</label> 
//       <input
//         type={type}
//         id={`${form}-${name}`}
//         name={name} 
//         value={value}
//         onChange={handler}
//         required={required} 
//         disabled={disabled}
//       />
//     </div>
//   );

//   return (
//     <div className="change-credentials-container section-container">
//       <h2><VpnKeyIcon /> Change Email / Password</h2>

//       {/* --- Change Email Form --- */}
//       <form onSubmit={handleEmailSubmit} className="form-section">
//         <h3><EmailIcon fontSize="small"/> Change Email Address</h3>
//         {emailError && <p className="error-message">{emailError}</p>}
//         {emailSuccess && <p className="success-message">{emailSuccess}</p>}

//         {renderInput('email', 'newEmail', 'New Email Address', 'email', handleEmailChange, emailData.newEmail, isEmailLoading)}
//         {renderInput('email', 'confirmEmail', 'Confirm New Email Address', 'email', handleEmailChange, emailData.confirmEmail, isEmailLoading)}
//         {renderInput('email', 'currentPassword', 'Current Password', 'password', handleEmailChange, emailData.currentPassword, isEmailLoading)}

//         <button type="submit" className="submit-button" disabled={isEmailLoading}>
//           {isEmailLoading ? 'Updating Email...' : 'Update Email'}
//         </button>
        
//       </form>

//       <form onSubmit={handlePasswordSubmit} className="form-section">
//         <h3><VpnKeyIcon fontSize="small"/> Change Password</h3>
//         {passwordError && <p className="error-message">{passwordError}</p>}
//         {passwordSuccess && <p className="success-message">{passwordSuccess}</p>}

//         {renderInput('password', 'currentPassword', 'Current Password', 'password', handlePasswordChange, passwordData.currentPassword, isPasswordLoading)}
//         {renderInput('password', 'newPassword', 'New Password', 'password', handlePasswordChange, passwordData.newPassword, isPasswordLoading)}
//         {renderInput('password', 'confirmNewPassword', 'Confirm New Password', 'password', handlePasswordChange, passwordData.confirmNewPassword, isPasswordLoading)}

//         <button type="submit" className="submit-button" disabled={isPasswordLoading}>
//           {isPasswordLoading ? 'Updating Password...' : 'Update Password'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ChangeCredentials;

// src/components/UserProfile/ChangeCredentials.jsx (Adjust path)
import React, { useState } from 'react';
import { changeEmail, changePassword } from '../../../services/api'; // Adjust path

// Import Heroicons
import { KeyIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

// --- Reusable Tailwind Input Field Component ---
// (You can extract this to a separate file if used elsewhere)
const InputField = ({ id, name, label, type = 'text', value, onChange, error, disabled, required, autoComplete }) => (
  <div>
    <label htmlFor={id || name} className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      id={id || name}
      name={name}
      value={value || ''}
      onChange={onChange}
      disabled={disabled}
      required={required}
      autoComplete={autoComplete || 'off'}
      className={`block w-full border ${
        error ? 'border-red-400' : 'border-gray-300'
      } rounded-md shadow-sm px-3 py-2 text-sm text-gray-900 placeholder-gray-400 bg-white
         focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500 focus:border-primary-500
         disabled:opacity-60 disabled:bg-gray-100 transition duration-150 ease-in-out`}
    />
    {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
  </div>
);
// --- End InputField ---

const ChangeCredentials = () => {
  // --- State Variables (Keep Existing) ---
  const [emailData, setEmailData] = useState({ newEmail: '', confirmEmail: '', currentPassword: '' });
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');

  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  // --- End State ---

  // --- Handlers (Keep Existing Logic) ---
  const handleEmailChange = (e) => {
    const { name, value } = e.target; setEmailData(prev => ({ ...prev, [name]: value })); setEmailError(''); setEmailSuccess('');
  };
  const handlePasswordChange = (e) => {
    const { name, value } = e.target; setPasswordData(prev => ({ ...prev, [name]: value })); setPasswordError(''); setPasswordSuccess('');
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault(); setEmailError(''); setEmailSuccess('');
    if (emailData.newEmail !== emailData.confirmEmail) { setEmailError('Emails do not match.'); return; }
    if (!/\S+@\S+\.\S+/.test(emailData.newEmail)) { setEmailError('Valid email required.'); return; }
    if (!emailData.currentPassword) { setEmailError('Current password required.'); return; }
    setIsEmailLoading(true);
    const payload = { new_email: emailData.newEmail, confirm_new_email: emailData.confirmEmail, current_password: emailData.currentPassword };
    try {
      await changeEmail(payload); setEmailSuccess('Email update initiated. Check new email for confirmation if required.'); setEmailData({ newEmail: '', confirmEmail: '', currentPassword: '' });
    } catch (err) { console.error("Email change error:", err); const errors = err.response?.data; let msg = 'Failed to change email.'; if(typeof errors === 'object' && errors !== null){msg = errors.detail || errors.new_email?.[0] || errors.current_password?.[0] || 'Invalid input.';} else if (typeof errors === 'string'){msg = errors;} setEmailError(msg); }
    finally { setIsEmailLoading(false); }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault(); setPasswordError(''); setPasswordSuccess('');
    if (!passwordData.currentPassword) { setPasswordError('Current password required.'); return; }
    if (passwordData.newPassword !== passwordData.confirmNewPassword) { setPasswordError('New passwords do not match.'); return; }
    if (passwordData.newPassword.length < 8) { setPasswordError('Password min 8 characters.'); return; }
    if (passwordData.newPassword === passwordData.currentPassword) { setPasswordError('New password must be different.'); return; }
    setIsPasswordLoading(true);
    try {
      await changePassword({ current_password: passwordData.currentPassword, new_password: passwordData.newPassword, confirm_new_password: passwordData.confirmNewPassword }); // Sending confirm too, though backend might ignore
      setPasswordSuccess('Password changed successfully!'); setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) { console.error("Password change error:", err); const errors = err.response?.data; let msg = 'Failed to change password.'; if(typeof errors === 'object' && errors !== null){ msg = errors.detail || errors.current_password?.[0] || errors.new_password?.[0] || errors.non_field_errors?.[0] || 'Invalid input.';} else if (typeof errors === 'string'){ msg = errors; } setPasswordError(msg); }
    finally { setIsPasswordLoading(false); }
  };
  // --- End Handlers ---


  // --- JSX with Tailwind ---
  return (
    // Main Container - Light theme
    <div className="p-6 md:p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header */}
      <h2 className="flex items-center text-xl font-semibold font-title text-gray-800 mb-6 pb-3 border-b border-gray-200">
        <KeyIcon className="w-6 h-6 mr-2 text-primary-600" /> {/* Purple icon */}
        Change Email / Password
      </h2>

      {/* --- Change Email Form --- */}
      <form onSubmit={handleEmailSubmit} className="mb-8 pt-4 border-t border-gray-100"> {/* Added top border */}
        <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center gap-2">
          <EnvelopeIcon className="w-5 h-5 text-primary-600" /> {/* Purple icon */}
           Change Email Address
        </h3>

        {/* Messages */}
        {emailError && <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md">{emailError}</div>}
        {emailSuccess && <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 border border-green-300 rounded-md">{emailSuccess}</div>}

        <div className="space-y-4">
          <InputField
            label="New Email Address" name="newEmail" type="email" required
            value={emailData.newEmail} onChange={handleEmailChange} disabled={isEmailLoading}
            error={emailError && (emailError.includes('match') || emailError.includes('email'))} // Basic error highlight
            autoComplete="email"
           />
          <InputField
             label="Confirm New Email Address" name="confirmEmail" type="email" required
             value={emailData.confirmEmail} onChange={handleEmailChange} disabled={isEmailLoading}
             error={emailError && emailError.includes('match')}
             autoComplete="email"
            />
          <InputField
             label="Current Password (for verification)" name="currentPassword" type="password" required
             value={emailData.currentPassword} onChange={handleEmailChange} disabled={isEmailLoading}
             error={emailError && emailError.includes('password')}
             autoComplete="current-password"
            />
        </div>

        <div className="mt-5 text-right">
          <button
             type="submit"
             className="inline-flex justify-center items-center px-5 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-60 transition duration-150 ease-in-out"
             disabled={isEmailLoading}
          >
             {isEmailLoading ? ( <><svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle><path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor" className="opacity-75"></path></svg>Updating...</> ) : 'Update Email'}
          </button>
        </div>
      </form>

      {/* --- Change Password Form --- */}
      <form onSubmit={handlePasswordSubmit} className="pt-4 border-t border-gray-100">
        <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center gap-2">
          <LockClosedIcon className="w-5 h-5 text-primary-600" /> {/* Purple icon */}
           Change Password
        </h3>

         {/* Messages */}
         {passwordError && <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md">{passwordError}</div>}
         {passwordSuccess && <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 border border-green-300 rounded-md">{passwordSuccess}</div>}

        <div className="space-y-4">
          <InputField
             label="Current Password" name="currentPassword" type="password" required
             value={passwordData.currentPassword} onChange={handlePasswordChange} disabled={isPasswordLoading}
             error={passwordError && passwordError.toLowerCase().includes('current password')}
             autoComplete="current-password"
            />
          <InputField
             label="New Password" name="newPassword" type="password" required
             value={passwordData.newPassword} onChange={handlePasswordChange} disabled={isPasswordLoading}
             error={passwordError && (passwordError.includes('match') || passwordError.includes('same') || passwordError.includes('short') || passwordError.includes('common'))}
             helperText="Minimum 8 characters."
             autoComplete="new-password"
            />
          <InputField
             label="Confirm New Password" name="confirmNewPassword" type="password" required
             value={passwordData.confirmNewPassword} onChange={handlePasswordChange} disabled={isPasswordLoading}
             error={passwordError && passwordError.includes('match')}
             autoComplete="new-password"
             />
        </div>

         <div className="mt-5 text-right">
          <button
             type="submit"
             className="inline-flex justify-center items-center px-5 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-60 transition duration-150 ease-in-out"
             disabled={isPasswordLoading}
          >
            {isPasswordLoading ? ( <><svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" /*...*/ ></svg>Updating...</> ) : 'Update Password'}
          </button>
        </div>
      </form>
    </div> // End container
  );
};

export default ChangeCredentials;