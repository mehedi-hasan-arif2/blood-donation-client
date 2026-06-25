import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAxiosPublic from "../../hooks/useAxiosPublic"; 
import Loader from "../../components/Loader";

const DonationRequests = () => {
  const axiosPublic = useAxiosPublic();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosPublic.get("/donation-requests?status=pending").then((res) => {
      setRequests(res.data.data);
      setLoading(false);
    });
  }, [axiosPublic]);

  if (loading) return <Loader />;

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">All Pending Requests</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {requests.map((req) => (
          <div key={req._id} className="card bg-white shadow p-6 rounded-xl">
            <h3 className="font-bold text-xl">{req.recipientName}</h3>
            <p>Group: {req.bloodGroup}</p>
            <p>Hospital: {req.hospitalName}</p>
            <Link to={`/donation-request/${req._id}`} className="btn btn-primary mt-4">View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
};
export default DonationRequests;