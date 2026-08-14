import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { Navigate } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";

function LoginProtection({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to="/tenant/dashboard" />;
  return children;
}

export default LoginProtection;
