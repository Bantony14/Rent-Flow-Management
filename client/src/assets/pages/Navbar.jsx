import { useState } from "react";
import Button from "../components/MyButton";
import { NavLink } from "react-router-dom";
import { userLogout } from "../api/authApi";
import { toast } from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, setUser } = useContext(AuthContext);
  const [logoutModal, setLogoutModal] = useState(false);
  const navigate = useNavigate();

  const logOut = async () => {
    try {
      const res = await userLogout();
      toast.success(res.data.message);
      setUser("");
      navigate("/");
    } catch (error) {
      toast.error(error.data.message);
    }
  };

  return (
    <>
      <nav className="w-full sticky top-0 z-50 backdrop-blur-xl bg-zinc-950/90 border-b border-cyan-500/10 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition duration-300">
              R
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-wide leading-none">
                Rent<span className="text-cyan-400">Flow</span>
              </h1>

              <p className="text-[10px] sm:text-xs text-zinc-400 tracking-widest uppercase">
                Property Management
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-10 text-sm font-medium">
            <li className="relative cursor-pointer text-zinc-300 hover:text-cyan-400 transition duration-300 after:absolute after:left-0 after:-bottom-2 after:h-[2px] after:w-0 after:bg-cyan-400 hover:after:w-full after:transition-all after:duration-300">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "text-cyan-400 font-bold" : "text-white"
                }
              >
                Home
              </NavLink>
            </li>

            <li className="relative cursor-pointer text-zinc-300 hover:text-cyan-400 transition duration-300 after:absolute after:left-0 after:-bottom-2 after:h-[2px] after:w-0 after:bg-cyan-400 hover:after:w-full after:transition-all after:duration-300">
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive ? "text-cyan-400 font-bold" : "text-white"
                }
              >
                About
              </NavLink>
            </li>

            <li className="relative cursor-pointer text-zinc-300 hover:text-cyan-400 transition duration-300 after:absolute after:left-0 after:-bottom-2 after:h-[2px] after:w-0 after:bg-cyan-400 hover:after:w-full after:transition-all after:duration-300">
              <NavLink
                to="/rooms"
                className={({ isActive }) =>
                  isActive ? "text-cyan-400 font-bold" : "text-white"
                }
              >
                Rooms
              </NavLink>
            </li>
          </ul>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <NavLink
              to={user ? "/tenant/dashboard" : "/Login"}
              onClick={() => setMenuOpen(false)}
            >
              <Button className="w-full px-5 py-2.5 rounded-2xl border border-zinc-700 bg-zinc-900/70 hover:bg-zinc-800 hover:border-cyan-500 transition duration-300 text-sm font-medium">
                {user ? "My Portal" : "Login"}
              </Button>
            </NavLink>

            {user && (
              <button
                className="text-amber-500 hover:text-red-500 transition"
                onClick={() => setLogoutModal(true)}
              >
                Logout
              </button>
            )}

            {user?.role === "ADMIN" && (
              <NavLink
                to="/admin/dashboard"
                className="hidden xl:inline-block"
                onClick={() => setMenuOpen(false)}
              >
                <Button className="w-full px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold hover:scale-105 transition duration-300 shadow-xl shadow-cyan-500/30">
                  Dashboard
                </Button>
              </NavLink>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1"
          >
            <span className="w-6 h-[2px] bg-white rounded-full"></span>
            <span className="w-6 h-[2px] bg-white rounded-full"></span>
            <span className="w-6 h-[2px] bg-white rounded-full"></span>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-cyan-500/10 bg-zinc-950/95 backdrop-blur-xl">
            <div className="px-6 py-6 flex flex-col gap-6 ">
              {/* Nav Links */}
              <ul className="flex flex-col gap-5 text-sm font-medium">
                <li className="text-zinc-300 hover:text-cyan-400 transition duration-300 cursor-pointer">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      isActive ? "text-cyan-400 font-bold" : "text-white"
                    }
                  >
                    Home
                  </NavLink>
                </li>

                <li className="text-zinc-300 hover:text-cyan-400 transition duration-300 cursor-pointer">
                  <NavLink
                    to="/about"
                    className={({ isActive }) =>
                      isActive ? "text-cyan-400 font-bold" : "text-white"
                    }
                  >
                    About
                  </NavLink>
                </li>

                <li className="text-zinc-300 hover:text-cyan-400 transition duration-300 cursor-pointer">
                  <NavLink
                    to="/rooms"
                    className={({ isActive }) =>
                      isActive ? "text-cyan-400 font-bold" : "text-white"
                    }
                  >
                    Rooms
                  </NavLink>
                </li>
              </ul>

              {/* Mobile Buttons */}
              <div className="flex flex-col gap-4">
                {user ? (
                  <>
                    <Button
                      onClick={() => setLogoutModal(true)}
                      className="w-full px-5 py-3 rounded-2xl border border-zinc-700 bg-red-900/70 hover:bg-red-800 transition duration-300 text-sm font-medium"
                    >
                      Logout
                    </Button>

                    {/* My Portal */}
                    <NavLink
                      to="/tenant/dashboard"
                      className="inline-block w-full"
                      onClick={() => setMenuOpen(false)}
                    >
                      <Button
                        className="w-full px-5 py-2.5 rounded-2xl border border-zinc-700 bg-zinc-900/70 hover:bg-zinc-800 hover:border-cyan-500 transition duration-300 text-sm font-medium"
                        onClick={() => setMenuOpen(false)}
                      >
                        My Portal
                      </Button>
                    </NavLink>
                  </>
                ) : (
                  <NavLink
                    to="/login"
                    className="inline-block w-full"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Button className="w-full px-5 py-3 rounded-2xl border border-zinc-700 bg-zinc-900/70 hover:bg-zinc-800 hover:border-cyan-500 transition duration-300 text-sm font-medium">
                      Login
                    </Button>
                  </NavLink>
                )}

                {user?.role === "ADMIN" && (
                  <NavLink
                    to="/admin/dashboard"
                    className="block w-full "
                    onClick={() => setMenuOpen(false)}
                  >
                    <Button className="w-full px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold hover:scale-105 transition duration-300 shadow-xl shadow-cyan-500/30">
                      Dashboard
                    </Button>
                  </NavLink>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {logoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
                <span className="text-3xl">🚪</span>
              </div>
            </div>

            <h2 className="mt-5 text-center text-2xl font-bold text-white">
              Sign Out
            </h2>

            <p className="mt-3 text-center text-zinc-400 leading-6">
              Are you sure you want to sign out?
              <br />
              You'll need to sign in again to access your account.
            </p>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setLogoutModal(false)}
                className="flex-1 rounded-xl border border-zinc-700 py-3 font-semibold text-white hover:bg-zinc-800 transition"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setLogoutModal(false);
                  logOut();
                }}
                className="flex-1 rounded-xl bg-red-600 py-3 font-semibold text-white hover:bg-red-700 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
