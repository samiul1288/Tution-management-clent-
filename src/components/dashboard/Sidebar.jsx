import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role;

  const baseLinkClass =
    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-base-200 transition";

  const activeClass = "bg-primary text-primary-content";

  return (
    <aside className="w-64 bg-base-100 border-r border-base-200 hidden md:flex flex-col">
      <div className="px-4 py-4 border-b border-base-200">
        <h2 className="font-bold text-lg">Dashboard</h2>
        <p className="text-xs text-gray-500 capitalize">{role} panel</p>
      </div>

      <nav className="flex-1 p-3 space-y-4 overflow-y-auto text-sm">
        {/* COMMON */}
        <div>
          <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">
            Overview
          </p>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${baseLinkClass} ${isActive ? activeClass : ""}`
            }
          >
            <span>🏠</span>
            <span>Home</span>
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `${baseLinkClass} ${isActive ? activeClass : ""}`
            }
          >
            <span>🏠</span>
            <span>Dashboard Home</span>
          </NavLink>
        </div>

        {/* STUDENT LINKS */}
        {role === "student" && (
          <div>
            <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">
              Student actions
            </p>
            <NavLink
              to="/dashboard/student/post-tuition"
              className={({ isActive }) =>
                `${baseLinkClass} ${isActive ? activeClass : ""}`
              }
            >
              <span>➕</span>
              <span>Post New Tuition</span>
            </NavLink>
            <NavLink
              to="/dashboard/student/my-tuitions"
              className={({ isActive }) =>
                `${baseLinkClass} ${isActive ? activeClass : ""}`
              }
            >
              <span>📂</span>
              <span>My Tuitions</span>
            </NavLink>
            <NavLink
              to="/dashboard/student/applied-tutors"
              className={({ isActive }) =>
                `${baseLinkClass} ${isActive ? activeClass : ""}`
              }
            >
              <span>🧑‍🏫</span>
              <span>Applied Tutors</span>
            </NavLink>
            <NavLink
              to="/dashboard/student/payments"
              className={({ isActive }) =>
                `${baseLinkClass} ${isActive ? activeClass : ""}`
              }
            >
              <span>💳</span>
              <span>Payment History</span>
            </NavLink>
            <NavLink
              to="/dashboard/student/profile"
              className={({ isActive }) =>
                `${baseLinkClass} ${isActive ? activeClass : ""}`
              }
            >
              <span>👤</span>
              <span>Profile Settings</span>
            </NavLink>
          </div>
        )}

        {/* TUTOR LINKS */}
        {role === "tutor" && (
          <div>
            <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">
              Tutor actions
            </p>
            <NavLink
              to="/dashboard/tutor/my-applications"
              className={({ isActive }) =>
                `${baseLinkClass} ${isActive ? activeClass : ""}`
              }
            >
              <span>📨</span>
              <span>My Applications</span>
            </NavLink>
            <NavLink
              to="/dashboard/tutor/ongoing-tuitions"
              className={({ isActive }) =>
                `${baseLinkClass} ${isActive ? activeClass : ""}`
              }
            >
              <span>📚</span>
              <span>Ongoing Tuitions</span>
            </NavLink>
            <NavLink
              to="/dashboard/tutor/revenue"
              className={({ isActive }) =>
                `${baseLinkClass} ${isActive ? activeClass : ""}`
              }
            >
              <span>💰</span>
              <span>Revenue History</span>
            </NavLink>
          </div>
        )}

        {/* ADMIN LINKS */}
        {role === "admin" && (
          <div>
            <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">
              Admin tools
            </p>
            <NavLink
              to="/dashboard/admin/users"
              className={({ isActive }) =>
                `${baseLinkClass} ${isActive ? activeClass : ""}`
              }
            >
              <span>👥</span>
              <span>User Management</span>
            </NavLink>
            <NavLink
              to="/dashboard/admin/tuitions"
              className={({ isActive }) =>
                `${baseLinkClass} ${isActive ? activeClass : ""}`
              }
            >
              <span>📋</span>
              <span>Tuition Management</span>
            </NavLink>
            <NavLink
              to="/dashboard/admin/reports"
              className={({ isActive }) =>
                `${baseLinkClass} ${isActive ? activeClass : ""}`
              }
            >
              <span>📈</span>
              <span>Reports & Analytics</span>
            </NavLink>
          </div>
        )}
      </nav>

      <div className="p-3 border-t border-base-200 text-[11px] text-gray-500">
        eTuitionBd • v1.0
      </div>
    </aside>
  );
};

export default Sidebar;
