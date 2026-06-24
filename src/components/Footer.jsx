import { Link } from "react-router-dom";
import { Heart, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";

// SVG ICONS FOR SOCIAL MEDIA
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* COL 1: BRAND LOGO & ABOUT */}
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2 text-2xl font-black text-white tracking-wider">
            <span className="bg-gradient-to-r from-red-600 to-rose-500 text-white p-2 rounded-xl shadow-lg shadow-red-500/20">
              🩸
            </span>
            SAFE<span className="text-red-500">DONOR</span>
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed pt-2">
            Connecting heroes every single day. A secure, real-time and MERN-powered blood network built to save lives instantly across the nation.
          </p>
          
          {/* SOCIAL LINKS WITH HOVER EFFECTS */}
          <div className="flex items-center gap-3 pt-3">
            <a href="#" className="p-2 bg-gray-800 hover:bg-blue-600 hover:text-white rounded-xl transition duration-300 hover:-translate-y-1">
              <FacebookIcon />
            </a>
            <a href="#" className="p-2 bg-gray-800 hover:bg-black hover:text-white rounded-xl transition duration-300 hover:-translate-y-1 flex items-center justify-center">
              <XIcon />
            </a>
            <a href="#" className="p-2 bg-gray-800 hover:bg-pink-600 hover:text-white rounded-xl transition duration-300 hover:-translate-y-1">
              <InstagramIcon />
            </a>
            <a href="#" className="p-2 bg-gray-800 hover:bg-blue-700 hover:text-white rounded-xl transition duration-300 hover:-translate-y-1">
              <LinkedinIcon />
            </a>
          </div>
        </div>

        {/* COL 2: QUICK LINKS */}
        <div>
          <h4 className="text-white font-bold text-lg mb-6 relative inline-block">
            Quick Links
            <span className="absolute left-0 bottom-[-6px] w-8 h-1 bg-red-500 rounded-full"></span>
          </h4>
          <ul className="space-y-3.5 text-sm">
            <li>
              <Link to="/donation-requests" className="flex items-center gap-1 hover:text-red-400 transition-all duration-300 hover:translate-x-1 group">
                <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                Donation Requests
              </Link>
            </li>
            <li>
              <Link to="/search" className="flex items-center gap-1 hover:text-red-400 transition-all duration-300 hover:translate-x-1 group">
                <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                Search Donors
              </Link>
            </li>
            <li>
              <Link to="/funding" className="flex items-center gap-1 hover:text-red-400 transition-all duration-300 hover:translate-x-1 group">
                <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                Funding Campaign
              </Link>
            </li>
          </ul>
        </div>

        {/* COL 3: CONTACT INFORMATION */}
        <div>
          <h4 className="text-white font-bold text-lg mb-6 relative inline-block">
            Contact Support
            <span className="absolute left-0 bottom-[-6px] w-8 h-1 bg-red-500 rounded-full"></span>
          </h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-red-500 shrink-0 mt-0.5" />
              <span className="text-gray-400">Dhaka, Bangladesh</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-red-500 shrink-0" />
              <span className="text-gray-400">+880 1234 567890</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-red-500 shrink-0" />
              <span className="text-gray-400">support@safedonor.com</span>
            </li>
          </ul>
        </div>

        {/* COL 4: EMERGENCY HELP */}
        <div>
          <h4 className="text-white font-bold text-lg mb-6 relative inline-block">
            Emergency Help
            <span className="absolute left-0 bottom-[-6px] w-8 h-1 bg-red-500 rounded-full"></span>
          </h4>
          <p className="text-sm text-gray-400 leading-relaxed mb-4">
            If you are facing any critical network bugs or need immediate group admin integration, call us immediately.
          </p>
          <div className="bg-gradient-to-r from-red-900/40 to-rose-900/40 border border-red-900/60 p-4 rounded-xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400 block mb-1">Available 24/7</span>
            <span className="text-white font-extrabold text-base">Call: 999 / +8801234</span>
          </div>
        </div>

      </div>

      {/* COPYRIGHT LOWER SECTION */}
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-800 text-center text-sm text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© 2026 SafeDonor Network. All rights reserved.</p>
        <p className="flex items-center gap-1.5 justify-center">
          Empowering donors <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" /> & saving lives globally.
        </p>
      </div>
    </footer>
  );
};

export default Footer;