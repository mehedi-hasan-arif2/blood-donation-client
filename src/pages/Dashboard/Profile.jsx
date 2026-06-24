import { useState } from "react";
import { Edit2, Save, User, Mail, Droplet, MapPin } from "lucide-react";
import useAuth from "../../hooks/useAuth";

const Profile = () => {
  const { user } = useAuth();
  const [isEditable, setIsEditable] = useState(false);

  // Form states with fallback dummy data until backend integration
  const [formData, setFormData] = useState({
    name: user?.displayName || "John Doe",
    email: user?.email || "donor@example.com",
    bloodGroup: "O+",
    district: "Dhaka",
    upazila: "Mirpur",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    // TODO: Connect with useAxiosSecure to update profile data in backend later
    setIsEditable(false);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Cover Header */}
      <div className="h-32 bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 relative">
        <div className="absolute right-6 bottom-4">
          {!isEditable ? (
            <button
              onClick={() => setIsEditable(true)}
              className="flex items-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:bg-gray-50 transition cursor-pointer"
            >
              <Edit2 size={16} className="text-red-500" /> Edit Profile
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:bg-green-600 transition cursor-pointer"
            >
              <Save size={16} /> Save Changes
            </button>
          )}
        </div>
      </div>

      {/* Avatar Section */}
      <div className="px-8 pb-8 relative">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16 mb-6">
          <img
            src={user?.photoURL || "https://i.ibb.co/6NGH09t/user-placeholder.png"}
            alt="User Avatar"
            className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg bg-white"
          />
          <div className="text-center sm:text-left pb-2">
            <h1 className="text-2xl font-bold text-gray-800">{formData.name}</h1>
            <p className="text-sm text-gray-500 capitalize font-medium px-2 py-0.5 bg-gray-100 rounded-full inline-block mt-1">
              Active Donor
            </p>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
              <User size={16} className="text-gray-400" /> Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditable}
              className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition duration-200 ${
                isEditable
                  ? "border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-500 bg-white"
                  : "border-gray-200 bg-gray-50 text-gray-500"
              }`}
            />
          </div>

          {/* Email Input - ALWAYS DISABLED */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
              <Mail size={16} className="text-gray-400" /> Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-400 text-sm font-medium cursor-not-allowed"
            />
          </div>

          {/* Blood Group Selector */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
              <Droplet size={16} className="text-gray-400" /> Blood Group
            </label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              disabled={!isEditable}
              className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition duration-200 ${
                isEditable
                  ? "border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-500 bg-white"
                  : "border-gray-200 bg-gray-50 text-gray-500"
              }`}
            >
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          {/* District Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
              <MapPin size={16} className="text-gray-400" /> District
            </label>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleChange}
              disabled={!isEditable}
              className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition duration-200 ${
                isEditable
                  ? "border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-500 bg-white"
                  : "border-gray-200 bg-gray-50 text-gray-500"
              }`}
            />
          </div>

          {/* Upazila Input */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
              <MapPin size={16} className="text-gray-400" /> Upazila
            </label>
            <input
              type="text"
              name="upazila"
              value={formData.upazila}
              onChange={handleChange}
              disabled={!isEditable}
              className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition duration-200 ${
                isEditable
                  ? "border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-500 bg-white"
                  : "border-gray-200 bg-gray-50 text-gray-500"
              }`}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;