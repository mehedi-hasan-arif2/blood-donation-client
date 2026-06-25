import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loader from "../../components/Loader";

const RequestDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosSecure.get(`/donation-requests/${id}`).then((res) => {
      setRequest(res.data);
      setLoading(false);
    });
  }, [id, axiosSecure]);

  if (loading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-red-600 mb-4">{request.recipientName}</h2>
      <p><strong>Hospital:</strong> {request.hospitalName}</p>
      <p><strong>Location:</strong> {request.fullAddress}</p>
      <p><strong>Blood Group:</strong> {request.bloodGroup}</p>
      <p><strong>Date & Time:</strong> {request.donationDate} at {request.donationTime}</p>
      <p className="mt-4 text-gray-600">{request.requestMessage}</p>
      <button className="mt-6 w-full btn btn-primary">Donate Now</button>
    </div>
  );
};

export default RequestDetails;