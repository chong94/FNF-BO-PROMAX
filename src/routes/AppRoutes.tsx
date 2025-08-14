import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";

function AppRouter() {
  const isLogin = useSelector((state: RootState) => state.auth.isLogin);

  return (
    <BrowserRouter>
      <Routes>
        {/* If logged in, go to Dashboard, otherwise go to Login */}
        <Route
          path="/"
          element={isLogin ? <DashboardPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/dashboard"
          element={isLogin ? <DashboardPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!isLogin ? <LoginPage /> : <Navigate to="/dashboard" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
