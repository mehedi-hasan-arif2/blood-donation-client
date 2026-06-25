import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useRole = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [role, setRole] = useState("donor");
  const [status, setStatus] = useState("active");
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (!user?.email) {
      setRoleLoading(false);
      return;
    }

    const getUserRole = async () => {
      try {
        const res = await axiosSecure.get(`/user/role/${user.email}`);

        setRole(res.data?.role || "donor");
        setStatus(res.data?.status || "active");
      } catch (error) {
        console.error(error);
      } finally {
        setRoleLoading(false);
      }
    };

    getUserRole();
  }, [user, loading, axiosSecure]);

  return {
    role,
    status,
    roleLoading,
    isAdmin: role === "admin",
    isVolunteer: role === "volunteer",
    isDonor: role === "donor",
  };
};

export default useRole;