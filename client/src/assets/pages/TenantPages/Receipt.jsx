import { FileText, ExternalLink, UserSearch } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { userReceipt } from "../../api/authApi";
import LoadingScreen from "../../components/LoadingScreen";

export default function ReceiptHistory() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async function receipts() {
      try {
        setLoading(true);
        const res = await userReceipt();
        toast.success(res?.data?.message);

        setReceipts(res.data.receipt.reverse());
      } catch (error) {
        toast.error(error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleViewReceipt = (id) => {
    window.open(`${id}`, "_blank");
  };

  if (loading) {
    <LoadingScreen />;
  }
  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Receipt History</h1>
          <p className="text-slate-500 mt-1">
            View and download all your payment receipts.
          </p>
        </div>

        {/* Receipt List */}
        <div className="space-y-5">
          {receipts.map((receipt) => (
            <div
              key={receipt._id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex  items-start  gap-4">
                <div className="h-14 w-14 rounded-xl bg-blue-100 flex items-center justify-center">
                  <FileText className="text-blue-600" size={28} />
                </div>

                <div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Receipt For
                    </p>

                    <h2 className="text-lg font-bold text-blue-600">
                      {receipt.months.map((month) => month.month).join(", ")}
                    </h2>

                    <p className="text-sm text-slate-600">Rent Receipt</p>
                  </div>

                  <p className="text-sm text-slate-500 mt-1">
                    Paid on {new Date(receipt.createdAt).toLocaleDateString()}
                  </p>

                  <span className="inline-block mt-2 text-green-600 font-semibold">
                    ₹{receipt.totalAmount}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleViewReceipt(receipt.pdf.secure_url)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition"
              >
                View Receipt
                <ExternalLink size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {receipts.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <FileText size={50} className="mx-auto text-slate-300" />
            <h2 className="mt-4 text-xl font-semibold text-slate-700">
              No Receipts Found
            </h2>
            <p className="text-slate-500 mt-2">
              Your payment receipts will appear here once you make a payment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
