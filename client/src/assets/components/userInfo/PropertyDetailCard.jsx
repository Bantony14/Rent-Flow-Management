function PropertyDetails({
  user,
  edit,
  onChange,
  buildingName,
  room,
  fetchRoom,
  fetchRoomLoading,
}) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300">
      <h2 className="text-xl font-bold text-slate-800 mb-6">
        Property Details
      </h2>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
          <span className="text-sm text-slate-500 sm:w-36 shrink-0">
            Building Name
          </span>
          {edit ? (
            <select
              name="building"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              onChange={(e) => {
                onChange(e);
                fetchRoom(e.target.value);
              }}
              value={user?.building}
            >
              {buildingName.map((buildingName) => {
                return (
                  <>
                    <option value="">Select Building</option>
                    <option key={buildingName} value={buildingName}>
                      {buildingName}
                    </option>
                  </>
                );
              })}
            </select>
          ) : (
            <span className="text-sm font-medium text-slate-800">
              {user?.building}
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
          <span className="text-sm text-slate-500 sm:w-36 shrink-0">
            Room Number
          </span>
          {edit ? (
            <select
              name="roomNumber"
              value={user.roomNumber}
              onChange={onChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              {fetchRoomLoading ? (
                <option value="loading">....loading</option>
              ) : room.length > 0 ? (
                <>
                  <option value="">Select Room</option>
                  {room.map((rooms) => (
                    <option key={rooms} value={rooms}>
                      {rooms}
                    </option>
                  ))}
                </>
              ) : (
                <>
                  <option disabled>{user.roomNumber}</option>
                  <option disabled>No room Available</option>
                </>
              )}
            </select>
          ) : (
            <span className="text-sm font-medium text-slate-800">
              {user?.roomNumber}
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
          <span className="text-sm text-slate-500 sm:w-36 shrink-0">
            Total Members
          </span>
          <span className="text-sm font-medium text-slate-800">
            {user?.member?.length || 0}
          </span>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetails;
