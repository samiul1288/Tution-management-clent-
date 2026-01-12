import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

const fallbackImg =
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop";

export default function TuitionCard({ tuition }) {
  const img = tuition?.image || tuition?.photoURL || fallbackImg;

  return (
    <div className="card bg-base-100 border border-base-200 shadow-sm rounded-2xl overflow-hidden h-full flex flex-col">
      <figure className="h-36">
        <img
          src={img}
          alt={tuition?.title || "Tuition"}
          className="h-36 w-full object-cover"
          onError={(e) => (e.currentTarget.src = fallbackImg)}
        />
      </figure>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold leading-snug line-clamp-2">
            {tuition?.title}
          </h3>
          {tuition?.status ? (
            <span
              className={`badge badge-sm ${
                tuition.status === "APPROVED"
                  ? "badge-success"
                  : tuition.status === "REJECTED"
                  ? "badge-error"
                  : "badge-warning"
              }`}
            >
              {tuition.status}
            </span>
          ) : null}
        </div>

        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
          {tuition?.description || "Tuition details available."}
        </p>

        <div className="mt-3 text-xs text-gray-500 space-y-1">
          <div className="flex justify-between gap-3">
            <span>Subject</span>
            <span className="font-medium text-base-content">
              {tuition?.subject || "N/A"}
            </span>
          </div>
          <div className="flex justify-between gap-3">
            <span>Class</span>
            <span className="font-medium text-base-content">
              {tuition?.className || "N/A"}
            </span>
          </div>
          <div className="flex justify-between gap-3">
            <span>Location</span>
            <span className="font-medium text-base-content">
              {tuition?.location || "N/A"}
            </span>
          </div>
          <div className="flex justify-between gap-3">
            <span>Budget</span>
            <span className="font-semibold text-base-content">
              {formatCurrency(tuition?.budget || 0)} ৳
            </span>
          </div>
          {tuition?.createdAt ? (
            <div className="flex justify-between gap-3">
              <span>Posted</span>
              <span className="font-medium text-base-content">
                {formatDate(tuition.createdAt)}
              </span>
            </div>
          ) : null}
        </div>

        <div className="mt-4 pt-2 flex justify-end">
          <Link
            to={`/tuitions/${tuition?._id}`}
            className="btn btn-sm btn-primary rounded-xl"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
