import { useEffect, useState } from "react";
import {
  MoreVertical, ShieldCheck, ShieldOff,
  UserCheck, Crown, Filter, Users,
} from "lucide-react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/Loader";

const roleBadge = {
  admin: "badge-error",
  volunteer: "badge-info",
  donor: "badge-ghost",
};

const AllUsers = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  const limit = 10;

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const url = statusFilter
        ? `/users?page=${currentPage}&limit=${limit}&status=${statusFilter}`
        : `/users?page=${currentPage}&limit=${limit}`;

      const res = await axiosSecure.get(url);
      setUsers(res.data.users || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Failed to load users:", err?.response?.data || err.message);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, statusFilter]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest("[data-dropdown]")) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateUser = async (id, updateData, successMessage) => {
    try {
      const res = await axiosSecure.patch(`/users/update/${id}`, updateData);
      if (res.data.modifiedCount > 0) {
        toast.success(successMessage);
        setOpenMenuId(null);
        fetchUsers();
      } else {
        toast.error("কোনো পরিবর্তন হয়নি");
      }
    } catch (err) {
      console.error("Update failed:", err?.response?.data || err.message);
      toast.error("Action failed");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-red-100">
            <Users size={22} className="text-red-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">All Users</h2>
            <p className="text-sm text-gray-400">Manage platform users</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setCurrentPage(1);
              setStatusFilter(e.target.value);
            }}
            className="select select-bordered select-sm w-44 focus:outline-none focus:border-red-400"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100">
        <div className="overflow-x-auto rounded-3xl">
          <table className="table">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th>#</th>
                <th>User</th>
                <th className="hidden md:table-cell">Email</th>
                <th>Role</th>
                <th>Status</th>
                <th className="text-center min-w-[60px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((item, index) => {
                  const isNearBottom = index >= users.length - 3;

                  return (
                    <tr key={item._id} className="hover:bg-rose-50/30 transition-colors">
                      <td className="text-gray-400 text-sm">
                        {(currentPage - 1) * limit + index + 1}
                      </td>

                      <td>
                        <div className="flex items-center gap-3">
                          <img
                            src={item.avatar || "https://i.ibb.co/6NGH09t/user-placeholder.png"}
                            alt={item.name}
                            className="w-9 h-9 rounded-full object-cover border-2 border-red-100"
                          />
                          <div>
                            <span className="font-semibold text-gray-800 text-sm block">
                              {item.name}
                            </span>
                            <span className="text-xs text-gray-400 md:hidden">
                              {item.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="hidden md:table-cell text-gray-500 text-sm">
                        {item.email}
                      </td>

                      <td>
                        <span className={`badge badge-sm capitalize ${roleBadge[item.role] || "badge-ghost"}`}>
                          {item.role}
                        </span>
                      </td>

                      <td>
                        <span className={`badge badge-sm ${item.status === "active" ? "badge-success" : "badge-error"}`}>
                          {item.status}
                        </span>
                      </td>

                      <td className="text-center">
                        {item.email !== user?.email ? (
                          <div className="relative inline-block" data-dropdown="true">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuId(openMenuId === item._id ? null : item._id);
                              }}
                              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                              <MoreVertical size={18} className="text-gray-500" />
                            </button>

                            {openMenuId === item._id && (
                              <div className={`absolute right-0 ${isNearBottom ? "bottom-9" : "top-9"} w-48 bg-white rounded-2xl shadow-xl border border-gray-100 z-[999] overflow-hidden`}>

                                {item.status === "active" ? (
                                  <button
                                    onClick={() => updateUser(item._id, { status: "blocked" }, "User blocked")}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                  >
                                    <ShieldOff size={15} /> Block User
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => updateUser(item._id, { status: "active" }, "User unblocked")}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-green-600 hover:bg-green-50 transition-colors"
                                  >
                                    <ShieldCheck size={15} /> Unblock User
                                  </button>
                                )}

                                {item.role !== "volunteer" && item.role !== "admin" && (
                                  <button
                                    onClick={() => updateUser(item._id, { role: "volunteer" }, "Volunteer role assigned")}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                                  >
                                    <UserCheck size={15} /> Make Volunteer
                                  </button>
                                )}

                                {item.role !== "admin" && (
                                  <button
                                    onClick={() => updateUser(item._id, { role: "admin" }, "Admin role assigned")}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-amber-600 hover:bg-amber-50 transition-colors"
                                  >
                                    <Crown size={15} /> Make Admin
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-300">You</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 flex-wrap">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="btn btn-sm border border-gray-200 hover:border-red-400 hover:text-red-500 disabled:opacity-40"
          >Prev</button>

          {[...Array(totalPages).keys()].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page + 1)}
              className={`btn btn-sm ${currentPage === page + 1 ? "bg-red-600 text-white border-red-600 hover:bg-red-700" : "border border-gray-200 hover:border-red-400"}`}
            >{page + 1}</button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="btn btn-sm border border-gray-200 hover:border-red-400 hover:text-red-500 disabled:opacity-40"
          >Next</button>
        </div>
      )}
    </div>
  );
};

export default AllUsers;