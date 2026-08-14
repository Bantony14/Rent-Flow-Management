function AllTenantsHeader() {
    return (
        <div className="mb-6 sm:mb-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 p-5 sm:p-8 text-white shadow-lg">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-xs sm:text-sm font-medium uppercase tracking-wider text-blue-100">
                        RentFlow Admin Panel
                    </p>
                    <h1 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold">
                        User Management
                    </h1>
                    <p className="mt-2 text-sm sm:text-base text-blue-100">
                        Manage, monitor and control all registered users from one place.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AllTenantsHeader;