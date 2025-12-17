import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );

  if (!user)
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;

  return children;
}
