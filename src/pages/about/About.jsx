import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-base-200">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-secondary blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-14">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <div className="badge badge-primary badge-outline">
                About eTuitionBd
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                Find the right tutor. <br className="hidden md:block" />
                Manage tuitions easily.
              </h1>
              <p className="text-base-content/70 leading-relaxed">
                eTuitionBd helps students post tuition needs, tutors apply with
                confidence, and admins keep everything safe & transparent—so
                learning stays the main focus.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link to="/tuitions" className="btn btn-primary">
                  Browse Tuitions
                </Link>
                <Link to="/tutors" className="btn btn-outline">
                  Explore Tutors
                </Link>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <div className="badge badge-success gap-2">
                  ✅ Verified Tutors
                </div>
                <div className="badge badge-info gap-2">🔒 Secure Login</div>
                <div className="badge badge-warning gap-2">
                  ⚡ Fast Applications
                </div>
              </div>
            </div>

            {/* RIGHT CARD */}
            <div className="card bg-base-100 shadow-xl border border-base-300">
              <div className="card-body">
                <h3 className="text-xl font-bold">What we do</h3>
                <p className="text-base-content/70">
                  A clean and modern tuition management system for students,
                  tutors, and admins.
                </p>

                <div className="divider my-2" />

                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="badge badge-primary mt-1">1</span>
                    <div>
                      <p className="font-semibold">Students post tuition</p>
                      <p className="text-sm text-base-content/70">
                        Add subject, class, budget, schedule and location.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="badge badge-secondary mt-1">2</span>
                    <div>
                      <p className="font-semibold">Tutors apply</p>
                      <p className="text-sm text-base-content/70">
                        Share qualifications and expected salary.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="badge badge-accent mt-1">3</span>
                    <div>
                      <p className="font-semibold">Admin reviews</p>
                      <p className="text-sm text-base-content/70">
                        Approve tutors, manage posts and track status.
                      </p>
                    </div>
                  </li>
                </ul>

                <div className="card-actions justify-end mt-4">
                  <Link to="/contact" className="btn btn-sm btn-ghost">
                    Need help?
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="grid md:grid-cols-3 gap-4 mt-10">
            <div className="stat bg-base-100 rounded-2xl border border-base-300 shadow-sm">
              <div className="stat-title">Verified tutors</div>
              <div className="stat-value text-primary">2K+</div>
              <div className="stat-desc">Trusted by students</div>
            </div>
            <div className="stat bg-base-100 rounded-2xl border border-base-300 shadow-sm">
              <div className="stat-title">Completed tuitions</div>
              <div className="stat-value text-secondary">5K+</div>
              <div className="stat-desc">Across Bangladesh</div>
            </div>
            <div className="stat bg-base-100 rounded-2xl border border-base-300 shadow-sm">
              <div className="stat-title">Admin support</div>
              <div className="stat-value text-accent">24/7</div>
              <div className="stat-desc">Fast issue resolution</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-4 pb-14">
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="card bg-base-100 border border-base-300 shadow-sm">
            <div className="card-body">
              <div className="flex items-center gap-3">
                <div className="avatar placeholder">
                  <div className="bg-primary text-primary-content rounded-xl w-10">
                    <span>🔎</span>
                  </div>
                </div>
                <h3 className="card-title">Smart discovery</h3>
              </div>
              <p className="text-base-content/70">
                Find tuitions and tutors based on subject, class, location and
                budget.
              </p>
            </div>
          </div>

          <div className="card bg-base-100 border border-base-300 shadow-sm">
            <div className="card-body">
              <div className="flex items-center gap-3">
                <div className="avatar placeholder">
                  <div className="bg-secondary text-secondary-content rounded-xl w-10">
                    <span>🧾</span>
                  </div>
                </div>
                <h3 className="card-title">Clean dashboard</h3>
              </div>
              <p className="text-base-content/70">
                Student, Tutor, Admin dashboard—each role gets the right tools.
              </p>
            </div>
          </div>

          <div className="card bg-base-100 border border-base-300 shadow-sm">
            <div className="card-body">
              <div className="flex items-center gap-3">
                <div className="avatar placeholder">
                  <div className="bg-accent text-accent-content rounded-xl w-10">
                    <span>🔐</span>
                  </div>
                </div>
                <h3 className="card-title">Secure auth</h3>
              </div>
              <p className="text-base-content/70">
                Firebase login + JWT protected APIs to keep data safe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-6xl mx-auto px-4 pb-14">
        <div className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body">
            <h2 className="text-2xl font-bold">How eTuitionBd works</h2>
            <p className="text-base-content/70">
              Simple steps for everyone—no confusion, no clutter.
            </p>

            <div className="grid lg:grid-cols-3 gap-4 mt-4">
              <div className="p-5 rounded-2xl bg-base-200 border border-base-300">
                <p className="font-semibold">👩‍🎓 For Students</p>
                <ul className="text-sm text-base-content/70 list-disc ml-5 mt-2 space-y-1">
                  <li>Post tuition with all details</li>
                  <li>Review tutor applications</li>
                  <li>Assign tutor & track progress</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-base-200 border border-base-300">
                <p className="font-semibold">👨‍🏫 For Tutors</p>
                <ul className="text-sm text-base-content/70 list-disc ml-5 mt-2 space-y-1">
                  <li>Apply with experience & salary</li>
                  <li>View ongoing tuitions</li>
                  <li>Track earnings & history</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-base-200 border border-base-300">
                <p className="font-semibold">🛡️ For Admin</p>
                <ul className="text-sm text-base-content/70 list-disc ml-5 mt-2 space-y-1">
                  <li>Manage users & roles</li>
                  <li>Approve/monitor tuition posts</li>
                  <li>Analytics & reports</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM + CTA */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-2 gap-4">
          {/* TEAM CARD */}
          <div className="card bg-base-100 border border-base-300 shadow-sm">
            <div className="card-body">
              <h2 className="text-2xl font-bold">Our mission</h2>
              <p className="text-base-content/70">
                Make tutoring more accessible, organized, and transparent—so
                learners can progress faster and tutors can grow their careers.
              </p>

              <div className="divider" />

              <div className="flex items-center gap-3">
                <div className="avatar placeholder">
                  <div className="bg-neutral text-neutral-content rounded-full w-12">
                    <span>ET</span>
                  </div>
                </div>
                <div>
                  <p className="font-semibold">eTuitionBd Team</p>
                  <p className="text-sm text-base-content/60">
                    Building education tools with care.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA CARD */}
          <div className="card bg-gradient-to-br from-base-100 to-base-200 border border-base-300 shadow-sm">
            <div className="card-body">
              <h2 className="text-2xl font-bold">Ready to get started?</h2>
              <p className="text-base-content/70">
                Post a tuition, apply as a tutor, or explore verified tutor
                profiles.
              </p>

              <div className="flex flex-wrap gap-3 mt-2">
                <Link to="/tuitions" className="btn btn-primary">
                  View Tuitions
                </Link>
                <Link to="/register" className="btn btn-outline">
                  Create Account
                </Link>
              </div>

              <p className="text-xs text-base-content/60 mt-3">
                Tip: Tutor profiles look best when you upload a valid photoURL.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
