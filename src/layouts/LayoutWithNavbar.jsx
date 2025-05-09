import React from "react";
import Navbar from "../components/ui/Navbar";
import { Outlet } from "react-router-dom";

const LayoutWithNavbar = () => {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16">
      <Outlet />
      </main>
    </>
  );
};

export default LayoutWithNavbar;
