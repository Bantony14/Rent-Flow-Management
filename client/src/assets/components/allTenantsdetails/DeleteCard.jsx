function DeleteCard({ data, onDelete, onCancel }) {
  const {
    fullName,
    email,
    roomNumber,
    building,
    rentPrice,
    mobileNumber,
    paymentStatus,
  } = data;

  const initials = fullName
    ?.split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-sm w-full">
        {/* Icon + heading */}
        <div className="flex flex-col items-center mb-5">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
              />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-slate-800">
            Delete tenant?
          </h2>
          <p className="text-xs text-slate-400 text-center mt-1">
            This action cannot be undone. All data will be permanently removed.
          </p>
        </div>

        {/* Tenant info card */}
        <div className="bg-slate-50 rounded-xl p-4 mb-5">
          {/* Top: avatar + name + badge */}
          <div className="flex items-center gap-3 pb-3 mb-3 border-b border-slate-200">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">
                {fullName}
              </p>
              <p className="text-xs text-slate-400 truncate">{email}</p>
            </div>
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-md flex-shrink-0 ${
                paymentStatus === "Paid"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {paymentStatus}
            </span>
          </div>

          {/* Detail grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Room", value: roomNumber },
              { label: "Building", value: building },
              { label: "Rent", value: `₹${rentPrice?.toLocaleString()} / mo` },
              { label: "Mobile", value: mobileNumber },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">
                  {label}
                </p>
                <p className="text-sm font-medium text-slate-700">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-600 text-sm font-medium hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="flex-1 py-2.5 rounded-xl bg-red-50 text-red-600 border border-red-200 text-sm font-medium hover:bg-red-100 transition-colors"
          >
            Delete tenant
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteCard;
