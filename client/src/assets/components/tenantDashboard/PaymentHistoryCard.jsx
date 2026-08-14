import { History, CheckCircle, Clock, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { paymentHistoryByUser } from "../../api/paymentApi";



function PaymentHistoryCard() {


    const [paymentHistory, setPaymentHistory] = useState([])

    useEffect(() => {
        (async function () {
            try {
                const res = await paymentHistoryByUser()
                setPaymentHistory((res.data.paymentHistoryByUser).reverse())
                console.log(res.data.paymentHistoryByUser)
            } catch (error) {
                console.log(error?.response?.data?.message)
            }

        }())
    }, [])

    return (
        <div className="w-full bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
                <History size={18} className="text-blue-600" />
                <h2 className="text-sm font-semibold text-slate-800">
                    Payment History
                </h2>

                <span className="ml-auto text-xs font-semibold bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded-full">
                    {paymentHistory.length} records
                </span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {paymentHistory.map((payment) => (
                    <div
                        key={payment._id}
                        className="border border-slate-100 rounded-xl p-4"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="font-semibold text-slate-800">
                                    {payment.month.join(", ")}
                                </p>

                                <p className="text-sm text-slate-500">
                                    ₹{payment.amount.toLocaleString("en-IN")}
                                </p>

                                <p className="text-xs text-slate-400 mt-1">
                                    Transaction ID: {payment.paymentId}
                                </p>

                                <p className="text-xs text-slate-400">
                                    Paid on:{" "}
                                    {new Date(payment.paidAt).toLocaleDateString("en-IN")}
                                </p>
                            </div>

                            <span
                                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium
    ${payment.status === "success"
                                        ? "bg-green-50 text-green-700"
                                        : payment.status === "Pending"
                                            ? "bg-amber-50 text-amber-700"
                                            : "bg-red-50 text-red-700"
                                    }`}
                            >
                                {payment.status === "success" ? (
                                    <CheckCircle size={14} />
                                ) : payment.status === "Pending" ? (
                                    <Clock size={14} />
                                ) : (
                                    <XCircle size={14} />
                                )}

                                {payment.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PaymentHistoryCard;