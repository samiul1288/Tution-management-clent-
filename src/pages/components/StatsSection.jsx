import { useEffect, useState } from "react";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import StatsCard from "../../components/shared/StatsCard";

export default function StatsSection() {
  const axiosPublic = useAxiosPublic();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axiosPublic
      .get("/dashboard/public-stats")
      .then((res) => setStats(res?.data?.data));
  }, [axiosPublic]);

  if (!stats) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold mb-5">Platform Statistics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard title="Total Users" value={stats.totalUsers} />
        <StatsCard title="Total Tuitions" value={stats.totalTuitions} />
        <StatsCard title="Total Applications" value={stats.totalApplications} />
      </div>
    </section>
  );
}
