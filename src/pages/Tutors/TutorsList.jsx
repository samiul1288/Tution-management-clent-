import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const TutorsList = () => {
  const axiosPublic = useAxiosPublic();

  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setError("");
        setLoading(true);

        // ✅ backend এ এই route বানাবো: GET /api/users/tutors
        const res = await axiosPublic.get("/users/tutors");

        const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setTutors(data);
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load tutors."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, [axiosPublic]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <div className="alert alert-error">
          <span className="text-sm">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <div>
        <h1 className="text-2xl font-bold">All Tutors</h1>
        <p className="text-sm text-gray-500">Browse verified tutors here.</p>
      </div>

      {tutors.length === 0 ? (
        <div className="card bg-base-100 border p-6">
          <p className="text-sm text-gray-500">No tutors found.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {tutors.map((t) => (
            <div key={t._id} className="card bg-base-100 border p-5">
              <div className="flex items-center gap-3">
                <img
                  className="w-12 h-12 rounded-full object-cover"
                  src={
                    t.photoURL || "https://i.ibb.co/2kR1bZB/default-avatar.png"
                  }
                  alt="tutor"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://i.ibb.co/2kR1bZB/default-avatar.png";
                  }}
                />
                <div>
                  <p className="font-semibold">{t.name || "Tutor"}</p>
                  <p className="text-xs text-gray-500">{t.email}</p>
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-medium">Role:</span>{" "}
                  {(t.role || "tutor").toUpperCase()}
                </p>
                {t.phone && (
                  <p>
                    <span className="font-medium">Phone:</span> {t.phone}
                  </p>
                )}
              </div>

              <div className="mt-4">
                <Link
                  to={`/tutors/${t._id}`}
                  className="btn btn-sm btn-outline w-full"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TutorsList;
