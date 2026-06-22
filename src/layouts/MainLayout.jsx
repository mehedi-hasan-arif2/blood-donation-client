import { Outlet } from "react-router-dom";
import Navbar from "../pages/Shared/Navbar";

const MainLayout = () => {
  return (
    <div className="font-sans">
      <Navbar />
      <div className="min-h-[calc(100vh-100px)]">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;