import { NavLink, Outlet, useParams } from "react-router-dom";

const AttendanceLayout = () => {
  const { userId } = useParams();

  return (
    <div className="space-y-4">
      <div className="rounded bg-blue-600 px-4 py-4 text-lg font-semibold text-white sm:px-6 sm:text-xl">
        Attendance - User #{userId}
      </div>

      <div className="flex flex-wrap gap-4 border-b pb-2 sm:gap-6">
        <NavLink
          to="day"
          className={({ isActive }) =>
            isActive ? "font-semibold text-blue-600" : "text-gray-600"
          }
        >
          Day
        </NavLink>

        <NavLink
          to="month"
          className={({ isActive }) =>
            isActive ? "font-semibold text-blue-600" : "text-gray-600"
          }
        >
          Month
        </NavLink>

        <NavLink
          to="calendar"
          className={({ isActive }) =>
            isActive ? "font-semibold text-blue-600" : "text-gray-600"
          }
        >
          Calendar
        </NavLink>
      </div>

      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  );
};

export default AttendanceLayout;
