
// import { NavLink } from "react-router-dom";
// import { useEffect, useState } from "react";
// import API from "../services/api";

// const Sidebar = () => {
//   const [employees, setEmployees] = useState([]);

//   // 🔹 Get logged-in user
//   const user = JSON.parse(localStorage.getItem("user"));

//   // 🔹 Fetch employees from backend
//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const res = await API.get("/employees");

//         // ADMIN → show all employees
//         if (user?.role === "admin") {
//           setEmployees(res.data);
//         }

//         // EMPLOYEE → show only their own record
//         else {
//           const own = res.data.filter(emp => emp.id === user?.emp_code);
//           setEmployees(own);
//         }

//       } catch (err) {
//         console.error("Failed to load employees", err);
//       }
//     };

//     fetchEmployees();
//   }, []);

//   return (
//     <>
//       {/* ========== ICON SIDEBAR ========== */}
//       <div className="fixed top-16 left-0 w-16 h-[calc(100vh-64px)] bg-white border-r 
//                       flex flex-col items-center py-6 gap-8 z-40">

//         <NavLink
//           to="/"
//           end
//           className={({ isActive }) =>
//             `text-xl ${isActive ? "text-blue-600" : "text-gray-500"}`
//           }
//         >
//           🏠
//         </NavLink>

//         <NavLink
//           to="/masters/departments"
//           className={({ isActive }) =>
//             `text-xl ${isActive ? "text-blue-600" : "text-gray-500"}`
//           }
//         >
//           👥
//         </NavLink>

//         <NavLink
//           to="/reports"
//           className={({ isActive }) =>
//             `text-xl ${isActive ? "text-blue-600" : "text-gray-500"}`
//           }
//         >
//           📄
//         </NavLink>

//         <div className="mt-auto flex flex-col gap-6 pb-4 text-gray-500">
//           <span className="cursor-pointer text-lg">👤</span>
//           <span className="cursor-pointer text-lg">⚙️</span>
//         </div>
//       </div>

//       {/* ========== TEAM SIDEBAR ========== */}
//       <div className="fixed top-16 left-16 w-56 h-[calc(100vh-64px)] 
//                       bg-gray-50 border-r flex flex-col z-30">

//         <div className="px-4 py-3 border-b">
//           <h3 className="text-lg font-bold">Team</h3>
//         </div>

//         {/* 🔹 Dynamic Employee List */}
//         <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
//           {employees.map((emp) => (
//             <NavLink
//               key={emp.id}
//               to={`/user/${emp.id}/dashboard`}
//               className={({ isActive }) =>
//                 `block font-medium cursor-pointer ${
//                   isActive
//                     ? "text-blue-600"
//                     : "text-gray-700 hover:text-blue-600"
//                 }`
//               }
//             >
//               {emp.name}
//             </NavLink>
//           ))}
//         </div>

//         <div className="border-t px-4 py-3 flex justify-center gap-6 text-gray-600">
//           <span className="cursor-pointer">👤</span>
//           <span className="cursor-pointer">⚙️</span>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Sidebar;
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

const Sidebar = () => {
  const [employees, setEmployees] = useState([]);

  // 🔹 Get logged-in user
  const user = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();

  // 🔹 Fetch employees from backend
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await API.get("/employees");

        if (user?.role === "admin") {
          setEmployees(res.data);
        } else {
          const own = res.data.filter(emp => emp.id === user?.emp_code);
          setEmployees(own);
        }

      } catch (err) {
        console.error("Failed to load employees", err);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <>
      {/* ========== ICON SIDEBAR ========== */}
      <div className="fixed top-16 left-0 w-16 h-[calc(100vh-64px)] bg-white border-r 
                      flex flex-col items-center py-6 gap-8 z-[999] pointer-events-auto">

        {/* HOME */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `text-xl flex items-center justify-center w-full ${
              isActive ? "text-blue-600" : "text-gray-500 hover:text-blue-600"
            }`
          }
        >
          🏠
        </NavLink>

        {/* MASTERS */}
        <NavLink
          to="/masters/departments"
          className={({ isActive }) =>
            `text-xl flex items-center justify-center w-full ${
              isActive ? "text-blue-600" : "text-gray-500 hover:text-blue-600"
            }`
          }
        >
          👥
        </NavLink>

        {/* REPORT */}
        <NavLink
          to={`/user/${user?.emp_code}/report`}
          className={({ isActive }) =>
            `text-xl flex items-center justify-center w-full ${
              isActive ? "text-blue-600" : "text-gray-500 hover:text-blue-600"
            }`
          }
        >
          📄
        </NavLink>

        {/* PROFILE + SETTINGS */}
        <div className="mt-auto flex flex-col gap-6 pb-4 text-gray-500">

          {/* PROFILE */}
          <NavLink
            to={`/user/${user?.emp_code}/dashboard`}
            className="cursor-pointer text-lg flex items-center justify-center w-full hover:text-blue-600"
          >
            👤
          </NavLink>

          {/* SETTINGS */}
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `text-lg flex items-center justify-center w-full ${
                isActive ? "text-blue-600" : "text-gray-500 hover:text-blue-600"
              }`
            }
          >
            ⚙️
          </NavLink>

        </div>
      </div>

      {/* ========== TEAM SIDEBAR ========== */}
      <div className="fixed top-16 left-16 w-56 h-[calc(100vh-64px)] 
                      bg-gray-50 border-r flex flex-col z-[998]">

        <div className="px-4 py-3 border-b">
          <h3 className="text-lg font-bold">Team</h3>
        </div>

        {/* 🔹 Dynamic Employee List */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {employees.map((emp) => (
            <NavLink
              key={emp.id}
              to={`/user/${emp.id}/dashboard`}
              className={({ isActive }) =>
                `block font-medium cursor-pointer ${
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

        <div className="border-t px-4 py-3 flex justify-center gap-6 text-gray-600">

          <NavLink
            to={`/user/${user?.emp_code}/dashboard`}
            className="cursor-pointer hover:text-blue-600"
          >
            👤
          </NavLink>

          <NavLink
  to={`/user/${user?.emp_code}/settings`}
  className="cursor-pointer"
>
  ⚙️
</NavLink>

        </div>
      </div>
    </>
  );
};

export default Sidebar;