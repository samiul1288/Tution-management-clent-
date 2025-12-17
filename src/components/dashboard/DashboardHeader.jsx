import useAuth from "../../hooks/useAuth";

const DashboardHeader = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-base-100 border-b border-base-200">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-3">
        <div>
          <h1 className="font-semibold text-lg">
            {user?.role === "admin"
              ? "Admin Control Panel"
              : user?.role === "tutor"
              ? "Tutor Dashboard"
              : "Student Dashboard"}
          </h1>
          <p className="text-xs text-gray-500">
            Manage your tuitions, applications, payments and profile from here.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
          <div className="avatar">
            <div className="w-9 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img
                src={user?.photoURL || "https://i.ibb.co/FHpdphK/avatar.png"}
                alt="avatar"
              />
            </div>
          </div>
          <button onClick={logout} className="btn btn-sm btn-outline">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
