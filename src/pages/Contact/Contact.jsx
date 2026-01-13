import { useEffect, useMemo, useState } from "react";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const Contact = () => {
  const axiosPublic = useAxiosPublic();

  const [tutors, setTutors] = useState([]);
  const [students, setStudents] = useState([]);
  const [admins, setAdmins] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // fallback avatar
  const defaultAvatar =
    "https://api.dicebear.com/7.x/initials/svg?seed=User&backgroundColor=1f2937&textColor=ffffff";

  const normalize = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  };

  const fetchUsers = async () => {
    try {
      setError("");
      setLoading(true);

      // ✅ Public contacts endpoint
  const [tRes, sRes, aRes] = await Promise.all([
    axiosPublic.get("/users/public/contacts", { params: { role: "tutor" } }),
    axiosPublic.get("/users/public/contacts", { params: { role: "student" } }),
    axiosPublic.get("/users/public/contacts", { params: { role: "admin" } }),
  ]);

      setTutors(normalize(tRes.data));
      setStudents(normalize(sRes.data));
      setAdmins(normalize(aRes.data));
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load contacts."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tutorCount = useMemo(() => tutors.length, [tutors]);
  const studentCount = useMemo(() => students.length, [students]);
  const adminCount = useMemo(() => admins.length, [admins]);

  const UserCard = ({ user, showEmail = false, showRoleBadge = false }) => {
    const name = user?.name || user?.displayName || "Unknown";
    const phone = user?.phone || user?.phoneNumber || "N/A";
    const email = user?.email || "N/A";
    const photo = user?.photoURL || user?.photo || defaultAvatar;
    const role = (user?.role || "").toUpperCase();

    return (
      <div className="card bg-base-100 border border-base-200 shadow-sm">
        <div className="card-body p-5">
          <div className="flex items-center gap-4">
            <div className="avatar">
              <div className="w-12 rounded-full ring ring-primary/30 ring-offset-base-100 ring-offset-2">
                <img
                  src={photo}
                  alt={name}
                  onError={(e) => {
                    e.currentTarget.src = defaultAvatar;
                  }}
                />
              </div>
            </div>

            <div className="flex-1 space-y-0.5">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base">{name}</h3>
                {showRoleBadge && role && (
                  <span className="badge badge-outline badge-sm">{role}</span>
                )}
              </div>

              <p className="text-sm text-gray-500">Phone: {phone}</p>

              {showEmail && (
                <p className="text-sm text-gray-500 truncate">Email: {email}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <a
                className="btn btn-sm btn-outline"
                href={phone && phone !== "N/A" ? `tel:${phone}` : "#"}
                onClick={(e) => {
                  if (!phone || phone === "N/A") e.preventDefault();
                }}
              >
                Call
              </a>

              {showEmail && (
                <a
                  className="btn btn-sm btn-primary"
                  href={email && email !== "N/A" ? `mailto:${email}` : "#"}
                  onClick={(e) => {
                    if (!email || email === "N/A") e.preventDefault();
                  }}
                >
                  Email
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Section = ({
    title,
    count,
    children,
    badgeClass = "badge-outline",
  }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        <span className={`badge ${badgeClass}`}>{count}</span>
      </div>
      {children}
    </div>
  );

  return (
    <div className="min-h-[70vh] bg-base-200/20">
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Contact</h1>
          <p className="text-sm text-gray-500">
            Find tutor, student & admin contact information in one place.
          </p>

          <div className="flex flex-wrap gap-2 pt-2 items-center">
            <div className="badge badge-outline">Tutors: {tutorCount}</div>
            <div className="badge badge-outline">Students: {studentCount}</div>
            <div className="badge badge-outline">Admins: {adminCount}</div>

            <button
              className="btn btn-sm btn-outline ml-auto"
              onClick={fetchUsers}
            >
              Refresh
            </button>
          </div>
        </div>

        {/* States */}
        {error && (
          <div className="alert alert-error">
            <span className="text-sm">{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center min-h-260px">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Tutors */}
            <Section
              title="Tutor Contacts"
              count={tutorCount}
              badgeClass="badge badge-primary badge-outline"
            >
              {tutors.length === 0 ? (
                <div className="card bg-base-100 border border-base-200 p-6">
                  <p className="text-sm text-gray-500">No tutors found.</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {tutors.map((t) => (
                    <UserCard
                      key={t?._id || t?.email}
                      user={t}
                      showEmail={false}
                      showRoleBadge={false}
                    />
                  ))}
                </div>
              )}
            </Section>

            {/* Students */}
            <Section
              title="Student Contacts"
              count={studentCount}
              badgeClass="badge badge-secondary badge-outline"
            >
              {students.length === 0 ? (
                <div className="card bg-base-100 border border-base-200 p-6">
                  <p className="text-sm text-gray-500">No students found.</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {students.map((s) => (
                    <UserCard
                      key={s?._id || s?.email}
                      user={s}
                      showEmail
                      showRoleBadge={false}
                    />
                  ))}
                </div>
              )}
            </Section>

            {/* Admins */}
            <Section
              title="Admin Contacts"
              count={adminCount}
              badgeClass="badge badge-accent badge-outline"
            >
              {admins.length === 0 ? (
                <div className="card bg-base-100 border border-base-200 p-6">
                  <p className="text-sm text-gray-500">No admins found.</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {admins.map((a) => (
                    <UserCard
                      key={a?._id || a?.email}
                      user={a}
                      showEmail
                      showRoleBadge
                    />
                  ))}
                </div>
              )}
            </Section>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;
