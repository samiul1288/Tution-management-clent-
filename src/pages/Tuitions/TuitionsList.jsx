import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const TuitionsList = () => {
  const axiosPublic = useAxiosPublic();

  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // filters
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("newest");

  // pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 6;

  const params = useMemo(
    () => ({ search, subject, location, sort, page, limit }),
    [search, subject, location, sort, page]
  );

  const fetchTuitions = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosPublic.get("/tuitions", { params });

      const list = res?.data?.data || [];
      const pages =
        res?.data?.pagination?.totalPages ?? res?.data?.meta?.totalPages ?? 1;

      setTuitions(list);
      setTotalPages(Number(pages) || 1);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load tuitions"
      );
    } finally {
      setLoading(false);
    }
  };

  // auto fetch when filters change
  useEffect(() => {
    fetchTuitions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  // reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [search, subject, location, sort]);

  const handleReset = () => {
    setSearch("");
    setSubject("");
    setLocation("");
    setSort("newest");
    setPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <span className="loading loading-spinner loading-lg"></span>
        <p className="text-sm opacity-70">Loading tuitions...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">All Tuition Posts</h1>
          <p className="text-sm opacity-70 mt-1">
            Find the best tuition opportunities by subject, location & budget.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="badge badge-outline">
            Page <span className="font-semibold mx-1">{page}</span> /{" "}
            <span className="font-semibold">{totalPages}</span>
          </div>
          <button onClick={handleReset} className="btn btn-ghost btn-sm">
            Reset
          </button>
        </div>
      </div>

      {/* filters */}
      <div className="bg-base-100 rounded-2xl shadow-sm border border-base-200 p-4 md:p-5">
        <div className="grid md:grid-cols-12 gap-3">
          <div className="md:col-span-5">
            <label className="label py-1">
              <span className="label-text font-medium">Search</span>
            </label>
            <div className="relative">
              <input
                className="input input-bordered w-full pr-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Title / subject / location..."
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60">
                🔎
              </span>
            </div>
          </div>

          <div className="md:col-span-3">
            <label className="label py-1">
              <span className="label-text font-medium">Subject</span>
            </label>
            <input
              className="input input-bordered w-full"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Math, English..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="label py-1">
              <span className="label-text font-medium">Location</span>
            </label>
            <input
              className="input input-bordered w-full"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Area / City"
            />
          </div>

          <div className="md:col-span-2">
            <label className="label py-1">
              <span className="label-text font-medium">Sort</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="budgetAsc">Budget: Low → High</option>
              <option value="budgetDesc">Budget: High → Low</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-sm opacity-70">
            Showing <span className="font-semibold">{tuitions.length}</span>{" "}
            results
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-outline btn-sm"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* error */}
      {error ? (
        <div className="alert alert-error rounded-2xl">
          <span>{error}</span>
        </div>
      ) : null}

      {/* empty state */}
      {!error && tuitions.length === 0 ? (
        <div className="bg-base-100 rounded-2xl border border-base-200 p-10 text-center">
          <div className="text-4xl">🫠</div>
          <h3 className="text-lg font-semibold mt-2">No tuitions found</h3>
          <p className="text-sm opacity-70 mt-1">
            Try changing your search or filters.
          </p>
          <button onClick={handleReset} className="btn btn-primary btn-sm mt-4">
            Reset Filters
          </button>
        </div>
      ) : null}

      {/* cards */}
      {tuitions.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tuitions.map((t) => {
            const budget = t.budget ?? t.price ?? 0;

            return (
              <div
                key={t._id}
                className="group card bg-base-100 border border-base-200 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden"
              >
                {/* header strip */}
                <div className="p-4 pb-0">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-lg leading-tight line-clamp-2">
                      {t.title}
                    </h3>

                    <div className="badge badge-primary badge-outline">
                      ৳ {budget}
                    </div>
                  </div>

                  <p className="text-sm opacity-70 mt-2 line-clamp-2">
                    {t.description || "No description provided."}
                  </p>
                </div>

                <div className="px-4 pt-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="badge badge-ghost">
                      📚 {t.subject || "N/A"}
                    </span>
                    <span className="badge badge-ghost">
                      🏠 {t.location || "N/A"}
                    </span>
                    {t.className ? (
                      <span className="badge badge-ghost">
                        🎓 {t.className}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="p-4 mt-auto">
                  <Link to={`/tuitions/${t._id}`} className="block">
                    <button className="btn btn-primary btn-sm w-full">
                      View Details
                    </button>
                  </Link>
                </div>

                {/* subtle hover underline */}
                <div className="h-1 w-full bg-primary/0 group-hover:bg-primary/20 transition" />
              </div>
            );
          })}
        </div>
      ) : null}

      {/* pagination */}
      {totalPages > 1 ? (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            className="btn btn-sm btn-outline"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ← Prev
          </button>

          <div className="join">
            <button className="btn btn-sm join-item btn-ghost" disabled>
              Page <span className="font-semibold mx-1">{page}</span> of{" "}
              <span className="font-semibold">{totalPages}</span>
            </button>
          </div>

          <button
            className="btn btn-sm btn-outline"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next →
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default TuitionsList;
