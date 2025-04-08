import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField, Button, Typography, FormControlLabel, Checkbox, CircularProgress,
  Alert, Paper, Grid, Box, Avatar, Link,
} from "@mui/material";

import { verifyOtp } from '../../components/services/api';
import Itilogo from '../../assets/images/logo.png';

import "../auth/auth.css";


const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const LoginForm = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [usernameForOtp, setUsernameForOtp] = useState('');
  const [otpCode, setOtpCode] = useState('');

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

        if (response.ok && data.access) {
          storeTokens(data);
          navigate("/dashboard");
        } else if (response.ok && data.otp_required) {
          setUsernameForOtp(values.username);
          setIsOtpStep(true);
          setErrorMessage(data.message || 'OTP sent to your email.');
          formik.setFieldValue('password', '');
        } else {
          setErrorMessage(data.detail || data.message || "Login failed. Check credentials.");
        }
      } catch (err) {
        console.error("Login error:", err);
        setErrorMessage("An error occurred during login. Please try again.");
      }

      setLoading(false);
    },
  });

  const storeTokens = (data) => {
    localStorage.setItem("access_token", data.access);
    if (data.refresh) localStorage.setItem("refresh_token", data.refresh);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    if (!otpCode || otpCode.length !== 6) {
      setErrorMessage("Please enter the 6-digit OTP code.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      console.log('Sending OTP verification data:', { username: usernameForOtp, otp_code: otpCode });

      const response = await verifyOtp({ username: usernameForOtp, otp_code: otpCode });

      if (response.data?.access) {
        storeTokens(response.data);
        resetOtpState();
        navigate("/dashboard");
      } else {
        setErrorMessage("OTP verification succeeded but no tokens received.");
      }
    } catch (err) {
      console.error("OTP Verification error:", err.response?.data || err.message);
      const errors = err.response?.data;
      const specificError =
        typeof errors === 'string'
          ? errors
          : errors?.detail || errors?.otp_code?.[0] || errors?.non_field_errors?.[0] || "Invalid or expired OTP code.";
      setErrorMessage(specificError);
      setOtpCode('');
    } finally {
      setLoading(false);
    }
  };

  const resetOtpState = () => {
    setIsOtpStep(false);
    setUsernameForOtp('');
    setOtpCode('');
  };

  const renderLogoHeader = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
      <Avatar sx={{ width: 48, height: 48, mr: 1.5, bgcolor: 'transparent' }}>
        <img src={Itilogo} alt="ITI Hub Logo" style={{ width: '100%' }} />
      </Avatar>
      <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold' }}>
        ITI Hub
      </Typography>
    </Box>
  );

  const renderLoginForm = () => (
    <>
      <Typography variant="h5">Sign In</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Welcome back! Please enter your details.
      </Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{errorMessage}</Alert>
      )}

      <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ width: '100%' }}>
        <TextField
          variant="filled" margin="normal" fullWidth required autoFocus
          id="username" label="Username" name="username" autoComplete="username"
          {...formik.getFieldProps('username')}
          error={formik.touched.username && Boolean(formik.errors.username)}
          helperText={formik.touched.username && formik.errors.username}
        />
        <TextField
          variant="filled" margin="normal" fullWidth required
          type="password" id="password" label="Password" name="password" autoComplete="current-password"
          {...formik.getFieldProps('password')}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
          <Link component={RouterLink} to="/forgot-password" variant="body2">Forgot password?</Link>
        </Box>

        <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2, py: 1.5 }} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Sign In"}
        </Button>

        <Grid container justifyContent="center" sx={{ mt: 1 }}>
          <Grid item>
            <Link component={RouterLink} to="/signup" variant="body2">{"Don't have an account? Sign Up"}</Link>
          </Grid>
        </Grid>
      </Box>
    </>
  );

  const renderOtpForm = () => (
    <>
      <Typography variant="h5">Enter Verification Code</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, mt: 1, textAlign: 'center' }}>
        A 6-digit code was sent to your registered email address.
      </Typography>

      {errorMessage && (
        <Alert severity={errorMessage.includes("sent") ? "info" : "error"} sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <Box component="form" noValidate onSubmit={handleOtpSubmit}>
        <TextField
          variant="filled" margin="normal" fullWidth required
          id="otpCode" name="otpCode" label="One-Time Password (OTP)"
          inputProps={{ maxLength: 6, inputMode: 'numeric', pattern: '[0-9]*' }}
          value={otpCode}
          onChange={(e) => { setOtpCode(e.target.value); setErrorMessage(''); }}
          error={Boolean(errorMessage && !errorMessage.includes("sent"))}
        />

        <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, py: 1.5 }} disabled={loading || otpCode.length !== 6}>
          {loading ? <CircularProgress size={24} /> : "Verify Code"}
        </Button>

        <Button fullWidth variant="text" sx={{ mt: 1 }} onClick={() => setIsOtpStep(false)} disabled={loading}>
          Back to Login
        </Button>
      </Box>
    </>
  );

  return (
    <>
    <Grid container component="main" sx={{ height: '100vh' }}>
    <Grid
  item
  xs={false}
  sm={4}
  md={7}
  sx={{
    backgroundImage: `url(new URL('../../assets/images/ITI.jpeg', import.meta.url))`,
    backgroundSize: 'cover',
  }}
/>      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {renderLogoHeader()}
          {isOtpStep ? renderOtpForm() : renderLoginForm()}
        </Box>
      </Grid>
    </Grid>
    </>
  );
};

export default LoginForm;
