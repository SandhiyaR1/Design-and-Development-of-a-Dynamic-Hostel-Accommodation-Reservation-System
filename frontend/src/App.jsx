import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import Availability from "./components/Availability";
import ReservationHistory from "./components/ReservationHistory";

// Protected Route Component
function ProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
  if (!user.regNo) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// Admin Route Component
function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
  if (!user.regNo) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

export default function App() {
  const [user, setUser] = useState(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    return storedUser;
  });

  // Listen for storage changes to update user
  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      setUser(storedUser);
      console.log("User updated:", storedUser);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {user?.role === "ADMIN" ? <AdminDashboard /> : <Dashboard />}
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/availability"
          element={
            <ProtectedRoute>
              <Availability />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <ReservationHistory />
            </ProtectedRoute>
          }
        />
        
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

