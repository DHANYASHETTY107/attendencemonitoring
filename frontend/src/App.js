
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Departments from "./pages/Masters/Departments";
import Sections from "./pages/Masters/Sections";
import Month from "./pages/Attendance/Month";
import Day from "./pages/Attendance/Day";
import Calendar from "./pages/Attendance/Calender"; // Note: ensure spelling matches your file
import Reports from "./pages/Reports";
import UserDashboard from "./pages/UserDashboard";
import UrlUsage from "./pages/UrlUsage";

// Layouts
import MainLayout from "./layout/MainLayout";
import MastersLayout from "./pages/Masters/MastersLayout";
import AttendanceLayout from "./pages/Attendance/AttendanceLayout";

// 🔐 Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  // Change to true for development if you don't have login logic ready yet
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
  <Routes>
    {/* PUBLIC ROUTE */}
    <Route path="/login" element={<Login />} />

    {/* PROTECTED ROUTES */}
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }
    >
      {/* 1. Admin/General Dashboard (Home) */}
      <Route index element={<Dashboard />} />

      {/* 2. Specific User Section */}
      <Route path="user/:userId">
        <Route index element={<Navigate to="dashboard" replace />} />
        
        {/* User Dashboard */}
        <Route path="dashboard" element={<UserDashboard />} />
        
        {/* --- MOVED THESE INSIDE user/:userId --- */}
        <Route path="report" element={<Reports />} />
        <Route path="url" element={<UrlUsage />} />
        {/* --------------------------------------- */}

        {/* User Attendance */}
        <Route path="attendance" element={<AttendanceLayout />}>
          <Route index element={<Navigate to="month" replace />} />
          <Route path="day" element={<Day />} />
          <Route path="day/:date" element={<Day />} />
          <Route path="month" element={<Month />} />
          <Route path="calendar" element={<Calendar />} />
        </Route>
      </Route>

      {/* 3. Masters Management */}
      <Route path="masters" element={<MastersLayout />}>
        <Route index element={<Navigate to="departments" replace />} />
        <Route path="departments" element={<Departments />} />
        <Route path="sections" element={<Sections />} />
      </Route>

    </Route>

    {/* FALLBACK */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
</BrowserRouter>
  );
}

export default App;