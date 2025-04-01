import React, { useState } from "react";
import { TextField, Button, Typography, CircularProgress } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import "../../assets/styles/auth.css";

const SignUpForm = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    national_id: Yup.string()
      .matches(/^\d{14}$/, "National ID must be 14 digits")
      .required("National ID is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      national_id: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch("http://127.0.0.1:8000/users/register/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (response.ok) {
          navigate("/login");
        } else {
          setErrorMessage(data.detail || "An error occurred");
        }
      } catch (error) {
        setErrorMessage("Network error. Please try again.");
      }
      setLoading(false);
    },
  });

  
  return (
    <div className="auth-container">
      <Typography variant="h5" className="auth-logo">ITI Hub</Typography>

      <div className="auth-box">
        <Typography variant="h4" className="auth-title">Register</Typography>
        <Typography variant="body2" className="register-subtitle">
          To keep connected with us please register to our website
        </Typography>

        {errorMessage && <Typography color="error">{errorMessage}</Typography>}

        <form className="auth-form" onSubmit={formik.handleSubmit}>
          <label className="auth-label">User Name</label>
          <TextField 
            fullWidth 
            variant="outlined" 
            className="auth-input"
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
            required 
          />

          <label className="auth-label">Email</label>
          <TextField 
            fullWidth 
            variant="outlined" 
            className="auth-input" 
            name="email" 
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            required 
          />

          <label className="auth-label">National ID</label>
          <TextField 
            fullWidth 
            variant="outlined" 
            className="auth-input"
            name="national_id"
            value={formik.values.national_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.national_id && Boolean(formik.errors.national_id)}
            helperText={formik.touched.national_id && formik.errors.national_id}
            required 
          />

          <label className="auth-label">Password</label>
          <TextField 
            fullWidth 
            variant="outlined" 
            className="auth-input" 
            name="password" 
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            required 
          />

          <label className="auth-label">Confirm Password</label>
          <TextField 
            fullWidth 
            variant="outlined" 
            className="auth-input"
            name="confirmPassword" 
            type="password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            required 
          />

          <Button 
            variant="contained" 
            fullWidth 
            className="auth-button" 
            type="submit" 
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} style={{ color: "white" }} /> : "Register"}
          </Button>
        </form>

        <Typography variant="body2" className="auth-link">
          <Link to="/login">Already have an account?</Link>
        </Typography>
      </div>

      <footer className="auth-footer-text">
        Copyright@2025
      </footer>
    </div>
  );
};

export default SignUpForm;
