import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { userLogin } from "../api/authApi";
import { AuthContext } from "../context/authContext";

function Login() {
  const initialState = {
    email: "",
    password: "",
  };

  const navigate = useNavigate();
  const strongEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(AuthContext);

  const validation = {
    email: !strongEmail.test(formData.email),
  };

  const input = [
    {
      type: "email",
      name: "email",
      PlaceHolder: "Enter your email",
    },
    {
      type: "password",
      name: "password",
      minlength: 8,
      PlaceHolder: "Enter your password",
    },
  ];

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!strongEmail.test(formData.email)) {
      return;
    }

    try {
      setLoading(true);
      const response = await userLogin(formData);

      setUser(response.data.user);
      toast.success(response.data.message);
      setFormData(initialState);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center px-4 py-6 sm:py-10">
      <form
        onSubmit={handleSubmit}
        className="
          w-full
          max-w-sm
          sm:max-w-md
          p-5
          sm:p-8
          bg-white
          rounded-2xl
          border
          border-gray-200
          shadow-lg
          shadow-gray-200/60
        "
      >
        {/* Title */}
        <div className="mb-6 text-center">
          <h1 className="text-xl sm:text-3xl font-bold text-gray-800">
            Login Tenant
          </h1>

          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Enter your credentials to continue
          </p>
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-5">
          {input.map((value, index) => (
            <div key={index} className="relative">
              <input
                type={
                  value.type === "password"
                    ? showPassword
                      ? "text"
                      : "password"
                    : value.type
                }
                name={value.name}
                value={formData[value.name]}
                onChange={handleChange}
                placeholder={value.PlaceHolder}
                minLength={value.name === "password" ? 8 : undefined}
                required
                className="
                  w-full
                  h-11
                  sm:h-12
                  px-4
                  border
                  border-gray-300
                  rounded-xl
                  outline-none
                  text-sm
                  sm:text-base
                  text-gray-700
                  placeholder:text-gray-400
                  transition-all
                  duration-200
                  focus:border-cyan-500
                  focus:ring-4
                  focus:ring-cyan-100
                "
              />

              {value.name === "email" &&
                validation[value.name] &&
                formData[value.name] && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    ⚠ Invalid email address
                  </p>
                )}

              {value.name === "password" && (
                <button
                  type="button"
                  className="
                    absolute
                    right-4
                    top-3
                    sm:top-3.5
                    text-gray-500
                    hover:text-cyan-600
                    transition
                  "
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              )}
            </div>
          ))}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="
                text-xs
                sm:text-sm
                text-cyan-600
                hover:text-cyan-700
                hover:underline
              "
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              h-11
              sm:h-12
              rounded-xl
              font-semibold
              text-sm
              sm:text-base
              text-white
              bg-gradient-to-r
              from-blue-600
              to-cyan-500
              transition-all
              duration-200
              hover:scale-[1.01]
              active:scale-95
              shadow-lg
              shadow-cyan-200/50
              disabled:opacity-70
              disabled:cursor-not-allowed
              disabled:hover:scale-100
            "
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
