import { FileText, Home, Settings, User, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

const Sidebar = () => {
  const [employees, setEmployees] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await API.get("/employees");

        if (user?.role === "admin") {
          setEmployees(res.data);
        } else {
          setEmployees(res.data.filter((emp) => emp.id === user?.emp_code));
        }
      } catch (err) {
        console.error("Failed to load employees", err);
      }
    };

    fetchEmployees();
  }, [user?.emp_code, user?.role]);

  return (
    <>
      <div className="fixed top-16 left-0 z-[999] flex h-[calc(100vh-64px)] w-16 flex-col items-center gap-8 border-r bg-white py-6">
        <NavLink
          to="/"
          end
          aria-label="Home"
          className={({ isActive }) =>
            `flex w-full items-center justify-center ${
              isActive ? "text-blue-600" : "text-gray-500 hover:text-blue-600"
            }`
          }
        >
          <Home size={20} />
        </NavLink>

        <NavLink
          to="/masters/departments"
          aria-label="Masters"
          className={({ isActive }) =>
            `flex w-full items-center justify-center ${
              isActive ? "text-blue-600" : "text-gray-500 hover:text-blue-600"
            }`
          }
        >
          <Users size={20} />
        </NavLink>

        <NavLink
          to={`/user/${user?.emp_code}/report`}
          aria-label="Reports"
          className={({ isActive }) =>
            `flex w-full items-center justify-center ${
              isActive ? "text-blue-600" : "text-gray-500 hover:text-blue-600"
            }`
          }
        >
          <FileText size={20} />
        </NavLink>

        <div className="mt-auto flex flex-col gap-6 pb-4">
          <NavLink
            to={`/user/${user?.emp_code}/dashboard`}
            aria-label="Profile"
            className="flex w-full items-center justify-center text-gray-500 hover:text-blue-600"
          >
            <User size={20} />
          </NavLink>

          <NavLink
            to={`/user/${user?.emp_code}/settings`}
            aria-label="Settings"
            className={({ isActive }) =>
              `flex w-full items-center justify-center ${
                isActive ? "text-blue-600" : "text-gray-500 hover:text-blue-600"
              }`
            }
          >
            <Settings size={20} />
          </NavLink>
        </div>
      </div>

      <div className="fixed top-16 left-16 z-[998] flex h-[calc(100vh-64px)] w-56 flex-col border-r bg-gray-50">
        <div className="border-b px-4 py-3">
          <h3 className="text-lg font-bold">Team</h3>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
          {employees.map((emp) => (
            <NavLink
              key={emp.id}
              to={`/user/${emp.id}/dashboard`}
              className={({ isActive }) =>
                `block cursor-pointer font-medium ${
                  isActive
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`
              }
            >
              {emp.name}
            </NavLink>
          ))}
        </div>

        <div className="flex justify-center gap-6 border-t px-4 py-3 text-gray-600">
          <NavLink
            to={`/user/${user?.emp_code}/dashboard`}
            aria-label="Profile"
            className="cursor-pointer hover:text-blue-600"
          >
            <User size={18} />
          </NavLink>

          <NavLink
            to={`/user/${user?.emp_code}/settings`}
            aria-label="Settings"
            className="cursor-pointer hover:text-blue-600"
          >
            <Settings size={18} />
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
