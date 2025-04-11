// src/components/UserProfile/PrivacySecuritySettings.jsx
import React, { useState, useEffect } from 'react';
import { updateAccount } from '../../services/api';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import SecurityIcon from '@mui/icons-material/Security';
import './PrivacySecuritySettings.css';

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
    setIsLoading(true); 
    setError(''); 
    setSuccess('');
    
    try {
        const response = await updateAccount({ is_two_factor_enabled: newEnabledState });
        const confirmedState = response.data.is_two_factor_enabled;
        setIsTwoFactorEnabled(confirmedState);
        if (onUpdateUserData) {
            onUpdateUserData(response.data);
        }
        setSuccess(`Two-Factor Authentication ${confirmedState ? 'enabled' : 'disabled'}. A confirmation email has been sent to ${userData.email}.`);
        } catch (err) {
        console.error("Failed to update 2FA setting:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Failed to update setting. Please try again.");
        setIsTwoFactorEnabled(!newEnabledState);
        } finally { 
        setIsLoading(false); 
        }
    };

    if (!userData) {
        return (
        <Box className="loading-container">
            <CircularProgress className="loading-spinner" />
        </Box>
        );
    }

    return (

    <>{/* Section Header */}
    <div className="privacy-header">
        <SecurityIcon />
        <h2 className="privacy-header-text-container"> 
            Account Security
        </h2>
    </div> 
    
    <Box className="privacy-security-container">
      {/* 2FA Section */}
    <div className="setting-section-header">
        <Typography variant="h6" component="h3" className="setting-title">
        Two-Factor Authentication (2FA)
        </Typography>
        <div className={`setting-status-badge ${isTwoFactorEnabled ? 'enabled' : 'disabled'}`}>
        {isTwoFactorEnabled ? 'Active' : 'Inactive'}
        </div>
    </div>
        
        <Typography variant="body1" className="setting-description">
            Add an extra layer of security to your account. When enabled, you'll need to enter a one-time code sent to your email after logging in with your password.
        </Typography>

        {!userData.email && (
        <Alert severity="warning" className="settings-alert settings-alert-warning">
        <strong>Action required:</strong> Please add and verify an email address in your profile to enable Two-Factor Authentication.
        </Alert>
    )}

    {/* Toggle control */}
            <div className='two-f-auth-toggle-icon'>
            <Switch
            size="large"
            sx={{ 
                width: 60,
                height: 26,
                padding: 0,
                '& .MuiSwitch-switchBase': {
                    padding: 1,
                    '&.Mui-checked': {
                    transform: 'translateX(32px)',
                    },

                },
                '& .MuiSwitch-thumb': {
                    width: 11,  // smaller circle
                    height: 11,
                    
                },
                '& .MuiSwitch-track': {
                    borderRadius: 26 / 2,
                    backgroundColor: 'grey',
                    opacity: 1,
                    
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: 'lightgreen',
                },}}
            checked={isTwoFactorEnabled}
            onChange={handleToggleChange}
            disabled={isLoading || !userData.email}
            />
            </div>
</Box>
</>
);
};

export default PrivacySecuritySettings;