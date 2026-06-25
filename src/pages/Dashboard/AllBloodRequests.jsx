import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loader from "../../components/Loader";

const AllBloodRequests = () => {
  const axiosSecure = useAxiosSecure();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axiosSecure.get(
          `/donation-requests?page=${page}&limit=10`
        );

        setRequests(res.data?.data || []);
        setTotalPages(res.data?.totalPages || 1);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [axiosSecure, page]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">
        All Blood Donation Requests
      </h2>

      <div className="overflow-x-auto bg-white rounded-xl shadow border">
        <table className="w-full text-left">
          <thead className="bg-red-50 text-red-600">
            <tr>
              <th className="p-3">Recipient</th>
              <th className="p-3">Blood Group</th>
              <th className="p-3">District</th>
              <th className="p-3">Upazila</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((req) => (
              <tr key={req._id} className="border-t">
                <td className="p-3">{req.recipientName}</td>
                <td className="p-3 font-semibold text-red-600">
                  {req.bloodGroup}
                </td>
                <td className="p-3">{req.recipientDistrict}</td>
                <td className="p-3">{req.recipientUpazila}</td>
                <td className="p-3 capitalize">
                  {req.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-3 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="px-4 py-2">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllBloodRequests;