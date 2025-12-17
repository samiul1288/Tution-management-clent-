import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const LatestTuitionsSection = () => {
  const axiosPublic = useAxiosPublic();
  const [tuitions, setTuitions] = useState([]);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await axiosPublic.get("/tuitions", {
          params: { page: 1, limit: 6, sort: "newest" },
        });
        setTuitions(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLatest();
  }, [axiosPublic]);

  return (
    <section className="mt-16 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Latest Tuition Posts</h2>
        <Link to="/tuitions" className="btn btn-link btn-sm">
          View all
        </Link>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {tuitions.map((t) => (
          <div
            key={t._id}
            className="card bg-base-100 shadow-sm border border-base-200"
          >
            <div className="card-body">
              <h3 className="card-title text-base">{t.title}</h3>
              <p className="text-xs text-gray-500">
                {t.subject} • Class {t.className}
              </p>
              <p className="text-xs">Location: {t.location}</p>
              <p className="font-semibold mt-1">Budget: {t.budget}৳</p>
              <div className="card-actions justify-end mt-3">
                <Link
                  to={`/tuitions/${t._id}`}
                  className="btn btn-xs btn-primary"
                >
                  Details
                </Link>
              </div>
            </div>
          </div>
        ))}
        {tuitions.length === 0 && <p>No tuitions yet.</p>}
      </div>
    </section>
  );
};

export default LatestTuitionsSection;
