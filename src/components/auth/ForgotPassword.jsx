import React, { useState } from "react";
import { TextField, Button, Typography, CircularProgress, Box, Link } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate , Link as RouterLink} from "react-router-dom";
import ItiLogo from "../../assets/images/logo.png";

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
        const response = await fetch("http://127.0.0.1:8000/api/users/password-reset/", {
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
    <div className="flex items-center justify-center min-h-screen !bg-white px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 max-w-5xl w-full !bg-white rounded-2xl overflow-hidden min-h-[600px]"> {/* Added shadow, overflow, min-h */}
      {/* Left Image Section */}
      <div
        className="hidden md:block bg-contain bg-center bg-no-repeat h-full rounded-l-2xl"
        style={{
          backgroundImage: `url(${new URL('../../assets/images/itihub.jpeg', import.meta.url)})`,
        }}
      ></div>

      {/* Right Form Section */}
      <div className="flex flex-col justify-center px-8 py-12 lg:px-12 flex-1">
        <div className="mx-auto w-full max-w-sm">
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <img src={ItiLogo} alt="ITI Logo" className="w-10 h-10 mr-2" />
            <Typography 
              component="h1" 
              variant="h5" 
              sx={{ fontFamily: "Poppins", color: "#7a2226", fontWeight: 600 }}
            >
              Password Recovery
            </Typography>
          </Box>

          {message && (
            <Typography color="error" sx={{ mb: 2 }}>
              {message}
            </Typography>
          )}

          <form onSubmit={formik.handleSubmit} className="w-full">
            <TextField
              fullWidth
              variant="filled"
              margin="normal"
              name="email"
              label="Email Address"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              required
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disableRipple
              sx={{
                mt: 2,
                py: 1.5,
                backgroundColor: '#7a2226 ',
                color: 'white !important',
                '&:hover': {
                  backgroundColor: '#7a2226 ',
                  filter: 'brightness(90%)',
                  transform: 'translateY(-1px)'
                },
                '&.Mui-disabled': {
                  backgroundColor: '#D3D3D3 !important',
                  color: 'white !important'
                }
              }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} style={{ color: "white" }} />
              ) : (
                "Send Reset Code"
              )}
            </Button>

            <Typography
              variant="body2"
              sx={{ mt: 2, textAlign: "center", color: "#7a2226" }}
            >
              Remember your password?{' '}
              <Link component={RouterLink} to="/login" sx={{ color: "#7a2226" }}>
                Login here
              </Link>
            </Typography>
          </form>
        </div>
      </div>
    </div>
  </div>
  );
};

export default ForgotPassword;
