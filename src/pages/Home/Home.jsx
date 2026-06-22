import { ArrowRight, Search, ShieldCheck } from "lucide-react";

const Home = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex items-center justify-center"
      style={{ backgroundImage: "url('/assets/banner.webp')" }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 text-center text-white max-w-3xl px-4">

        {/* TRUST BADGE */}
        <div className="flex justify-center mb-4">
          <span className="flex items-center gap-2 bg-white/20 px-4 py-1 rounded-full text-sm backdrop-blur-md">
            <ShieldCheck size={16} className="animate-pulse" />
            Trusted Blood Donation Platform
          </span>
        </div>

        <h1 className="text-5xl font-bold mb-4">
          Donate Blood, <span className="text-red-300">Save Lives</span>
        </h1>

        <p className="text-gray-200 mb-8">
          Every drop matters. Join thousands of heroes saving lives every day.
        </p>

        {/* BUTTONS */}
        <div className="flex flex-wrap gap-4 justify-center">

          <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold
          transition hover:scale-[1.03] hover:-translate-y-1 shadow-md">

            <ArrowRight size={18} className="transition group-hover:translate-x-1" />
            Join as Donor
          </button>

          <button className="flex items-center gap-2 border border-white hover:bg-white hover:text-black px-6 py-3 rounded-lg font-semibold
          transition hover:scale-[1.03] hover:-translate-y-1">

            <Search size={18} className="hover:scale-110 transition" />
            Search Donors
          </button>

        </div>

      </div>
    </div>
  );
};

export default Home;