import React, { useState } from "react";
import { TextField, Button, Typography, FormControlLabel, Checkbox, CircularProgress } from "@mui/material";
import { Link ,useNavigate} from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import "../../assets/styles/auth.css";




const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  });

  const formik = useFormik({
    initialValues: { username: "", password: "" },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch("http://127.0.0.1:8000/users/login/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("accessToken", data.access);
          navigate("/dashboard");
        } else {
          setErrorMessage(data.detail || "Login error");
        }
      } catch (err) {
        setErrorMessage("An unexpected error occurred");
      }

      setLoading(false);
    },
  });

  return (
    <div className="auth-container">
      <Typography variant="h5" className="auth-logo">ITI Hub</Typography>

      <div className="auth-box">
        <Typography variant="h4" className="auth-title">Sign In</Typography>

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

          <label className="auth-label">Password</label>
          <TextField
            fullWidth
            type="password"
            variant="outlined"
            className="auth-input"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            required
          />

          <div className="auth-options">
            <FormControlLabel control={<Checkbox color="primary" />} label="Remember me" />
            <Link to="/forgot-password" className="auth-forgot">Forgot Password?</Link>
          </div>

          <Button variant="contained" fullWidth className="auth-button" type="submit" disabled={loading}>
            {loading ? <CircularProgress size={24} style={{ color: "white" }} /> : "Sign In"}
          </Button>
        </form>

        <Typography variant="body2" className="auth-link">
          <Link to="/signup">Register as a new user?</Link>
        </Typography>
      </div>

      <footer className="auth-footer-text">
        Copyright@2025
      </footer>
    </div>
  );
};

export default LoginForm;
