import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Search,
  ShieldCheck,
  Heart,
  Users,
  Clock,
  Mail,
  Phone,
  MapPin,
  Send,
  Droplets,
  Calendar,
  Eye,
  ChevronRight,
} from "lucide-react";
import useAxiosPublic from "../hooks/useAxiosPublic";

const Home = () => {
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  const [recentRequests, setRecentRequests] = useState([]);

  useEffect(() => {
    axiosPublic
      .get("/donation-requests/recent")
      .then((res) => setRecentRequests(res.data || []))
      .catch(() => {});
  }, [axiosPublic]);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    e.target.reset();
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">

      {/* BANNER */}
      <div
        className="h-screen bg-cover bg-center relative flex items-center justify-center"
        style={{ backgroundImage: "url('/assets/banner.webp')" }}
      >
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 text-center text-white max-w-3xl px-4">
          <div className="flex justify-center mb-4">
            <span className="flex items-center gap-2 bg-white/20 px-4 py-1 rounded-full text-sm backdrop-blur-md">
              <ShieldCheck size={16} className="animate-pulse" />
              Trusted Blood Donation Platform
            </span>
          </div>

          <h1 className="text-5xl font-bold mb-4">
            Donate Blood,{" "}
            <span className="text-red-300">Save Lives</span>
          </h1>

          <p className="text-gray-200 mb-8">
            Every drop matters. Join thousands of heroes saving lives every day.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            {/* Join as Donor */}
            <button
              onClick={() => navigate("/register")}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition duration-300 hover:scale-[1.05] hover:-translate-y-1 shadow-md hover:shadow-red-500/20"
            >
              <ArrowRight size={18} />
              Join as Donor
            </button>

            <button
              onClick={() => navigate("/search")}
              className="flex items-center gap-2 border border-white hover:bg-white hover:text-black px-6 py-3 rounded-lg font-semibold transition duration-300 hover:scale-[1.05] hover:-translate-y-1"
            >
              <Search size={18} />
              Search Donors
            </button>
          </div>
        </div>
      </div>

      {/* FEATURED SECTION */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-red-500 font-bold tracking-wider uppercase text-xs">
            Features
          </span>
          <h2 className="text-4xl font-extrabold text-gray-900 mt-2 mb-4 tracking-tight">
            Our Key Features
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-rose-500 mx-auto rounded-full" />
          <p className="text-gray-500 mt-4 max-w-xl mx-auto text-base">
            Making blood donation smooth, secure, and fully automated for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-red-100 hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-500/5 transition-all duration-300 flex flex-col items-center text-center">
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl mb-6 group-hover:bg-red-500 group-hover:text-white transition-all duration-300">
              <Clock size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-red-500 transition-colors">
              Fast Requests
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Create emergency blood donation requests instantly and reach active donors in minutes.
            </p>
          </div>

          <div className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-rose-100 hover:-translate-y-2 hover:shadow-2xl hover:shadow-rose-500/5 transition-all duration-300 flex flex-col items-center text-center">
            <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl mb-6 group-hover:bg-rose-500 group-hover:text-white transition-all duration-300">
              <Users size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-rose-500 transition-colors">
              Verified Donors
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Connect with authentic and responsive blood donors sorted by your exact location.
            </p>
          </div>

          <div className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-pink-100 hover:-translate-y-2 hover:shadow-2xl hover:shadow-pink-500/5 transition-all duration-300 flex flex-col items-center text-center">
            <div className="p-4 bg-pink-50 text-pink-600 rounded-2xl mb-6 group-hover:bg-pink-500 group-hover:text-white transition-all duration-300">
              <Heart size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-pink-500 transition-colors">
              Secure Funding
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Contribute safely using Stripe to empower our local camp activities and secure operations.
            </p>
          </div>
        </div>
      </section>

      {/* RECENT DONATION REQUESTS SECTION */}
      {recentRequests.length > 0 && (
        <section className="py-24 px-6 bg-gradient-to-br from-red-50 via-rose-50/40 to-white border-t border-red-100/40">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-red-500 font-bold tracking-wider uppercase text-xs">
                Urgent
              </span>
              <h2 className="text-4xl font-extrabold text-gray-900 mt-2 mb-4 tracking-tight">
                Recent Donation Requests
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-rose-500 mx-auto rounded-full" />
              <p className="text-gray-500 mt-4 max-w-xl mx-auto text-base">
                These people urgently need blood. Step forward and save a life today.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentRequests.map((req) => (
                <div
                  key={req._id}
                  className="bg-white rounded-3xl shadow-md border border-red-50 p-6 flex flex-col gap-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Top */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 text-white text-sm font-extrabold shadow-sm">
                      <Droplets size={14} />
                      {req.bloodGroup}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                      Pending
                    </span>
                  </div>

                  {/* Name */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 leading-tight">
                      {req.recipientName}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">{req.hospitalName}</p>
                  </div>

                  {/* Info */}
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-rose-400 shrink-0" />
                      <span>
                        {req.recipientDistrict}, {req.recipientUpazila}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-rose-400 shrink-0" />
                      <span>{req.donationDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-rose-400 shrink-0" />
                      <span>{req.donationTime}</span>
                    </div>
                  </div>

                  {/* View button */}
                  <button
                    onClick={() => navigate(`/donation-request/${req._id}`)}
                    className="mt-auto w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 text-white text-sm font-semibold shadow-md shadow-red-200 hover:shadow-red-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                  >
                    <Eye size={15} />
                    View Details
                  </button>
                </div>
              ))}
            </div>

            {/* See all button */}
            <div className="flex justify-center mt-10">
              <button
                onClick={() => navigate("/donation-requests")}
                className="flex items-center gap-2 px-8 py-3 rounded-xl border-2 border-red-600 text-red-600 font-semibold text-sm hover:bg-red-600 hover:text-white transition-all duration-200 hover:shadow-lg hover:shadow-red-200"
              >
                See All Requests
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* CONTACT SECTION */}
      <section className="bg-white py-24 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-red-500 font-bold tracking-wider uppercase text-xs">
              Support
            </span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-2 mb-4 tracking-tight">
              Contact Us
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-rose-500 mx-auto rounded-full" />
            <p className="text-gray-500 mt-4 max-w-xl mx-auto text-base">
              Have questions or need support? Drop us a message, we are here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
            {/* Contact info */}
            <div className="space-y-8 bg-gradient-to-br from-red-50/60 via-rose-50/40 to-pink-50/60 p-10 rounded-2xl border border-red-100/30 flex flex-col justify-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Get In Touch
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Feel free to contact us via form or direct hotline numbers for urgent blood network queries.
                </p>
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-4 text-gray-700">
                  <div className="p-3 bg-white text-red-500 rounded-xl shadow-sm border border-red-100/60">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Hotline Number</p>
                    <span className="font-bold text-sm text-gray-800">
                      +880 1234 567890
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-gray-700">
                  <div className="p-3 bg-white text-red-500 rounded-xl shadow-sm border border-red-100/60">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Email Address</p>
                    <span className="font-bold text-sm text-gray-800">
                      support@safedonor.com
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-gray-700">
                  <div className="p-3 bg-white text-red-500 rounded-xl shadow-sm border border-red-100/60">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Our Location</p>
                    <span className="font-bold text-sm text-gray-800">
                      Dhaka, Bangladesh
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <form
              onSubmit={handleContactSubmit}
              className="space-y-5 bg-white p-10 rounded-2xl border border-gray-200/80 shadow-xl shadow-gray-100 flex flex-col justify-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-rose-500 to-pink-500" />

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all shadow-sm focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all shadow-sm focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Message
                </label>
                <textarea
                  rows="4"
                  placeholder="Write your message here..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all shadow-sm focus:bg-white resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 via-rose-500 to-pink-500 text-white py-3.5 rounded-xl font-semibold transition duration-300 hover:opacity-95 hover:scale-[1.01] shadow-md hover:shadow-red-500/20 active:scale-[0.99] cursor-pointer"
              >
                <Send size={16} />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;