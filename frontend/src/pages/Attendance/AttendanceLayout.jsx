import { NavLink, Outlet, useParams } from "react-router-dom";

const AttendanceLayout = () => {
  const { userId } = useParams();

  return (
    <div>
      {/* Header */}
      <div className="bg-blue-600 text-white px-6 py-4 rounded text-xl font-semibold">
        Attendance – User #{userId}
      </div>

      {/* Tabs */}
      <div className="flex gap-6 mt-4 border-b pb-2">
        <NavLink
          to="day"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-semibold" : "text-gray-600"
          }
        >
          Day
        </NavLink>

        <NavLink
          to="month"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-semibold" : "text-gray-600"
          }
        >
          Month
        </NavLink>

        <NavLink
          to="calendar"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-semibold" : "text-gray-600"
          }
        >
          Calendar
        </NavLink>
      </div>

      {/* Page Content */}
      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  );
};

export default AttendanceLayout;
