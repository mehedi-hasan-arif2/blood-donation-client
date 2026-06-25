import { useState } from "react";
import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  User,
  Home,
  Heart,
  PlusCircle,
  Users,
  Droplets,
  LogOut,
} from "lucide-react";

import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";
import Loader from "../components/Loader";

const DashboardLayout = () => {
  const { user, logOut } = useAuth();
  const { isAdmin, isVolunteer, isDonor, roleLoading } = useRole();

  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  if (roleLoading) {
    return <Loader />;
  }

  const handleLogout = async () => {
    try {
      localStorage.removeItem("access-token");
      await logOut();
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      isActive
        ? "bg-white text-red-600 shadow-md"
        : "text-white hover:bg-white/10"
    }`;

  const sidebarLinks = (
    <>
      <NavLink
        to="/dashboard"
        end
        onClick={() => setIsOpen(false)}
        className={navClass}
      >
        <Home size={18} />
        Dashboard Home
      </NavLink>

      {isDonor && (
        <>
          <NavLink
            to="/dashboard/create-donation-request"
            onClick={() => setIsOpen(false)}
            className={navClass}
          >
            <PlusCircle size={18} />
            Create Donation Request
          </NavLink>

          <NavLink
            to="/dashboard/my-donation-requests"
            onClick={() => setIsOpen(false)}
            className={navClass}
          >
            <Heart size={18} />
            My Donation Requests
          </NavLink>
        </>
      )}

      {(isAdmin || isVolunteer) && (
        <NavLink
          to="/dashboard/all-blood-donation-request"
          onClick={() => setIsOpen(false)}
          className={navClass}
        >
          <Droplets size={18} />
          All Blood Requests
        </NavLink>
      )}

      {isAdmin && (
        <NavLink
          to="/dashboard/all-users"
          onClick={() => setIsOpen(false)}
          className={navClass}
        >
          <Users size={18} />
          All Users
        </NavLink>
      )}

      <NavLink
        to="/dashboard/profile"
        onClick={() => setIsOpen(false)}
        className={navClass}
      >
        <User size={18} />
        Profile
      </NavLink>

      <div className="border-t border-white/20 my-4"></div>

      <Link
        to="/"
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-white/10 transition-all"
      >
        <Home size={18} />
        Public Home
      </Link>

      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-red-700/30 transition-all cursor-pointer"
      >
        <LogOut size={18} />
        Logout
      </button>
    </>
  );

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-72 flex-col justify-between bg-gradient-to-b from-red-600 via-rose-500 to-pink-500 text-white p-6 shadow-xl sticky top-0 h-screen">
        <div>
          <div className="flex items-center gap-3 mb-8 pb-5 border-b border-white/20">
            <Heart className="w-8 h-8 fill-white animate-pulse" />
            <h2 className="text-xl font-bold">
              Blood Donation Dashboard
            </h2>
          </div>

          <div className="space-y-2">{sidebarLinks}</div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <div className="flex items-center gap-3">
            <img
              src={
                user?.photoURL ||
                "https://i.ibb.co/6NGH09t/user-placeholder.png"
              }
              alt="user"
              className="w-12 h-12 rounded-full object-cover border-2 border-white"
            />

            <div className="overflow-hidden">
              <h4 className="font-semibold truncate">
                {user?.displayName || "User"}
              </h4>

              <p className="text-xs text-white/80 truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-red-600 to-pink-500 flex items-center justify-between px-5 text-white z-50 shadow-lg">
        <h2 className="font-bold">Dashboard</h2>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-pointer"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        ></div>
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-72 bg-gradient-to-b from-red-600 via-rose-500 to-pink-500 text-white p-6 z-50 transform transition-transform duration-300 md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-bold text-lg">Dashboard</h2>

          <button onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="space-y-2">{sidebarLinks}</div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-5 md:p-8 pt-24 md:pt-8 overflow-x-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;