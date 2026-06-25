import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";

const VolunteerRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const location = useLocation();

  const [roleLoading, setRoleLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!user?.email) {
      setRoleLoading(false);
      return;
    }

    axiosSecure
      .get(`/users/role/${user.email}`)
      .then((res) => {
        const role = res.data?.role;
        setAllowed(role === "admin" || role === "volunteer");
      })
      .catch(() => {
        setAllowed(false);
      })
      .finally(() => {
        setRoleLoading(false);
      });
  }, [user, axiosSecure]);

  if (loading || roleLoading) {
    return <Loader />;
  }

  if (user && allowed) {
    return children;
  }

  return <Navigate to="/" state={{ from: location }} replace />;
};

export default VolunteerRoute;