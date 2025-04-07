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
        Forgot Password
      </Typography>

      {message && <Typography color="error">{message}</Typography>}

      <form className="mb-4" onSubmit={formik.handleSubmit}>
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="email"
        >
          Email Address
        </label>
        <TextField
          fullWidth
          variant="outlined"
          className="mb-4"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          required
        />

        <Button
          variant="contained"
          fullWidth
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Code"}
        </Button>
      </form>
    </div>

    <footer className="text-center mt-8 text-gray-500 text-xs">
      Copyright@2025
    </footer>
  </div>
  );
};

export default ForgotPassword;
