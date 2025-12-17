const features = [
  {
    title: "Verified tutors & tuitions",
    desc: "Admins review every tutor profile and tuition post to keep the marketplace safe and high-quality.",
    icon: "✅",
  },
  {
    title: "Role-based dashboards",
    desc: "Separate dashboards for Students, Tutors and Admins with exactly the tools they need.",
    icon: "📊",
  },
  {
    title: "Secure online payments",
    desc: "Stripe integration ensures fast, safe and trackable tuition payments with clear history.",
    icon: "🔐",
  },
  {
    title: "Smart search & filters",
    desc: "Find the right tutor or tuition quickly using subject, class, budget, location and more.",
    icon: "⚡",
  },
];

const WhyChooseUsSection = () => {
  return (
    <section className="mt-16 mb-10">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        <div>
          <h2 className="text-2xl font-bold mb-3">Why choose eTuitionBd?</h2>
          <p className="text-sm text-gray-500 mb-4 max-w-md">
            Instead of random Facebook groups and unverified posts, get a
            complete tuition management system with transparent workflows and
            strong admin control.
          </p>
          <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
            <li>End–to–end workflow from posting to payment</li>
            <li>Real-time status of applications and approvals</li>
            <li>Admin analytics for platform earnings and performance</li>
            <li>Mobile-friendly interface built with React & Tailwind</li>
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="card bg-base-100 shadow-sm border border-base-200 p-4"
            >
              <div className="text-2xl mb-2">{f.icon}</div>
              <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
              <p className="text-xs text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
