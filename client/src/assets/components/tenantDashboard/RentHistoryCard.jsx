import { History, Receipt } from "lucide-react";
import { useNavigate } from "react-router-dom"

const statusStyles = {
  Paid: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Overdue: "bg-red-100 text-red-700",
};

function RentHistoryCard({ userRentHistory }) {

  const naviagte = useNavigate()
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 max-h-[80vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-100">
            <History size={18} className="text-blue-600" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-800">
              Rent History
            </h2>
            <p className="text-xs text-slate-500">
              Previous rent payment records
            </p>
          </div>
        </div>

        <button
          onClick={() => naviagte("/receipt")}
          className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700" >
          <Receipt size={15} />
          Receipt
        </button>
      </div>
      {
        userRentHistory.length === 0 ? (
          <div className="py-10 text-center">
            <History size={35} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 text-sm">
              No rent history available
            </p>
          </div>
        ) : (
          <>
            {/* Mobile View */}
            <div className="space-y-4 md:hidden">
              {userRentHistory.map((rent, index) => (
                <div
                  key={rent._id || index}
                  className="border border-slate-200 rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold text-slate-800">
                      {rent.month}
                    </p>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[rent.paymentStatus] ??
                        "bg-slate-100 text-slate-700"
                        }`}
                    >
                      {rent.paymentStatus}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Rent</span>
                      <span className="font-semibold text-slate-800">
                        ₹{rent.dueAmount?.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">Paid On</span>
                      <span className="text-slate-700">
                        {rent.paidOn
                          ? new Date(rent.paidOn).toLocaleDateString("en-IN")
                          : "-"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Month
                    </th>

                    <th className="text-left py-3 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Rent
                    </th>

                    <th className="text-left py-3 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Paid On
                    </th>

                    <th className="text-left py-3 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {userRentHistory.map((rent, index) => (
                    <tr
                      key={rent._id || index}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition"
                    >
                      <td className="py-4 px-2 font-medium text-slate-700">
                        {rent.month}
                      </td>

                      <td className="py-4 px-2 font-semibold text-slate-800">
                        ₹{rent.dueAmount?.toLocaleString("en-IN")}
                      </td>

                      <td className="py-4 px-2 text-slate-600">
                        {rent.paidOn
                          ? new Date(rent.paidOn).toLocaleDateString("en-IN")
                          : "-"}
                      </td>

                      <td className="py-4 px-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[rent.paymentStatus] ??
                            "bg-slate-100 text-slate-700"
                            }`}
                        >
                          {rent.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )
      }
    </div >
  );
}

export default RentHistoryCard;