import { useCallback, useEffect, useMemo, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const RevenueHistory = () => {
  const axiosSecure = useAxiosSecure();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const total = useMemo(
    () => payments.reduce((sum, p) => sum + Number(p.amount || 0), 0),
    [payments]
  );

  const fetchRevenue = useCallback(async () => {
    try {
      setError("");
      setLoading(true);

      // ✅ Backend route mismatch হলে শুধু এইটা change করো:
      // Option A: /payments/tutor
      // Option B: /payments/my
      // Option C: /tutor/revenue
      const res = await axiosSecure.get("/payments/my");
      setPayments(res.data || []);
    } catch (err) {
      console.error(err);
      const status = err?.response?.status;
      if (status === 401) setError("Unauthorized (401). Please login again.");
      else if (status === 403) setError("Forbidden (403). Tutor only route.");
      else
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load revenue history."
        );
    } finally {
      setLoading(false);
    }
  }, [axiosSecure]);

  useEffect(() => {
    fetchRevenue();
  }, [fetchRevenue]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Revenue History</h2>
          <p className="text-sm text-gray-500">
            Your payment history from approved tuitions.
          </p>
        </div>

        <div className="card bg-base-100 border border-base-200 shadow-sm p-4">
          <p className="text-xs text-gray-500">Total earnings</p>
          <p className="text-2xl font-extrabold">{total}৳</p>
          <button
            className="btn btn-sm btn-outline mt-3"
            onClick={fetchRevenue}
          >
            Refresh
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
      ) : payments.length === 0 ? (
        <div className="card bg-base-100 border border-base-200 p-6">
          <p className="text-sm text-gray-500">No revenue found yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto card bg-base-100 border border-base-200 shadow-sm">
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Date</th>
                <th>Tuition</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Transaction</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id}>
                  <td className="text-xs">
                    {p.createdAt ? new Date(p.createdAt).toLocaleString() : "-"}
                  </td>
                  <td className="text-xs">
                    {p.tuitionTitle || p.tuitionId?.title || "-"}
                  </td>
                  <td className="text-xs font-semibold">{p.amount ?? "-"}৳</td>
                  <td>
                    <span className="badge badge-ghost badge-sm">
                      {p.status || "PAID"}
                    </span>
                  </td>
                  <td className="text-xs">{p.transactionId || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RevenueHistory;
