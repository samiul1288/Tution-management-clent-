import { useEffect, useState, useCallback } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";

const AppliedTutors = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [tuitions, setTuitions] = useState([]);
  const [selectedTuition, setSelectedTuition] = useState(null);
  const [applications, setApplications] = useState([]);

  const [loadingTuitions, setLoadingTuitions] = useState(true);
  const [loadingApps, setLoadingApps] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");

  const fetchMyTuitions = useCallback(async () => {
    try {
      setError("");
      setLoadingTuitions(true);

      const res = await axiosSecure.get("/tuitions/me");
      setTuitions(res.data || []);
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load your tuitions.";
      setError(msg);
    } finally {
      setLoadingTuitions(false);
    }
  }, [axiosSecure]);

  useEffect(() => {
    fetchMyTuitions();
  }, [fetchMyTuitions]);

  const openApplications = async (tuition) => {
    setSelectedTuition(tuition);
    setApplications([]);
    setModalOpen(true);
    setLoadingApps(true);
    setError("");

    try {
      const res = await axiosSecure.get(`/applications/tuition/${tuition._id}`);
      setApplications(res.data || []);
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load applications.";
      setError(msg);
    } finally {
      setLoadingApps(false);
    }
  };

  const refreshApplications = async () => {
    if (!selectedTuition?._id) return;
    setLoadingApps(true);
    setError("");

    try {
      const res = await axiosSecure.get(
        `/applications/tuition/${selectedTuition._id}`
      );
      setApplications(res.data || []);
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to refresh applications.";
      setError(msg);
    } finally {
      setLoadingApps(false);
    }
  };

  const handleReject = async (appId) => {
    const ok = window.confirm("Reject this tutor application?");
    if (!ok) return;

    try {
      await axiosSecure.patch(`/applications/${appId}/reject`);
      await refreshApplications();
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message || err?.message || "Reject failed.";
      setError(msg);
    }
  };

  const handleApprove = (application) => {
    if (!selectedTuition?._id) return;

    navigate("/checkout", {
      state: {
        applicationId: application._id,
        tuitionId: selectedTuition._id,
        tutorId: application?.tutorId?._id,
        tutorName: application?.tutorId?.name,
        expectedSalary: application.expectedSalary,
        tuitionTitle: selectedTuition.title,
      },
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Applied Tutors</h2>
      <p className="text-sm text-gray-500">
        Choose an application for each tuition. A tutor is fully approved only
        after successful payment.
      </p>

      {error && (
        <div className="alert alert-error">
          <span className="text-sm">{error}</span>
        </div>
      )}

      {loadingTuitions ? (
        <div className="flex justify-center items-center min-h-160px">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      ) : tuitions.length === 0 ? (
        <p>You haven&apos;t posted any tuitions yet.</p>
      ) : (
        <div className="space-y-3">
          {tuitions.map((t) => (
            <div
              key={t._id}
              className="card bg-base-100 p-4 shadow flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            >
              <div>
                <h3 className="font-semibold">{t.title}</h3>
                <p className="text-sm text-gray-500">
                  {t.subject} • Class {t.className} • {t.location}
                </p>
                <p className="text-sm">Budget: {t.budget}৳</p>
                <p className="badge badge-outline mt-1">{t.status}</p>
              </div>

              <button
                className="btn btn-sm btn-primary"
                onClick={() => openApplications(t)}
              >
                View applications
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Applications modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="card bg-base-100 w-full max-w-3xl p-6 relative">
            <button
              className="btn btn-sm btn-circle absolute right-3 top-3"
              onClick={() => {
                setModalOpen(false);
                setSelectedTuition(null);
                setApplications([]);
                setError("");
              }}
            >
              ✕
            </button>

            <h3 className="text-lg font-semibold mb-1">
              Tutor applications for:{" "}
              <span className="font-bold">{selectedTuition?.title}</span>
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Approve one tutor and you&apos;ll be redirected to the payment
              page.
            </p>

            {loadingApps ? (
              <div className="flex justify-center items-center min-h-[120px]">
                <span className="loading loading-spinner loading-md"></span>
              </div>
            ) : applications.length === 0 ? (
              <p className="text-sm text-gray-500">
                No applications for this tuition yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Tutor</th>
                      <th>Qualifications</th>
                      <th>Experience</th>
                      <th>Expected salary</th>
                      <th>Status</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app._id}>
                        <td>
                          <div>
                            <p className="font-semibold text-xs">
                              {app.tutorId?.name}
                            </p>
                            <p className="text-[11px] text-gray-500">
                              {app.tutorId?.email}
                            </p>
                          </div>
                        </td>
                        <td className="max-w-xs text-[11px]">
                          {app.qualifications}
                        </td>
                        <td className="max-w-xs text-[11px]">
                          {app.experience}
                        </td>
                        <td className="text-xs font-semibold">
                          {app.expectedSalary}৳
                        </td>
                        <td>
                          <span className="badge badge-ghost badge-sm">
                            {app.status}
                          </span>
                        </td>
                        <td>
                          <div className="flex justify-end gap-2">
                            <button
                              className="btn btn-xs btn-outline"
                              onClick={() => handleReject(app._id)}
                              disabled={app.status !== "PENDING"}
                            >
                              Reject
                            </button>
                            <button
                              className="btn btn-xs btn-primary"
                              onClick={() => handleApprove(app)}
                              disabled={app.status !== "PENDING"}
                            >
                              Approve & Pay
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppliedTutors;
