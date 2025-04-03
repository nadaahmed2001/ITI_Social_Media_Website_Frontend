import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const PasswordResetConfirm = () => {
  const [resetCode, setResetCode] = useState("");  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [message, setMessage] = useState("");
  const [passwordError, setPasswordError] = useState(""); 
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      return;
    }

    if (!/\d/.test(newPassword) || !/[a-zA-Z]/.test(newPassword)) {
      setPasswordError("Password must contain letters and numbers.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setPasswordError(""); 
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/users/password-reset-confirm/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reset_code: resetCode, new_password: newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Password reset successfully! Redirecting to login...");
        navigate("/login"); 
      } else {
        setMessage(data.error || "Failed to reset password.");
      }
    } catch (err) {
      setMessage("An error occurred, please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <Typography variant="h5" className="auth-logo">ITI Hub</Typography>

      <div className="auth-box">
        <Typography variant="h4" className="auth-title">Reset Your Password</Typography>

        {message && <Typography color="error">{message}</Typography>}
        {passwordError && <Typography color="error">{passwordError}</Typography>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label">Reset Code</label>
          <TextField
            fullWidth
            type="text"
            variant="outlined"
            className="auth-input"
            value={resetCode}
            onChange={(e) => setResetCode(e.target.value)}
            required
          />

          <label className="auth-label">New Password</label>
          <TextField
            fullWidth
            type="password"
            variant="outlined"
            className="auth-input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <label className="auth-label">Confirm Password</label>
          <TextField
            fullWidth
            type="password"
            variant="outlined"
            className="auth-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button variant="contained" fullWidth className="auth-button" type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </div>

      <footer className="auth-footer-text">
        Copyright@2025
      </footer>
    </div>
  );
};

export default PasswordResetConfirm;
