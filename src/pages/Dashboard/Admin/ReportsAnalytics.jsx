import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ReportsAnalytics = () => {
  const axiosSecure = useAxiosSecure();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get("/dashboard/admin-analytics");
      setData(res.data);
    } catch (e) {
      console.error(e);
      alert("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!data) return <div className="p-6">No data</div>;

  const { users, tuitions, payments, monthly } = data;

  return (
    <div className="space-y-6">
      <div className="card bg-base-100 p-6 shadow">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Reports & Analytics</h2>
            <p className="text-sm opacity-70">Overview of platform stats</p>
          </div>
          <button className="btn" onClick={fetchAnalytics}>
            Refresh
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="card bg-base-100 p-5 shadow">
          <p className="text-sm opacity-70">Total Users</p>
          <p className="text-3xl font-bold">{users.totalUsers}</p>
          <p className="text-xs opacity-60">
            S:{users.totalStudents} T:{users.totalTutors} A:{users.totalAdmins}
          </p>
        </div>

        <div className="card bg-base-100 p-5 shadow">
          <p className="text-sm opacity-70">Total Tuitions</p>
          <p className="text-3xl font-bold">{tuitions.totalTuitions}</p>
          <p className="text-xs opacity-60">
            Pending: {tuitions.pendingTuitions}
          </p>
        </div>

        <div className="card bg-base-100 p-5 shadow">
          <p className="text-sm opacity-70">Approved</p>
          <p className="text-3xl font-bold">{tuitions.approvedTuitions}</p>
          <p className="text-xs opacity-60">
            Rejected: {tuitions.rejectedTuitions}
          </p>
        </div>

        <div className="card bg-base-100 p-5 shadow">
          <p className="text-sm opacity-70">Revenue</p>
          <p className="text-3xl font-bold">${payments.totalRevenue}</p>
          <p className="text-xs opacity-60">
            Payments: {payments.totalPayments}
          </p>
        </div>
      </div>

      {/* Monthly Table */}
      <div className="card bg-base-100 p-6 shadow">
        <h3 className="font-bold mb-3">Last 6 Months Revenue</h3>

        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Revenue</th>
                <th>Payments</th>
              </tr>
            </thead>
            <tbody>
              {monthly?.map((m) => (
                <tr key={`${m._id.y}-${m._id.m}`}>
                  <td>
                    {m._id.y}-{String(m._id.m).padStart(2, "0")}
                  </td>
                  <td>${m.revenue}</td>
                  <td>{m.count}</td>
                </tr>
              ))}

              {!monthly?.length && (
                <tr>
                  <td colSpan={3} className="text-center py-6 opacity-70">
                    No payment data yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
