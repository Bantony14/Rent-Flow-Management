import { useNavigate } from "react-router-dom";

function UserCard({ user, onView }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6 hover:shadow-2xl transition-all duration-300 mb-6">
      {/* Avatar + Basic Info */}
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold shrink-0">
          {user?.fullName?.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-slate-800 truncate">
            {user?.fullName}
          </h2>
          <p className="text-slate-500 truncate">{user?.email}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="inline-block px-3 py-1 rounded-full bg-cyan-100 text-cyan-700 text-sm font-medium">
              {user?.role}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold tracking-wide
    ${
      user?.paymentStatus === "Paid"
        ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300"
        : "bg-rose-100 text-rose-600 ring-1 ring-rose-300"
    }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full
        ${user?.paymentStatus === "Paid" ? "bg-emerald-500" : "bg-rose-500"}`}
              />

              {user?.paymentStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <div className="bg-slate-50 rounded-xl p-3">
          <p className="text-slate-500 text-sm">Mobile Number</p>
          <p className="font-semibold">{user?.mobileNumber}</p>
        </div>

        <div className="bg-slate-50 rounded-xl p-3">
          <p className="text-slate-500 text-sm">User ID</p>
          <p className="font-semibold break-all text-xs">{user?._id}</p>
        </div>
      </div>

      {/* Button */}
      <div className="mt-6">
        <button
          onClick={() => navigate(`/view-tenant-detail/${user._id}`)}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:opacity-90 transition"
        >
          View Details
        </button>
      </div>
    </div>
  );
}

export default UserCard;
