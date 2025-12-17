import { Navigate } from "react-router-dom";

const DashboardIndex = () => {
  const role = (localStorage.getItem("user-role") || "").toLowerCase();

  if (role === "admin") return <Navigate to="/dashboard/admin" replace />;
  if (role === "tutor") return <Navigate to="/dashboard/tutor" replace />;
  return <Navigate to="/dashboard/student" replace />;
};

export default DashboardIndex;
