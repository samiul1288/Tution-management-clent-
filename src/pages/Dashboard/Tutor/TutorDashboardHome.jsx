import { useCallback, useEffect, useMemo, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const TutorDashboardHome = () => {
  const axiosSecure = useAxiosSecure();

  const [applications, setApplications] = useState([]);
  const [ongoing, setOngoing] = useState([]);
  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const totalEarning = useMemo(() => {
    return payments.reduce((sum, p) => sum + Number(p?.amount || 0), 0);
  }, [payments]);

  const fetchAll = useCallback(async () => {
    try {
      setError("");
      setLoading(true);

      // NOTE: backend route mismatch হলে শুধু এখান থেকে endpoint change করবেন
      const [appRes, onRes, payRes] = await Promise.allSettled([
        axiosSecure.get("/tuitions/tutor/ongoing"),
        axiosSecure.get("/payments/my"),
        axiosSecure.get("/applications/my"),
      ]);

      // ✅ Promise.allSettled ব্যবহার করায় ১টা fail হলেও অন্যগুলো show করতে পারবে
      if (appRes.status === "fulfilled")
        setApplications(appRes.value.data || []);
      else console.error("applications error:", appRes.reason);

      if (onRes.status === "fulfilled") setOngoing(onRes.value.data || []);
      else console.error("ongoing error:", onRes.reason);

      if (payRes.status === "fulfilled") setPayments(payRes.value.data || []);
      else console.error("payments error:", payRes.reason);

      // ✅ যদি সবগুলোই fail হয়, তখন error দেখাবো
      const allFailed =
        appRes.status === "rejected" &&
        onRes.status === "rejected" &&
        payRes.status === "rejected";

      if (allFailed) {
        const status =
          appRes?.reason?.response?.status ||
          onRes?.reason?.response?.status ||
          payRes?.reason?.response?.status;

        if (status === 401) setError("Unauthorized (401). Please login again.");
        else if (status === 403)
          setError("Forbidden (403). You don’t have access.");
        else {
          setError(
            appRes?.reason?.response?.data?.message ||
              onRes?.reason?.response?.data?.message ||
              payRes?.reason?.response?.data?.message ||
              "Failed to load dashboard summary."
          );
        }
      }
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
    fetchAll();
  }, [fetchAll]);

  const pending = useMemo(
    () => applications.filter((a) => a?.status === "PENDING").length,
    [applications]
  );

  const approved = useMemo(
    () => applications.filter((a) => a?.status === "APPROVED").length,
    [applications]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Tutor Dashboard</h2>
          <p className="text-sm text-gray-500">
            Overview of your applications, ongoing tuitions and earnings.
          </p>
        </div>

        <button className="btn btn-sm btn-outline" onClick={fetchAll}>
          Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <span className="text-sm">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center min-h-200px">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="card bg-base-100 border border-base-200 shadow-sm p-5">
              <p className="text-xs text-gray-500">Applications</p>
              <p className="text-2xl font-extrabold">{applications.length}</p>
              <p className="text-[11px] text-gray-500">
                Pending: {pending} • Approved: {approved}
              </p>
            </div>

            <div className="card bg-base-100 border border-base-200 shadow-sm p-5">
              <p className="text-xs text-gray-500">Ongoing Tuitions</p>
              <p className="text-2xl font-extrabold">{ongoing.length}</p>
              <p className="text-[11px] text-gray-500">
                Currently assigned to you
              </p>
            </div>

            <div className="card bg-base-100 border border-base-200 shadow-sm p-5">
              <p className="text-xs text-gray-500">Total Earnings</p>
              <p className="text-2xl font-extrabold">{totalEarning}৳</p>
              <p className="text-[11px] text-gray-500">
                From completed/paid tuitions
              </p>
            </div>
          </div>

          <div className="card bg-base-100 border border-base-200 shadow-sm p-5">
            <h3 className="font-semibold mb-2">Recent Activity</h3>
            <div className="text-sm text-gray-500 space-y-1">
              <p>• Latest applications: {applications.slice(0, 3).length}</p>
              <p>• Latest ongoing tuitions: {ongoing.slice(0, 3).length}</p>
              <p>• Latest payments: {payments.slice(0, 3).length}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TutorDashboardHome;
