import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // ✅ role resolve from: user.role > localStorage user-role > jwt token
  const getRole = () => {
    if (user?.role) return user.role;

    const storedRole = localStorage.getItem("user-role");
    if (storedRole) return storedRole;

    const token = localStorage.getItem("access-token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        return decoded?.role || "student";
      } catch (e) {
        console.log("role decode failed:", e);
      }
    }
    return "student";
  };

  const role = getRole();

  // ✅ dashboard path by role
  const dashboardPath =
    role === "admin"
      ? "/dashboard/admin"
      : role === "tutor"
      ? "/dashboard/tutor"
      : "/dashboard/student";

  // ✅ safe avatar fallback (404 fix)
  const avatar =
    user?.photoURL || "https://api.dicebear.com/7.x/initials/svg?seed=User";

  const navLinks = (
    <>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <NavLink to="/tuitions">Tuitions</NavLink>
      </li>
      <li>
        <NavLink to="/tutors">Tutors</NavLink>
      </li>
      <li>
        <NavLink to="/about">About</NavLink>
      </li>
      <li>
        <NavLink to="/contact">Contact</NavLink>
      </li>
    </>
  );

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      localStorage.removeItem("access-token");
      localStorage.removeItem("user-role");
      navigate("/login");
    }
  };

  return (
    <div className="bg-base-100 border-b border-base-200 sticky top-0 z-40">
      <div className="navbar max-w-6xl mx-auto px-4 md:px-0">
        {/* LEFT */}
        <div className="navbar-start">
          <div className="dropdown md:hidden">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-50 p-2 shadow bg-base-100 rounded-box w-52"
            >
              {navLinks}
            </ul>
          </div>

          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center font-black">
              eT
            </span>
            <span>eTuitionBd</span>
          </Link>
        </div>

        {/* CENTER */}
        <div className="navbar-center hidden md:flex">
          <ul className="menu menu-horizontal px-1 gap-1">{navLinks}</ul>
        </div>

        {/* RIGHT */}
        <div className="navbar-end gap-3">
          {!user ? (
            <>
              <Link to="/login" className="btn btn-sm btn-ghost">
                Login
              </Link>
              <Link to="/register" className="btn btn-sm btn-primary">
                Join now
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              {/* ✅ role-based dashboard */}
              <Link to={dashboardPath} className="btn btn-sm btn-outline">
                Dashboard
              </Link>

              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <div className="w-9 rounded-full">
                    <img
                      src={avatar}
                      alt="Profile"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://api.dicebear.com/7.x/initials/svg?seed=User";
                      }}
                    />
                  </div>
                </label>

                <ul
                  tabIndex={0}
                  className="mt-3 z-50 p-3 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-56 space-y-1"
                >
                  <li className="px-2 pb-2 border-b border-base-200">
                    <p className="font-semibold">
                      {user?.name || user?.displayName || "User"}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    <p className="badge badge-sm mt-1">{role}</p>
                  </li>

                  {/* ✅ direct role dashboard */}
                  <li>
                    <NavLink to={dashboardPath}>Go to Dashboard</NavLink>
                  </li>

                  <li>
                    <button onClick={handleLogout}>Logout</button>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
