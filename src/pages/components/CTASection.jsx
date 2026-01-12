import Button from "../../components/ui/Button";
import { Link } from "react-router-dom";

export default function CTASection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div
        className="rounded-2xl border p-6 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        style={{
          borderColor: "rgb(var(--border))",
          background: "rgb(var(--card))",
        }}
      >
        <div>
          <h2 className="text-2xl font-semibold">Ready to start?</h2>
          <p className="opacity-80 mt-1">
            Post a tuition or explore verified tutors today.
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
          <Link to="/tuitions">
            <Button variant="outline">Explore Tuitions</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
