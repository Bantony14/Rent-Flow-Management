import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import LoadingScreen from "../components/LoadingScreen";
import { Navigate } from "react-router-dom";

function AdminProtection({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <LoadingScreen />;
  if (user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminProtection;
