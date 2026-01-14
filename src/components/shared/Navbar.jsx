import { Link, NavLink } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useRole from "../../hooks/useRole";
import { useTheme } from "../../context/ThemeProvider";
import Button from "../ui/Button";
import Avatar from "../ui/Avatar";

const navLinkClass = ({ isActive }) =>
  [
    "px-3 py-2 rounded-xl text-sm font-medium transition",
    isActive
      ? "bg-black/5 dark:bg-white/10"
      : "hover:bg-black/5 dark:hover:bg-white/10",
  ].join(" ");

export default function Navbar() {
  const { user, logout } = useAuth(); // তোমার AuthProvider অনুযায়ী logOut/logout ফাংশন নাম match করো
  const { role } = useRole(); // expected: "ADMIN" | "MANAGER" | "USER" (বা Student/Tutor/Admin)
  const { theme, toggleTheme } = useTheme();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);

  // close dropdown on outside click
  useEffect(() => {
    const onDocClick = (e) => {
      if (!profileRef.current) return;
      if (!profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

 const handleLogout = async () => {
   try {
     await logout?.();
   } finally {
     setProfileOpen(false);
     setMobileOpen(false);
   }
 };

const dashboardPath = useMemo(() => {
  const r = (role || user?.role || "student").toLowerCase();
  if (r === "admin") return "/dashboard/admin";
  if (r === "tutor") return "/dashboard/tutor";
  return "/dashboard/student";
}, [role, user]);


  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur"
      style={{
        background: "rgba(var(--bg),0.85)",
        borderColor: "rgb(var(--border))",
      }}
    >
      <nav className="max-w-7xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between gap-3">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2">
            <div
              className="h-9 w-9 rounded-2xl grid place-items-center font-bold"
              style={{ background: "rgba(var(--primary),0.15)" }}
            >
              T
            </div>
            <div className="leading-tight">
              <div className="font-semibold">Tuition Management</div>
              <div className="text-xs opacity-70 -mt-0.5">
                Find tutors & tuitions
              </div>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {/* Logged out routes ≥ 3 */}
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/tuitions" className={navLinkClass}>
              Tuitions
            </NavLink>
            <NavLink to="/tutors" className={navLinkClass}>
              Tutors
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>

            {/* Logged in extra routes ≥ 5 total */}
            {user ? (
              <>
                <NavLink to={dashboardPath} className={navLinkClass}>
                  Dashboard
                </NavLink>
               <NavLink to="/dashboard/student/profile" className={navLinkClass}>
  Profile
</NavLink>

<NavLink to="/dashboard/student/payments" className={navLinkClass}>
  Payments
</NavLink>

              </>
            ) : null}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="h-10 w-10 rounded-2xl border grid place-items-center transition hover:bg-black/5 dark:hover:bg-white/10"
              style={{
                borderColor: "rgb(var(--border))",
                background: "rgb(var(--card))",
              }}
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {theme === "dark" ? "🌙" : "☀️"}
            </button>

            {/* Auth buttons / Profile dropdown */}
            {!user ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Register</Button>
                </Link>
              </div>
            ) : (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen((v) => !v)}
                  className="h-10 rounded-2xl border px-2 flex items-center gap-2 transition hover:bg-black/5 dark:hover:bg-white/10"
                  style={{
                    borderColor: "rgb(var(--border))",
                    background: "rgb(var(--card))",
                  }}
                >
                  <Avatar
                    src={user?.photoURL}
                    name={user?.displayName || user?.email}
                    size={32}
                  />
                  <div className="hidden lg:block text-left">
                    <div className="text-sm font-medium leading-4 line-clamp-1">
                      {user?.displayName || "User"}
                    </div>
                    <div className="text-xs opacity-70 leading-4">
                      {role || "USER"}
                    </div>
                  </div>
                  <span className="text-sm opacity-70">▾</span>
                </button>

                {profileOpen ? (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-2xl border shadow-lg overflow-hidden"
                    style={{
                      borderColor: "rgb(var(--border))",
                      background: "rgb(var(--bg))",
                    }}
                  >
                    <div
                      className="p-3 border-b"
                      style={{ borderColor: "rgb(var(--border))" }}
                    >
                      <div className="text-sm font-semibold line-clamp-1">
                        {user?.displayName || "Signed in"}
                      </div>
                      <div className="text-xs opacity-70 line-clamp-1">
                        {user?.email}
                      </div>
                    </div>

                    <div className="p-2">
                      <Link
                        to={dashboardPath}
                        onClick={() => setProfileOpen(false)}
                        className="block px-3 py-2 rounded-xl text-sm hover:bg-black/5 dark:hover:bg-white/10"
                      >
                        Dashboard
                      </Link>

                      <Link
                        to="/dashboard/profile"
                        onClick={() => setProfileOpen(false)}
                        className="block px-3 py-2 rounded-xl text-sm hover:bg-black/5 dark:hover:bg-white/10"
                      >
                        Profile Settings
                      </Link>

                      {/* role based quick links (optional) */}
                      {role === "ADMIN" ? (
                        <Link
                          to="/dashboard/admin"
                          onClick={() => setProfileOpen(false)}
                          className="block px-3 py-2 rounded-xl text-sm hover:bg-black/5 dark:hover:bg-white/10"
                        >
                          Admin Panel
                        </Link>
                      ) : null}

                      {role === "MANAGER" ? (
                        <Link
                          to="/dashboard/manager"
                          onClick={() => setProfileOpen(false)}
                          className="block px-3 py-2 rounded-xl text-sm hover:bg-black/5 dark:hover:bg-white/10"
                        >
                          Manager Panel
                        </Link>
                      ) : null}

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-black/5 dark:hover:bg-white/10"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden h-10 w-10 rounded-2xl border grid place-items-center hover:bg-black/5 dark:hover:bg-white/10"
              style={{
                borderColor: "rgb(var(--border))",
                background: "rgb(var(--card))",
              }}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen ? (
          <div className="md:hidden pb-4">
            <div
              className="rounded-2xl border p-3 flex flex-col gap-2"
              style={{
                borderColor: "rgb(var(--border))",
                background: "rgb(var(--card))",
              }}
            >
              <NavLink
                to="/"
                className={navLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/tuitions"
                className={navLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                Tuitions
              </NavLink>
              <NavLink
                to="/tutors"
                className={navLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                Tutors
              </NavLink>
              <NavLink
                to="/about"
                className={navLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                About
              </NavLink>
              <NavLink
                to="/contact"
                className={navLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                Contact
              </NavLink>

              {user ? (
                <>
                  <div
                    className="h-px my-1"
                    style={{ background: "rgb(var(--border))" }}
                  />
                  <NavLink
                    to={dashboardPath}
                    className={navLinkClass}
                    onClick={() => setMobileOpen(false)}
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    to="/dashboard/profile"
                    className={navLinkClass}
                    onClick={() => setMobileOpen(false)}
                  >
                    Profile
                  </NavLink>
                  <NavLink
                    to="/dashboard/payments"
                    className={navLinkClass}
                    onClick={() => setMobileOpen(false)}
                  >
                    Payments
                  </NavLink>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-xl text-sm font-medium text-left hover:bg-black/5 dark:hover:bg-white/10"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <div
                    className="h-px my-1"
                    style={{ background: "rgb(var(--border))" }}
                  />
                  <Link to="/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full">Register</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        ) : null}
      </nav>
    </header>
  );
}
