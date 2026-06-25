import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const location = useLocation();

  const [roleLoading, setRoleLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user?.email) {
      setRoleLoading(false);
      return;
    }

    axiosSecure
      .get(`/users/role/${user.email}`)
      .then((res) => {
        setIsAdmin(res.data?.role === "admin");
      })
      .catch(() => {
        setIsAdmin(false);
      })
      .finally(() => {
        setRoleLoading(false);
      });
  }, [user, axiosSecure]);

  if (loading || roleLoading) {
    return <Loader />;
  }

  if (user && isAdmin) {
    return children;
  }

  return <Navigate to="/" state={{ from: location }} replace />;
};

export default AdminRoute;