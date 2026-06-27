import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Droplets,
  MapPin,
  Calendar,
  Clock,
  Building2,
  FileText,
  User,
  Mail,
  Heart,
  X,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/Loader";

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="p-2 rounded-lg bg-red-50 shrink-0">
      <Icon size={15} className="text-red-500" />
    </div>
    <div>
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-700 mt-0.5">{value}</p>
    </div>
  </div>
);

const RequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const fetchRequest = async () => {
    try {
      const res = await axiosSecure.get(`/donation-requests/${id}`);
      setRequest(res.data);
    } catch {
      toast.error("Failed to load request details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const handleConfirmDonate = async () => {
    setConfirming(true);
    try {
      await axiosSecure.patch(`/donation-requests/update/${id}`, {
        status: "inprogress",
        donorName: user?.displayName || user?.email,
        donorEmail: user?.email,
      });
      toast.success("Thank you! Donation confirmed.");
      setShowModal(false);
      fetchRequest();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to confirm donation";
      toast.error(msg);
    } finally {
      setConfirming(false);
    }
  };

  if (loading) return <Loader />;

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Request not found.</p>
      </div>
    );
  }

  const isPending = request.status === "pending";

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-red-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header card */}
        <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-rose-500 to-pink-500 rounded-3xl p-8 text-white shadow-xl shadow-red-200">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold mb-3">
              <Droplets size={12} />
              Blood Donation Request
            </span>
            <h1 className="text-3xl font-extrabold">{request.recipientName}</h1>
            <p className="text-white/80 text-sm mt-1">{request.hospitalName}</p>
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/20 text-white font-bold text-lg">
              <Droplets size={16} />
              {request.bloodGroup}
            </div>
          </div>
          <Heart size={120} className="absolute -right-6 -top-6 text-white/10" />
        </div>

        {/* Details card */}
        <div className="bg-white rounded-3xl shadow-lg border border-red-100 p-8">
          <h2 className="text-base font-bold text-gray-700 mb-6 flex items-center gap-2">
            <FileText size={16} className="text-rose-500" />
            Request Information
          </h2>

          <div className="grid sm:grid-cols-2 gap-5">
            <InfoRow
              icon={MapPin}
              label="Location"
              value={`${request.recipientDistrict}, ${request.recipientUpazila}`}
            />
            <InfoRow
              icon={Building2}
              label="Hospital"
              value={request.hospitalName}
            />
            <InfoRow
              icon={MapPin}
              label="Full Address"
              value={request.fullAddress}
            />
            <InfoRow
              icon={Droplets}
              label="Blood Group"
              value={request.bloodGroup}
            />
            <InfoRow
              icon={Calendar}
              label="Donation Date"
              value={request.donationDate}
            />
            <InfoRow
              icon={Clock}
              label="Donation Time"
              value={request.donationTime}
            />
            <InfoRow
              icon={User}
              label="Requested By"
              value={request.requesterName}
            />
            <InfoRow
              icon={Mail}
              label="Requester Email"
              value={request.requesterEmail}
            />
          </div>

          {/* Request message */}
          <div className="mt-6 p-4 rounded-2xl bg-gray-50 border border-gray-100">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">
              Request Message
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              {request.requestMessage}
            </p>
          </div>

          {/* Status */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs text-gray-400 font-medium">Status:</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                request.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : request.status === "inprogress"
                  ? "bg-blue-100 text-blue-700"
                  : request.status === "done"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {request.status}
            </span>
          </div>
        </div>

        {/* Donate button — only if pending */}
        {isPending && (
          <button
            onClick={() => setShowModal(true)}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-500 text-white text-base font-bold shadow-xl shadow-red-200 hover:shadow-red-300 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
          >
            <Heart size={20} />
            Donate Now
          </button>
        )}

        {/* Not pending message */}
        {!isPending && (
          <div className="w-full py-4 rounded-2xl bg-gray-100 text-center text-gray-400 text-sm font-medium">
            This request is no longer accepting donations ({request.status})
          </div>
        )}

      </div>

      {/* Donate modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full space-y-5">

            {/* Modal header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-red-100">
                  <Heart size={20} className="text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  Confirm Donation
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            <p className="text-sm text-gray-500">
              You are about to confirm blood donation for{" "}
              <span className="font-semibold text-gray-700">
                {request.recipientName}
              </span>
              . Your information will be shared with the requester.
            </p>

            {/* Donor name — readonly */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1 mb-1 block">
                Your Name
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={user?.displayName || user?.email || ""}
                  readOnly
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Donor email — readonly */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1 mb-1 block">
                Your Email
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={user?.email || ""}
                  readOnly
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowModal(false)}
                disabled={confirming}
                className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-600 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDonate}
                disabled={confirming}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 text-white font-semibold shadow-md shadow-red-200 hover:shadow-red-300 transition-all disabled:opacity-50"
              >
                <CheckCircle size={16} />
                {confirming ? "Confirming..." : "Confirm Donation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestDetails;