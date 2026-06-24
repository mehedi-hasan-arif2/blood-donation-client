import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAxiosPublic from "../hooks/useAxiosPublic";
import useAuth from "../hooks/useAuth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import Swal from "sweetalert2";
import { Mail, Lock, Eye, EyeOff, Heart } from "lucide-react";
import Loader from "../components/Loader";

const Login = () => {
  const axiosPublic = useAxiosPublic();
  const { loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      // firebase authentication
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      if (result.user) {
        const loginData = { email, password };

        // Server token generation
        const res = await axiosPublic.post("/login", loginData);

        if (res.data.token) {
          localStorage.setItem("access-token", res.data.token);

          Swal.fire({
            icon: "success",
            title: "Login Successful",
            timer: 1500,
            showConfirmButton: false,
          });

          navigate("/");
        } else {
          Swal.fire("Error", "Invalid credentials", "error");
        }
      }
    } catch (err) {
      console.error("Login Error: ", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Login failed",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading || authLoading) return <Loader />;

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* LEFT SIDE */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-red-600 via-rose-500 to-pink-500 text-white items-center justify-center p-10">

        <div className="text-center space-y-5">

          {/* LOGO IMAGE */}
          <img
            src="/assets/login page left side logo.webp"
            alt="login"
            className="w-72 mx-auto drop-shadow-2xl rounded-xl animate-pulse"
          />

          {/* TITLE WITH HEART GLOW */}
          <h2 className="text-3xl font-bold flex items-center justify-center gap-3">
            
            {/* glowing animated heart */}
            <span className="relative flex items-center justify-center">
              <Heart
                className="text-white animate-bounce drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]"
                size={28}
              />
              <span className="absolute w-6 h-6 bg-white/40 rounded-full blur-md animate-ping"></span>
            </span>

            Donate Blood, Save Lives
          </h2>

          {/* DESCRIPTION */}
          <p className="text-sm opacity-90 leading-relaxed max-w-sm mx-auto">
            Join our trusted blood donation community and help save lives every single day.
          </p>

            {/* BADGES */}
          <div className="flex justify-center gap-3 text-xs mt-4">
            <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
              Safe
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
              Fast
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
              Trusted
            </span>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-50 p-6">

        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 space-y-5"
        >

          <h2 className="text-2xl font-bold text-center text-gray-800">
            Welcome Back
          </h2>

          {/* EMAIL */}
          <div className="relative">
            <Mail className="absolute top-3 left-3 text-gray-400" size={18} />
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg 
              text-gray-900 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
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
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg 
              text-gray-900 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-3 right-3 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 via-rose-500 to-pink-500 
            text-white py-3 rounded-lg font-semibold hover:scale-[1.02] transition"
          >
            Login
          </button>

          {/* LINK */}
          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link to="/register" className="text-red-500 font-semibold hover:underline">
              Register
            </Link>
          </p>

        </form>
      </div>

    </div>
  );
};

export default Login;