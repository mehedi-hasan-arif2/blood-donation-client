import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Droplets,
  MapPin,
  Calendar,
  Clock,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import Loader from "../../components/Loader";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
};

const DonationRequests = () => {
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 9;

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axiosPublic.get(
        `/donation-requests?status=pending&page=${page}&limit=${limit}`
      );
      setRequests(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [page]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-red-50 py-12 px-4">

      {/* Page header */}
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 text-red-600 text-xs font-semibold uppercase tracking-wider mb-4">
          <Droplets size={13} />
          Blood Donation
        </span>
        <h1 className="text-4xl font-extrabold text-gray-800 mb-3">
          Pending Donation Requests
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto text-sm">
          People in need are waiting for your help. View the requests below
          and step forward to save a life.
        </p>
      </div>

      {/* Cards grid */}
      <div className="max-w-6xl mx-auto">
        {requests.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Droplets size={48} className="mx-auto mb-4 text-red-200" />
            <p className="text-lg font-medium">No pending requests found.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((req) => (
              <div
                key={req._id}
                className="bg-white rounded-3xl shadow-md border border-red-50 p-6 flex flex-col gap-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Top — blood group badge + status */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 text-white text-sm font-extrabold shadow-sm">
                    <Droplets size={14} />
                    {req.bloodGroup}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                    Pending
                  </span>
                </div>

                {/* Recipient name */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 leading-tight">
                    {req.recipientName}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5 font-medium">
                    {req.hospitalName}
                  </p>
                </div>

                {/* Info rows */}
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
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-12">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="p-2 rounded-xl border border-gray-200 hover:border-red-400 hover:text-red-500 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>

            {[...Array(totalPages).keys()].map((p) => (
              <button
                key={p}
                onClick={() => setPage(p + 1)}
                className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${
                  page === p + 1
                    ? "bg-red-600 text-white shadow-md shadow-red-200"
                    : "border border-gray-200 text-gray-600 hover:border-red-400 hover:text-red-500"
                }`}
              >
                {p + 1}
              </button>
            ))}

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="p-2 rounded-xl border border-gray-200 hover:border-red-400 hover:text-red-500 disabled:opacity-40 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationRequests;