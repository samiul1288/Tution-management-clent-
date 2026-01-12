import { useEffect, useMemo, useState } from "react";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import TuitionCard from "../../components/shared/TuitionCard";
import SkeletonCard from "../../components/shared/SkeletonCard";

const normalize = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

export default function TuitionsList() {
  const axiosPublic = useAxiosPublic();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // ✅ explore states
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("all");
  const [location, setLocation] = useState("all");
  const [sort, setSort] = useState("latest"); // latest | budget_asc | budget_desc

  // ✅ pagination
  const [page, setPage] = useState(1);
  const limit = 8;

  // total for pagination (fallback to client calc)
  const [total, setTotal] = useState(0);

  const fetchData = async () => {
    try {
      setErr("");
      setLoading(true);

      const params = {
        q: search.trim(),
        subject: subject === "all" ? "" : subject,
        location: location === "all" ? "" : location,
        sort,
        page,
        limit,
      };

      const res = await axiosPublic.get("/tuitions", { params });

      const list = normalize(res.data);
      setItems(list);

      if (typeof res?.data?.total === "number") {
        setTotal(res.data.total);
      } else {
        // fallback: if backend doesn't return total, set 0 (no max limit)
        setTotal(0);
      }
    } catch (e) {
      setErr(
        e?.response?.data?.message || e?.message || "Failed to load tuitions."
      );
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, subject, location, sort, page]);

  // build filter dropdown options from loaded items
  const subjectOptions = useMemo(() => {
    const set = new Set(
      normalize(items)
        .map((t) => t?.subject)
        .filter(Boolean)
    );
    return ["all", ...Array.from(set)];
  }, [items]);

  const locationOptions = useMemo(() => {
    const set = new Set(
      normalize(items)
        .map((t) => t?.location)
        .filter(Boolean)
    );
    return ["all", ...Array.from(set)];
  }, [items]);

  // pagination pages
  const totalPages = useMemo(() => {
    if (total > 0) return Math.ceil(total / limit);
    return page; // fallback (unknown total)
  }, [total, limit, page]);

  return (
    <div className="min-h-[70vh] bg-base-200/20">
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Explore Tuitions</h1>
          <p className="text-sm text-gray-500">
            Search, filter and find the best tuition opportunities.
          </p>
        </div>

        {/* Controls */}
        <div className="card bg-base-100 border border-base-200 rounded-2xl p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* search */}
            <label className="form-control">
              <span className="label-text text-sm">Search</span>
              <input
                className="input input-bordered rounded-xl"
                placeholder="Search by title / subject / location..."
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
              />
            </label>

            {/* subject filter */}
            <label className="form-control">
              <span className="label-text text-sm">Subject</span>
              <select
                className="select select-bordered rounded-xl"
                value={subject}
                onChange={(e) => {
                  setPage(1);
                  setSubject(e.target.value);
                }}
              >
                {subjectOptions.map((s) => (
                  <option key={s} value={s}>
                    {s === "all" ? "All" : s}
                  </option>
                ))}
              </select>
            </label>

            {/* location filter */}
            <label className="form-control">
              <span className="label-text text-sm">Location</span>
              <select
                className="select select-bordered rounded-xl"
                value={location}
                onChange={(e) => {
                  setPage(1);
                  setLocation(e.target.value);
                }}
              >
                {locationOptions.map((l) => (
                  <option key={l} value={l}>
                    {l === "all" ? "All" : l}
                  </option>
                ))}
              </select>
            </label>

            {/* sort */}
            <label className="form-control">
              <span className="label-text text-sm">Sort</span>
              <select
                className="select select-bordered rounded-xl"
                value={sort}
                onChange={(e) => {
                  setPage(1);
                  setSort(e.target.value);
                }}
              >
                <option value="latest">Latest</option>
                <option value="budget_desc">Budget: High to Low</option>
                <option value="budget_asc">Budget: Low to High</option>
              </select>
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
            <button
              className="btn btn-sm btn-outline rounded-xl"
              onClick={() => {
                setSearch("");
                setSubject("all");
                setLocation("all");
                setSort("latest");
                setPage(1);
              }}
            >
              Reset
            </button>

            <button
              className="btn btn-sm btn-outline rounded-xl"
              onClick={fetchData}
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Error */}
        {err ? (
          <div className="alert alert-error">
            <span className="text-sm">{err}</span>
          </div>
        ) : null}

        {/* Grid */}
        {loading ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : normalize(items).length === 0 ? (
          <div className="card bg-base-100 border border-base-200 rounded-2xl p-6">
            <p className="text-sm text-gray-500">
              No tuitions found. Try changing search or filters.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {normalize(items).map((t) => (
              <TuitionCard key={t?._id} tuition={t} />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            className="btn btn-sm btn-outline rounded-xl"
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>

          <span className="text-sm opacity-75">
            Page <span className="font-semibold">{page}</span>
            {total > 0 ? (
              <>
                {" "}
                / <span className="font-semibold">{totalPages}</span>
              </>
            ) : null}
          </span>

          <button
            className="btn btn-sm btn-outline rounded-xl"
            disabled={loading || (total > 0 && page >= totalPages)}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
