import { useState } from "react";
import toast from "react-hot-toast";
import {
  forgotPassword,
  resetPassword,
  verifyEmailOtp,
} from "../api/authApi.js";
import { useNavigate } from "react-router-dom";

function Forgotpassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [countDown, setCountDown] = useState(0);
  const [otpTrigger, setOtpTrigger] = useState(false);
  const [passwordTrigger, setPasswordTrigger] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  let timer;

  // sending otp on email
  async function otpSending() {
    if (!email) {
      toast.error("please enter email ");
      return;
    }

    setCountDown(30);

    const interval = setInterval(() => {
      setCountDown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    timer = setTimeout(() => {
      setLoading(false);
    }, 30000);

    try {
      setLoading(true);
      const res = await forgotPassword(email);
      toast.success(
        `opt Send Successfull please check your this email ${email}`,
      );
      setOtpTrigger(true);
      setPasswordTrigger(false);
    } catch (error) {
      clearTimeout(timer);
      setLoading(false);
      toast.error(error?.response?.data?.message);
    }
  }
  // verifing otp is correct or not
  async function verifyOtp() {
    try {
      setLoading2(true);
      const res = await verifyEmailOtp(email, otp.join(""));
      toast.success(res?.data?.message);
      clearTimeout(timer);
      setLoading(false);
      setOtpTrigger(false);
      setPasswordTrigger(true);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading2(false);
    }
  }

  async function updatePassword() {
    if (!newPassword || !confirmPassword) {
      toast.error("Please enter password ");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Please Check your confirmPassword");
      return;
    }
    try {
      const res = await resetPassword(
        email,
        otp.join(""),
        newPassword,
        confirmPassword,
      );
      toast.success(res?.data?.message);
      navigate("/Login");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }

  const handleChange = (e, index) => {
    const value = e.target.value;

    // only number allow
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Next box focus
    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-slate-800">
          Forgot Password
        </h2>

        <p className="text-center text-slate-500 mt-2 mb-8">
          Enter your registered email to receive an OTP.
        </p>

        <div className="relative">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Email Address
          </label>

          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            className="  w-full h-12 px-4 rounded-xl border border-slate-300 outline-none transition duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />

          <button
            disabled={loading}
            onClick={otpSending}
            className="absolute right-4 top-[39px] font-medium text-blue-600 transition duration-200 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:text-gray-400"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>

          {/* enter otp here section */}
          {otpTrigger && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-slate-800 text-center">
                Enter OTP
              </h3>

              <p className="text-sm text-slate-500 text-center mt-2">
                Please enter the 4-digit OTP sent to your email.
              </p>

              <div className="flex justify-center gap-4 mt-8">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    value={digit}
                    maxLength={1}
                    onChange={(e) => handleChange(e, index)}
                    className="w-14 h-14 text-center text-xl font-semibold border border-slate-300 rounded-xl outline-none transition duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                ))}
              </div>

              <button
                type="button"
                disabled={loading2}
                onClick={verifyOtp}
                className={`w-full h-12 mt-8 rounded-xl font-semibold text-white transition-all duration-200 shadow-lg
                                     ${
                                       loading2
                                         ? "bg-slate-400 cursor-not-allowed shadow-none"
                                         : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:scale-[1.01] active:scale-95 shadow-cyan-200/50"
                                     }`}
              >
                {loading2 ? "Verifying..." : "Verify OTP"}
              </button>

              <p className="text-center text-sm text-slate-500 mt-5">
                Didn't receive the OTP?{" "}
                {countDown === 0 ? "Send OTP" : "You can request a new one in "}
                <span className="font-semibold text-blue-600">
                  {countDown === 0 ? "" : `${countDown}s`}
                </span>
              </p>
            </div>
          )}

          {/* new password and confirm password section  */}
          {passwordTrigger && (
            <div className="mt-4">
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    New Password
                  </label>

                  <input
                    id="password"
                    type="text"
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full h-12 px-4 rounded-xl border border-slate-300 outline-none transition duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Confirm Password
                  </label>

                  <input
                    id="confirmPassword"
                    type="text"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full h-12 px-4 rounded-xl border border-slate-300 outline-none transition duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => updatePassword()}
                className="w-full h-12 mt-8 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-200 hover:scale-[1.01] active:scale-95 shadow-lg shadow-cyan-200/50"
              >
                Change Password
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Forgotpassword;
