// import React, { useState } from "react";
// import { TextField, Button, Typography, FormControlLabel, Checkbox, CircularProgress } from "@mui/material";
// import { Link ,useNavigate} from "react-router-dom";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import "../../assets/styles/auth.css";


// const LoginForm = () => {
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const navigate = useNavigate();

//   const validationSchema = Yup.object({
//     username: Yup.string().required("Username is required"),
//     password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
//   });

//   const formik = useFormik({
//     initialValues: { username: "", password: "" },
//     validationSchema,
//     onSubmit: async (values) => {
//       setLoading(true);
//       setErrorMessage("");

//       try {
//         const response = await fetch("http://127.0.0.1:8000/users/login/", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(values),
//         });

//         const data = await response.json();

//         if (response.ok) {
//           localStorage.setItem("accessToken", data.access);
//           navigate("/dashboard");
//         } else {
//           setErrorMessage(data.detail || "Login error");
//         }
//       } catch (err) {
//         setErrorMessage("An unexpected error occurred");
//       }

//       setLoading(false);
//     },
//   });


//   return (
//     <div className="auth-container">
//       <Typography variant="h5" className="auth-logo">ITI Hub</Typography>

//       <div className="auth-box">
//         <Typography variant="h4" className="auth-title">Sign In</Typography>

//         {errorMessage && <Typography color="error">{errorMessage}</Typography>}

//         <form className="auth-form" onSubmit={formik.handleSubmit}>
//           <label className="auth-label">User Name</label>
//           <TextField
//             fullWidth
//             variant="outlined"
//             className="auth-input"
//             name="username"
//             value={formik.values.username}
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             error={formik.touched.username && Boolean(formik.errors.username)}
//             helperText={formik.touched.username && formik.errors.username}
//             required
//           />

//           <label className="auth-label">Password</label>
//           <TextField
//             fullWidth
//             type="password"
//             variant="outlined"
//             className="auth-input"
//             name="password"
//             value={formik.values.password}
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             error={formik.touched.password && Boolean(formik.errors.password)}
//             helperText={formik.touched.password && formik.errors.password}
//             required
//           />

//           <div className="auth-options">
//             <FormControlLabel control={<Checkbox color="primary" />} label="Remember me" />
//             <Link to="/forgot-password" className="auth-forgot">Forgot Password?</Link>
//           </div>

//           <Button variant="contained" fullWidth className="auth-button" type="submit" disabled={loading}>
//             {loading ? <CircularProgress size={24} style={{ color: "white" }} /> : "Sign In"}
//           </Button>
//         </form>

//         <Typography variant="body2" className="auth-link">
//           <Link to="/signup">Register as a new user?</Link>
//         </Typography>
//       </div>

//       <footer className="auth-footer-text">
//         Copyright@2025
//       </footer>
//     </div>
//   );
// };

// export default LoginForm;


// src/components/auth/NewLoginForm.jsx
import React, { useState } from 'react'; // Keep existing imports
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
// ... other MUI imports (Avatar, Button, TextField, Box, Grid, Typography, etc.)
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

// --- Import the new API function ---
import { verifyOtp } from '../../services/api'; // Adjust path if needed (create this function below)
// --- Keep other imports ---
import Itilogo from '../../assets/images/logo.png';
import BackgroundImage from '../../assets/images/ITI.jpeg';
import { Paper, FormControlLabel, Checkbox } from '@mui/material';
import {Grid, Box, Avatar, Button, TextField, Link, Typography} from '@mui/material';

// ... Copyright component ...

const LoginForm = () => {
  const [loading, setLoading] = useState(false); // General loading state for both steps
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // --- Add State for OTP Flow ---
  const [isOtpStep, setIsOtpStep] = useState(false); // Controls which form is shown
  const [usernameForOtp, setUsernameForOtp] = useState(''); // Store username for OTP verification
  const [otpCode, setOtpCode] = useState(''); // Store the OTP code entered by user
  // --- End OTP State ---


  // Validation Schema (Only for initial login)
  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  });

  // Initial Login Formik Handler
  const formik = useFormik({
    initialValues: { username: "", password: "" },
    validationSchema,
    // --- MODIFIED onSubmit for Initial Login ---
    onSubmit: async (values) => {
      setLoading(true);
      setErrorMessage("");
      try {
        // Step 1: Send credentials
        const response = await fetch("http://127.0.0.1:8000/users/login/", { // Hit the CustomTokenObtainPairView endpoint
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        const data = await response.json();

        // Step 2: Check response
        if (response.ok && data.access) {
          // Case 1: Login Success (2FA OFF) - Tokens received directly
          localStorage.setItem("access_token", data.access);
          if (data.refresh) { localStorage.setItem("refresh_token", data.refresh); }
          navigate("/dashboard"); // Or your target page
        } else if (response.ok && data.otp_required === true) {
          // Case 2: Credentials OK, but OTP Required (2FA ON)
          setUsernameForOtp(values.username); // Store username for OTP verification step
          setIsOtpStep(true); // Switch to OTP form view
          setErrorMessage(data.message || 'OTP sent to your email.'); // Show info message
          formik.setFieldValue('password', ''); // Clear password field for security
        } else {
          // Case 3: Login Failed (Invalid Credentials or other backend error)
          setErrorMessage(data.detail || data.message || "Login failed. Check credentials.");
        }
      } catch (err) {
        console.error("Login API error:", err);
        setErrorMessage("An error occurred during login. Please try again.");
      }
      setLoading(false); // Clear loading state for initial login attempt
    },
    // --- End MODIFIED onSubmit ---
  });

  // --- NEW: Handler for OTP Form Submission ---
  const handleOtpSubmit = async (e) => {
      e.preventDefault(); // Prevent default form submission
      if (!otpCode || otpCode.length !== 6) { // Basic OTP format check
          setErrorMessage("Please enter the 6-digit OTP code.");
          return;
      }
      setLoading(true); // Use the same loading state
      setErrorMessage("");

      try {
          // Call the new verifyOtp API function
          const response = await verifyOtp({
              username: usernameForOtp,
              otp_code: otpCode
          });

          // Check if response has tokens (verifyOtp returns tokens on success)
          if (response.data && response.data.access) {
              localStorage.setItem("access_token", response.data.access);
              if (response.data.refresh) { localStorage.setItem("refresh_token", response.data.refresh); }
              // Reset state completely after successful login
              setIsOtpStep(false);
              setUsernameForOtp('');
              setOtpCode('');
              navigate("/dashboard"); // Navigate after successful OTP verification
          } else {
              // Should not happen if backend works correctly, but handle defensively
               setErrorMessage("OTP verification succeeded but no tokens received.");
          }

      } catch (err) {
          console.error("OTP Verification error:", err.response?.data || err.message);
          const errors = err.response?.data;
          let specificError = "Invalid or expired OTP code."; // Default OTP error
          if (typeof errors === 'object' && errors !== null) {
              specificError = errors.detail || errors.otp_code?.[0] || errors.non_field_errors?.[0] || specificError;
          } else if (typeof errors === 'string') {
              specificError = errors;
          }
          setErrorMessage(specificError);
          setOtpCode(''); // Clear OTP input for retry
      } finally {
          setLoading(false);
      }
  };
  // --- End OTP Handler ---

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      {/* CssBaseline likely applied in App.js via ThemeProvider */}
      {/* Image Side Grid */}
      <Grid item xs={false} sm={4} md={7} sx={{ /* ... background image styles ... */ }} />

      {/* Form Side Grid */}
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square sx={{ /* ... Paper styles ... */ }}>
        <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Logo and App Name */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ width: 48, height: 48, mr: 1.5, bgcolor: 'transparent' }}>
                <img src={Itilogo} alt="ITI Hub Logo" style={{ width: '100%', height: 'auto' }} />
            </Avatar>
            <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold' }}> ITI Hub </Typography>
        </Box>

          {/* Conditionally Render Login Form or OTP Form */}
          {!isOtpStep ? (
            <> {/* Fragment to group Login Form elements */}
              <Typography component="h1" variant="h5"> Sign In </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Welcome back! Please enter your details.
              </Typography>

              {/* Display Login Error Message */}
              {errorMessage && !isOtpStep && ( <Alert severity="error" sx={{ width: '100%', mb: 2 }}> {errorMessage} </Alert> )}

              {/* Login Form */}
              <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ width: '100%', mt: 1 }}>
                <TextField variant="filled" margin="normal" required fullWidth id="username" label="Username" name="username" autoComplete="username" autoFocus {...formik.getFieldProps('username')} error={formik.touched.username && Boolean(formik.errors.username)} helperText={formik.touched.username && formik.errors.username} />
                <TextField variant="filled" margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" {...formik.getFieldProps('password')} error={formik.touched.password && Boolean(formik.errors.password)} helperText={formik.touched.password && formik.errors.password} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', /* ... other styles ... */ }}>
                    <FormControlLabel control={<Checkbox value="remember" color="primary" sx={{ paddingLeft: 0 }} />} label="Remember me" />
                    <Link component={RouterLink} to="/forgot-password" variant="body2" sx={{ alignSelf: 'center' }}> Forgot password? </Link>
                </Box>
                <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2, mb: 2, py: 1.5, fontSize: '1rem' }} disabled={loading} >
                  {loading ? <CircularProgress size={24} color="inherit"/> : "Sign In"}
                </Button>
                <Grid container justifyContent="center">
                  <Grid item> <Link component={RouterLink} to="/signup" variant="body2"> {"Don't have an account? Sign Up"} </Link> </Grid>
                </Grid>
              </Box>
            </>
          ) : (
            <> {/* Fragment to group OTP Form elements */}
              <Typography component="h1" variant="h5"> Enter Verification Code </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, mt: 1, textAlign: 'center' }}>
                A 6-digit code was sent to your registered email address.
              </Typography>

              {/* Display OTP Error/Info Message */}
              {/* Show info message first if no error */}
              {errorMessage && ( <Alert severity={errorMessage.includes("sent") ? "info" : "error"} sx={{ width: '100%', mb: 2 }}> {errorMessage} </Alert> )}

              {/* OTP Form */}
              <Box component="form" noValidate onSubmit={handleOtpSubmit} sx={{ width: '100%', mt: 1 }}>
                 <TextField
                    variant="filled"
                    margin="normal"
                    required
                    fullWidth
                    name="otpCode"
                    label="One-Time Password (OTP)"
                    type="text" // Use text for easier input, add pattern/inputMode
                    id="otpCode"
                    inputProps={{ maxLength: 6, inputMode: 'numeric', pattern: '[0-9]*' }}
                    value={otpCode}
                    onChange={(e) => { setOtpCode(e.target.value); setErrorMessage(''); }} // Clear error on change
                    error={Boolean(errorMessage && !errorMessage.includes("sent"))} // Show error state if error message exists (and isn't just the 'sent' info)
                    // No helper text needed usually for OTP, error shown above
                  />
                   <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1rem' }} disabled={loading || !otpCode || otpCode.length !== 6}>
                    {loading ? <CircularProgress size={24} color="inherit"/> : "Verify Code"}
                  </Button>
                   {/* Optional: Button to go back */}
                   <Button fullWidth variant="text" sx={{ mt: 1 }} onClick={() => setIsOtpStep(false)} disabled={loading}>
                        Back to Login
                   </Button>
              </Box>
            </>
          )}
          {/* Copyright outside the conditional rendering */}
        </Box>
      </Grid>
    </Grid>
  );
};

export default LoginForm;