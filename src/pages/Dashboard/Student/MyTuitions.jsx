import { useEffect, useState, useCallback } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MyTuitions = () => {
  const axiosSecure = useAxiosSecure();

  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // edit modal states
  const [openEdit, setOpenEdit] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchMyTuitions = useCallback(async () => {
    try {
      setError("");
      setLoading(true);
      const res = await axiosSecure.get("/tuitions/me");
      setTuitions(res.data || []);
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load tuitions.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure]);

  useEffect(() => {
    fetchMyTuitions();
  }, [fetchMyTuitions]);

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this tuition?");
    if (!ok) return;

    try {
      await axiosSecure.delete(`/tuitions/${id}`);
      setTuitions((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message || err?.message || "Failed to delete.";
      setError(msg);
    }
  };

  const openEditModal = (tuition) => {
    setEditing({
      _id: tuition._id,
      title: tuition.title ?? "",
      subject: tuition.subject ?? "",
      className: tuition.className ?? "",
      location: tuition.location ?? "",
      budget: tuition.budget ?? "",
      schedule: tuition.schedule ?? "",
      description: tuition.description ?? "",
    });
    setOpenEdit(true);
    setError("");
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditing((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editing?._id) return;

    try {
      setSaving(true);
      setError("");

      const payload = {
        title: editing.title,
        subject: editing.subject,
        className: editing.className,
        location: editing.location,
        budget: Number(editing.budget),
        schedule: editing.schedule,
        description: editing.description,
      };

      const res = await axiosSecure.patch(`/tuitions/${editing._id}`, payload);

      const updated = res.data;
      setTuitions((prev) =>
        prev.map((t) => (t._id === editing._id ? updated : t))
      );

      setOpenEdit(false);
      setEditing(null);
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message || err?.message || "Update failed.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const approved = tuitions.filter((t) => t.status === "APPROVED");
  const others = tuitions.filter((t) => t.status !== "APPROVED");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">My Tuitions</h2>
          <p className="text-sm text-gray-500">
            Manage your posted tuition requests. Approved ones are visible to
            tutors.
          </p>
        </div>

        <div className="card bg-base-100 border border-base-200 shadow-sm p-4">
          <p className="text-xs text-gray-500">Total posted</p>
          <p className="text-2xl font-extrabold">{tuitions.length}</p>
          <p className="text-[11px] text-gray-500">
            Approved: {approved.length} • Pending/Rejected: {others.length}
          </p>
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
      ) : tuitions.length === 0 ? (
        <div className="card bg-base-100 border border-base-200 p-6">
          <p className="text-sm text-gray-500">
            You haven’t posted any tuitions yet. Go to “Post New Tuition” to
            create one.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {[...approved, ...others].map((t) => (
            <div
              key={t._id}
              className="card bg-base-100 border border-base-200 shadow-sm p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{t.title}</h3>
                  <span
                    className={`badge badge-sm ${
                      t.status === "APPROVED"
                        ? "badge-success"
                        : t.status === "REJECTED"
                        ? "badge-error"
                        : "badge-warning"
                    }`}
                  >
                    {t.status}
                  </span>
                </div>

                <p className="text-sm text-gray-500">
                  {t.subject} • Class {t.className} • {t.location}
                </p>
                <p className="text-sm font-semibold">Budget: {t.budget}৳</p>
              </div>

              <div className="flex gap-2 md:justify-end">
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => openEditModal(t)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-error"
                  onClick={() => handleDelete(t._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EDIT MODAL */}
      {openEdit && editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="card bg-base-100 w-full max-w-2xl p-6 relative">
            <button
              className="btn btn-sm btn-circle absolute right-3 top-3"
              onClick={() => {
                setOpenEdit(false);
                setEditing(null);
              }}
            >
              ✕
            </button>

            <h3 className="text-lg font-bold mb-1">Update Tuition</h3>
            <p className="text-xs text-gray-500 mb-4">
              Default values are shown. Update the fields and save.
            </p>

            <form onSubmit={handleUpdate} className="grid md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  name="title"
                  value={editing.title}
                  onChange={handleEditChange}
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Subject</span>
                </label>
                <input
                  name="subject"
                  value={editing.subject}
                  onChange={handleEditChange}
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Class</span>
                </label>
                <input
                  name="className"
                  value={editing.className}
                  onChange={handleEditChange}
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Location</span>
                </label>
                <input
                  name="location"
                  value={editing.location}
                  onChange={handleEditChange}
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Budget (৳)</span>
                </label>
                <input
                  name="budget"
                  type="number"
                  value={editing.budget}
                  onChange={handleEditChange}
                  className="input input-bordered"
                  required
                  min="1"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Schedule</span>
                </label>
                <input
                  name="schedule"
                  value={editing.schedule}
                  onChange={handleEditChange}
                  className="input input-bordered"
                  placeholder="e.g. 3 days/week"
                />
              </div>

              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  name="description"
                  value={editing.description}
                  onChange={handleEditChange}
                  className="textarea textarea-bordered"
                  rows={4}
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setOpenEdit(false);
                    setEditing(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={saving}
                >
                  {saving ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    "Save changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTuitions;
