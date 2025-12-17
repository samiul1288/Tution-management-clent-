import { useEffect, useMemo, useState, useCallback } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const UsersManagement = () => {
  const axiosSecure = useAxiosSecure();

  const [users, setUsers] = useState([]);
  const [q, setQ] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ build query string from current filters
  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (role) params.set("role", role);
    if (status) params.set("status", status);
    return params.toString();
  }, [q, role, status]);

  // ✅ fetch users (always uses current queryString)
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axiosSecure.get(`/users?${queryString}`);

      // backend response: array or {data:[]}
      const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setUsers(list);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [axiosSecure, queryString]);

  // ✅ auto fetch when queryString changes
  useEffect(() => {
    fetchUsers();
  }, [q, role, status])

  // ✅ Step 3: Role change করলে সাথে সাথে update + refetch
  const changeRole = async (id, newRole) => {
    try {
      await axiosSecure.patch(`/users/${id}/role`, { role: newRole });
      await fetchUsers();
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Failed to update role");
    }
  };

  // ✅ Block/Unblock (status patch)
  const toggleStatus = async (user) => {
    try {
      const nextStatus = user.status === "BLOCKED" ? "ACTIVE" : "BLOCKED";
      await axiosSecure.patch(`/users/${user._id}/status`, {
        status: nextStatus,
      });
      await fetchUsers();
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Failed to update status");
    }
  };

  const deleteUser = async (id) => {
    const ok = confirm("Are you sure you want to delete this user?");
    if (!ok) return;

    try {
      await axiosSecure.delete(`/users/${id}`);
      await fetchUsers();
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Failed to delete user");
    }
  };

  const defaultAvatar =
    "https://api.dicebear.com/7.x/initials/svg?seed=User&backgroundColor=1f2937&textColor=ffffff";

  return (
    <div className="card bg-base-100 p-6 shadow">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
        <div>
          <h2 className="text-xl font-bold">User Management</h2>
          <p className="text-sm opacity-70">Manage roles + block users</p>
        </div>

        <div className="flex flex-col md:flex-row gap-2">
          <input
            className="input input-bordered"
            placeholder="Search name/email..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <select
            className="select select-bordered"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="student">Student</option>
            <option value="tutor">Tutor</option>
            <option value="admin">Admin</option>
          </select>

          <select
            className="select select-bordered"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="BLOCKED">Blocked</option>
          </select>

          <button className="btn" onClick={fetchUsers}>
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <span className="text-sm">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-10 rounded-full">
                          <img
                            src={u.photoURL || u.photo || defaultAvatar}
                            alt="avatar"
                            onError={(e) => {
                              e.currentTarget.src = defaultAvatar;
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold">{u.name || "N/A"}</div>
                        <div className="text-sm opacity-70">{u.email}</div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <select
                      className="select select-bordered select-sm"
                      value={u.role}
                      onChange={(e) => changeRole(u._id, e.target.value)}
                    >
                      <option value="student">student</option>
                      <option value="tutor">tutor</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>

                  <td>
                    <span
                      className={`badge ${
                        u.status === "BLOCKED" ? "badge-error" : "badge-success"
                      }`}
                    >
                      {u.status || "ACTIVE"}
                    </span>
                  </td>

                  <td className="text-sm opacity-70">
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="text-right space-x-2">
                    <button
                      className={`btn btn-sm ${
                        u.status === "BLOCKED" ? "btn-success" : "btn-warning"
                      }`}
                      onClick={() => toggleStatus(u)}
                    >
                      {u.status === "BLOCKED" ? "Unblock" : "Block"}
                    </button>

                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => deleteUser(u._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 opacity-70">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
