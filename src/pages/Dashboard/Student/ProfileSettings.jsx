import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Card from "../../../components/ui/Card";

const DEFAULT_AVATAR =
  "https://api.dicebear.com/7.x/initials/svg?seed=User&backgroundColor=1f2937&textColor=ffffff";

export default function ProfileSettings() {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    photoURL: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    phone: false,
    photoURL: false,
  });

  const updateField = (key, value) => {
    setForm((p) => ({ ...p, [key]: value }));
    setSuccess("");
    setServerError("");
  };

  const loadProfile = async () => {
    try {
      setServerError("");
      setLoading(true);

      const res = await axiosSecure.get("/users/me");
      const me = res?.data || {};

      setForm({
        name: me?.name || user?.displayName || "",
        phone: me?.phone || "",
        photoURL: me?.photoURL || user?.photoURL || "",
      });
    } catch (err) {
      const status = err?.response?.status;

      // ✅ auth problem -> go to login
      if (status === 401 || status === 403) {
        setServerError("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      setServerError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load profile. Check server connection."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Basic validation
  const errors = useMemo(() => {
    const e = {};
    const name = (form.name || "").trim();
    const phone = (form.phone || "").trim();
    const photoURL = (form.photoURL || "").trim();

    if (!name) e.name = "Name is required.";
    if (name && name.length < 3) e.name = "Name must be at least 3 characters.";

    if (phone && !/^\+?\d[\d\s-]{8,15}$/.test(phone)) {
      e.phone = "Enter a valid phone number (8–16 digits).";
    }

    if (photoURL && !/^https?:\/\/.+/i.test(photoURL)) {
      e.photoURL = "Photo URL must start with http:// or https://";
    }

    return e;
  }, [form]);

  const isValid = Object.keys(errors).length === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, phone: true, photoURL: true });
    setSuccess("");
    setServerError("");

    if (!isValid) return;

    try {
      setSaving(true);

      await axiosSecure.patch("/users/me", {
        name: form.name.trim(),
        phone: form.phone.trim(),
        photoURL: form.photoURL.trim(),
      });

      setSuccess("Profile updated successfully.");
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        setServerError("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      setServerError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const displayEmail = user?.email || "N/A";
  const avatarSrc = form.photoURL?.trim() || user?.photoURL || DEFAULT_AVATAR;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Profile Settings</h1>
        <p className="text-sm opacity-75 mt-1">
          Update your personal information and profile photo.
        </p>
      </div>

      {/* Alerts */}
      {serverError ? (
        <div className="mb-4 rounded-2xl border p-4 text-sm bg-base-100">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-red-500 font-medium">Error:</span>{" "}
              <span className="opacity-90">{serverError}</span>
            </div>
            <button className="btn btn-sm btn-outline" onClick={loadProfile}>
              Retry
            </button>
          </div>
        </div>
      ) : null}

      {success ? (
        <div className="mb-4 rounded-2xl border p-4 text-sm bg-base-100">
          <span className="text-green-500 font-medium">Success:</span>{" "}
          <span className="opacity-90">{success}</span>
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <Card className="rounded-2xl overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold">Your Profile</h2>
            <p className="text-sm opacity-70 mt-1">
              This information is visible to tutors/admins when needed.
            </p>

            <div className="mt-6 flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl overflow-hidden border border-base-200">
                <img
                  src={avatarSrc}
                  alt="avatar"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_AVATAR;
                  }}
                />
              </div>

              <div className="min-w-0">
                <div className="font-semibold line-clamp-1">
                  {form.name || "Your Name"}
                </div>
                <div className="text-sm opacity-70 line-clamp-1">
                  {displayEmail}
                </div>
                <div className="text-xs opacity-60 mt-1">
                  Role: <span className="font-medium">Student</span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="opacity-70">Account status</span>
                <span className="px-2 py-1 rounded-xl border border-base-200">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="opacity-70">Last update</span>
                <span className="opacity-90">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Form card */}
        <Card className="rounded-2xl overflow-hidden lg:col-span-2">
          <div className="p-6">
            <h2 className="text-lg font-semibold">Edit Information</h2>
            <p className="text-sm opacity-70 mt-1">
              Make sure your name and phone number are accurate.
            </p>

            {loading ? (
              <div className="mt-8 flex items-center gap-3">
                <span className="loading loading-spinner loading-md"></span>
                <span className="text-sm opacity-70">Loading profile...</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
                <Input
                  label="Full Name"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, name: true }))}
                  error={touched.name ? errors.name : ""}
                  placeholder="e.g. Samiul Islam"
                />

                <Input
                  label="Phone Number (optional)"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, phone: true }))}
                  error={touched.phone ? errors.phone : ""}
                  placeholder="e.g. 01XXXXXXXXX"
                />

                <Input
                  label="Photo URL (optional)"
                  value={form.photoURL}
                  onChange={(e) => updateField("photoURL", e.target.value)}
                  onBlur={() =>
                    setTouched((p) => note({ ...p, photoURL: true }))
                  }
                  error={touched.photoURL ? errors.photoURL : ""}
                  placeholder="https://..."
                />

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button type="submit" disabled={saving || !isValid}>
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    disabled={saving}
                    onClick={() => {
                      setForm({
                        name: user?.displayName || "",
                        phone: "",
                        photoURL: user?.photoURL || "",
                      });
                      setTouched({
                        name: false,
                        phone: false,
                        photoURL: false,
                      });
                      setSuccess("");
                      setServerError("");
                    }}
                  >
                    Reset
                  </Button>
                </div>

                {!isValid &&
                (touched.name || touched.phone || touched.photoURL) ? (
                  <p className="text-xs opacity-70">
                    Please fix the errors above to save changes.
                  </p>
                ) : null}
              </form>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
