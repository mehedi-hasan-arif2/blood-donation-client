import axios from "axios";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase.config";

const useAxiosSecure = () => {
  const navigate = useNavigate();

  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  });

  // Request Interceptor: Send token to server
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("access-token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response Interceptor: Handle 401/403 errors (unauthorized/blocked)
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error.response ? error.response.status : null;
      if (status === 401 || status === 403) {
        await signOut(auth);
        localStorage.removeItem("access-token");
        navigate("/login");
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export default useAxiosSecure;