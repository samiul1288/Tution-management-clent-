import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const TutorProfile = () => {
  const { id } = useParams();
  const axiosPublic = useAxiosPublic();

  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        setLoading(true);
        setError("");

        // ✅ backend route: GET /api/users/:id
        const res = await axiosPublic.get(`/users/${id}`);
        setTutor(res.data);
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load tutor profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTutor();
  }, [axiosPublic, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-gray-500">Tutor not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* ===== Header Card ===== */}
      <div className="card bg-base-100 shadow-md border">
        <div className="card-body md:flex-row gap-6">
          <img
            src={
              tutor.photoURL || "https://i.ibb.co/2kR1bZB/default-avatar.png"
            }
            alt="Tutor"
            className="w-28 h-28 rounded-full object-cover border"
            onError={(e) => {
              e.currentTarget.src =
                "https://i.ibb.co/2kR1bZB/default-avatar.png";
            }}
          />

          <div className="flex-1 space-y-1">
            <h2 className="text-2xl font-bold">{tutor.name || "Tutor"}</h2>
            <p className="text-sm text-gray-500">{tutor.email}</p>

            <div className="mt-2 flex flex-wrap gap-2">
              <span className="badge badge-primary badge-outline">
                {(tutor.role || "tutor").toUpperCase()}
              </span>
              <span className="badge badge-success badge-outline">
                Verified Tutor
              </span>
            </div>
          </div>

          <div className="self-start">
            <button className="btn btn-primary btn-sm">Contact Tutor</button>
          </div>
        </div>
      </div>

      {/* ===== Info Grid ===== */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card bg-base-100 border p-5">
          <p className="text-xs text-gray-500">Experience</p>
          <p className="text-xl font-bold">{tutor.experience || "N/A"} years</p>
        </div>

        <div className="card bg-base-100 border p-5">
          <p className="text-xs text-gray-500">Subjects</p>
          <p className="text-sm font-medium">
            {tutor.subjects?.join(", ") || "All Subjects"}
          </p>
        </div>

        <div className="card bg-base-100 border p-5">
          <p className="text-xs text-gray-500">Location</p>
          <p className="text-sm font-medium">
            {tutor.location || "Bangladesh"}
          </p>
        </div>
      </div>

      {/* ===== About Section ===== */}
      <div className="card bg-base-100 border shadow-sm p-6">
        <h3 className="font-semibold text-lg mb-2">About Tutor</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {tutor.bio ||
            "This tutor has not added a bio yet. However, they are verified and actively available for tuition opportunities."}
        </p>
      </div>

      {/* ===== Stats ===== */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card bg-base-100 border p-5">
          <p className="text-xs text-gray-500">Completed Tuitions</p>
          <p className="text-2xl font-extrabold">
            {tutor.completedTuitions || 0}
          </p>
        </div>

        <div className="card bg-base-100 border p-5">
          <p className="text-xs text-gray-500">Rating</p>
          <p className="text-2xl font-extrabold">{tutor.rating || "4.8"} ⭐</p>
        </div>

        <div className="card bg-base-100 border p-5">
          <p className="text-xs text-gray-500">Joined</p>
          <p className="text-sm font-medium">
            {new Date(tutor.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TutorProfile;
