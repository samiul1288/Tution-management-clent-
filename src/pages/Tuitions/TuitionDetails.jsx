import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const TuitionDetails = () => {
  const { id } = useParams();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  const { user } = useAuth(); // Firebase user object (role usually not here)
  const navigate = useNavigate();
  const location = useLocation();

  const [tuition, setTuition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyOpen, setApplyOpen] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ✅ role source: localStorage (because JWT decode/store is done in Register/Login)
  const role = useMemo(() => {
    return (localStorage.getItem("user-role") || "student").toLowerCase();
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axiosPublic.get(`/tuitions/${id}`);
        setTuition(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [axiosPublic, id]);

  const handleApply = async (e) => {
    e.preventDefault();
    setApplyError("");

    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    // ✅ FIX: check role from localStorage instead of user.role
    if (role !== "tutor") {
      setApplyError("Only tutors can apply to tuition posts.");
      return;
    }

    const form = e.target;
    const qualifications = form.qualifications.value.trim();
    const experience = form.experience.value.trim();
    const expectedSalary = Number(form.expectedSalary.value);

    if (!tuition?._id) {
      setApplyError("Tuition not loaded properly. Refresh and try again.");
      return;
    }

    try {
      setSubmitting(true);

      await axiosSecure.post("/applications", {
        tuitionId: tuition._id,
        qualifications,
        experience,
        expectedSalary,
      });

      setApplyOpen(false);
      form.reset();
      alert("Application submitted!");
    } catch (err) {
      console.error(err);

      // optional: backend message show
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to apply. Try again.";
      setApplyError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!tuition) return <p>Tuition not found</p>;

  // ✅ safer displayName fallback for firebase
  const displayName = user?.displayName || user?.name || "";
  const displayEmail = user?.email || "";

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">{tuition.title}</h1>
      <p>{tuition.description}</p>

      <div className="grid md:grid-cols-2 gap-4 text-sm">
        <p>
          <span className="font-semibold">Subject:</span> {tuition.subject}
        </p>
        <p>
          <span className="font-semibold">Class:</span> {tuition.className}
        </p>
        <p>
          <span className="font-semibold">Location:</span> {tuition.location}
        </p>
        <p>
          <span className="font-semibold">Budget:</span> {tuition.budget}৳
        </p>
        <p>
          <span className="font-semibold">Schedule:</span> {tuition.schedule}
        </p>
      </div>

      <button
        className="btn btn-primary mt-4"
        onClick={() => setApplyOpen(true)}
      >
        Apply as Tutor
      </button>

      {/* Apply Modal */}
      {applyOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="card bg-base-100 w-full max-w-lg p-6 relative">
            <button
              className="btn btn-sm btn-circle absolute right-3 top-3"
              onClick={() => setApplyOpen(false)}
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-4">
              Apply to this Tuition
            </h2>

            {user ? (
              <form onSubmit={handleApply} className="space-y-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="label">
                      <span className="label-text">Name</span>
                    </label>
                    <input
                      className="input input-bordered w-full"
                      value={displayName}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      className="input input-bordered w-full"
                      value={displayEmail}
                      readOnly
                    />
                  </div>
                </div>

                <textarea
                  name="qualifications"
                  className="textarea textarea-bordered w-full"
                  placeholder="Qualifications"
                  required
                />

                <textarea
                  name="experience"
                  className="textarea textarea-bordered w-full"
                  placeholder="Experience"
                  required
                />

                <input
                  type="number"
                  name="expectedSalary"
                  className="input input-bordered w-full"
                  placeholder="Expected salary"
                  required
                  min="1"
                />

                {applyError && (
                  <p className="text-red-500 text-sm">{applyError}</p>
                )}

                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </form>
            ) : (
              <p>Please login to apply.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TuitionDetails;
