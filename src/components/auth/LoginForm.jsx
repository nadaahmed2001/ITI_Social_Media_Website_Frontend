import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { verifyOtp } from '../../services/api';
import { 
  Box, 
  Avatar, 
  Button, 
  TextField, 
  Link, 
  Typography,
  FormControlLabel,
  Checkbox,
  CssBaseline,
  Paper,
  Grid,
  Fade
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [usernameForOtp, setUsernameForOtp] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const navigate = useNavigate();

  // Validation Schema for initial login
  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  });

  // Initial Login Formik Handler
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
          localStorage.setItem("access_token", data.access);
          if (data.refresh) { localStorage.setItem("refresh_token", data.refresh); }
          navigate("/dashboard");
        } else if (response.ok && data.otp_required === true) {
          setUsernameForOtp(values.username);
          setIsOtpStep(true);
          setErrorMessage(data.message || 'OTP sent to your email.');
          formik.setFieldValue('password', '');
        } else {
          setErrorMessage(data.detail || data.message || "Login failed. Check credentials.");
        }
      } catch (err) {
        console.error("Login API error:", err);
        setErrorMessage("An error occurred during login. Please try again.");
      }
      setLoading(false);
    },
  });

  // OTP Form Submission Handler
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      setErrorMessage("Please enter the 6-digit OTP code.");
      return;
    }
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await verifyOtp({
        username: usernameForOtp,
        otp_code: otpCode
      });

      if (response.data && response.data.access) {
        localStorage.setItem("access_token", response.data.access);
        if (response.data.refresh) { localStorage.setItem("refresh_token", response.data.refresh); }
        setIsOtpStep(false);
        setUsernameForOtp('');
        setOtpCode('');
        navigate("/dashboard");
      } else {
        setErrorMessage("OTP verification succeeded but no tokens received.");
      }
    } catch (err) {
      console.error("OTP Verification error:", err.response?.data || err.message);
      const errors = err.response?.data;
      let specificError = "Invalid or expired OTP code.";
      if (typeof errors === 'object' && errors !== null) {
        specificError = errors.detail || errors.otp_code?.[0] || errors.non_field_errors?.[0] || specificError;
      } else if (typeof errors === 'string') {
        specificError = errors;
      }
      setErrorMessage(specificError);
      setOtpCode('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container component="main" sx={{ 
      height: '100vh',
      background: 'linear-gradient(to right, #f5f5f5 0%, #e8e8e8 100%)'
    }}>
      <CssBaseline />
      
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: 'background.paper',
        margin: { xs: 0, sm: '40px' },
        borderRadius: { xs: 0, sm: '16px' },
        height: { xs: '100%', sm: 'auto' }
      }}>
        <Box sx={{ 
          my: 8, 
          mx: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          maxWidth: '400px',
          width: '100%',
          margin: '0 auto',
          padding: { xs: '20px', sm: '40px' }
        }}>
          <Avatar sx={{ 
            m: 1, 
            bgcolor: '#A9272D',
            width: 56,
            height: 56
          }}>
            <LockOutlinedIcon fontSize="medium" />
          </Avatar>
          
          <Fade in={true} timeout={500}>
            <Box sx={{ width: '100%' }}>
              {!isOtpStep ? (
                <>
                  <Typography component="h1" variant="h4" sx={{ 
                    mt: 2,
                    mb: 1,
                    fontWeight: 700,
                    color: '#A9272D',
                    letterSpacing: '0.5px',
                    textAlign: 'center'
                  }}> 
                    Sign In
                  </Typography>
                  
                  <Typography variant="body1" sx={{ 
                    mb: 3,
                    textAlign: 'center',
                    color: 'text.secondary'
                  }}>
                    Welcome to login
                  </Typography>
                  
                  {errorMessage && (
                    <Alert severity="error" sx={{ 
                      mb: 2,
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}>
                      {errorMessage}
                    </Alert>
                  )}
                  
                  <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ width: '100%' }}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="username"
                      label="Username"
                      name="username"
                      autoComplete="username"
                      autoFocus
                      variant="outlined"
                      {...formik.getFieldProps('username')}
                      error={formik.touched.username && Boolean(formik.errors.username)}
                      helperText={formik.touched.username && formik.errors.username}
                      sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          '& fieldset': {
                            borderColor: '#e0e0e0',
                          },
                          '&:hover fieldset': {
                            borderColor: '#A9272D',
                          },
                        }
                      }}
                    />
                    
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                      variant="outlined"
                      {...formik.getFieldProps('password')}
                      error={formik.touched.password && Boolean(formik.errors.password)}
                      helperText={formik.touched.password && formik.errors.password}
                      sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                        }
                      }}
                    />
                    
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2
                    }}>
                      <FormControlLabel
                        control={
                          <Checkbox 
                            value="remember" 
                            sx={{ 
                              color: '#A9272D',
                              '&.Mui-checked': {
                                color: '#A9272D',
                              }
                            }} 
                          />
                        }
                        label="Remember Me"
                        sx={{ color: 'text.secondary' }}
                      />
                      <Link 
                        component={RouterLink} 
                        to="/forgot-password" 
                        variant="body2" 
                        sx={{ 
                          color: '#A9272D',
                          fontWeight: 500,
                          '&:hover': {
                            textDecoration: 'none',
                            color: '#8c1f24'
                          }
                        }}
                      >
                        Forgot Password?
                      </Link>
                    </Box>
                    
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{
                        mt: 2,
                        mb: 3,
                        py: 1.5,
                        fontSize: '1rem',
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 600,
                        letterSpacing: '0.5px',
                        backgroundColor: '#A9272D',
                        '&:hover': {
                          backgroundColor: '#8c1f24',
                          boxShadow: '0 3px 5px rgba(0,0,0,0.2)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                      disabled={loading}
                    >
                      {loading ? <CircularProgress size={24} color="inherit"/> : "Sign In"}
                    </Button>
                    
                    <Grid container justifyContent="center">
                      <Grid item>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Don't have an account?{' '}
                          <Link 
                            component={RouterLink} 
                            to="/signup" 
                            sx={{ 
                              color: '#A9272D',
                              fontWeight: 500,
                              '&:hover': {
                                textDecoration: 'none'
                              }
                            }}
                          >
                            Sign Up
                          </Link>
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </>
              ) : (
                <>
                  <Typography component="h1" variant="h4" sx={{ 
                    mt: 2,
                    mb: 1,
                    fontWeight: 700,
                    color: '#A9272D',
                    letterSpacing: '0.5px',
                    textAlign: 'center'
                  }}> 
                    Verify Your Identity
                  </Typography>
                  
                  <Typography variant="body1" sx={{ 
                    mb: 3,
                    textAlign: 'center',
                    color: 'text.secondary'
                  }}>
                    We've sent a 6-digit code to your registered email.
                  </Typography>
                  
                  {errorMessage && (
                    <Alert 
                      severity={errorMessage.includes("sent") ? "info" : "error"} 
                      sx={{ 
                        mb: 2,
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                      }}
                    >
                      {errorMessage}
                    </Alert>
                  )}
                  
                  <Box component="form" noValidate onSubmit={handleOtpSubmit} sx={{ width: '100%' }}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="otpCode"
                      label="Verification Code"
                      type="text"
                      id="otpCode"
                      inputProps={{ 
                        maxLength: 6, 
                        inputMode: 'numeric', 
                        pattern: '[0-9]*' 
                      }}
                      value={otpCode}
                      onChange={(e) => { 
                        setOtpCode(e.target.value); 
                        setErrorMessage(''); 
                      }}
                      error={Boolean(errorMessage && !errorMessage.includes("sent"))}
                      sx={{
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          '& fieldset': {
                            borderColor: '#e0e0e0',
                          },
                          '&:hover fieldset': {
                            borderColor: '#A9272D',
                          },
                        }
                      }}
                    />
                    
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{
                        mt: 1,
                        mb: 2,
                        py: 1.5,
                        fontSize: '1rem',
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 600,
                        letterSpacing: '0.5px',
                        backgroundColor: '#A9272D',
                        '&:hover': {
                          backgroundColor: '#8c1f24',
                          boxShadow: '0 3px 5px rgba(0,0,0,0.2)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                      disabled={loading || !otpCode || otpCode.length !== 6}
                    >
                      {loading ? <CircularProgress size={24} color="inherit"/> : "Verify Code"}
                    </Button>
                    
                    <Button 
                      fullWidth 
                      variant="text" 
                      sx={{ 
                        mt: 1,
                        color: 'text.secondary',
                        textTransform: 'none',
                        '&:hover': {
                          color: '#A9272D',
                          backgroundColor: 'transparent'
                        }
                      }} 
                      onClick={() => setIsOtpStep(false)} 
                      disabled={loading}
                    >
                      ← Back to Login
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          </Fade>
        </Box>
      </Grid>
    </Grid>
  );
};

export default LoginForm;