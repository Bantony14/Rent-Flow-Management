import { Loader2 } from "lucide-react";

function ProfileCard({
  user,
  edit,
  onEditToggle,
  onSave,
  onCancel,
  onDelete,
  handleChange,
  uploadDataloading,
  fetchRoom,
  handleRoomUpdate,
}) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-6 md:p-8 text-white shadow-xl">
      {/* Top bar */}
      <div className="flex justify-end gap-3 mb-6">
        {edit ? (
          <>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-400 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition"
              onClick={() => {
                onSave();
                handleRoomUpdate();
              }}
              disabled={uploadDataloading}
            >
              {uploadDataloading && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              {uploadDataloading ? "Sending..." : "Send"}
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/40 rounded-xl text-sm font-semibold text-white hover:bg-white/30 transition"
              onClick={() => {
                onEditToggle();
                onCancel();
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              onEditToggle();
              fetchRoom();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/40 rounded-xl text-sm font-semibold hover:bg-white/30 transition"
          >
            Edit
          </button>
        )}

        <button
          className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-xl text-sm font-semibold transition"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* User Avatar */}
        <div className="relative w-28 h-28 shrink-0">
          {edit ? (
            <label
              htmlFor="profileImage"
              className="group relative block w-full h-full cursor-pointer"
            >
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl bg-white">
                {user?.profileImage?.secure_url ? (
                  <img
                    src={
                      typeof user?.profileImage?.secure_url === "string"
                        ? user?.profileImage?.secure_url
                        : URL.createObjectURL(user?.profileImage?.secure_url)
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                    <div className="rounded-full bg-white p-3 shadow-sm"></div>
                    <p className="text-xs font-medium">No Photo</p>
                  </div>
                )}
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white text-sm font-semibold">Change</span>
              </div>

              {/* Camera Icon */}
              <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center shadow-lg border-2 border-white">
                📷
              </div>

              <input
                id="profileImage"
                name="profileImage"
                type="file"
                onChange={handleChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl bg-white">
              <img
                src={user?.profileImage?.secure_url}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 w-full text-center lg:text-left">
          <h1 className="text-3xl md:text-4xl font-bold">{user?.fullName}</h1>

          <p className="text-white/80 mt-2">{user?.email}</p>

          <div className="flex flex-wrap justify-center lg:justify-start gap-3 mt-4">
            <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-sm">
              {user?.role}
            </span>

            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                user?.paymentStatus === "Paid" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {user?.paymentStatus}
            </span>
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-300 ${
                user?.isActive
                  ? "bg-green-500/50 text-green-300 border-green-500/30"
                  : "bg-red-500/50 text-red-300 border-red-500/30"
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  user?.isActive ? "bg-green-400" : "bg-red-400"
                }`}
              ></span>

              {user?.isActive ? "Active" : "In Active"}
            </span>
          </div>
        </div>
      </div>

      {/* Header Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
          <p className="text-white/70 text-sm">Room Number</p>
          <h3 className="text-xl font-bold mt-1">{user?.roomNumber}</h3>
        </div>

        <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
          <p className="text-white/70 text-sm">Building</p>
          <h3 className="text-xl font-bold mt-1">{user?.building}</h3>
        </div>

        <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
          <p className="text-white/70 text-sm">Monthly Rent</p>
          <h3 className="text-xl font-bold mt-1">₹ {user?.rentPrice}</h3>
        </div>

        <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
          <p className="text-white/70 text-sm">Members</p>
          <h3 className="text-xl font-bold mt-1">
            {user?.member?.length || 0}
          </h3>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
