import { useEffect, useState } from "react";
import {
  Users,
  Droplets,
  DollarSign,
  TrendingUp,
  HeartHandshake,
} from "lucide-react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import useRole from "../../hooks/useRole";
import Loader from "../../components/Loader";

const StatCard = ({ icon: Icon, label, value, color, bg, delay }) => (
  <div
    className={`bg-white rounded-3xl shadow-lg border border-gray-100 p-6 flex items-center gap-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
    style={{ animationDelay: delay }}
  >
    <div className={`p-4 rounded-2xl ${bg} shrink-0`}>
      <Icon size={28} className={color} />
    </div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{label}</p>
      <h3 className={`text-4xl font-extrabold mt-1 ${color}`}>{value}</h3>
    </div>
  </div>
);

const AdminHome = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { role } = useRole();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBloodDonationRequests: 0,
    totalFunding: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await axiosSecure.get("/admin-stats");
        setStats(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getStats();
  }, [axiosSecure]);

  if (loading) return <Loader />;

  const isVolunteer = role === "volunteer";

  return (
    <div className="space-y-8">

      {/* Welcome banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-rose-500 to-pink-500 rounded-3xl p-8 text-white shadow-xl shadow-red-200">
        <div className="relative z-10">
          <p className="text-white/80 text-sm font-medium mb-1 uppercase tracking-widest">
            Welcome back
          </p>
          <h2 className="text-3xl font-bold">
            {user?.displayName || (isVolunteer ? "Volunteer" : "Admin")} 👋
          </h2>
          <p className="text-white/80 mt-2 text-sm">
            {isVolunteer
              ? "You can manage and update blood donation requests from here."
              : "Manage users, monitor donations, and track all platform activities."}
          </p>
        </div>
        <HeartHandshake
          size={120}
          className="absolute -right-6 -top-6 text-white/10"
        />
      </div>

      {/* Stats cards */}
      <div>
        <h3 className="text-base font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <TrendingUp size={16} />
          Platform Overview
        </h3>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <StatCard
            icon={Users}
            label="Total Registered Users"
            value={stats.totalUsers}
            color="text-red-600"
            bg="bg-red-100"
            delay="0ms"
          />
          <StatCard
            icon={Droplets}
            label="Total Donation Requests"
            value={stats.totalBloodDonationRequests}
            color="text-rose-600"
            bg="bg-rose-100"
            delay="100ms"
          />
          <StatCard
            icon={DollarSign}
            label="Total Funding Raised"
            value={`$${stats.totalFunding.toLocaleString()}`}
            color="text-emerald-600"
            bg="bg-emerald-100"
            delay="200ms"
          />
        </div>
      </div>

      {/* Info box */}
      <div className="bg-white rounded-3xl shadow border border-red-100 p-8">
        <h3 className="text-lg font-bold text-gray-800 mb-3">
          {isVolunteer ? "Volunteer Panel" : "Admin Control Panel"}
        </h3>
        <p className="text-gray-500 leading-relaxed text-sm">
          {isVolunteer
            ? "As a volunteer, you can view all blood donation requests and update their status. Help coordinate donations and keep the platform running smoothly."
            : "As an admin, you have full control over the platform. You can manage users, handle all donation requests, track funding, and oversee every activity of the Blood Donation Management System."}
        </p>
      </div>

    </div>
  );
};

export default AdminHome;