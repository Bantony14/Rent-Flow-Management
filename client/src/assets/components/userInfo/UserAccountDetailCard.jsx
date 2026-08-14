function UserAccountDetailCard({ user, edit, onChange }) {
    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300">

            <h2 className="text-xl font-bold text-slate-800 mb-6">
                Account Information
            </h2>

            <div className="space-y-4">

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                    <span className="text-sm text-slate-500 sm:w-36 shrink-0">Role</span>
                    {edit ? (
                        <select
                            value={user?.role}
                            className="flex-1 border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white"
                            onChange={onChange}
                            name="role"
                        >
                            <option>ADMIN</option>
                            <option>TENANT</option>
                        </select>
                    ) : (
                        <span className="text-sm font-medium text-slate-800">{user?.role}</span>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                    <span className="text-sm text-slate-500 sm:w-36 shrink-0">User ID</span>
                    <span className="text-sm font-medium text-slate-800 break-all">{user?._id}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                    <span className="text-sm text-slate-500 sm:w-36 shrink-0">Created At</span>
                    <span className="text-sm font-medium text-slate-800">
                        {user?.createdAt
                            ? new Date(user.createdAt).toLocaleDateString("en-IN")
                            : "N/A"}
                    </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                    <span className="text-sm text-slate-500 sm:w-36 shrink-0">Last Updated</span>
                    <span className="text-sm font-medium text-slate-800">
                        {user?.updatedAt
                            ? new Date(user.updatedAt).toLocaleDateString("en-IN")
                            : "N/A"}
                    </span>
                </div>

            </div>

        </div>
    );
}

export default UserAccountDetailCard;