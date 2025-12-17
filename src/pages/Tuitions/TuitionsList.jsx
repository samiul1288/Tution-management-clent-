import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const TuitionsList = () => {
  const axiosPublic = useAxiosPublic();

  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("newest");

  // pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 6;

  const fetchTuitions = async () => {
    setLoading(true);
    try {
      const res = await axiosPublic.get("/tuitions", {
        params: { search, subject, location, sort, page, limit },
      });
      setTuitions(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTuitions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sort]); // search/filter manual button diye handle korbo

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTuitions();
  };

  const handleReset = () => {
    setSearch("");
    setSubject("");
    setLocation("");
    setSort("newest");
    setPage(1);
    fetchTuitions();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">All Tuition Posts</h1>

      {/* search + filter + sort */}
      <form
        onSubmit={handleFilterSubmit}
        className="grid md:grid-cols-5 gap-3 items-end bg-base-100 p-4 rounded-box shadow-sm"
      >
        <div className="md:col-span-2">
          <label className="label">
            <span className="label-text">Search (subject/location)</span>
          </label>
          <input
            className="input input-bordered w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="e.g. Physics, Dhanmondi"
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Subject</span>
          </label>
          <input
            className="input input-bordered w-full"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Math, English..."
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Location</span>
          </label>
          <input
            className="input input-bordered w-full"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Area / City"
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Sort by</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="budgetAsc">Budget: Low to High</option>
            <option value="budgetDesc">Budget: High to Low</option>
          </select>
        </div>

        <div className="md:col-span-5 flex gap-3 justify-end">
          <button
            type="button"
            onClick={handleReset}
            className="btn btn-ghost btn-sm"
          >
            Reset
          </button>
          <button type="submit" className="btn btn-primary btn-sm">
            Apply Filters
          </button>
        </div>
      </form>

      {/* list */}
      {tuitions.length === 0 ? (
        <p>No tuitions found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tuitions.map((t) => (
            <div
              key={t._id}
              className="card bg-base-100 shadow p-4 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-semibold text-lg mb-1">{t.title}</h3>
                <p className="text-sm text-gray-500">
                  {t.subject} • Class {t.className}
                </p>
                <p className="text-sm">Location: {t.location}</p>
                <p className="text-sm font-bold mt-1">Budget: {t.budget}৳</p>
              </div>
              <Link
                to={`/tuitions/${t._id}`}
                className="btn btn-sm btn-primary mt-4"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* pagination */}
      <div className="flex justify-center gap-2 mt-4">
        <button
          className="btn btn-sm"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </button>
        <span className="btn btn-sm btn-ghost">
          Page {page} of {totalPages}
        </span>
        <button
          className="btn btn-sm"
          disabled={page === totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TuitionsList;
