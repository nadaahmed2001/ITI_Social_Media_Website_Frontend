// src/components/UserProfile/PrivacySecuritySettings.jsx
import React, { useState, useEffect } from 'react';
import { updateAccount } from '../../../services/api'; // Adjust path

// Import Heroicons
import { ShieldCheckIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import CircularProgress from '@mui/material/CircularProgress'; // Keep spinner from MUI

// --- Custom Tailwind CSS Toggle Switch (No internal label) ---
const ToggleSwitch = ({ id, checked, onChange, disabled }) => {
  return (
    <div className="relative inline-block"> {/* Position relative for absolute dot */}
      <input
        type="checkbox"
        id={id}
        className="sr-only peer" // Hide default, use peer state
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      {/* Track */}
      <div className={`block w-12 h-7 rounded-full transition duration-200 ease-in-out cursor-pointer ${
          disabled ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-300 peer-checked:bg-primary-600' // Grey track -> Purple track
          }`}>
      </div>
      {/* Thumb */}
      <div className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform duration-200 ease-in-out shadow ${
          checked ? 'translate-x-5' : '' // Move thumb right when checked
          } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
      </div>
    </div>
  );
};
// --- End ToggleSwitch ---


const PrivacySecuritySettings = ({ userData, onUpdateUserData }) => {
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (userData) {
      setIsTwoFactorEnabled(userData.is_two_factor_enabled || false);
    }
  }, [userData]);

  const handleToggleChange = async (event) => {
    const newEnabledState = event.target.checked;
    setIsLoading(true); setError(''); setSuccess('');
    try {
      const response = await updateAccount({ is_two_factor_enabled: newEnabledState });
      const confirmedState = response.data.is_two_factor_enabled;
      setIsTwoFactorEnabled(confirmedState);
      if (onUpdateUserData) { onUpdateUserData(response.data); }
      setSuccess(`Two-Factor Authentication ${confirmedState ? 'Enabled' : 'Disabled'}.`);
    } catch (err) {
      console.error("Failed 2FA update:", err); setError("Failed setting update.");
      setIsTwoFactorEnabled(!newEnabledState); // Revert
    } finally { setIsLoading(false); }
  };

  if (!userData) {
    return <div className="p-6 text-center text-gray-500">Loading settings...</div>;
  }

  return (
    // Main Container - Light theme
    <div className="p-6 md:p-8 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-900">
      {/* Section Header */}
      <h2 className="flex items-center text-xl font-semibold font-title text-gray-800 mb-6 pb-3 border-b border-gray-200">
        <ShieldCheckIcon className="w-6 h-6 mr-2 text-primary-600" /> {/* Purple icon */}
        Account Security
      </h2>

      {/* Messages */}
      {error && <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md">{error}</div>}
      {success && <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 border border-green-300 rounded-md">{success}</div>}

      {/* 2FA Section */}
      <div className="setting-section bg-gray-50 p-5 rounded-md border border-gray-200"> {/* Lighter BG for section */}
        <h3 className="text-lg font-medium text-gray-800 mb-1">
          Two-Factor Authentication (2FA)
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Enhance security by requiring an OTP sent to your email ({userData.email || 'Not Set'}) during login.
        </p>

        {/* Warning if no email */}
        {!userData.email && (
             <div className="mb-4 p-3 text-sm text-yellow-800 bg-yellow-50 border border-yellow-300 rounded-md flex items-start gap-2">
                 <InformationCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5 text-yellow-500"/>
                 <span>Please add an email address via 'Edit Profile' to enable Two-Factor Authentication.</span>
             </div>
        )}

        {/* Toggle control and Status Badge Row */}
        <div className="flex items-center justify-between mt-2"> {/* Use flex justify-between */}
            <label htmlFor="twoFactorToggle" className="text-sm font-medium text-gray-700 cursor-pointer pr-4"> {/* Label for the toggle */}
                Email OTP Status
            </label>
            <div className="flex items-center gap-3"> {/* Group toggle, badge, spinner */}
                <ToggleSwitch
                    id="twoFactorToggle"
                    checked={isTwoFactorEnabled}
                    onChange={handleToggleChange}
                    disabled={isLoading || !userData.email}
                />
                {/* Status Badge */}
                <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${
                    isTwoFactorEnabled
                    ? 'bg-green-100 text-green-800' // Enabled style
                    : 'bg-gray-200 text-gray-800'   // Disabled style
                }`}>
                    {isTwoFactorEnabled ? 'Enabled' : 'Disabled'}
                </span>
                {/* Show spinner */}
                {isLoading && <CircularProgress size={20} thickness={5} sx={{ color: 'primary.main' }} />}
            </div>
        </div>
      </div>

      {/* Add other sections similarly */}
    </div> // End main container
  );
};

export default PrivacySecuritySettings;