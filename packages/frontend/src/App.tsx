import { Routes, Route, Navigate } from "react-router-dom";

import Portal from "./pages/Portal";

import Dashboard from "./pages/dashboard/Dashboard";

import AuthWrapper from "./pages/auth/AuthWrapper";
import Login from "./pages/auth/Login";
import LoginCallback from "./pages/auth/LoginCallback";
import Logout from "./pages/auth/Logout";
import LogoutCallback from "./pages/auth/LogoutCallback";
import Register from "./pages/auth/Register";
import ConfirmSignUp from "./pages/auth/ConfirmSignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ConfirmNewPassword from "./pages/auth/ConfirmNewPassword";

function App() {
  return (
    <Routes>
      {/* IF AUTHENTICATED */}
      <Route path="/" element={<Portal />}>
        <Route path="/" element={<Redirect />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      {/* IF NOT AUTHENTICATED */}
      <Route path="/" element={<AuthWrapper />}>
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="login" element={<Login />} />
        <Route path="login/callback" element={<LoginCallback />} />
        <Route path="logout" element={<Logout />} />
        <Route path="logout/callback" element={<LogoutCallback />} />
        <Route path="register" element={<Register />} />
        <Route path="confirm-account" element={<ConfirmSignUp />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="confirm-password" element={<ConfirmNewPassword />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
}

export default App;

// I use this component to redirect to other specific pages
// based on users recent activity.
const Redirect = () => {
  return <Navigate replace to="/dashboard" />;
};
