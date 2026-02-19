import { NavLink, Outlet } from "react-router-dom";

const tabBase =
  "px-4 py-2 font-medium border-b-2 transition-colors duration-200";

const MastersLayout = () => {
  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-6 border-b mb-6">
        <NavLink
          to="departments"
          end
          className={({ isActive }) =>
            isActive
              ? `${tabBase} border-blue-600 text-blue-600`
              : `${tabBase} border-transparent text-gray-500 hover:text-blue-600`
          }
        >
          Department
        </NavLink>

        <NavLink
          to="sections"
          className={({ isActive }) =>
            isActive
              ? `${tabBase} border-blue-600 text-blue-600`
              : `${tabBase} border-transparent text-gray-500 hover:text-blue-600`
          }
        >
          Section
        </NavLink>
      </div>

      {/* Render Department / Section */}
      <Outlet />
    </div>
  );
};

export default MastersLayout;
