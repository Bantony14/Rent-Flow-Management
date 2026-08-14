import About from "./assets/pages/About";
import Registration from "./assets/pages/AdminPages/Registration";
import Home from "./assets/pages/Home";
import { Routes, Route } from "react-router-dom";
import LayoutWithNavAndFooter from "./assets/layout/LayoutWithNavAndFooter";
import LayoutWithNavOnly from "./assets/layout/LayoutWithNavOnly";
import ScrollToTop from "./assets/components/ScrollToTop";
import Login from "./assets/pages/login";
import TenantDashboard from "./assets/pages/TenantPages/TenantDashboard";
import ProtectedRoute from "./assets/routes/ProtectedRoute";
import AdminDashboard from "./assets/pages/AdminPages/AdminDashboard";
import AllTenants from "./assets/pages/AdminPages/AllTenants";
import UserInfoCard from "./assets/pages/AdminPages/UserInfo";
import PaymentSuccess from "./assets/components/paymentPage/PaymentSuccess.jsx";
import PaymentFailed from "./assets/components/paymentPage/PaymentFailed";
import TenantProfile from "./assets/pages/TenantPages/TenantProfile.jsx";
import Forgotpassword from "./assets/pages/ForgotPassword.jsx";
import { Receipt } from "lucide-react";
import ReceiptHistory from "./assets/pages/TenantPages/Receipt.jsx";
import AdminProtection from "./assets/routes/AdminProtection.jsx";
import LoginProtection from "./assets/routes/LoginProtection.jsx";
import RoomDetails from "./assets/pages/RoomDetail.jsx";
import AllRoom from "./assets/pages/AdminPages/AllRoom.jsx";
import Properties from "./assets/pages/Properties.jsx";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* this route with navbar and footer */}
        <Route element={<LayoutWithNavAndFooter />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/room/:id" element={<RoomDetails />} />
          <Route path="/rooms" element={<Properties />} />
        </Route>

        {/* this route with navbar only */}
        <Route element={<LayoutWithNavOnly />}>
          {/* this is a only route user and admin both cannot access after login  */}

          <Route
            path="/login"
            element={
              <LoginProtection>
                <Login />
              </LoginProtection>
            }
          />

          {/* ========================PROTECTED ROUTE FOR ADMIN================================ */}

          {/* this all route below only for admin user cannot access this route  */}
          <Route
            path="/registration"
            element={
              <AdminProtection>
                <Registration />
              </AdminProtection>
            }
          />

          <Route
            path="/allroom"
            element={
              <AdminProtection>
                <AllRoom />
              </AdminProtection>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <AdminProtection>
                <AdminDashboard />
              </AdminProtection>
            }
          />
          <Route
            path="/all-tenants"
            element={
              <AdminProtection>
                <AllTenants />
              </AdminProtection>
            }
          />
          <Route
            path="/view-tenant-detail/:tenantid"
            element={
              <AdminProtection>
                <UserInfoCard />
              </AdminProtection>
            }
          />

          {/* THIS ROUTE FOR FORGOT PASSWORD WITHOUT ANY PROTECTION */}
          <Route path="/forgot-password" element={<Forgotpassword />} />

          {/* ========================PROTECTED ROUTE FOR USER================================ */}
          {/* this below all route is for user or tenant */}

          <Route
            path="/payment-success"
            element={
              <ProtectedRoute>
                <PaymentSuccess />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment-failed"
            element={
              <ProtectedRoute>
                <PaymentFailed />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tenant/dashboard"
            element={
              <ProtectedRoute>
                <TenantDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tenant/profile"
            element={
              <ProtectedRoute>
                <TenantProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/receipt"
            element={
              <ProtectedRoute>
                <ReceiptHistory />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
