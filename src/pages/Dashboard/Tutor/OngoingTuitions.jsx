import { useCallback, useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const OngoingTuitions = () => {
  const axiosSecure = useAxiosSecure();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOngoing = useCallback(async () => {
    try {
      setError("");
      setLoading(true);

      // ✅ Backend route mismatch হলে শুধু এইটা change করো:
      // Option A: /tutor/ongoing
      // Option B: /tuitions/ongoing
      // Option C: /tuitions/my-ongoing
      const res = await axiosSecure.get("/tuitions/tutor/ongoing");
      setItems(res.data || []);
    } catch (err) {
      console.error("TutorDashboardHome fetchAll error:", err);

      const status = err?.response?.status;
      if (status === 401) {
        setError("Unauthorized (401). Please login again.");
      } else if (status === 403) {
        setError("Forbidden (403). Tutor only route.");
      } else {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load dashboard summary."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [axiosSecure]);

  useEffect(() => {
    fetchOngoing();
  }, [fetchOngoing]);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Ongoing Tuitions</h2>
          <p className="text-sm text-gray-500">
            These are the tuitions currently assigned to you.
          </p>
        </div>

        <button className="btn btn-sm btn-outline" onClick={fetchOngoing}>
          Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <span className="text-sm">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      ) : items.length === 0 ? (
        <div className="card bg-base-100 border border-base-200 p-6">
          <p className="text-sm text-gray-500">No ongoing tuition found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((t) => (
            <div
              key={t._id}
              className="card bg-base-100 border border-base-200 shadow-sm p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{t.title || "Tuition"}</h3>
                  <span className="badge badge-success badge-sm">
                    {t.status || "ONGOING"}
                  </span>
                </div>

                <p className="text-sm text-gray-500">
                  {t.subject || "-"} • Class {t.className || "-"} •{" "}
                  {t.location || "-"}
                </p>

                <p className="text-sm font-semibold">
                  Salary: {t.salary ?? t.expectedSalary ?? "-"}৳
                </p>

                {t.student?.email && (
                  <p className="text-[11px] text-gray-500">
                    Student: {t.student?.name || "-"} • {t.student?.email}
                  </p>
                )}
              </div>

              <div className="flex gap-2 md:justify-end">
                <button className="btn btn-sm btn-primary" disabled>
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OngoingTuitions;
