import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "../../lib/auth/AuthContext";
import { RequireAdmin } from "../../lib/auth/RequireAdmin";
import { AdminLogin } from "../../pages/AdminLogin";
import { app } from "../../styles/app.styles";
import { AdminPanel } from "./AdminPanel";

export default function AdminRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<AdminLogin />} />
        <Route
          path="*"
          element={
            <RequireAdmin>
              <div style={app}>
                <AdminPanel />
              </div>
            </RequireAdmin>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
