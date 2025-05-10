import React, { useState } from "react";
import { TextField, Button, Typography, CircularProgress ,Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import "../auth/auth.css";
import ItiLogo from "../../assets/images/logo.png";
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
        const response = await fetch("http://itihub-backend-ncohav-026f24-129-159-8-224.traefik.me/api/users/register/", {
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
    <div className="flex items-center justify-center min-h-screen bg-white px-4 py-12">
  <div className="flex flex-col md:flex-row items-center gap-8 max-w-5xl w-full">
      
   
      <div
       className="hidden md:block w-[500px] h-[600px]">
        <img 
        src={new URL('../../assets/images/itihub.jpeg', import.meta.url)}
        alt="IT Hub"
        className="w-full h-full object-contain rounded-lg" // object-contain maintains aspect ratio
      />
      </div>


      <div className="w-full max-w-md bg-white rounded-2xl">
      <div className="flex flex-col justify-center">
        <div className="mx-auto w-full max-w-sm">
    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
      <img src={ItiLogo} alt="ITI Logo" className="w-10 h-10 mr-2" />
      <Typography component="h1" variant="h5" sx={{ fontFamily: "Poppins", color: "#7a2226", fontWeight: 600 }}>
        Join ITI Talents
      </Typography>
    </Box>
        </div>

        <div className="w-full">
          {errorMessage && (
            <Typography color="error" sx={{ mb: 2 }}>{errorMessage}</Typography>
          )}

          <form onSubmit={formik.handleSubmit}>
            {[
              { name: "username", label: "Username" },
              { name: "email", label: "Email", type: "email" },
              { name: "national_id", label: "National ID" },
              { name: "password", label: "Password", type: "password" },
              { name: "confirmPassword", label: "Confirm Password", type: "password" },
            ].map(({ name, label, type = "text" }) => (
              <TextField
                key={name}
                fullWidth
                variant="filled"
                margin="normal"
                name={name}
                type={type}
                label={label}
                value={formik.values[name]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched[name] && Boolean(formik.errors[name])}
                helperText={formik.touched[name] && formik.errors[name]}
                required
              />
            ))}

<Button
type="submit"
fullWidth
variant="contained"
disableRipple
sx={{
  mt: 2,
  py: 1.5,
  backgroundColor: '#7a2226',
  '&:hover': {
    backgroundColor: '#7a2226', 
    opacity: 0.9
  },
  '&.Mui-disabled': {
    backgroundColor: '#7a2226',
    color: 'white !important'
  }
}}
disabled={loading}
>
{loading ? <CircularProgress size={24} style={{ color: "white" }} /> : "Register"}
</Button>
            <Typography variant="body2" sx={{ mt: 2, textAlign: "center" , color: "#7a2226" }}>
              Already have an account? <Link  sx={{ color: "#7a2226" }} to="/login" >Log in</Link>
            </Typography>
          </form>
        </div>
      </div>

</div>
    </div>
  </div>
  );
};

export default SignUpForm;
