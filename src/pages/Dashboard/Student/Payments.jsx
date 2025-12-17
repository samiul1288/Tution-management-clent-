import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const Payments = () => {
  const axiosSecure = useAxiosSecure();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/payments/my");
      setPayments(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const total = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold">Payment History</h2>
          <p className="text-sm text-gray-500">
            Your successful Stripe payments will appear here.
          </p>
        </div>

        <div className="card bg-base-100 border border-base-200 shadow-sm p-4">
          <p className="text-xs text-gray-500">Total paid</p>
          <p className="text-2xl font-extrabold">{total}৳</p>
          <p className="text-[11px] text-gray-500">
            Transactions: {payments.length}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-200px">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      ) : payments.length === 0 ? (
        <div className="card bg-base-100 border border-base-200 p-6">
          <p className="text-sm text-gray-500">
            No payments yet. Approve a tutor and complete checkout to see
            transactions here.
          </p>
        </div>
      ) : (
        <div className="card bg-base-100 border border-base-200 shadow-sm">
          <div className="p-4 border-b border-base-200">
            <h3 className="font-semibold">Transactions</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tuition</th>
                  <th>Tutor</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Transaction ID</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((p, idx) => (
                  <tr key={p._id}>
                    <td>{idx + 1}</td>

                    <td>
                      <p className="font-semibold text-sm">
                        {p.tuitionId?.title || "N/A"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {p.tuitionId?.subject
                          ? `${p.tuitionId.subject} • Class ${
                              p.tuitionId.className || ""
                            }`
                          : ""}
                      </p>
                    </td>

                    <td>
                      <p className="font-semibold text-sm">
                        {p.tutorId?.name || "N/A"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {p.tutorId?.email || ""}
                      </p>
                    </td>

                    <td className="font-bold">{p.amount}৳</td>

                    <td>
                      <span
                        className={`badge ${
                          p.status === "SUCCESS"
                            ? "badge-success"
                            : "badge-ghost"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    <td className="text-xs font-mono">
                      {p.transactionId || "—"}
                    </td>

                    <td className="text-xs text-gray-500">
                      {p.createdAt
                        ? new Date(p.createdAt).toLocaleString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-base-200 text-xs text-gray-500">
            Tip: Stripe test card use korte:{" "}
            <span className="font-mono">4242 4242 4242 4242</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
