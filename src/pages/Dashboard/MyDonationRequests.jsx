import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  Droplets,
  Filter,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loader from "../../components/Loader";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
  inprogress: "bg-blue-100 text-blue-700 border-blue-300",
  done: "bg-green-100 text-green-700 border-green-300",
  canceled: "bg-red-100 text-red-700 border-red-300",
};

const ITEMS_PER_PAGE = 5;

const MyDonationRequests = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/my-donation-requests");
      setRequests(res.data || []);
    } catch {
      toast.error("Failed to load your requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRequests();
  }, []);

  // filter + paginate client side
  useEffect(() => {
    const data = statusFilter
      ? requests.filter((r) => r.status === statusFilter)
      : requests;
    setFiltered(data);
    setPage(1);
  }, [statusFilter, requests]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axiosSecure.patch(`/donation-requests/update/${id}`, {
        status: newStatus,
      });
      toast.success(`Status updated to ${newStatus}`);
      fetchMyRequests();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axiosSecure.delete(`/donation-requests/${deleteId}`);
      toast.success("Request deleted");
      setDeleteId(null);
      fetchMyRequests();
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-red-100">
            <Droplets size={22} className="text-red-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">My Donation Requests</h2>
            <p className="text-sm text-gray-400">{filtered.length} request(s) found</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="select select-bordered select-sm w-44 focus:outline-none focus:border-red-400"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th>Recipient</th>
                <th>Location</th>
                <th>Date</th>
                <th>Time</th>
                <th>Blood</th>
                <th>Status</th>
                <th>Donor Info</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400">
                    No requests found
                  </td>
                </tr>
              ) : (
                paginated.map((req) => (
                  <tr key={req._id} className="hover:bg-rose-50/30 transition-colors">

                    <td className="font-semibold text-gray-800 text-sm">
                      {req.recipientName}
                    </td>

                    <td className="text-gray-500 text-sm">
                      {req.recipientDistrict}, {req.recipientUpazila}
                    </td>

                    <td className="text-gray-500 text-sm">{req.donationDate}</td>

                    <td className="text-gray-500 text-sm">{req.donationTime}</td>

                    <td>
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-red-50 text-red-600 font-bold text-xs border border-red-200">
                        <Droplets size={11} />
                        {req.bloodGroup}
                      </span>
                    </td>

                    <td>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColors[req.status]}`}>
                        {req.status}
                      </span>

                      {req.status === "inprogress" && (
                        <div className="flex gap-1 mt-2">
                          <button
                            onClick={() => handleStatusUpdate(req._id, "done")}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-500 text-white text-xs hover:bg-green-600 transition-colors cursor-pointer"
                          >
                            <CheckCircle size={11} />
                            Done
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(req._id, "canceled")}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500 text-white text-xs hover:bg-red-600 transition-colors cursor-pointer"
                          >
                            <XCircle size={11} />
                            Cancel
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="text-xs text-gray-500">
                      {req.status === "inprogress" && req.donorName ? (
                        <div>
                          <p className="font-semibold text-gray-700">{req.donorName}</p>
                          <p className="text-gray-400">{req.donorEmail}</p>
                        </div>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>

                    <td>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => navigate(`/donation-request/${req._id}`)}
                          title="View"
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => navigate(`/dashboard/edit-donation-request/${req._id}`)}
                          title="Edit"
                          className="p-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors cursor-pointer"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteId(req._id)}
                          title="Delete"
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 flex-wrap">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="btn btn-sm border border-gray-200 hover:border-red-400 hover:text-red-500 disabled:opacity-40"
          >
            Prev
          </button>
          {[...Array(totalPages).keys()].map((p) => (
            <button
              key={p}
              onClick={() => setPage(p + 1)}
              className={`btn btn-sm ${
                page === p + 1
                  ? "bg-red-600 text-white border-red-600 hover:bg-red-700"
                  : "border border-gray-200 hover:border-red-400"
              }`}
            >
              {p + 1}
            </button>
          ))}
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="btn btn-sm border border-gray-200 hover:border-red-400 hover:text-red-500 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {/* Delete modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
              <AlertTriangle size={28} className="text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Delete Request?</h3>
            <p className="text-gray-500 text-sm">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-600 font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-50"
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

export default MyDonationRequests;