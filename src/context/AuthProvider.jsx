import { createContext, useEffect, useMemo, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { app } from "../config/firebase.config";
import { axiosPublic } from "../config/axios.config";

export const AuthContext = createContext(null);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // {name, email, role, photoURL}
  const [loading, setLoading] = useState(true);

  const googleLogin = async () => {
    setLoading(true);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);

      // ✅ clear local session first
      localStorage.removeItem("access-token");
      localStorage.removeItem("user-role");
      setUser(null);

      // ✅ firebase logout
      await signOut(auth);

      // optional (যদি backend cookie use করেন)
      // await axiosPublic.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (!isMounted) return;
        setLoading(true);

        // ✅ if logged out
        if (!currentUser) {
          localStorage.removeItem("access-token");
          localStorage.removeItem("user-role");
          if (isMounted) setUser(null);
          return;
        }

        const userInfo = {
          name: currentUser.displayName || "User",
          email: currentUser.email,
          photoURL: currentUser.photoURL || "",
          // ✅ role পাঠানোর দরকার নাই (server DB থেকে role set করবে)
        };

        // ✅ IMPORTANT: token + db user (NO token needed here)
        const res = await axiosPublic.post("/auth/jwt", userInfo);

        const token = res?.data?.token || res?.data?.accessToken;
        const dbUser = res?.data?.user;

        if (!token) {
          throw new Error("Token not found from /auth/jwt response");
        }

        // ✅ save token + role
        localStorage.setItem("access-token", token);

        const role = (dbUser?.role || "student").toLowerCase();
        localStorage.setItem("user-role", role);

        // ✅ update state user
        if (isMounted) {
          setUser({
            name: dbUser?.name || userInfo.name,
            email: dbUser?.email || userInfo.email,
            role,
            photoURL: dbUser?.photoURL || userInfo.photoURL,
          });
        }
      } catch (err) {
        console.error("AuthProvider error:", err);

        // fail safe: clear everything
        localStorage.removeItem("access-token");
        localStorage.removeItem("user-role");
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      googleLogin,
      logout,
      setUser,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
