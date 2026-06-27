import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loader from "../components/Loader";
import useRole from "../hooks/useRole";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { isAdmin, roleLoading } = useRole();
  const location = useLocation();

  if (loading || roleLoading) return <Loader />;

  if (user && isAdmin) return children;

  return <Navigate to="/" state={{ from: location }} replace />;
};

export default AdminRoute;