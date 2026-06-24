import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <div className="font-sans flex flex-col min-h-screen bg-gray-50 text-gray-900">
      {/* NAVBAR */}
      <Navbar />
      
      {/* MAIN CONTENT AREA */}
      <div className="flex-grow">
        <Outlet />
      </div>

      {/* FOOTER FOR PUBLIC ROUTES */}
      <Footer />
    </div>
  );
};

export default MainLayout;