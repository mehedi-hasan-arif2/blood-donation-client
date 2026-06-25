import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";

const MyDonationRequests = () => {
  const axiosSecure = useAxiosSecure();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyRequests = async () => {
    try {
      const res = await axiosSecure.get("/my-donation-requests");
      setRequests(res.data);
    } catch (error) {
      toast.error("Failed to load your requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyRequests(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this?")) return;
    try {
      await axiosSecure.delete(`/donation-requests/${id}`);
      toast.success("Deleted successfully");
      fetchMyRequests();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="overflow-x-auto bg-white p-6 rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-5">My Donation Requests</h2>
      <table className="table w-full">
        <thead>
          <tr><th>Recipient</th><th>Blood</th><th>Date</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req._id}>
              <td>{req.recipientName}</td>
              <td>{req.bloodGroup}</td>
              <td>{req.donationDate}</td>
              <td>{req.status}</td>
              <td className="flex gap-2">
                <button onClick={() => handleDelete(req._id)} className="btn btn-xs btn-error">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyDonationRequests;