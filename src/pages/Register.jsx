import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAxiosPublic from "../hooks/useAxiosPublic";
import Swal from "sweetalert2";
import { Mail, Lock, User, Droplet, MapPin, Eye, EyeOff, UploadCloud, Heart } from "lucide-react";
import Loader from "../components/Loader";

// NOTE: later you will replace this with ImageBB upload API
const mockUploadImage = async (file) => {
  return "https://i.ibb.co/placeholder-image.jpg";
};

const Register = () => {
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [image, setImage] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;

    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if (password !== confirmPassword) {
      Swal.fire("Error", "Passwords do not match", "error");
      setLoading(false);
      return;
    }

    let avatarUrl = "";
    if (image) {
      avatarUrl = await mockUploadImage(image);
    }

    const userData = {
      name,
      email,
      password,
      avatar: avatarUrl,
      bloodGroup: form.bloodGroup.value,
      district: form.district.value,
      upazila: form.upazila.value,
      role: "donor",
      status: "active",
    };

    try {
      const res = await axiosPublic.post("/register", userData);

      if (res.data.insertedId || res.data.acknowledged) {
        Swal.fire({
          icon: "success",
          title: "Registration Successful",
          timer: 1500,
          showConfirmButton: false,
        });

        navigate("/login");
      } else {
        Swal.fire("Error", "User already exists", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Something went wrong", "error");
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

          {/* BLOOD GROUP */}
          <select
            name="bloodGroup"
            className="w-full border p-2 rounded-lg text-gray-900 focus:ring-2 focus:ring-red-500"
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

          {/* DISTRICT (FIXED - select placeholder) */}
          <input
            name="district"
            placeholder="District (dropdown later)"
            className="w-full border p-2 rounded-lg text-gray-900"
            required
          />

          {/* UPAZILA */}
          <input
            name="upazila"
            placeholder="Upazila (dropdown later)"
            className="w-full border p-2 rounded-lg text-gray-900"
            required
          />

          {/* AVATAR UPLOAD */}
          <div>
            <label className="flex items-center gap-2 border p-2 rounded-lg cursor-pointer text-gray-600">
              <UploadCloud size={18} />
              Upload Avatar (ImageBB later)
              <input
                type="file"
                hidden
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
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
            <Link to="/login" className="text-red-500 font-semibold">
              Login
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
};

export default Register;