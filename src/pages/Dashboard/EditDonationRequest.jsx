import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  User,
  Droplets,
  MapPin,
  Map,
  Building2,
  FileText,
  Calendar,
  Clock,
  Save,
} from "lucide-react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loader from "../../components/Loader";
import districtsData from "../../data/districts.json";
import upazilasData from "../../data/upazilas.json";

const allDistricts = districtsData[2]?.data || [];
const allUpazilas = upazilasData[2]?.data || [];
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all duration-200 bg-white";

const inputWithIconClass =
  "w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all duration-200 bg-white";

const labelClass =
  "text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1 mb-1 block";

const EditDonationRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [recipientName, setRecipientName] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [donationDate, setDonationDate] = useState("");
  const [donationTime, setDonationTime] = useState("");
  const [requestMessage, setRequestMessage] = useState("");

  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [selectedDistrictName, setSelectedDistrictName] = useState("");
  const [selectedUpazila, setSelectedUpazila] = useState("");
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);

  // fetch existing request data
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await axiosSecure.get(`/donation-requests/${id}`);
        const data = res.data;

        setRecipientName(data.recipientName || "");
        setHospitalName(data.hospitalName || "");
        setFullAddress(data.fullAddress || "");
        setBloodGroup(data.bloodGroup || "");
        setDonationDate(data.donationDate || "");
        setDonationTime(data.donationTime || "");
        setRequestMessage(data.requestMessage || "");
        setSelectedDistrictName(data.recipientDistrict || "");
        setSelectedUpazila(data.recipientUpazila || "");

        // find district id from name
        const distObj = allDistricts.find(
          (d) => d.name === data.recipientDistrict
        );
        if (distObj) {
          setSelectedDistrictId(distObj.id);
        }
      } catch {
        toast.error("Failed to load request");
        navigate("/dashboard/my-donation-requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [id]);

  // filter upazilas when district changes
  useEffect(() => {
    if (selectedDistrictId) {
      setFilteredUpazilas(
        allUpazilas.filter(
          (u) => String(u.district_id) === String(selectedDistrictId)
        )
      );
    } else {
      setFilteredUpazilas([]);
    }
  }, [selectedDistrictId]);

  const handleDistrictChange = (e) => {
    const distId = e.target.value;
    const distObj = allDistricts.find((d) => d.id === distId);
    setSelectedDistrictId(distId);
    setSelectedDistrictName(distObj?.name || "");
    setSelectedUpazila("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDistrictName || !selectedUpazila) {
      toast.error("Please select district and upazila");
      return;
    }

    setSubmitting(true);
    try {
      await axiosSecure.patch(`/donation-requests/edit/${id}`, {
        recipientName,
        recipientDistrict: selectedDistrictName,
        recipientUpazila: selectedUpazila,
        hospitalName,
        fullAddress,
        bloodGroup,
        donationDate,
        donationTime,
        requestMessage,
      });

      toast.success("Donation request updated successfully!");
      navigate("/dashboard/my-donation-requests");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update request";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-2xl mx-auto">

      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-rose-500 to-pink-500 rounded-3xl p-8 text-white shadow-xl shadow-red-200 mb-8">
        <div className="relative z-10">
          <p className="text-white/80 text-sm font-medium mb-1 uppercase tracking-widest">
            Dashboard
          </p>
          <h2 className="text-3xl font-bold">Edit Donation Request</h2>
          <p className="text-white/80 mt-2 text-sm">
            Update the details below and save your changes.
          </p>
        </div>
        <Droplets size={100} className="absolute -right-4 -top-4 text-white/10" />
      </div>

      {/* Form */}
      <div className="bg-white rounded-3xl shadow-lg border border-red-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Recipient Name */}
          <div>
            <label className={labelClass}>Recipient Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Recipient full name"
                required
                className={inputWithIconClass}
              />
            </div>
          </div>

          {/* District */}
          <div>
            <label className={labelClass}>Recipient District</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={selectedDistrictId}
                onChange={handleDistrictChange}
                required
                className={`${inputWithIconClass} appearance-none`}
              >
                <option value="">Select District</option>
                {allDistricts.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Upazila */}
          <div>
            <label className={labelClass}>Recipient Upazila</label>
            <div className="relative">
              <Map size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={selectedUpazila}
                onChange={(e) => setSelectedUpazila(e.target.value)}
                disabled={!selectedDistrictId}
                required
                className={`${inputWithIconClass} appearance-none ${!selectedDistrictId ? "bg-gray-50 cursor-not-allowed" : ""}`}
              >
                <option value="">
                  {selectedDistrictId ? "Select Upazila" : "Select district first"}
                </option>
                {filteredUpazilas.map((u) => (
                  <option key={u.id} value={u.name}>{u.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Hospital Name */}
          <div>
            <label className={labelClass}>Hospital Name</label>
            <div className="relative">
              <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                placeholder="e.g. Dhaka Medical College Hospital"
                required
                className={inputWithIconClass}
              />
            </div>
          </div>

          {/* Full Address */}
          <div>
            <label className={labelClass}>Full Address</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                placeholder="e.g. Zahir Raihan Rd, Dhaka"
                required
                className={inputWithIconClass}
              />
            </div>
          </div>

          {/* Blood Group */}
          <div>
            <label className={labelClass}>Blood Group</label>
            <div className="relative">
              <Droplets size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                required
                className={`${inputWithIconClass} appearance-none`}
              >
                <option value="">Select Blood Group</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Donation Date</label>
              <input
                type="date"
                value={donationDate}
                onChange={(e) => setDonationDate(e.target.value)}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Donation Time</label>
              <input
                type="time"
                value={donationTime}
                onChange={(e) => setDonationTime(e.target.value)}
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* Request Message */}
          <div>
            <label className={labelClass}>Request Message</label>
            <div className="relative">
              <FileText size={16} className="absolute left-3 top-3.5 text-gray-400" />
              <textarea
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                placeholder="Explain why you need blood donation..."
                rows={4}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all duration-200 bg-white resize-none"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 text-white font-semibold shadow-md shadow-red-200 hover:shadow-red-300 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:scale-100"
          >
            <Save size={17} />
            {submitting ? "Saving..." : "Update Donation Request"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default EditDonationRequest;