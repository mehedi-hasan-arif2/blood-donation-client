import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Heart, UserRound, Menu, X, DollarSign, Search, LayoutDashboard, LogOut } from "lucide-react";
import useAuth from "../hooks/useAuth";
import logo from "/assets/logo.png";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logOut();
      setDropdownOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="SafeDonor Logo"
            className="w-10 h-10 hover:scale-105 transition duration-200"
          />
          <span className="text-xl font-bold tracking-wide">SafeDonor</span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8 font-medium">
          <Link to="/" className="flex items-center gap-1 hover:-translate-y-0.5 transition duration-200">
            <Home size={18} />
            Home
          </Link>

          <Link to="/donation-requests" className="flex items-center gap-1 hover:-translate-y-0.5 transition duration-200">
            <Heart size={18} />
            Donation Requests
          </Link>

          {/* Conditional links based on auth status */}
          {!user ? (
            <Link to="/search" className="flex items-center gap-1 hover:-translate-y-0.5 transition duration-200">
              <Search size={18} />
              Search Donors
            </Link>
          ) : (
            <Link to="/funding" className="flex items-center gap-1 hover:-translate-y-0.5 transition duration-200">
              <DollarSign size={18} />
              Funding
            </Link>
          )}
        </div>

        {/* AUTH BUTTONS / USER PROFILE */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <img
                 src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'User')}&background=dc2626&color=fff&rounded=true`}
                  alt={user?.displayName || "User Avatar"}
                  className="w-10 h-10 rounded-full border-2 border-white object-cover cursor-pointer hover:scale-105 transition"
                />
              </button>

              {/* USER PROFILE DROPDOWN */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 text-gray-800 z-50 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-semibold text-sm truncate">{user?.displayName}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  
                  <Link
                    to="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 transition"
                  >
                    <LayoutDashboard size={16} className="text-gray-500" />
                    Dashboard
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium transition"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 bg-white text-red-600 px-5 py-2 rounded-lg font-semibold hover:scale-[1.03] hover:-translate-y-0.5 transition duration-200 shadow-md"
            >
              <UserRound size={18} />
              Login
            </Link>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button className="md:hidden focus:outline-none" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white text-gray-800 px-6 py-5 space-y-4 border-t border-gray-100 shadow-inner">
          <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2 font-medium py-1">
            <Home size={18} className="text-red-500" /> Home
          </Link>

          <Link to="/donation-requests" onClick={() => setOpen(false)} className="flex items-center gap-2 font-medium py-1">
            <Heart size={18} className="text-red-500" /> Donation Requests
          </Link>

          {!user ? (
            <>
              <Link to="/search" onClick={() => setOpen(false)} className="flex items-center gap-2 font-medium py-1">
                <Search size={18} className="text-red-500" /> Search Donors
              </Link>
              <Link to="/login" onClick={() => setOpen(false)} className="flex items-center gap-2 text-red-600 font-bold py-1">
                <UserRound size={18} /> Login
              </Link>
            </>
          ) : (
            <>
              <Link to="/funding" onClick={() => setOpen(false)} className="flex items-center gap-2 font-medium py-1">
                <DollarSign size={18} className="text-red-500" /> Funding
              </Link>
              <Link to="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-2 font-medium py-1 text-gray-700">
                <LayoutDashboard size={18} className="text-red-500" /> Dashboard
              </Link>
              <button
                onClick={() => { setOpen(false); handleLogout(); }}
                className="w-full flex items-center gap-2 text-red-600 font-bold py-1 text-left"
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;