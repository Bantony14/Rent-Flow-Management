import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function PaymentSuccess() {
    const location = useLocation();

    const paymentId = location.state?.paymentId;
    const orderId = location.state?.orderId;
    const amount = location.state?.amount;
    const [countDown, setCountDown] = useState(5)


    useEffect(() => {
        const timer = setInterval(() => {
            setCountDown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1
            })
        }, 1000)
    }, [])


    useEffect(() => {
        const timer = setTimeout(() => {
            window.location.href = "/tenant/dashboard";
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="bg-white max-w-md w-full rounded-3xl shadow-sm border p-8 text-center">
                <div className="flex justify-center mb-4">
                    <CheckCircle2
                        size={70}
                        className="text-green-500"
                    />
                </div>

                <h1 className="text-2xl font-bold text-slate-800 mb-2">
                    Payment Successful
                </h1>

                <p className="text-slate-500 mb-6">
                    Your rent payment has been received successfully.
                </p>

                <div className="bg-slate-50 rounded-2xl p-4 text-left space-y-2 mb-6">
                    <p>
                        <span className="font-medium">
                            Amount:
                        </span>{" "}
                        ₹{amount}
                    </p>

                    <p>
                        <span className="font-medium">
                            Payment ID:
                        </span>{" "}
                        {paymentId}
                    </p>

                    <p>
                        <span className="font-medium">
                            Order ID:
                        </span>{" "}
                        {orderId}
                    </p>
                </div>

                <p className="text-sm text-slate-500">
                    Redirecting to dashboard in {countDown} seconds...
                </p>

                <button
                    onClick={() =>
                        window.location.href = "/tenant/dashboard"
                    }
                    className="w-full mt-4 bg-green-600 text-white py-3 rounded-xl font-semibold"
                >
                    Go To Dashboard
                </button>
            </div>
        </div >
    );
}

export default PaymentSuccess;