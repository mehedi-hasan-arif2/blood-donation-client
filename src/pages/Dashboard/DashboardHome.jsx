import useRole from "../../hooks/useRole";
import DonorHome from "./DonorHome";
import AdminHome from "./AdminHome";
import Loader from "../../components/Loader";

const DashboardHome = () => {
  const { role, roleLoading } = useRole();

  if (roleLoading) {
    return <Loader />;
  }

  if (role === "admin" || role === "volunteer") {
    return <AdminHome />;
  }

  return <DonorHome />;
};

export default DashboardHome;