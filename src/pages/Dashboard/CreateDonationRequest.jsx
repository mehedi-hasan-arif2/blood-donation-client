import { useState } from "react";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import districtsData from "../../data/districts.json";
import upazilasData from "../../data/upazilas.json";

const CreateDonationRequest = () => {
  const { register, handleSubmit, reset } = useForm();
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);

  const handleDistrictChange = (e) => {
    const distId = e.target.value;
    setSelectedDistrictId(distId);
    const upazilas = upazilasData[2]?.data?.filter(u => String(u.district_id) === String(distId)) || [];
    setFilteredUpazilas(upazilas);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axiosSecure.post("/donation-requests", data);
      toast.success("Request created successfully!");
      reset();
    } catch (error) {
      toast.error("Failed to create request");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-6">Create Donation Request</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register("recipientName")} placeholder="Recipient Name" className="w-full p-3 border rounded" required />
        <select onChange={handleDistrictChange} className="w-full p-3 border rounded" required>
          <option value="">Select District</option>
          {districtsData[2]?.data?.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <select {...register("recipientUpazila")} className="w-full p-3 border rounded" required>
          <option value="">Select Upazila</option>
          {filteredUpazilas.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
        </select>
        <input {...register("hospitalName")} placeholder="Hospital Name" className="w-full p-3 border rounded" required />
        <input {...register("fullAddress")} placeholder="Full Address" className="w-full p-3 border rounded" required />
        <input {...register("bloodGroup")} placeholder="Blood Group" className="w-full p-3 border rounded" required />
        <button type="submit" className="w-full bg-red-600 text-white p-3 rounded font-bold">Submit Request</button>
      </form>
    </div>
  );
};

export default CreateDonationRequest;