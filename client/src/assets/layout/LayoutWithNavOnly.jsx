import { Outlet } from "react-router-dom";
import Navbar from "../pages/Navbar";

function LayoutWithNavAndOnly() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default LayoutWithNavAndOnly;
