import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loader from "../components/Loader";
import useRole from "../hooks/useRole";

const VolunteerRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { isAdmin, isVolunteer, roleLoading } = useRole();
  const location = useLocation();

  if (loading || roleLoading) return <Loader />;

  if (user && (isAdmin || isVolunteer)) return children;

  return <Navigate to="/" state={{ from: location }} replace />;
};

export default VolunteerRoute;