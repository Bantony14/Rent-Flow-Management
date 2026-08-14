import { useEffect, useState } from "react";
import { createContext } from "react";
import { getMe } from "../api/authApi";
import { paymentCheck } from "../api/paymentApi";
import toast from "react-hot-toast";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getCurrentUser() {
      try {
        const res = await paymentCheck();
      } catch (error) {
        console.log(error);
      }

      try {
        const res = await getMe();
        setUser(res?.data?.user);
      } catch (error) {
        setUser("");
      } finally {
        setLoading(false);
      }
    }

    getCurrentUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
