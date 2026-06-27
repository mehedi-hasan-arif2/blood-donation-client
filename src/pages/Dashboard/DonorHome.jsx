import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  Droplets,
  ClipboardList,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/Loader";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
  inprogress: "bg-blue-100 text-blue-700 border-blue-300",
  done: "bg-green-100 text-green-700 border-green-300",
  canceled: "bg-red-100 text-red-700 border-red-300",
};

const DonorHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const fetchRecentRequests = async () => {
    try {
      const res = await axiosSecure.get("/my-donation-requests");

      setRequests(res.data.slice(0, 3));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentRequests();
  }, [axiosSecure]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axiosSecure.patch(`/donation-requests/update/${id}`, {
        status: newStatus,
      });
      toast.success(`Status updated to ${newStatus}`);
      fetchRecentRequests();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axiosSecure.delete(`/donation-requests/${deleteId}`);
      toast.success("Donation request deleted");
      setDeleteId(null);
      fetchRecentRequests();
    } catch {
      toast.error("Failed to delete request");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-8">

      {/* Welcome banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-rose-500 to-pink-500 rounded-3xl p-8 text-white shadow-xl shadow-red-200">
        <div className="relative z-10">
          <p className="text-white/80 text-sm font-medium mb-1 uppercase tracking-widest">
            Welcome back
          </p>
          <h2 className="text-3xl font-bold">
            {user?.displayName || user?.name || "Donor"}👋
          </h2>
          <p className="text-white/80 mt-2 text-sm">
            Manage your blood donation requests from here.
          </p>
        </div>
        <Droplets
          size={120}
          className="absolute -right-6 -top-6 text-white/10"
        />
      </div>

      {/* Recent requests section */}
      {requests.length > 0 && (
        <div className="bg-white rounded-3xl shadow-lg border border-red-100 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
            <div className="p-2 rounded-xl bg-red-50">
              <ClipboardList size={20} className="text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">
              Recent Donation Requests
            </h3>
            <span className="ml-auto text-xs text-gray-400 font-medium">
              Last {requests.length} request{requests.length > 1 ? "s" : ""}
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">Recipient</th>
                  <th className="px-4 py-3 text-left">Location</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Time</th>
                  <th className="px-4 py-3 text-left">Blood</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Donor Info</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requests.map((req) => (
                  <tr
                    key={req._id}
                    className="hover:bg-rose-50/40 transition-colors"
                  >
                    <td className="px-4 py-4 font-semibold text-gray-800">
                      {req.recipientName}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {req.recipientDistrict}, {req.recipientUpazila}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {req.donationDate}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {req.donationTime}
                    </td>

                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-red-50 text-red-600 font-bold text-xs border border-red-200">
                        <Droplets size={11} />
                        {req.bloodGroup}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColors[req.status]
                          }`}
                      >
                        {req.status}
                      </span>

                      {/* Done / Cancel — only when inprogress */}
                      {req.status === "inprogress" && (
                        <div className="flex gap-1 mt-2">
                          <button
                            onClick={() =>
                              handleStatusUpdate(req._id, "done")
                            }
                            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-500 text-white text-xs hover:bg-green-600 transition-colors"
                          >
                            <CheckCircle size={11} />
                            Done
                          </button>
                          <button
                            onClick={() =>
                              handleStatusUpdate(req._id, "canceled")
                            }
                            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500 text-white text-xs hover:bg-red-600 transition-colors"
                          >
                            <XCircle size={11} />
                            Cancel
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Donor info — only when inprogress */}
                    <td className="px-4 py-4 text-gray-600 text-xs">
                      {req.status === "inprogress" &&
                        req.donorName ? (
                        <div>
                          <p className="font-semibold text-gray-700">
                            {req.donorName}
                          </p>
                          <p className="text-gray-400">{req.donorEmail}</p>
                        </div>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* View */}
                        <button
                          onClick={() =>
                            navigate(`/donation-request/${req._id}`)
                          }
                          title="View"
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        >
                          <Eye size={15} />
                        </button>

                        {/* Edit */}
                        {req.status === "pending" && (
                          <button
                            onClick={() =>
                              navigate(`/dashboard/edit-donation-request/${req._id}`)
                            }
                            title="Edit"
                            className="p-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                          >
                            <Pencil size={15} />
                          </button>
                        )}

                        {/* Delete */}
                        {req.status === "pending" && (
                          <button
                            onClick={() => setDeleteId(req._id)}
                            title="Delete"
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* View all button */}
          <div className="px-6 py-5 border-t border-gray-100 flex justify-center">
            <Link
              to="/dashboard/my-donation-requests"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 text-white text-sm font-semibold shadow-md shadow-red-200 hover:shadow-red-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <ClipboardList size={16} />
              View My All Requests
            </Link>
          </div>
        </div>
      )}

      {/* No requests section */}
      {requests.length === 0 && (
        <div className="bg-white rounded-3xl shadow border border-red-50 p-12 flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
            <Droplets size={28} className="text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">
            No donation requests yet
          </h3>
          <p className="text-gray-400 text-sm max-w-sm">
            You have not created any blood donation requests. Start by
            creating your first request.
          </p>
          <Link
            to="/dashboard/create-donation-request"
            className="mt-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 text-white text-sm font-semibold shadow-md shadow-red-200 hover:scale-[1.02] transition-all"
          >
            Create Donation Request
          </Link>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
              <AlertTriangle size={28} className="text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">
              Delete Request?
            </h3>
            <p className="text-gray-500 text-sm">
              This action cannot be undone. The donation request will
              be permanently deleted.
            </p>
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-600 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorHome;