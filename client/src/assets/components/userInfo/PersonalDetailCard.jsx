function PersonalDetails({ user, edit, onChange }) {
    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300">

            <h2 className="text-xl font-bold text-slate-800 mb-6">
                Personal Details
            </h2>

            <div className="space-y-4">

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                    <span className="text-sm text-slate-500 sm:w-36 shrink-0">Full Name</span>
                    {edit ? (
                        <input
                            type="text"
                            value={user?.fullName}
                            name="fullName"
                            className="flex-1 border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                            placeholder="Full Name"
                            onChange={onChange}
                        />
                    ) : (
                        <span className="text-sm font-medium text-slate-800">{user?.fullName}</span>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                    <span className="text-sm text-slate-500 sm:w-36 shrink-0">Email</span>
                    {edit ? (
                        <input
                            type="email"
                            value={user?.email}
                            name="email"
                            className="flex-1 border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                            placeholder="Email"
                            onChange={onChange}
                        />
                    ) : (
                        <span className="text-sm font-medium text-slate-800">{user?.email}</span>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                    <span className="text-sm text-slate-500 sm:w-36 shrink-0">Mobile Number</span>
                    {edit ? (
                        <input
                            type="tel"
                            value={user?.mobileNumber}
                            name="mobileNumber"
                            className="flex-1 border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                            placeholder="Mobile Number"
                            onChange={onChange}
                        />
                    ) : (
                        <span className="text-sm font-medium text-slate-800">{user?.mobileNumber}</span>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                    <span className="text-sm text-slate-500 sm:w-36 shrink-0">Date Of Birth</span>
                    {edit ? (
                        <input
                            type="date"
                            value={user?.dob ? new Date(user.dob).toISOString().split("T")[0] : ""}
                            name="dob"
                            className="flex-1 border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                            onChange={onChange}
                        />
                    ) : (
                        <span className="text-sm font-medium text-slate-800">
                            {user?.dob ? new Date(user.dob).toLocaleDateString("en-IN") : "N/A"}
                        </span>
                    )}
                </div>

            </div>

        </div>
    );
}

export default PersonalDetails;