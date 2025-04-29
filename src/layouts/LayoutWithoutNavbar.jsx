import React from "react";
import { Outlet } from "react-router-dom";

const LayoutWithoutNavbar = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

export default LayoutWithoutNavbar;
