import { useState, useEffect, useRef } from "react";
import {
  User,
  Mail,
  Droplet,
  MapPin,
  Map,
  Edit3,
  Save,
  X,
  Camera,
  CheckCircle,
  Shield,
  Heart,
  Loader2,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useRole from "../../hooks/useRole";
import districtsData from "../../data/districts.json";
import upazilasData from "../../data/upazilas.json";

/* ImgBB upload helper */
const uploadToImgBB = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const url = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`;
  const res = await fetch(url, { method: "POST", body: formData });
  const data = await res.json();
  if (!data.success) throw new Error("ImgBB upload failed");
  return data.data.display_url;
};

/* Static data helpers */
const allDistricts = districtsData[2]?.data || [];
const allUpazilas = upazilasData[2]?.data || [];

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const roleMeta = {
  admin: {
    label: "Admin",
    icon: Shield,
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-200",
    badge: "bg-rose-600",
  },
  volunteer: {
    label: "Volunteer",
    icon: Heart,
    color: "text-pink-600",
    bg: "bg-pink-50",
    border: "border-pink-200",
    badge: "bg-pink-600",
  },
  donor: {
    label: "Donor",
    icon: Droplet,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    badge: "bg-red-600",
  },
};

/*  Profile Component  */
const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { role } = useRole();

  /* server profile state */
  const [profile, setProfile] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  /* edit mode state */
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  /* form fields */
  const [name, setName] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUpazila, setSelectedUpazila] = useState("");
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);

  /* avatar */
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  /* snapshot for cancel */
  const [snapshot, setSnapshot] = useState(null);

  /*  fetch profile */
  const fetchProfile = async () => {
    try {
      const res = await axiosSecure.get(`/users/profile/${user.email}`);
      const data = res.data;
      setProfile(data);
      applyToForm(data);
    } catch (err) {
      toast.error("Could not load profile.");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) fetchProfile();
  }, [user]);

  /* apply server data → form fields */
  const applyToForm = (data) => {
    setName(data.name || "");
    setBloodGroup(data.bloodGroup || "");
    setSelectedDistrict(data.district || "");
    setSelectedUpazila(data.upazila || "");
    setAvatarPreview(data.avatar || user?.photoURL || null);

    /* resolve district id for upazila filter */
    const distObj = allDistricts.find((d) => d.name === data.district);
    setSelectedDistrictId(distObj?.id || "");
  };

  /* filter upazilas when district changes */
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

  /*  district picker  */
  const handleDistrictChange = (e) => {
    const distId = e.target.value;
    const distObj = allDistricts.find((d) => d.id === distId);
    setSelectedDistrictId(distId);
    setSelectedDistrict(distObj?.name || "");
    setSelectedUpazila("");
  };

  /*  avatar picker  */
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  /* enter edit mode  */
  const handleEdit = () => {
    setSnapshot({ name, bloodGroup, selectedDistrictId, selectedDistrict, selectedUpazila, avatarPreview });
    setIsEditing(true);
  };

  /* cancel edit  */
  const handleCancel = () => {
    if (snapshot) {
      setName(snapshot.name);
      setBloodGroup(snapshot.bloodGroup);
      setSelectedDistrictId(snapshot.selectedDistrictId);
      setSelectedDistrict(snapshot.selectedDistrict);
      setSelectedUpazila(snapshot.selectedUpazila);
      setAvatarPreview(snapshot.avatarPreview);
    }
    setAvatarFile(null);
    setIsEditing(false);
  };

  /* save  */
  const handleSave = async () => {
    if (!name.trim()) return toast.error("Name is required.");
    if (!bloodGroup) return toast.error("Blood group is required.");
    if (!selectedDistrict) return toast.error("District is required.");
    if (!selectedUpazila) return toast.error("Upazila is required.");

    setSaving(true);
    try {
      let avatarUrl = profile?.avatar || user?.photoURL || "";

      /* upload new avatar if selected */
      if (avatarFile) {
        avatarUrl = await uploadToImgBB(avatarFile);
      }

      const payload = {
        name: name.trim(),
        bloodGroup,
        district: selectedDistrict,
        upazila: selectedUpazila,
        avatar: avatarUrl,
      };

      /* update MongoDB */
      await axiosSecure.patch(`/users/profile/${user.email}`, payload);

      /* update Firebase profile */
      await updateUserProfile(name.trim(), avatarUrl);

      /* refetch */
      await fetchProfile();

      setAvatarFile(null);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  /*  UI helpers */
  const meta = roleMeta[role] || roleMeta.donor;
  const RoleIcon = meta.icon;

  /* Loading Screen  */
  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-red-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-200 animate-pulse">
            <Heart className="text-white" size={28} />
          </div>
          <p className="text-gray-500 text-sm font-medium tracking-wide">Loading your profile…</p>
        </div>
      </div>
    );
  }

  const inputBase =
    "w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 outline-none";
  const inputDisabled =
    "bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed";
  const inputEnabled =
    "bg-white border-rose-300 text-gray-800 focus:border-rose-500 focus:ring-2 focus:ring-rose-100";

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-red-50 py-10 px-4">
      <Toaster
        position="top-right"
        toastOptions={{
          success: { style: { background: "#fff", color: "#16a34a", border: "1px solid #bbf7d0" } },
          error: { style: { background: "#fff", color: "#dc2626", border: "1px solid #fecaca" } },
        }}
      />

      <div className="max-w-2xl mx-auto">

        {/*  Header Card  */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl shadow-red-100 mb-6">
          {/* gradient banner */}
          <div className="h-32 bg-gradient-to-r from-red-600 via-rose-500 to-pink-500" />

          {/* avatar + name */}
          <div className="bg-white px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12 mb-4">

              {/* Avatar */}
              <div className="relative w-24 h-24 shrink-0">
                <img
                  src={avatarPreview || "https://i.ibb.co/VxPZMX6/default-avatar.png"}
                  alt="Avatar"
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
                />
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md hover:bg-rose-700 transition-colors"
                    title="Change avatar"
                  >
                    <Camera size={14} />
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleAvatarChange}
                />
              </div>

              {/* Name + role badge + action buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between flex-1 gap-3 sm:pl-4">
                <div>
                  <h1 className="text-xl font-bold text-gray-800 leading-tight">{profile?.name}</h1>
                  <p className="text-gray-400 text-sm mt-0.5">{profile?.email}</p>
                  <span
                    className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-semibold text-white ${meta.badge}`}
                  >
                    <RoleIcon size={11} />
                    {meta.label}
                  </span>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 shrink-0">
                  {!isEditing ? (
                    <button
                      onClick={handleEdit}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 text-white text-sm font-semibold shadow-md shadow-red-200 hover:shadow-red-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                    >
                      <Edit3 size={15} />
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleCancel}
                        disabled={saving}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-300 text-gray-600 text-sm font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50"
                      >
                        <X size={15} />
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 text-white text-sm font-semibold shadow-md shadow-red-200 hover:shadow-red-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:scale-100"
                      >
                        {saving ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : (
                          <Save size={15} />
                        )}
                        {saving ? "Saving…" : "Save Changes"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* edit mode hint */}
            {isEditing && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
                <Edit3 size={13} />
                You are in edit mode — make your changes and click Save.
              </div>
            )}
          </div>
        </div>

        {/*  Form Card  */}
        <div className="bg-white rounded-3xl shadow-xl shadow-red-50 border border-red-100 p-6 space-y-5">

          <h2 className="text-base font-bold text-gray-700 flex items-center gap-2 mb-1">
            <User size={16} className="text-rose-500" />
            Personal Information
          </h2>

          {/* Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">
              Full Name
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
                className={`${inputBase} ${isEditing ? inputEnabled : inputDisabled}`}
                placeholder="Your full name"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">
              Email Address
              <span className="ml-2 text-[10px] text-rose-400 normal-case font-medium">(cannot be changed)</span>
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={profile?.email || ""}
                disabled
                className={`${inputBase} ${inputDisabled}`}
                placeholder="Email"
              />
              <CheckCircle size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400" />
            </div>
          </div>

          {/* Blood Group */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">
              Blood Group
            </label>
            <div className="relative">
              <Droplet size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                disabled={!isEditing}
                className={`${inputBase} appearance-none ${isEditing ? inputEnabled : inputDisabled}`}
              >
                <option value="">Select Blood Group</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
          </div>

          {/* District */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">
              District
            </label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              {isEditing ? (
                <select
                  value={selectedDistrictId}
                  onChange={handleDistrictChange}
                  className={`${inputBase} appearance-none ${inputEnabled}`}
                >
                  <option value="">Select District</option>
                  {allDistricts.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={selectedDistrict}
                  disabled
                  className={`${inputBase} ${inputDisabled}`}
                  placeholder="District"
                />
              )}
            </div>
          </div>

          {/* Upazila  */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">
              Upazila
            </label>
            <div className="relative">
              <Map size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              {isEditing ? (
                <select
                  value={selectedUpazila}
                  onChange={(e) => setSelectedUpazila(e.target.value)}
                  disabled={!selectedDistrictId}
                  className={`${inputBase} appearance-none ${
                    selectedDistrictId ? inputEnabled : inputDisabled
                  }`}
                >
                  <option value="">
                    {selectedDistrictId ? "Select Upazila" : "Select a district first"}
                  </option>
                  {filteredUpazilas.map((u) => (
                    <option key={u.id} value={u.name}>{u.name}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={selectedUpazila}
                  disabled
                  className={`${inputBase} ${inputDisabled}`}
                  placeholder="Upazila"
                />
              )}
            </div>
          </div>

        </div>

        {/*  Info strip  */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
          <Shield size={12} />
          Your information is private and secure.
        </div>

      </div>
    </div>
  );
};

export default Profile;