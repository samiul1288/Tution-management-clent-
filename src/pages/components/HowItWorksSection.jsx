const steps = [
  {
    id: 1,
    title: "Post a tuition",
    desc: "Students create a detailed tuition post with subject, class, budget and location.",
    icon: "📝",
  },
  {
    id: 2,
    title: "Tutors apply",
    desc: "Verified tutors browse posts and apply with their qualifications and expected salary.",
    icon: "🧑‍🏫",
  },
  {
    id: 3,
    title: "Secure payment & tracking",
    desc: "Students approve a tutor, pay securely and track classes, payments and progress.",
    icon: "💳",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold text-center mb-8">
        How the Platform Works
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((step) => (
          <div
            key={step.id}
            className="card bg-base-100 shadow-sm border border-base-200 text-center p-6"
          >
            <div className="text-4xl mb-3">{step.icon}</div>
            <h3 className="font-semibold mb-2">{step.title}</h3>
            <p className="text-sm text-gray-500">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorksSection;
