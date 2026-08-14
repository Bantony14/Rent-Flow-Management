const NumberOfUsers = ({ totalUsers, tenants, admins }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">

            <div className="rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-slate-200">
                <p className="text-sm font-medium text-slate-500">Total Users</p>
                <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-800">
                    {totalUsers}
                </h1>
            </div>

            <div className="rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-slate-200">
                <p className="text-sm font-medium text-slate-500">Total Tenants</p>
                <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-blue-600">
                    {tenants}
                </h1>
            </div>

            <div className="rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-slate-200">
                <p className="text-sm font-medium text-slate-500">Total Admins</p>
                <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-emerald-600">
                    {admins}
                </h1>
            </div>

        </div>
    );
};

export default NumberOfUsers;