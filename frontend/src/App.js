
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Departments from "./pages/Masters/Departments";
import Sections from "./pages/Masters/Sections";
import Month from "./pages/Attendance/Month";
import Day from "./pages/Attendance/Day";
import Calendar from "./pages/Attendance/Calender";
import Reports from "./pages/Reports";

import MainLayout from "./layout/MainLayout";
import MastersLayout from "./pages/Masters/MastersLayout";
import AttendanceLayout from "./pages/Attendance/AttendanceLayout";

// 🔐 Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Layout Wrapper */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route index element={<Dashboard />} />

          {/* Masters with Tabs */}
          <Route path="masters" element={<MastersLayout />}>
  <Route index element={<Navigate to="departments" />} />
  <Route path="departments" element={<Departments />} />
  <Route path="sections" element={<Sections />} />
</Route>

          <Route path="attendance/:userId" element={<AttendanceLayout />}>
  <Route index element={<Month />} />
  <Route path="day" element={<Day />} />
  <Route path="month" element={<Month />} />
  <Route path="calendar" element={<Calendar />} />
</Route>



          {/* Reports */}
          <Route path="reports" element={<Reports />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
