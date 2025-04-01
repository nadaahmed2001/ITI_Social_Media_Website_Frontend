import React, { useState } from "react";
import LoginForm from "../components/auth/LoginForm";
import SignUpForm from "../components/auth/SignUpForm";
import { Button, Typography } from "@mui/material";
import "../assets/styles/auth.css";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  console.log("Current isLogin state:", isLogin);
  console.log("AuthPage is rendering...");

  console.log("🚀 AuthPage is loaded for path:", window.location.pathname);

  return (
    <div className="auth-container">
      {/* <Typography variant="h4" className="auth-title">
        {isLogin ? "Sign In" : "Sign Up"}
      </Typography> */}

        <div className="auth-box">
          {isLogin ? <LoginForm /> : <SignUpForm />}


          {/* <Button
            className="auth-toggle-button"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </Button> */}
        </div>
        
    </div>
  );
};

export default AuthPage;
