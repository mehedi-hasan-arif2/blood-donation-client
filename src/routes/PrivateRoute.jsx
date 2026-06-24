import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loader from "../components/Loader"; 

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Using global reusable loader for auth checking state
  if (loading) {
    return <Loader />;
  }

  if (user) {
    return children;
  }

  return <Navigate to="/login" state={{ from: location }} replace></Navigate>;
};

export default PrivateRoute;