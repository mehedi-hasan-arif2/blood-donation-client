import { useEffect, useState } from "react";
import {
  Users,
  HeartHandshake,
  Droplets,
} from "lucide-react";

import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loader from "../../components/Loader";

const AdminHome = () => {
  const axiosSecure = useAxiosSecure();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRequests: 0,
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

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">
          Dashboard Overview
        </h2>

        <p className="text-gray-500 mt-2">
          Blood Donation Management Statistics
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">
                Total Users
              </p>

              <h3 className="text-4xl font-bold mt-2 text-red-600">
                {stats.totalUsers}
              </h3>
            </div>

            <div className="p-4 rounded-full bg-red-100">
              <Users size={32} className="text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">
                Total Donation Requests
              </p>

              <h3 className="text-4xl font-bold mt-2 text-rose-600">
                {stats.totalRequests}
              </h3>
            </div>

            <div className="p-4 rounded-full bg-rose-100">
              <Droplets size={32} className="text-rose-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">
                Total Funding
              </p>

              <h3 className="text-4xl font-bold mt-2 text-green-600">
                ${stats.totalFunding}
              </h3>
            </div>

            <div className="p-4 rounded-full bg-green-100">
              <HeartHandshake
                size={32}
                className="text-green-600"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-8">
        <h3 className="text-xl font-bold mb-4">
          Welcome to Admin Dashboard
        </h3>

        <p className="text-gray-600 leading-relaxed">
          From here you can manage users, monitor blood
          donation requests, track platform funding and
          oversee all activities of the Blood Donation
          Management System.
        </p>
      </div>
    </div>
  );
};

export default AdminHome;