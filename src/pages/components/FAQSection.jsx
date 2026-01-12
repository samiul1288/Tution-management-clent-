const FAQS = [
  {
    q: "How do I apply for a tuition?",
    a: "Open a tuition details page and click Apply. You can track status from Dashboard.",
  },
  {
    q: "How do tutors get selected?",
    a: "Students review applications and choose based on profile, ratings, and availability.",
  },
  {
    q: "Is payment secure?",
    a: "Payments are processed securely. You can view transactions from your dashboard.",
  },
  {
    q: "Can I post multiple tuitions?",
    a: "Yes. Students can post multiple tuitions from Dashboard → Post New Tuition.",
  },
];

export default function FAQSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold mb-5">FAQ</h2>
      <div className="space-y-3">
        {FAQS.map((f) => (
          <details
            key={f.q}
            className="rounded-2xl border p-4"
            style={{
              borderColor: "rgb(var(--border))",
              background: "rgb(var(--card))",
            }}
          >
            <summary className="cursor-pointer font-medium">{f.q}</summary>
            <p className="mt-2 opacity-85">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
