function SearchBar({ props }) {
    return (
        <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-5 mb-6">
            <div className="flex flex-col lg:flex-row gap-3">

                <select
                    value={props.searchField}
                    onChange={(e) => { props.setSearchField(e.target.value), props.setIsError(false) }}
                    className={`px-4 py-3 border border-slate-300 rounded-xl lg:w-48 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white ${props.searchField === "" ? "text-slate-400" : "text-slate-700"
                        }`}
                >
                    <option value="" disabled>
                        Select Find Option
                    </option>

                    <option value="fullName">Full Name</option>
                    <option value="email">Email</option>
                    <option value="mobileNumber">Mobile Number</option>
                    <option value="_id">ID</option>
                </select>

                <input
                    type="text"
                    placeholder={`Search by ${props.searchField}`}
                    value={props.search}
                    onChange={(e) => { props.setSearch(e.target.value), props.setIsError(false) }}
                    className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />

                <button

                    onClick={props.handleSearch}
                    className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-xl transition-colors"

                >
                    Search
                </button>

            </div>
        </div>
    );
}

export default SearchBar;