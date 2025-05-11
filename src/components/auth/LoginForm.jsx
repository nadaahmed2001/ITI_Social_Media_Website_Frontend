import React, { useState, useContext } from 'react'; // Removed useEffect/useRef if not needed
import { useNavigate, Link as RouterLink } from "react-router-dom";
// import ItiLogo from "../../assets/images/logo.png"; // Use Itilogo import below
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField, Button, Typography, FormControlLabel, Checkbox, CircularProgress,
  Alert, Paper, Grid, Box, Avatar, Link,
} from "@mui/material";
import { verifyOtp } from '../../components/services/api'; // Adjust path if needed
import Itipg from '../../assets/images/logo.png'; // Corrected import name
import Itilogo from '../../assets/images/itihub.jpeg';
// Removed unused useContext import if loginUser handles navigation
import AuthContext from "../../../src/contexts/AuthContext"; // Adjust path if needed
import "../auth/auth.css"; // Ensure path is correct

const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const LoginForm = () => {
  // Keep navigate for other potential uses like forgot password link
  const navigate = useNavigate();
  // Get loginUser function from context
  const { loginUser } = useContext(AuthContext);

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
        // Using fetch directly (consider moving to api.js service)
        const response = await fetch("http://itihub-backend-ncohav-026f24-129-159-8-224.traefik.me/api/users/login/", { // Ensure URL is correct
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const data = await response.json();
        console.log("Login response:", data);

        if (response.ok && data.access && !data.otp_required) { // Check for access token AND no OTP needed
          console.log("Login successful (No OTP):", data);
          // Call context function to store tokens, set user state, AND navigate
          loginUser(data.access, data.user, data.refresh); // Pass user data from login response
          // REMOVE navigation from here:
          setTimeout(() => navigate("/Home"), 0);
        } else if (response.ok && data.otp_required) {
          // Handle OTP step
          console.log("OTP Required for login");
          setUsernameForOtp(values.username);
          setIsOtpStep(true);
          setErrorMessage(data.message || 'OTP sent to your email.');
          formik.setFieldValue('password', ''); // Clear password field
        } else {
          // Handle login failure
          setErrorMessage(data.detail || data.error || data.message || "Login failed. Check credentials.");
        }
      } catch (err) {
        console.error("Login error:", err);
        setErrorMessage("An error occurred during login. Please try again.");
      } finally { // Use finally to ensure loading is always set to false
          setLoading(false);
      }
    },
  });

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

      // Call API service function
      const response = await verifyOtp({ username: usernameForOtp, otp_code: otpCode });

      console.log("OTP verification response:", response); // Log the whole response

      // Check response structure based on verifyOtp API call
      if (response?.data?.access) { // Check the data within the response
        console.log("OTP Correct, logging in user...");
        // Call context function to store tokens, set user state, AND navigate
        // *** FIX: Use response.data ***
        loginUser(response.data.access, response.data.user, response.data.refresh);

        resetOtpState(); // Clear OTP form state
        // REMOVE navigation from here:
        // console.log("Navigating to dashboard...");
        navigate("/Home");
      } else {
         // This case might indicate a backend issue if verifyOtp returns 200 without tokens
         console.error("OTP verification succeeded but no tokens received in response.", response);
         setErrorMessage("Verification failed. Please try logging in again.");
         resetOtpState(); // Go back to login form
         setIsOtpStep(false); // Explicitly ensure OTP step is exited
      }
    } catch (err) {
      console.error("OTP Verification error:", err.response?.data || err.message || err);
      const errors = err.response?.data;
      // Try to extract a specific error message from backend response
      const specificError =
        typeof errors === 'string'
          ? errors
          : errors?.detail || errors?.otp_code?.[0] || errors?.non_field_errors?.[0] || "Invalid or expired OTP code.";
      setErrorMessage(specificError);
      setOtpCode(''); // Clear OTP input on error
    } finally {
      setLoading(false);
    }
  };


  const resetOtpState = () => {
    // Keep setIsOtpStep(false) out of here, handle it based on success/failure
    setUsernameForOtp('');
    setOtpCode('');
    // Don't necessarily reset error message here
  };

  const renderLogoHeader = () => (  /* ... JSX unchanged ... */
     <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
       <img src={Itipg} alt="ITI Logo" className="w-10 h-10 mr-2" />
       <Typography component="h1" variant="h5" sx={{ fontFamily: "Poppins", color: "#7a2226", fontWeight: 600 }}>
         Join ITI Talents
       </Typography>
     </Box>
   );


  const renderLoginForm = () => ( /* ... JSX mostly unchanged ... */
    <>
      {errorMessage && !isOtpStep && ( // Only show login errors here
        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{errorMessage}</Alert>
      )}
      <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ width: '100%' }}>
        <TextField /* ... Username ... */
            variant="filled" margin="normal" fullWidth required autoFocus
            id="username" label="Username" name="username" autoComplete="username"
            {...formik.getFieldProps('username')}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
         />
        <TextField /* ... Password ... */
            variant="filled" margin="normal" fullWidth required
            type="password" id="password" label="Password" name="password" autoComplete="current-password"
            {...formik.getFieldProps('password')}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}> {/* Adjusted margin */}
          <FormControlLabel control={<Checkbox value="remember" size="small"/>} label="Remember me" sx={{ color: "grey.500" }}  /> {/* Smaller checkbox */}
          <Link component={RouterLink} to="/forgot-password" variant="body2" sx={{ color: "#a0a0a0", '&:hover': {color: "#7a2226"} }}> {/* Adjusted color */}
            Forgot password?
          </Link>
        </Box>
        <Button type="submit" fullWidth variant="contained" disableRipple sx={{ /* ... Button styles ... */
            mt: 2, py: 1.5, backgroundColor: '#7a2226',
             '&:hover': { backgroundColor: '#5a181b' }, // Darker hover
             '&.Mui-disabled': { backgroundColor: '#ab6a6d', color: '#e0e0e0' } // Disabled style
            }} disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit"/> : "Sign In"}
        </Button>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}> {/* Adjusted margin */}
          <Link component={RouterLink} to="/signup" variant="body2" sx={{ color: "#a0a0a0", '&:hover': {color: "#7a2226"} }} >
              {"Don't have an account? Sign Up"}
          </Link>
        </Box>
      </Box>
    </>
  );


  const renderOtpForm = () => ( /* ... JSX mostly unchanged ... */
    <>
      <Typography variant="h5" sx={{ textAlign: 'center' }}>Enter Verification Code</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, mt: 1, textAlign: 'center' }}>
        A 6-digit code was sent to your registered email address.
      </Typography>

      {errorMessage && ( // Show OTP errors here
        <Alert severity={errorMessage.includes("sent") ? "info" : "error"} sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <Box component="form" noValidate onSubmit={handleOtpSubmit}>
        <TextField
          variant="filled" margin="normal" fullWidth required
          id="otpCode" name="otpCode" label="One-Time Password (OTP)"
          inputProps={{ maxLength: 6, inputMode: 'numeric', pattern: '[0-9]*', style: { textAlign: 'center', letterSpacing: '0.5em' } }} // Center align OTP input
          value={otpCode}
          onChange={(e) => { setOtpCode(e.target.value.replace(/[^0-9]/g, '')); setErrorMessage(''); }} // Allow only digits
          error={Boolean(errorMessage && !errorMessage.includes("sent"))} // Show error state if relevant
        />

        <Button type="submit" fullWidth variant="contained" sx={{ /* ... Button styles ... */
             mt: 3, py: 1.5, backgroundColor: '#7a2226',
             '&:hover': { backgroundColor: '#5a181b' },
             '&.Mui-disabled': { backgroundColor: '#ab6a6d', color: '#e0e0e0' }
            }} disabled={loading || otpCode.length !== 6}>
          {loading ? <CircularProgress size={24} color="inherit"/> : "Verify Code"}
        </Button>

        <Button fullWidth variant="text" sx={{ mt: 1, color: 'grey.500' }} onClick={() => {setIsOtpStep(false); setErrorMessage(''); formik.resetForm();}} disabled={loading}>
          Back to Login
        </Button>
      </Box>
    </>
  );


  return ( /* ... Outer JSX structure unchanged ... */
    <div className="flex items-center justify-center min-h-screen !bg-white px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 max-w-5xl w-full !bg-white rounded-2xl overflow-hidden min-h-[600px]"> {/* Added shadow, overflow, min-h */}
        {/* Left Image */}
        <div
className="hidden md:block bg-contain bg-center bg-no-repeat h-full rounded-l-2xl"
style={{ backgroundImage: `url(${Itilogo})` }} // Use imported logo variable
        ></div>
        {/* Right Form Area */}
        <div className="flex flex-col justify-center px-8 py-12 lg:px-12 flex-1">
          <div className="mx-auto w-full max-w-sm">
            {renderLogoHeader()}
            <div className="mt-8 w-full">
              {isOtpStep ? renderOtpForm() : renderLoginForm()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
