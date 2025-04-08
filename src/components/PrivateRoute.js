// components/PrivateRoute.js
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import React from "react";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;
  // console.log(user);
  return user ? children : React.createElement(Navigate, { to: "/login" });
};

export default PrivateRoute;
