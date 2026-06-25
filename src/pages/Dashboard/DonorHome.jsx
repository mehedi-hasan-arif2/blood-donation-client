import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/Loader";

const DonorHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentRequests = async () => {
      try {
        const res = await axiosSecure.get("/donation-requests/recent");
        setRequests(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentRequests();
  }, [axiosSecure]);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Welcome, {user?.displayName}!</h2>
      <div className="bg-white p-6 rounded-2xl shadow border">
        <h3 className="text-xl font-semibold mb-4">Your Recent Requests</h3>
        {requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map((req) => (
              <div key={req._id} className="p-4 border rounded-xl flex justify-between items-center">
                <div>
                  <p className="font-bold">{req.recipientName}</p>
                  <p className="text-sm text-gray-500">{req.hospitalName}</p>
                </div>
                <span className="badge badge-primary">{req.status}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No recent requests found.</p>
        )}
      </div>
    </div>
  );
};

export default DonorHome;