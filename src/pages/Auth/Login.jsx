import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../../config/firebase.config";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useAuth from "../../hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const auth = getAuth(app);

const Login = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const axiosPublic = useAxiosPublic();
  const { googleLogin } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  // protected page থেকে আসলে সেখানে যাবে, না হলে role অনুযায়ী dashboard
  const from = location.state?.from?.pathname || null;

  const routeByRole = (token) => {
    // ✅ save token
    localStorage.setItem("access-token", token);

    // ✅ decode role
    let role = "student";
    try {
      const decoded = jwtDecode(token);
      role = decoded?.role || "student"; // ✅ FIXED (no shadowing)
      localStorage.setItem("user-role", role);
      console.log("✅ decoded role:", role);
    } catch (e) {
      console.log("❌ token decode failed", e);
      localStorage.setItem("user-role", "student");
    }

    // ✅ if user came from protected route, go there first
    if (from) return navigate(from, { replace: true });

    // ✅ role based dashboard route
    if (role === "admin") navigate("/dashboard/admin", { replace: true });
    else if (role === "tutor") navigate("/dashboard/tutor", { replace: true });
    else navigate("/dashboard/student", { replace: true });
  };

  const mapFirebaseError = (err) => {
    const code = err?.code || "";
    if (code === "auth/invalid-credential") return "Invalid email or password";
    if (code === "auth/user-not-found")
      return "No account found with this email";
    if (code === "auth/wrong-password") return "Wrong password";
    if (code === "auth/too-many-requests")
      return "Too many attempts. Try later.";
    return "Login failed. Please try again.";
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.target;
    const email = form.email.value.trim();
    const password = form.password.value;

    try {
      // ✅ Firebase login
      const cred = await signInWithEmailAndPassword(auth, email, password);

      const userInfo = {
        name: cred.user?.displayName || "User",
        email: cred.user?.email || email,
        photoURL: cred.user?.photoURL || "",
      };

      // ✅ server থেকে JWT
      const res = await axiosPublic.post("/auth/jwt", userInfo);

      const token = res.data?.token || res.data?.accessToken;
      if (!token) {
        console.log("❌ Server response:", res.data);
        throw new Error("Token not found in server response");
      }

      routeByRole(token);
    } catch (err) {
      console.error(err);

      // ✅ show firebase error if firebase failed
      if (err?.code?.startsWith("auth/")) {
        setError(mapFirebaseError(err));
      } else {
        // ✅ otherwise backend / network error
        setError("Server error / JWT issue. Check backend & console.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const result = await googleLogin();
      const user = result.user;

      const userInfo = {
        name: user?.displayName || "User",
        email: user?.email,
        photoURL: user?.photoURL || "",
      };

      const res = await axiosPublic.post("/auth/jwt", userInfo);

      const token = res.data?.token || res.data?.accessToken;
      if (!token) {
        console.log("❌ Server response:", res.data);
        throw new Error("Token not found in server response");
      }

      routeByRole(token);
    } catch (err) {
      console.error(err);
      setError("Google login failed (Firebase/Popup/Server issue)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-6 card bg-base-100 shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

      <form onSubmit={handleEmailLogin} className="space-y-3">
        <input
          type="email"
          name="email"
          className="input input-bordered w-full"
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          className="input input-bordered w-full"
          placeholder="Password"
          required
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "Login"
          )}
        </button>
      </form>

      <button
        onClick={handleGoogleLogin}
        className="btn btn-outline w-full mt-3"
        disabled={loading}
      >
        {loading ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : (
          "Continue with Google"
        )}
      </button>

      <p className="mt-3 text-sm text-center">
        New here?{" "}
        <Link to="/register" className="link link-primary">
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default Login;
