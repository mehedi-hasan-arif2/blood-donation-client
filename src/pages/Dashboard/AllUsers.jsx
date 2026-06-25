import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/Loader";

const AllUsers = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [statusFilter, setStatusFilter] = useState("");

  const limit = 10;

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await axiosSecure.get(
        `/users?page=${currentPage}&limit=${limit}`
      );

      let allUsers = res.data.users || [];

      if (statusFilter) {
        allUsers = allUsers.filter(
          (item) => item.status === statusFilter
        );
      }

      setUsers(allUsers);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, statusFilter]);

  const updateUser = async (id, updateData, successMessage) => {
    try {
      const res = await axiosSecure.patch(
        `/users/update/${id}`,
        updateData
      );

      if (res.data.modifiedCount > 0) {
        toast.success(successMessage);
        fetchUsers();
      }
    } catch (error) {
      console.error(error);
      toast.error("Action failed");
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-3xl font-bold">
          All Users
        </h2>

        <select
          value={statusFilter}
          onChange={(e) => {
            setCurrentPage(1);
            setStatusFilter(e.target.value);
          }}
          className="select select-bordered w-full md:w-52"
        >
          <option value="">All Users</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl shadow">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((item, index) => (
              <tr key={item._id}>
                <td>
                  {(currentPage - 1) * limit + index + 1}
                </td>

                <td>{item.name}</td>

                <td>{item.email}</td>

                <td>
                  <span className="badge badge-outline">
                    {item.role}
                  </span>
                </td>

                <td>
                  <span
                    className={`badge ${
                      item.status === "active"
                        ? "badge-success"
                        : "badge-error"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td>
                  <div className="flex flex-wrap gap-2">
                    {item.email !== user?.email && (
                      <>
                        {item.status === "active" ? (
                          <button
                            onClick={() =>
                              updateUser(
                                item._id,
                                { status: "blocked" },
                                "User blocked"
                              )
                            }
                            className="btn btn-xs btn-error"
                          >
                            Block
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              updateUser(
                                item._id,
                                { status: "active" },
                                "User unblocked"
                              )
                            }
                            className="btn btn-xs btn-success"
                          >
                            Unblock
                          </button>
                        )}

                        {item.role !== "volunteer" && (
                          <button
                            onClick={() =>
                              updateUser(
                                item._id,
                                { role: "volunteer" },
                                "Volunteer assigned"
                              )
                            }
                            className="btn btn-xs btn-info"
                          >
                            Make Volunteer
                          </button>
                        )}

                        {item.role !== "admin" && (
                          <button
                            onClick={() =>
                              updateUser(
                                item._id,
                                { role: "admin" },
                                "Admin assigned"
                              )
                            }
                            className="btn btn-xs btn-warning"
                          >
                            Make Admin
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center gap-2 flex-wrap">
        <button
          disabled={currentPage === 1}
          onClick={() =>
            setCurrentPage(currentPage - 1)
          }
          className="btn btn-sm"
        >
          Prev
        </button>

        {[...Array(totalPages).keys()].map((page) => (
          <button
            key={page}
            onClick={() =>
              setCurrentPage(page + 1)
            }
            className={`btn btn-sm ${
              currentPage === page + 1
                ? "btn-primary"
                : ""
            }`}
          >
            {page + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage(currentPage + 1)
          }
          className="btn btn-sm"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllUsers;