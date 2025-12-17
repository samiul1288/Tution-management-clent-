import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const badgeByStatus = (status) => {
  if (status === "PENDING") return "badge badge-warning";
  if (status === "APPROVED") return "badge badge-success";
  if (status === "REJECTED") return "badge badge-error";
  return "badge";
};

const TuitionsManagement = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("PENDING"); // PENDING/APPROVED/REJECTED
  const [errorMsg, setErrorMsg] = useState("");

  const token = useMemo(() => localStorage.getItem("access-token"), []);

  const fetchTuitions = async (status = statusFilter) => {
    // ✅ token missing => login
    if (!token) {
      setErrorMsg("Login required. Please login again.");
      navigate("/login", { replace: true });
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await axiosSecure.get(`/tuitions/admin?status=${status}`);
      setTuitions(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error("Admin tuitions fetch error:", e);

      const code = e?.response?.status;

      // ✅ handle auth errors nicely
      if (code === 401) {
        setErrorMsg("Unauthorized. Please login again.");
        localStorage.removeItem("access-token");
        navigate("/login", { replace: true });
      } else if (code === 403) {
        setErrorMsg("Forbidden. You are not admin.");
        navigate("/unauthorized", { replace: true });
      } else {
        setErrorMsg(
          e?.response?.data?.message ||
            "Failed to load tuitions (server error)."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTuitions(statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const changeStatus = async (id, nextStatus) => {
    const ok = window.confirm(
      `Are you sure you want to ${
        nextStatus === "APPROVED" ? "approve" : "reject"
      } this tuition?`
    );
    if (!ok) return;

    try {
      await axiosSecure.patch(`/tuitions/${id}/status`, { status: nextStatus });
      // ✅ refresh list after update
      await fetchTuitions(statusFilter);
    } catch (e) {
      console.error("Update status error:", e);

      const code = e?.response?.status;
      if (code === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("access-token");
        navigate("/login", { replace: true });
        return;
      }
      if (code === 403) {
        alert("Forbidden. Only admin can update.");
        navigate("/unauthorized", { replace: true });
        return;
      }

      alert(e?.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="card bg-base-100 p-6 shadow">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl font-bold">Tuition Management</h2>
          <p className="text-sm opacity-70">
            Review and approve/reject tuition posts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="tabs tabs-boxed">
            <button
              className={`tab ${
                statusFilter === "PENDING" ? "tab-active" : ""
              }`}
              onClick={() => setStatusFilter("PENDING")}
              type="button"
            >
              Pending
            </button>
            <button
              className={`tab ${
                statusFilter === "APPROVED" ? "tab-active" : ""
              }`}
              onClick={() => setStatusFilter("APPROVED")}
              type="button"
            >
              Approved
            </button>
            <button
              className={`tab ${
                statusFilter === "REJECTED" ? "tab-active" : ""
              }`}
              onClick={() => setStatusFilter("REJECTED")}
              type="button"
            >
              Rejected
            </button>
          </div>

          <button
            className="btn btn-outline btn-sm"
            onClick={() => fetchTuitions(statusFilter)}
            type="button"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Error */}
      {errorMsg && (
        <div className="alert alert-error mb-4">
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="py-10 flex items-center justify-center">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : tuitions.length === 0 ? (
        <div className="py-10 text-center opacity-70">
          No {statusFilter.toLowerCase()} tuitions found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Subject</th>
                <th>Class</th>
                <th>Location</th>
                <th>Budget</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {tuitions.map((t) => (
                <tr key={t._id}>
                  <td className="font-medium">{t.title}</td>
                  <td>{t.subject}</td>
                  <td>{t.className}</td>
                  <td>{t.location}</td>
                  <td>${t.budget}</td>
                  <td>
                    <span className={badgeByStatus(t.status)}>{t.status}</span>
                  </td>

                  <td className="text-right">
                    {statusFilter === "PENDING" ? (
                      <div className="inline-flex gap-2">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => changeStatus(t._id, "APPROVED")}
                          type="button"
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-error btn-sm"
                          onClick={() => changeStatus(t._id, "REJECTED")}
                          type="button"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm opacity-70">No action</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TuitionsManagement;
