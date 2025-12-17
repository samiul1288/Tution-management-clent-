import { Link } from "react-router-dom";
import { Fade, Slide } from "react-awesome-reveal";

const HeroSection = () => {
  return (
    <section className="min-h-[70vh] grid md:grid-cols-2 gap-10 items-center">
      <Fade triggerOnce>
        <div className="space-y-5">
          <p className="badge badge-primary badge-outline">
            eTuitionBd • Smart Tuition Management
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-snug">
            Find <span className="text-primary">Trusted Tutors</span> &
            <br />
            Manage Tuitions Effortlessly
          </h1>
          <p className="text-gray-500 max-w-md">
            A modern platform for students, tutors, and admins to manage tuition
            posts, applications, payments, and progress from one powerful
            dashboard.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/tuitions" className="btn btn-primary">
              Browse Tuitions
            </Link>
            <Link to="/tutors" className="btn btn-outline">
              Explore Tutors
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4 text-sm">
            <div className="p-3 rounded-xl bg-base-100 shadow-sm">
              <p className="font-bold text-lg">2K+</p>
              <p className="text-gray-500">Verified tutors</p>
            </div>
            <div className="p-3 rounded-xl bg-base-100 shadow-sm">
              <p className="font-bold text-lg">5K+</p>
              <p className="text-gray-500">Completed tuitions</p>
            </div>
            <div className="p-3 rounded-xl bg-base-100 shadow-sm">
              <p className="font-bold text-lg">24/7</p>
              <p className="text-gray-500">Admin support</p>
            </div>
          </div>
        </div>
      </Fade>

      <Slide direction="right" triggerOnce>
        <div className="relative">
          <div className="rounded-3xl bg-base-100 shadow-2xl p-6 space-y-4">
            <h3 className="font-semibold text-lg">Live tuition overview</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Active tuitions</span>
                <span className="font-semibold">128</span>
              </div>
              <progress
                className="progress progress-primary w-full"
                value="70"
                max="100"
              />
              <div className="flex justify-between">
                <span>Approved tutors</span>
                <span className="font-semibold">86%</span>
              </div>
            </div>
          </div>

          <div className="hidden md:block absolute -bottom-6 -left-6 bg-primary text-primary-content rounded-2xl px-4 py-3 shadow-lg">
            <p className="text-xs">Secure Stripe payments</p>
            <p className="font-semibold text-sm">Instant tutor confirmation</p>
          </div>
        </div>
      </Slide>
    </section>
  );
};

export default HeroSection;
