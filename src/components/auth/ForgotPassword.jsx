import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Email is required"),
  });

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setMessage("");

      try {
        const response = await fetch("http://127.0.0.1:8000/users/password-reset/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (response.ok) {
          setMessage("Password reset code sent to your email, please check your inbox.");
          setTimeout(() => navigate("/password-reset-confirm"), 2000); 
        } else {
          setMessage(data.detail || "Failed to send reset code.");
        }
      } catch (err) {
        setMessage("An error occurred, please try again.");
      }

      setLoading(false);
    },
  });

  return (
    <div className="auth-container">
      <Typography variant="h5" className="auth-logo">ITI Hub</Typography>

      <div className="auth-box">
        <Typography variant="h4" className="auth-title">Forgot Password</Typography>

        {message && <Typography color="error">{message}</Typography>}

        <form className="auth-form" onSubmit={formik.handleSubmit}>
          <label className="auth-label">Email Address</label>
          <TextField
            fullWidth
            variant="outlined"
            className="auth-input"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            required
          />

          <Button variant="contained" fullWidth className="auth-button" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Code"}
          </Button>
        </form>
      </div>

      <footer className="auth-footer-text">
        Copyright@2025
      </footer>
    </div>
  );
};

export default ForgotPassword;
