import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";

const AllBloodRequests = () => {
  const axiosSecure = useAxiosSecure();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get(`/donation-requests?page=${page}&limit=10`);
      setRequests(res.data?.data || []);
      setTotalPages(res.data?.totalPages || 1);
    } catch (error) {
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [axiosSecure, page]);

  // Status update handler
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axiosSecure.patch(`/donation-requests/update/${id}`, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      fetchRequests(); 
    } catch (error) {
      toast.error("Update failed");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">All Blood Donation Requests</h2>
      <div className="overflow-x-auto bg-white rounded-xl shadow border">
        <table className="w-full text-left">
          <thead className="bg-red-50 text-red-600">
            <tr>
              <th className="p-3">Recipient</th>
              <th className="p-3">Blood</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id} className="border-t">
                <td className="p-3">{req.recipientName}</td>
                <td className="p-3 font-semibold text-red-600">{req.bloodGroup}</td>
                <td className="p-3">
                  <span className={`badge ${req.status === 'pending' ? 'badge-warning' : 'badge-success'}`}>
                    {req.status}
                  </span>
                </td>
                <td className="p-3 flex gap-2">
                  {req.status === 'pending' && (
                    <>
                      <button onClick={() => handleUpdateStatus(req._id, 'done')} className="btn btn-xs btn-success">Done</button>
                      <button onClick={() => handleUpdateStatus(req._id, 'canceled')} className="btn btn-xs btn-error">Cancel</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllBloodRequests;