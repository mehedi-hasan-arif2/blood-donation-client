import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Heart, UserRound, Menu, X } from "lucide-react";
import logo from "/assets/logo.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 text-white shadow-lg sticky top-0 z-50">
      
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="logo"
            className="w-10 h-10 hover:scale-105 transition"
          />
          <span className="text-xl font-bold">SafeDonor</span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8">

          <Link
            to="/"
            className="flex items-center gap-1 hover:-translate-y-1 transition"
          >
            <Home size={18} className="hover:rotate-12 transition" />
            Home
          </Link>

          <Link
            to="/donation-requests"
            className="flex items-center gap-1 hover:-translate-y-1 transition"
          >
            <Heart size={18} className="hover:scale-110 transition" />
            Donation Requests
          </Link>

        </div>

        {/* LOGIN */}
        <Link
          to="/login"
          className="hidden md:flex items-center gap-2 bg-white text-red-600 px-4 py-2 rounded-lg font-semibold
          hover:scale-[1.03] hover:-translate-y-1 transition shadow-md"
        >
          <UserRound size={18} className="hover:rotate-12 transition" />
          Login
        </Link>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>

      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white text-black px-6 py-4 space-y-4">

          <Link to="/" className="flex items-center gap-2">
            <Home size={18} /> Home
          </Link>

          <Link to="/donation-requests" className="flex items-center gap-2">
            <Heart size={18} /> Donation Requests
          </Link>

          <Link to="/login" className="flex items-center gap-2 text-red-600 font-semibold">
            <UserRound size={18} /> Login
          </Link>

        </div>
      )}

    </nav>
  );
};

export default Navbar;