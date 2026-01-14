import { useEffect, useMemo, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import normalizeArray from "../../../utils/normalizeArray";

export default function TutorDashboardHome() {
  const axiosSecure = useAxiosSecure();
  const [applications, setApplications] = useState([]); // ✅ always array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError("");

        // ✅ tutor route should be /applications/my (based on your backend controller)
        const res = await axiosSecure.get("/applications/my");
        if (!alive) return;

        setApplications(normalizeArray(res.data));
      } catch (err) {
        if (!alive) return;
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load applications."
        );
        setApplications([]);
      } finally {
        alive && setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [axiosSecure]);

  const approved = useMemo(
    () => applications.filter((a) => a?.status === "APPROVED"),
    [applications]
  );

  const pending = useMemo(
    () => applications.filter((a) => a?.status === "PENDING"),
    [applications]
  );

  if (loading) {
    return (
      <div className="p-6 flex items-center gap-2">
        <span className="loading loading-spinner loading-sm" />
        <span className="text-sm opacity-70">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="alert alert-error">
          <span className="text-sm">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Tutor Dashboard</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card bg-base-100 border p-4">
          <p className="text-sm opacity-70">Approved</p>
          <p className="text-3xl font-extrabold">{approved.length}</p>
        </div>

        <div className="card bg-base-100 border p-4">
          <p className="text-sm opacity-70">Pending</p>
          <p className="text-3xl font-extrabold">{pending.length}</p>
        </div>
      </div>

      {/* Optional list */}
      <div className="card bg-base-100 border p-4">
        <p className="font-semibold mb-2">Recent Applications</p>
        {applications.length === 0 ? (
          <p className="text-sm opacity-70">No applications found.</p>
        ) : (
          <div className="space-y-2">
            {applications.slice(0, 6).map((a) => (
              <div
                key={a?._id}
                className="flex items-center justify-between border rounded-xl p-3"
              >
                <div className="min-w-0">
                  <p className="font-medium truncate">
                    {a?.tuitionId?.title || "Tuition"}
                  </p>
                  <p className="text-xs opacity-70 truncate">
                    Expected: {a?.expectedSalary || 0}৳ • Status: {a?.status}
                  </p>
                </div>
                <span
                  className={`badge badge-sm ${
                    a?.status === "APPROVED"
                      ? "badge-success"
                      : a?.status === "REJECTED"
                      ? "badge-error"
                      : "badge-warning"
                  }`}
                >
                  {a?.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
