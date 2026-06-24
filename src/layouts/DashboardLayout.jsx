import { useState } from "react";
import { Outlet, Link, NavLink, useNavigate } from "react-router-dom";
import { 
  Menu, X, User, Heart, PlusCircle, List, 
  Users, FileText, Home, LogOut, DollarSign 
} from "lucide-react";
import useAuth from "../hooks/useAuth";

const DashboardLayout = () => {
  const { user, logOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Temporary role check (We will make it dynamic via backend later)
  const isAdmin = true; 
  const isVolunteer = false;

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Sidebar Links based on Roles
  const links = (
    <div className="space-y-1.5 font-medium">
      {/* Common Route for All Logged In Users */}
      <NavLink
        to="/dashboard/profile"
        end
        onClick={() => setIsOpen(false)}
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-3 rounded-xl transition duration-200 ${
            isActive 
              ? "bg-white text-red-600 shadow-md" 
              : "text-white hover:bg-white/10"
          }`
        }
      >
        <User size={18} /> Profile
      </NavLink>

      {/* Donor Specific Routes */}
      {!isAdmin && !isVolunteer && (
        <>
          <NavLink
            to="/dashboard"
            end
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition duration-200 ${
                isActive 
                  ? "bg-white text-red-600 shadow-md" 
                  : "text-white hover:bg-white/10"
              }`
            }
          >
            <Home size={18} /> Donor Home
          </NavLink>
          <NavLink
            to="/dashboard/create-donation-request"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition duration-200 ${
                isActive 
                  ? "bg-white text-red-600 shadow-md" 
                  : "text-white hover:bg-white/10"
              }`
            }
          >
            <PlusCircle size={18} /> Create Request
          </NavLink>
          <NavLink
            to="/dashboard/my-donation-requests"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition duration-200 ${
                isActive 
                  ? "bg-white text-red-600 shadow-md" 
                  : "text-white hover:bg-white/10"
              }`
            }
          >
            <Heart size={18} /> My Requests
          </NavLink>
        </>
      )}

      {/* Admin & Volunteer Shared Routes */}
      {(isAdmin || isVolunteer) && (
        <>
          <NavLink
            to="/dashboard"
            end
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition duration-200 ${
                isActive 
                  ? "bg-white text-red-600 shadow-md" 
                  : "text-white hover:bg-white/10"
              }`
            }
          >
            <Home size={18} /> Dashboard Home
          </NavLink>
          <NavLink
            to="/dashboard/all-blood-donation-request"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition duration-200 ${
                isActive 
                  ? "bg-white text-red-600 shadow-md" 
                  : "text-white hover:bg-white/10"
              }`
            }
          >
            <List size={18} /> All Blood Requests
          </NavLink>
        </>
      )}

      {/* Admin Only Routes */}
      {isAdmin && (
        <>
          <NavLink
            to="/dashboard/all-users"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition duration-200 ${
                isActive 
                  ? "bg-white text-red-600 shadow-md" 
                  : "text-white hover:bg-white/10"
              }`
            }
          >
            <Users size={18} /> All Users
          </NavLink>
        </>
      )}

      <hr className="border-white/20 my-4" />

      {/* Public Home Link */}
      <Link
        to="/"
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-white/10 transition duration-200"
      >
        <Home size={18} /> Back to Public Home
      </Link>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-red-700/40 font-semibold transition duration-200 text-left cursor-pointer"
      >
        <LogOut size={18} /> Logout
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-gradient-to-b from-red-600 via-rose-500 to-pink-500 text-white p-6 shadow-xl sticky top-0 h-screen justify-between">
        <div>
          <div className="flex items-center gap-2 mb-8 border-b border-white/20 pb-4">
            <Heart className="w-8 h-8 animate-pulse text-white fill-white" />
            <span className="text-xl font-bold tracking-wide">SafeDonor Panel</span>
          </div>
          {links}
        </div>
        
        {/* User Status Card */}
        <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl border border-white/10">
          <img 
            src={user?.photoURL || "https://i.ibb.co/6NGH09t/user-placeholder.png"} 
            alt="Avatar" 
            className="w-10 h-10 rounded-full object-cover border border-white/20"
          />
          <div className="truncate">
            <p className="text-sm font-semibold truncate">{user?.displayName}</p>
            <p className="text-xs text-white/70 truncate">{user?.email}</p>
          </div>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-gradient-to-r from-red-500 to-pink-500 text-white h-16 flex items-center justify-between px-6 z-50 shadow-md">
        <span className="font-bold tracking-wide">SafeDonor Panel</span>
        <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE SIDEBAR DRAWERS */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
      <aside className={`fixed top-0 bottom-0 left-0 w-64 bg-gradient-to-b from-red-600 to-pink-500 text-white p-6 z-50 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition duration-300 ease-in-out md:hidden flex flex-col justify-between shadow-2xl`}>
        <div>
          <div className="flex items-center justify-between mb-6 border-b border-white/20 pb-4">
            <span className="text-xl font-bold">Menu</span>
            <button onClick={() => setIsOpen(false)}><X size={20} /></button>
          </div>
          {links}
        </div>
        <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl">
          <img src={user?.photoURL || "https://i.ibb.co/6NGH09t/user-placeholder.png"} alt="Avatar" className="w-10 h-10 rounded-full object-cover"/>
          <div className="truncate">
            <p className="text-sm font-semibold truncate">{user?.displayName}</p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 md:p-10 pt-24 md:pt-10 overflow-x-hidden w-full max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;