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
      const response = await fetch("http://127.0.0.1:8000/api/users/password-reset-confirm/", {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <Typography
      variant="h5"
      className="text-2xl font-bold mb-8 text-center"
    >
      ITI Hub
    </Typography>

    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
      <Typography
        variant="h4"
        className="text-3xl font-semibold mb-6 text-center"
      >
        Reset Your Password
      </Typography>

      {message && <Typography color="error">{message}</Typography>}
      {passwordError && <Typography color="error">{passwordError}</Typography>}

      <form className="mb-4" onSubmit={handleSubmit}>
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="resetCode"
        >
          Reset Code
        </label>
        <TextField
          fullWidth
          type="text"
          variant="outlined"
          className="mb-4"
          value={resetCode}
          onChange={(e) => setResetCode(e.target.value)}
          required
        />

        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="newPassword"
        >
          New Password
        </label>
        <TextField
          fullWidth
          type="password"
          variant="outlined"
          className="mb-4"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="confirmPassword"
        >
          Confirm Password
        </label>
        <TextField
          fullWidth
          type="password"
          variant="outlined"
          className="mb-4"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <Button
          variant="contained"
          fullWidth
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </div>

    <footer className="text-center mt-8 text-gray-500 text-xs">
      Copyright@2025
    </footer>
  </div>
  );
};

export default PasswordResetConfirm;
