import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const LatestTutorsSection = () => {
  const axiosPublic = useAxiosPublic();
  const [tutors, setTutors] = useState([]);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        // 👉 backend e simple public route banale valo:
        // GET /api/users/tutors?limit=6  => only role:"tutor"
        const res = await axiosPublic.get("/users/tutors", {
          params: { limit: 6 },
        });
        setTutors(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTutors();
  }, [axiosPublic]);

  return (
    <section className="mt-16 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Latest Tutors</h2>
        <Link to="/tutors" className="btn btn-link btn-sm">
          View all tutors
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {tutors.map((tutor) => (
          <div
            key={tutor._id}
            className="card bg-base-100 shadow-sm border border-base-200"
          >
            <div className="card-body">
              <div className="flex items-center gap-3 mb-2">
                <div className="avatar">
                  <div className="w-12 rounded-full">
                    <img
                      src={
                        tutor.photoURL || "https://i.ibb.co/FHpdphK/avatar.png"
                      }
                      alt={tutor.name}
                    />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{tutor.name}</h3>
                  <p className="text-[11px] uppercase tracking-wide text-gray-500">
                    {tutor.specialization || "Private tutor"}
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-500">
                Experience: {tutor.experience || "2+ years"}
              </p>
              <p className="text-xs">
                Preferred areas: {tutor.preferredLocation || "Dhaka"}
              </p>

              <div className="card-actions justify-between items-center mt-3 text-xs">
                <span className="badge badge-outline">
                  {tutor.subjects?.join(", ") || "Multiple subjects"}
                </span>
                <Link
                  to={`/tutors/${tutor._id}`}
                  className="btn btn-xs btn-primary"
                >
                  View profile
                </Link>
              </div>
            </div>
          </div>
        ))}

        {tutors.length === 0 && (
          <p className="text-sm text-gray-500">No tutors found yet.</p>
        )}
      </div>
    </section>
  );
};

export default LatestTutorsSection;
