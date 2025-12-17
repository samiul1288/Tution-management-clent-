import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { app } from "../../config/firebase.config";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const auth = getAuth(app);

const Register = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const routeByRole = (token) => {
    // ✅ clear old session first (important)
    localStorage.removeItem("access-token");
    localStorage.removeItem("user-role");

    localStorage.setItem("access-token", token);

    let role = "student";
    try {
      const decoded = jwtDecode(token);
      role = decoded?.role || "student";
      localStorage.setItem("user-role", role);
      console.log("✅ decoded role:", role);
    } catch (e) {
      console.log("❌ token decode failed", e);
      localStorage.setItem("user-role", "student");
    }

    if (role === "admin") navigate("/dashboard/admin", { replace: true });
    else if (role === "tutor") navigate("/dashboard/tutor", { replace: true });
    else navigate("/dashboard/student", { replace: true });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const form = e.target;

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const password = form.password.value;
      const role = (form.role.value || "student").trim().toLowerCase(); // ✅ better
      const phone = form.phone.value.trim();

      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        setLoading(false);
        return;
      }

      // ✅ Create firebase user
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      // ✅ Update profile (optional: photoURL)
      await updateProfile(cred.user, {
        displayName: name,
        photoURL: cred.user?.photoURL || "",
      });

      const userInfo = {
        name,
        email,
        role,
        phone,
        photoURL: cred.user?.photoURL || "",
      };

      // ✅ server: create/update user + returns jwt
      const res = await axiosPublic.post("/auth/jwt", userInfo);

      const token = res?.data?.token || res?.data?.accessToken;
      if (!token) {
        console.log("❌ Server response:", res?.data);
        throw new Error("Token not found in server response");
      }

      routeByRole(token);
    } catch (err) {
      console.error(err);

      // ✅ cleaner message for user
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed. Try again.";

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-6 card bg-base-100 shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Create an Account</h2>

      <form onSubmit={handleRegister} className="space-y-3">
        <input
          name="name"
          className="input input-bordered w-full"
          placeholder="Full Name"
          required
        />

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

        <input
          name="phone"
          className="input input-bordered w-full"
          placeholder="Phone"
        />

        <select
          name="role"
          className="select select-bordered w-full"
          defaultValue="student"
        >
          <option value="student">Register as Student</option>
          <option value="tutor">Register as Tutor</option>
        </select>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "Register"
          )}
        </button>
      </form>

      <p className="mt-3 text-sm text-center">
        Already have an account?{" "}
        <Link to="/login" className="link link-primary">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;
