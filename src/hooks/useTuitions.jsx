import { useEffect, useMemo, useState } from "react";
import useAxiosPublic from "./useAxiosPublic";

const DEFAULT_LIMIT = 8;

export default function useTuitions() {
  const axiosPublic = useAxiosPublic();

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    location: "",
    minPrice: "",
    maxPrice: "",
    sort: "newest",
    page: 1,
    limit: DEFAULT_LIMIT,
  });

  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: DEFAULT_LIMIT,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== "" && v !== null && v !== undefined) params.set(k, v);
    });
    return params.toString();
  }, [filters]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");

    axiosPublic
      .get(`/tuitions?${queryString}`)
      .then((res) => {
        if (!alive) return;
        setData(res?.data?.data || []);
        setMeta(res?.data?.meta || meta);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e?.response?.data?.message || "Failed to load tuitions");
      })
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString]);

  const actions = {
    setSearch: (search) => setFilters((p) => ({ ...p, search, page: 1 })),
    setCategory: (category) => setFilters((p) => ({ ...p, category, page: 1 })),
    setLocation: (location) => setFilters((p) => ({ ...p, location, page: 1 })),
    setPriceRange: ({ minPrice, maxPrice }) =>
      setFilters((p) => ({ ...p, minPrice, maxPrice, page: 1 })),
    setSort: (sort) => setFilters((p) => ({ ...p, sort, page: 1 })),
    setPage: (page) => setFilters((p) => ({ ...p, page })),
    reset: () =>
      setFilters({
        search: "",
        category: "",
        location: "",
        minPrice: "",
        maxPrice: "",
        sort: "newest",
        page: 1,
        limit: DEFAULT_LIMIT,
      }),
  };

  return { data, meta, loading, error, filters, actions };
}
