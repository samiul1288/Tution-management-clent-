import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import normalizeArray from "../../../utils/normalizeArray";

export default function AppliedTutors() {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosSecure.get("/applications/student");
      setApps(normalizeArray(res.data));
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load applied tutors."
      );
      setApps([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ helper: always return id string
  const pickId = (v) => {
    if (!v) return "";
    if (typeof v === "string") return v;
    if (typeof v === "object") return v?._id || v?.id || "";
    return "";
  };

  // ✅ helper: make salary number
  const normalizeAmount = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const handlePayApprove = (app) => {
    const applicationId = pickId(app?._id);
    const tuitionId = pickId(app?.tuitionId);
    const tutorId = pickId(app?.tutorId);

    const expectedSalary = normalizeAmount(app?.expectedSalary);

    const tuitionTitle =
      app?.tuitionId?.title ||
      app?.tuitionTitle ||
      app?.tuition?.title ||
      "Tuition";

    const tutorName =
      app?.tutorId?.name ||
      app?.tutorId?.displayName ||
      app?.tutorName ||
      "Tutor";

    // ✅ hard guard (so checkout blank page issue not happen)
    if (!applicationId || !tuitionId || !tutorId || expectedSalary <= 0) {
      alert(
        "Payment data missing! Please refresh Applied Tutors page and try again."
      );
      return;
    }

    navigate("/dashboard/student/checkout", {
      state: {
        applicationId,
        tuitionId,
        tutorId,
        expectedSalary,
        tuitionTitle,
        tutorName,
      },
    });
  };

  const handleReject = async (appId) => {
    const ok = window.confirm("Are you sure to reject this application?");
    if (!ok) return;

    try {
      await axiosSecure.patch(`/applications/${appId}/reject`);
      await load();
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to reject application."
      );
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  if (error) {
    return (
      <div className="p-6">
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
        <button onClick={load} className="btn btn-sm btn-outline mt-3">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-2xl font-bold">Applied Tutors</h2>
        <button onClick={load} className="btn btn-sm btn-outline">
          Refresh
        </button>
      </div>

      {apps.length === 0 ? (
        <div className="card bg-base-100 border p-5">
          <p className="text-sm opacity-70">No applications found.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {apps.map((app) => {
            const status = (app?.status || "PENDING").toUpperCase();

            const applicationId = pickId(app?._id);
            const tuitionId = pickId(app?.tuitionId);
            const tutorId = pickId(app?.tutorId);

            const tuitionTitle =
              app?.tuitionId?.title ||
              app?.tuitionTitle ||
              app?.tuition?.title ||
              "Tuition";

            const tutorName =
              app?.tutorId?.name ||
              app?.tutorId?.displayName ||
              app?.tutorName ||
              "Tutor";

            const tutorEmail = app?.tutorId?.email || app?.tutorEmail || "";
            const amount = normalizeAmount(app?.expectedSalary);

            // ✅ if missing required info, disable pay button
            const canPay =
              status === "PENDING" &&
              Boolean(applicationId && tuitionId && tutorId && amount > 0);

            return (
              <div
                key={applicationId || Math.random()}
                className="card bg-base-100 border p-4"
              >
                <p className="font-semibold text-lg">{tuitionTitle}</p>

                <p className="text-sm opacity-70">
                  Tutor: <span className="font-medium">{tutorName}</span>
                  {tutorEmail ? ` (${tutorEmail})` : ""}
                </p>

                <p className="text-sm opacity-70">
                  Expected Salary: <span className="font-medium">{amount}</span>
                  ৳
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <span
                    className={`badge ${
                      status === "APPROVED"
                        ? "badge-success"
                        : status === "REJECTED"
                        ? "badge-error"
                        : "badge-warning"
                    }`}
                  >
                    {status}
                  </span>

                  {status === "PENDING" ? (
                    <div className="ml-auto flex gap-2">
                      <button
                        onClick={() => handleReject(applicationId)}
                        className="btn btn-outline btn-sm"
                        disabled={!applicationId}
                      >
                        Reject
                      </button>

                      <button
                        onClick={() => handlePayApprove(app)}
                        className="btn btn-primary btn-sm"
                        disabled={!canPay}
                        title={!canPay ? "Missing payment info" : ""}
                      >
                        Pay & Approve
                      </button>
                    </div>
                  ) : (
                    <div className="ml-auto text-xs opacity-60">
                      {status === "APPROVED"
                        ? "Approved via payment"
                        : "Rejected by student"}
                    </div>
                  )}
                </div>

                {/* ✅ debug hint if pay disabled */}
                {status === "PENDING" && !canPay ? (
                  <p className="mt-2 text-xs opacity-60">
                    ⚠ Missing data: {!applicationId ? "applicationId " : ""}
                    {!tuitionId ? "tuitionId " : ""}
                    {!tutorId ? "tutorId " : ""}
                    {amount <= 0 ? "expectedSalary " : ""}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
