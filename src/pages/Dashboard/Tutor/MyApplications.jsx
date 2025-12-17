import { useCallback, useEffect, useMemo, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MyApplications = () => {
  const axiosSecure = useAxiosSecure();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const role = useMemo(() => localStorage.getItem("user-role"), []);

  const fetchMyApplications = useCallback(
    async (mode = "load") => {
      try {
        setError("");
        mode === "load" ? setLoading(true) : setRefreshing(true);

        // ✅ backend এ route নাম যদি আলাদা হয়, এখানে change করো:
        // option A: /applications/my
        // option B: /applications/me
        const res = await axiosSecure.get("/applications/my");

        setApplications(res.data || []);
      } catch (err) {
        console.error(err);

        const status = err?.response?.status;
        if (status === 401) {
          setError(
            "Unauthorized (401). Token missing/expired. Please login again."
          );
        } else if (status === 403) {
          setError(
            "Forbidden (403). You don't have permission for this route."
          );
        } else {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to load your applications."
          );
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [axiosSecure]
  );

  useEffect(() => {
    fetchMyApplications("load");
  }, [fetchMyApplications]);

  const pending = applications.filter((a) => a.status === "PENDING");
  const approved = applications.filter((a) => a.status === "APPROVED");
  const rejected = applications.filter((a) => a.status === "REJECTED");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">My Applications</h2>
          <p className="text-sm text-gray-500">
            Track the tuitions you applied to. Status updates will appear here.
          </p>

          {/* role guard message */}
          {role && role !== "tutor" && (
            <div className="alert alert-warning mt-3">
              <span className="text-sm">
                You are logged in as <b>{role}</b>. This page is for{" "}
                <b>tutor</b> only.
              </span>
            </div>
          )}
        </div>

        <div className="card bg-base-100 border border-base-200 shadow-sm p-4">
          <p className="text-xs text-gray-500">Total applications</p>
          <p className="text-2xl font-extrabold">{applications.length}</p>
          <p className="text-[11px] text-gray-500">
            Pending: {pending.length} • Approved: {approved.length} • Rejected:{" "}
            {rejected.length}
          </p>

          <button
            className="btn btn-sm btn-outline mt-3"
            onClick={() => fetchMyApplications("refresh")}
            disabled={refreshing}
          >
            {refreshing ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              "Refresh"
            )}
          </button>
        </div>
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
      ) : applications.length === 0 ? (
        <div className="card bg-base-100 border border-base-200 p-6">
          <p className="text-sm text-gray-500">
            You haven’t applied to any tuitions yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => {
            const tuition = app?.tuitionId; // backend populate করলে object আসবে
            const tuitionTitle =
              tuition?.title || app?.tuitionTitle || "Tuition";
            const subject = tuition?.subject || "-";
            const location = tuition?.location || "-";
            const className = tuition?.className || "-";
            const budget = tuition?.budget ?? app?.budget ?? "-";

            const status = app?.status || "PENDING";

            return (
              <div
                key={app._id}
                className="card bg-base-100 border border-base-200 shadow-sm p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{tuitionTitle}</h3>

                    <span
                      className={`badge badge-sm ${
                        status === "APPROVED"
                          ? "badge-success"
                          : status === "REJECTED"
                          ? "badge-error"
                          : "badge-warning"
                      }`}
                    >
                      {status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500">
                    {subject} • Class {className} • {location}
                  </p>

                  <p className="text-sm">
                    <span className="font-semibold">Expected Salary:</span>{" "}
                    {app?.expectedSalary ?? "-"}৳<span className="mx-2">•</span>
                    <span className="font-semibold">Budget:</span> {budget}৳
                  </p>

                  {app?.createdAt && (
                    <p className="text-[11px] text-gray-500">
                      Applied on: {new Date(app.createdAt).toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 md:justify-end">
                  {/* optional actions (future) */}
                  <button className="btn btn-sm btn-outline" disabled>
                    View
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
