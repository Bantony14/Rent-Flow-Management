import { CircleX } from "lucide-react";
import { useNavigate } from "react-router-dom";

function PaymentFailed() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="bg-white max-w-md w-full rounded-3xl shadow-sm border p-8 text-center">
                <div className="flex justify-center mb-4">
                    <CircleX
                        size={70}
                        className="text-red-500"
                    />
                </div>

                <h1 className="text-2xl font-bold text-slate-800 mb-2">
                    Payment Failed
                </h1>

                <p className="text-slate-500 mb-6">
                    We couldn't process your rent payment.
                    Please try again.
                </p>

                <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-red-700 text-sm mb-6">
                    The transaction was not completed or was
                    cancelled.
                </div>

                <button
                    onClick={() =>
                        navigate("/tenant/dashboard")
                    }
                    className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold"
                >
                    Back To Dashboard
                </button>
            </div>
        </div>
    );
}

export default PaymentFailed;