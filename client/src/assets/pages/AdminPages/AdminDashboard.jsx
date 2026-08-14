import { useEffect, useState } from "react";
import SearchBar from "../../components/adminDashboard/SearchBar";
import UserCard from "../../components/adminDashboard/UserCard";
import TenantActions from "../../components/adminDashboard/TenantAction";
import { getOneUser } from "../../api/authApi";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("");
  let [tenantDetail, setTenantDetail] = useState("");
  const [isError, setIsError] = useState(false);

  // this form data only for sending data with filedName and value
  let formData = {
    [searchField]: search,
  };

  //  sending a API to finding a User By Name ,Email, MobileNumber
  async function sendApi() {
    if (search.trim() === "" || searchField === "") {
      return toast.error("Please select a field and provide a value.");
    }
    try {
      const res = await getOneUser(formData);
      toast.success(res.data.message);
      setTenantDetail(res.data.user);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      setTenantDetail("");
      setIsError(true);
    }
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50 p-6">
        {/* Good thought */}
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-white shadow-xl">
          <h1 className="text-3xl md:text-4xl font-bold">
            Welcome Back, Admin 👋
          </h1>

          <p className="mt-3 text-cyan-100 max-w-2xl">
            Manage users, monitor activities, update records, and keep your
            platform running smoothly from one centralized dashboard.
          </p>
        </div>

        {/* Search */}

        <SearchBar
          props={{
            search: search,
            setSearch: setSearch,
            searchField: searchField,
            setSearchField: setSearchField,
            handleSearch: sendApi,
            setIsError: setIsError,
          }}
        />

        {/* Users Card */}

        {tenantDetail ? (
          <UserCard user={tenantDetail} />
        ) : (
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6 mb-6">
            <div className="flex flex-col items-center justify-center min-h-[240px] text-center">
              <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-3xl">
                🔍
              </div>

              <h2 className="mt-4 text-xl font-bold text-slate-700">
                {isError ? "No Tenant Found" : "Please Search to Find a Tenant"}
              </h2>

              <p className="mt-2 text-slate-500 max-w-sm text-center">
                {isError ? (
                  <>
                    We couldn't find any tenant with{" "}
                    <span className="font-semibold text-slate-700">
                      {searchField}
                    </span>{" "}
                    matching{" "}
                    <span className="font-semibold text-slate-700">
                      "{search}"
                    </span>
                    . Try a different search value or field.
                  </>
                ) : (
                  "Enter a search field and value to find tenant records instantly."
                )}
              </p>
            </div>
          </div>
        )}

        {/* All buttons */}
        <TenantActions />
      </div>
    </>
  );
};

export default AdminDashboard;
