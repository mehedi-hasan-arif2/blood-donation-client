import useAuth from "../hooks/useAuth"; 
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAxiosPublic from "../hooks/useAxiosPublic";
import Swal from "sweetalert2";
import { Mail, Lock, User, Droplet, MapPin, Eye, EyeOff, UploadCloud, Heart, Phone, Map } from "lucide-react";
import Loader from "../components/Loader";
import districtsData from "../data/districts.json"; 
import upazilasData from "../data/upazilas.json";

const Register = () => {
  const { user, createUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  // Redirect logged-in users to home page
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  // Image and preview states
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); 
  
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);

  // Filter upazilas when a district is selected
  useEffect(() => {
    if (selectedDistrictId) {
      const allUpazilas = upazilasData[2]?.data || [];
      const upazilas = allUpazilas.filter(u => String(u.district_id) === String(selectedDistrictId));
      setFilteredUpazilas(upazilas);
    } else {
      setFilteredUpazilas([]);
    }
  }, [selectedDistrictId]);

  // Handle image selection and create a preview URL
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); 
    }
  };

  // Upload image to ImgBB
  const uploadImageToImgBB = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    const url = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`;
    
    const response = await axiosPublic.post(url, formData);
    return response.data.data.display_url; 
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;

    // Form inputs
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    
    // Image validation
    if (!image) {
     Swal.fire(
     "Avatar Required",
     "Please upload your profile picture",
     "warning"
    );
     setLoading(false);
     return;
    }

        // Password validation
    if (password.length < 6) {
      Swal.fire(
        "Weak Password",
        "Password must be at least 6 characters",
        "warning"
      );
      setLoading(false);
      return;
    }

    if (!/[A-Z]/.test(password)) {
      Swal.fire(
        "Weak Password",
        "Add at least one uppercase letter",
        "warning"
      );
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire(
        "Error",
        "Passwords do not match",
        "error"
      );
      setLoading(false);
      return;
    }

    let avatarUrl = "";
    
    // Upload image if a file is selected
    if (image) {
      try {
        avatarUrl = await uploadImageToImgBB(image);
      } catch (error) {
        Swal.fire("Error", "Image upload failed! Please check your connection.", "error");
        setLoading(false);
        return; 
      }
    }

    const districtName = form.district.options[form.district.selectedIndex].text;
    const upazilaName = form.upazila.options[form.upazila.selectedIndex].text;
    
    const userData = {
      name,
      email,
      password,
      avatar: avatarUrl,
      bloodGroup: form.bloodGroup.value,
      district: districtName,
      upazila: upazilaName,   
      phone: form.phone.value,
      gender: form.gender.value,
      role: "donor",
      status: "active",
    };

    try {
      // Create user in Firebase Authentication
      await createUser(email, password);

      // Update user profile name and photo in Firebase
      await updateUserProfile(name, avatarUrl);

      // Save user information in MongoDB database
      const res = await axiosPublic.post("/register", userData);

      if (res.data.insertedId || res.data.acknowledged) {
        Swal.fire({
          icon: "success",
          title: "Registration Successful",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/login");
      }
    } catch (err) {
      console.error("Registration error:", err);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: err.message || "Something went wrong during registration",
      });
    }

    setLoading(false);
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">

      {/* LEFT SIDE */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center bg-gradient-to-br from-red-600 via-rose-500 to-pink-500 text-white p-10">

        <div className="text-center space-y-5">

          <Heart className="mx-auto animate-pulse drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" size={40} />

          <h2 className="text-3xl font-bold">
            Join as a Donor
          </h2>

          <p className="text-sm text-white/90">
            Register now and help save lives by donating blood when needed.
          </p>

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-6">

        <form
          onSubmit={handleRegister}
          className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 space-y-4"
        >

          <h2 className="text-2xl font-bold text-center text-gray-800">
            Create Account
          </h2>

         {/* Form Box Start */}

         {/* AVATAR UPLOAD WITH LIVE PREVIEW */}
          <div className="flex items-center gap-4 border p-3 rounded-lg bg-white">
            <label className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-red-500 transition flex-1">
              <UploadCloud size={18} />
              <span className="text-sm font-medium">
                {image ? "Change Avatar" : "Upload Avatar"}
              </span>
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </label>
            
            {/* Live Preview Circle */}
            {imagePreview ? (
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-red-500 shadow-sm shrink-0">
                <img 
                  src={imagePreview} 
                  alt="Avatar Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-xs shrink-0 font-medium">
                No Img
              </div>
            )}
          </div>

          {/* NAME */}
          <div className="relative">
            <User className="absolute top-3 left-3 text-gray-400" size={18} />
            <input
              name="name"
              placeholder="Full Name"
              className="w-full border pl-10 py-2 rounded-lg text-gray-900 focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          {/* EMAIL */}
          <div className="relative">
            <Mail className="absolute top-3 left-3 text-gray-400" size={18} />
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="w-full border pl-10 py-2 rounded-lg text-gray-900 focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          {/* PHONE NUMBER */}
          <div className="relative">
            <Phone className="absolute top-3 left-3 text-gray-400" size={18} />
            <input
              name="phone"
              type="tel"
              placeholder="Phone Number"
              className="w-full border pl-10 py-2 rounded-lg text-gray-900 focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          {/* GENDER */}
          <div className="relative">
            <User className="absolute top-3 left-3 text-gray-400" size={18} />
            <select
              name="gender"
              className="w-full border pl-10 py-2 rounded-lg text-gray-900 focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* BLOOD GROUP */}
          <div className="relative">
            <Droplet className="absolute top-3 left-3 text-gray-400" size={18} />
            <select
              name="bloodGroup"
              className="w-full border pl-10 py-2 rounded-lg text-gray-900 focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="">Select Blood Group</option>
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>AB+</option>
              <option>AB-</option>
              <option>O+</option>
              <option>O-</option>
            </select>
          </div>

          {/* DISTRICT DROPDOWN */}
          <div className="relative">
            <MapPin className="absolute top-3 left-3 text-gray-400" size={18} />
            <select
              name="district"
              className="w-full border pl-10 py-2 rounded-lg text-gray-900 focus:ring-2 focus:ring-red-500 bg-white"
              onChange={(e) => setSelectedDistrictId(e.target.value)}
              required
            >
              <option value="">Select District</option>
              {districtsData[2]?.data?.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* UPAZILA DROPDOWN */}
          <div className="relative">
            <Map className="absolute top-3 left-3 text-gray-400" size={18} />
            <select
              name="upazila"
              className="w-full border pl-10 py-2 rounded-lg text-gray-900 focus:ring-2 focus:ring-red-500 bg-white"
              required
            >
              <option value="">Select Upazila</option>
              {filteredUpazilas.map((u) => (
                <option key={u.id} value={u.name}>
                  {u.name}
                </option>
              ))}

            </select>
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <Lock className="absolute top-3 left-3 text-gray-400" size={18} />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full border pl-10 pr-10 py-2 rounded-lg text-gray-900 focus:ring-2 focus:ring-red-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="relative">
            <Lock className="absolute top-3 left-3 text-gray-400" size={18} />
            <input
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full border pl-10 pr-10 py-2 rounded-lg text-gray-900 focus:ring-2 focus:ring-red-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-600 via-rose-500 to-pink-500 text-white py-2 rounded-lg font-semibold hover:scale-[1.02] transition"
          >
            Register
          </button>

          {/* LINK */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-red-500 font-semibold hover:underline">
              Login
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
};

export default Register;