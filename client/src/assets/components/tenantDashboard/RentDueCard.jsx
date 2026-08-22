import { CreditCard, Calendar, CheckCircle2 } from "lucide-react";
import { paymentOrderCreate } from "../../api/paymentApi";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { resetUserData } from "../../api/authApi";

function RentDueCard({ user }) {
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(null);
  const navigate = useNavigate();
  const totalRent = user?.rentPrice;
  const isPaid = user?.paymentStatus;
  const dueAmount = user?.dueAmount;

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  async function resetFewData() {
    try {
      setResetLoading(true);
      const res = await resetUserData(user._id);
      window.location.reload();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setResetLoading(false);
    }
  }

  const date = new Date(user.joiningDate);

  const joiningMonth = date.getMonth();
  const joiningYear = date.getFullYear();

  let month = Number(user?.nextRentGeneratedMonth?.split("-")[1]);
  let year = Number(user?.nextRentGeneratedMonth?.split("-")[0]);

  const handlePayNow = async () => {
    try {
      const { data } = await paymentOrderCreate();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        order_id: data.order.id,

        name: "Rent Payment",
        description: user.nextRentGeneratedMonth
          ? `${monthNames[month - 2]} ${year} Rent Payment`
          : `${monthNames[joiningMonth - 1]} ${joiningYear} Rent Payment`,

        handler: async (response) => {
          try {
            setLoading(true);

            const { data } = await axios.post(
              `${import.meta.env.VITE_API_URL}/api/v1/payment/verify-payment`,
              // "http://localhost:5000/api/v1/payment/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                withCredentials: true,
              },
            );

            if (data.success) {
              toast.success("Rent paid successfully");
              navigate("/payment-success", {
                state: {
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  amount: data.amount,
                },
              });
            }
          } catch (error) {
            console.error(error);
            toast.error("Payment verification failed");
            navigate("/payment-failed");
          } finally {
            setLoading(false);
          }
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error("Unable to initiate payment");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[480px] flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white">
        <div className="rounded-full bg-blue-100 p-6">
          <div className="h-10 w-10 rounded-full border-4 border-blue-300 border-t-blue-600 animate-spin"></div>
        </div>

        <h2 className="mt-5 text-xl font-bold text-slate-800">
          Initializing Payment...
        </h2>

        <p className="mt-2 text-center text-sm text-slate-500">
          Please wait while we prepare your payment. This may take a few
          seconds.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CreditCard size={18} className="text-blue-600" />
          <h2 className="font-semibold text-slate-800">Rent Status</h2>
        </div>

        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${
            isPaid === "Paid"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {isPaid}
        </span>
      </div>

      {/* Rent Amount */}
      <div
        className={`rounded-2xl p-6 mb-5 shadow-sm ${
          isPaid === "Paid"
            ? "bg-green-50 border border-green-200"
            : "bg-red-50 border border-red-200"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-slate-500">
              {user.nextRentGeneratedMonth
                ? `${monthNames[month - 2]} ${year} Rent`
                : `${monthNames[joiningMonth]} ${joiningYear} Rent`}
            </p>

            {user.lastRentAmount ? (
              <h1
                className={`text-4xl font-bold mt-1 ${
                  isPaid === "Paid" ? "text-green-700" : "text-red-700"
                }`}
              >
                ₹{user.lastRentAmount.toLocaleString("en-IN")}
              </h1>
            ) : (
              <p className="mt-2 text-base font-bold text-slate-500">
                Rent has not been generated for your first month yet.
              </p>
            )}
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-4">
          {isPaid === "Paid"
            ? `Rent for ${
                user?.nextRentGeneratedMonth
                  ? `${monthNames[month - 2]} ${year}`
                  : `${monthNames[joiningMonth]} ${joiningYear}`
              }
                            has been paid successfully.`
            : `Rent payment for ${
                user?.nextRentGeneratedMonth
                  ? `${monthNames[month - 2]} ${year}`
                  : `${monthNames[joiningMonth]} ${joiningYear}`
              }
                             is pending.`}
        </p>

        <div className="flex items-center justify-between bg-white rounded-xl p-4 border">
          <span className="text-slate-600 font-medium">Due Amount</span>

          <span
            className={`text-xl font-bold ${
              dueAmount > 0 ? "text-red-600" : "text-green-600"
            }`}
          >
            ₹{dueAmount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Due Date */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Calendar size={15} />
        <span>
          {isPaid === "Paid" ? (
            <span>
              Next Rent Due:{" "}
              {user.nextRentGeneratedMonth
                ? `${monthNames[month - 1]} 
                                ${year}`
                : `${monthNames[joiningMonth]} ${joiningYear}`}
            </span>
          ) : (
            <span>
              Pending Rent:{" "}
              {user.nextRentGeneratedMonth
                ? `${monthNames[month - 2]} 
                                ${year}`
                : `${monthNames[joiningMonth]} ${joiningYear}`}
            </span>
          )}
        </span>
      </div>

      {/* Action */}
      {isPaid === "Paid" ? (
        <>
          <div className="flex items-center justify-center gap-2 rounded-2xl border border-green-200 bg-green-100 py-3 font-semibold text-green-700">
            <CheckCircle2 size={18} />
            Rent Paid Successfully
          </div>

          <div className="mt-3 flex flex-col items-center justify-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-center">
            <p className="text-sm font-medium text-amber-700">
              Want to test the payment flow again?
            </p>

            <button
              type="button"
              className="rounded-xl bg-amber-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-amber-600 active:scale-95"
              onClick={() => {
                resetFewData();
              }}
            >
              {resetLoading ? "Data reseting...." : "Reset Payment"}
            </button>

            <p className="rounded-lg bg-white px-3 py-1 text-sm font-bold text-amber-700 shadow-sm">
              Number of Try: {user.countNumberOftry}
            </p>
          </div>
        </>
      ) : dueAmount > 0 ? (
        <button
          onClick={handlePayNow}
          className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 py-3 font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-lg active:scale-[0.98]"
        >
          Pay Rent ₹{dueAmount.toLocaleString()}
        </button>
      ) : (
        <button
          disabled
          className="w-full cursor-not-allowed rounded-2xl border border-gray-200 bg-gray-100 py-3 font-semibold text-gray-500"
        >
          Next rent will be available in{" "}
          {user.nextRentGeneratedMonth
            ? `${monthNames[month - 2]} ${year}`
            : `${monthNames[joiningMonth]} ${joiningYear}`}
        </button>
      )}
    </div>
  );
}

export default RentDueCard;
