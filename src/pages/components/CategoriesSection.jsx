import { TUITION_CATEGORIES } from "../../utils/constants";

export default function CategoriesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold mb-5">Popular Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {TUITION_CATEGORIES.map((c) => (
          <div
            key={c}
            className="rounded-2xl border p-4"
            style={{
              borderColor: "rgb(var(--border))",
              background: "rgb(var(--card))",
            }}
          >
            <div className="font-medium">{c}</div>
            <div className="text-sm opacity-80 mt-1">
              Find verified tutors & tuitions
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
