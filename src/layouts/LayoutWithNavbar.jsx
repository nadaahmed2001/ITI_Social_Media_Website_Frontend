import React from "react";
import Navbar from "../components/ui/Navbar";
import { Outlet } from "react-router-dom";

const LayoutWithNavbar = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default LayoutWithNavbar;
