import { Navigate } from "react-router-dom";

export default function RoleBasedRoute({ allowedRoles, children }) {
  const role = (localStorage.getItem("user-role") || "").toLowerCase();

  if (!role) return <Navigate to="/unauthorized" replace />;
  if (!allowedRoles.includes(role))
    return <Navigate to="/unauthorized" replace />;

  return children;
}
