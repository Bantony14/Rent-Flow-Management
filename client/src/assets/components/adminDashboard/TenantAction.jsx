import { useNavigate } from "react-router-dom";

function TenantActions() {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6 mb-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">
        Tenant Management Actions
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          onClick={() => navigate("/registration")}
          className="px-5 py-4 rounded-2xl bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold shadow-lg hover:scale-105 transition"
        >
          Add New Tenant
        </button>

        <button
          className="px-5 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg hover:scale-105 transition"
          onClick={() => {
            navigate("/all-tenants");
          }}
        >
          All Tenant
        </button>

        <button
          className="px-5 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-500 text-white font-semibold shadow-lg hover:from-violet-700 hover:to-purple-600 hover:scale-105 transition-all duration-300"
          onClick={() => {
            navigate("/allroom");
          }}
        >
          All Room
        </button>
      </div>
    </div>
  );
}

export default TenantActions;
