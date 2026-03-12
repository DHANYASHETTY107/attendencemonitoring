
// import {
//   NavLink,
//   Outlet,
//   useNavigate,
//   useLocation,
// } from "react-router-dom";
// import { useEffect, useState } from "react";
// import API from "../services/api";

// const MainLayout = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Extract userId from URL: /user/:id/...
//   const pathParts = location.pathname.split("/");
//   const userId = pathParts[1] === "user" ? pathParts[2] : null;

//   // 🔹 Employees from backend
//   const [employees, setEmployees] = useState([]);

//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const res = await API.get("/employees");
//         setEmployees(res.data);
//       } catch (err) {
//         console.error("Failed to load employees", err);
//       }
//     };

//     fetchEmployees();
//   }, []);

//   const logout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 font-sans">
//       {/* ================= TOP NAVBAR ================= */}
//       <nav className="fixed top-0 left-0 right-0 h-16 bg-[#1a73e8] text-white flex items-center px-6 z-50 shadow-md">
//         <div className="font-bold text-xl tracking-tight mr-10 italic">
//           ATTENDANCE
//         </div>

//         <div className="flex gap-1 h-full items-center">
//           <NavLink
//             to={userId ? `/user/${userId}/dashboard` : "/"}
//             className={({ isActive }) =>
//               `px-4 py-2 rounded-md transition flex items-center h-10 ${
//                 isActive
//                   ? "bg-white/20 font-bold border-b-2 border-white"
//                   : "hover:bg-white/10"
//               }`
//             }
//           >
//             Dashboard
//           </NavLink>

//           <NavLink
//             to={userId ? `/user/${userId}/attendance` : "#"}
//             className={({ isActive }) =>
//               `px-4 py-2 rounded-md transition flex items-center h-10 ${
//                 !userId
//                   ? "opacity-40 cursor-not-allowed pointer-events-none"
//                   : isActive
//                   ? "bg-white/20 font-bold border-b-2 border-white"
//                   : "hover:bg-white/10"
//               }`
//             }
//           >
//             Attendance
//           </NavLink>

//           <NavLink
//             to={userId ? `/user/${userId}/url` : "#"}
//             className={({ isActive }) =>
//               `px-4 py-2 rounded-md transition flex items-center h-10 ${
//                 !userId
//                   ? "opacity-40 cursor-not-allowed pointer-events-none"
//                   : isActive
//                   ? "bg-white/20 font-bold border-b-2 border-white"
//                   : "hover:bg-white/10"
//               }`
//             }
//           >
//             URL
//           </NavLink>

//           <NavLink
//             to={userId ? `/user/${userId}/report` : "#"}
//             className={({ isActive }) =>
//               `px-4 py-2 rounded-md transition flex items-center h-10 ${
//                 !userId
//                   ? "opacity-40 cursor-not-allowed pointer-events-none"
//                   : isActive
//                   ? "bg-white/20 font-bold border-b-2 border-white"
//                   : "hover:bg-white/10"
//               }`
//             }
//           >
//             Report
//           </NavLink>

//           <NavLink
//             to="/masters/departments"
//             className={({ isActive }) =>
//               `px-4 py-2 rounded-md transition flex items-center h-10 ${
//                 isActive
//                   ? "bg-white/20 font-bold border-b-2 border-white"
//                   : "hover:bg-white/10"
//               }`
//             }
//           >
//             Masters
//           </NavLink>

//           <button className="px-4 py-2 rounded-md opacity-40 cursor-default h-10">
//             Time Claim
//           </button>
//         </div>

//         <button
//           onClick={logout}
//           className="ml-auto bg-red-500 hover:bg-red-600 px-4 py-1.5 rounded text-sm font-bold shadow-sm transition"
//         >
//           Logout
//         </button>
//       </nav>

//       {/* ================= ICON SIDEBAR ================= */}
//       <aside className="fixed top-16 left-0 w-16 h-[calc(100vh-64px)] bg-white border-r flex flex-col items-center py-6 gap-8 z-40">
//         <NavLink
//           to="/"
//           className={({ isActive }) =>
//             `text-xl transition ${
//               isActive ? "text-blue-600" : "text-gray-400 hover:text-blue-600"
//             }`
//           }
//         >
//           🏠
//         </NavLink>

//         <NavLink
//           to="/masters/departments"
//           className={({ isActive }) =>
//             `text-xl transition ${
//               isActive ? "text-blue-600" : "text-gray-400 hover:text-blue-600"
//             }`
//           }
//         >
//           👥
//         </NavLink>

//         <NavLink
//           to={userId ? `/user/${userId}/report` : "/reports"}
//           className={({ isActive }) =>
//             `text-xl transition ${
//               isActive ? "text-blue-600" : "text-gray-400 hover:text-blue-600"
//             }`
//           }
//         >
//           📄
//         </NavLink>

//         <div className="mt-auto flex flex-col gap-6 pb-4 text-gray-300">
//           <span className="text-lg cursor-pointer hover:text-blue-500">👤</span>
//           <span className="text-lg cursor-pointer hover:text-blue-500">⚙️</span>
//         </div>
//       </aside>

//       {/* ================= TEAM SIDEBAR ================= */}
//       <aside className="fixed top-16 left-16 w-56 h-[calc(100vh-64px)] bg-white border-r flex flex-col z-30 shadow-sm">
//         <div className="px-6 py-4 border-b">
//           <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
//             Team Members
//           </h3>
//         </div>

//         <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
//           {employees.map((emp) => (
//             <NavLink
//               key={emp.id}
//               to={`/user/${emp.id}/dashboard`}
//               className={({ isActive }) =>
//                 `block px-4 py-2 rounded-lg text-sm font-bold transition-all ${
//                   isActive
//                     ? "bg-blue-50 text-blue-700 shadow-sm"
//                     : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
//                 }`
//               }
//             >
//               {emp.name}
//             </NavLink>
//           ))}
//         </div>
//       </aside>

//       {/* ================= MAIN CONTENT ================= */}
//       <main className="ml-72 pt-16 min-h-screen">
//         <div className="p-8 max-w-[1600px] mx-auto">
//           <Outlet />
//         </div>
//       </main>
//     </div>
//   );
// };

// export default MainLayout;
import {
  NavLink,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 Logged in user
  const user = JSON.parse(localStorage.getItem("user"));

  // Extract userId from URL
  const pathParts = location.pathname.split("/");
  const userId = pathParts[1] === "user" ? pathParts[2] : null;

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await API.get("/employees");

        // ADMIN → all employees
        if (user?.role === "admin") {
          setEmployees(res.data);
        }

        // EMPLOYEE → only themselves
        else {
          const own = res.data.filter(emp => emp.id === user?.emp_code);
          setEmployees(own);
        }

      } catch (err) {
        console.error("Failed to load employees", err);
      }
    };

    fetchEmployees();
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ================= TOP NAVBAR ================= */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-[#1a73e8] text-white flex items-center px-6 z-50 shadow-md">

        <div className="font-bold text-xl tracking-tight mr-10 italic">
          ATTENDANCE
        </div>

        <div className="flex gap-1 h-full items-center">

          <NavLink
            to={userId ? `/user/${userId}/dashboard` : "/"}
            className={({ isActive }) =>
              `px-4 py-2 rounded-md transition flex items-center h-10 ${
                isActive
                  ? "bg-white/20 font-bold border-b-2 border-white"
                  : "hover:bg-white/10"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to={userId ? `/user/${userId}/attendance` : "#"}
            className={({ isActive }) =>
              `px-4 py-2 rounded-md transition flex items-center h-10 ${
                !userId
                  ? "opacity-40 cursor-not-allowed pointer-events-none"
                  : isActive
                  ? "bg-white/20 font-bold border-b-2 border-white"
                  : "hover:bg-white/10"
              }`
            }
          >
            Attendance
          </NavLink>

          {/* URL page → ADMIN only */}
          {user?.role === "admin" && (
            <NavLink
              to={userId ? `/user/${userId}/url` : "#"}
              className={({ isActive }) =>
                `px-4 py-2 rounded-md transition flex items-center h-10 ${
                  !userId
                    ? "opacity-40 cursor-not-allowed pointer-events-none"
                    : isActive
                    ? "bg-white/20 font-bold border-b-2 border-white"
                    : "hover:bg-white/10"
                }`
              }
            >
              URL
            </NavLink>
          )}

          <NavLink
            to={userId ? `/user/${userId}/report` : "#"}
            className={({ isActive }) =>
              `px-4 py-2 rounded-md transition flex items-center h-10 ${
                !userId
                  ? "opacity-40 cursor-not-allowed pointer-events-none"
                  : isActive
                  ? "bg-white/20 font-bold border-b-2 border-white"
                  : "hover:bg-white/10"
              }`
            }
          >
            Report
          </NavLink>

          {/* Masters → ADMIN only */}
          {user?.role === "admin" && (
            <NavLink
              to="/masters/departments"
              className={({ isActive }) =>
                `px-4 py-2 rounded-md transition flex items-center h-10 ${
                  isActive
                    ? "bg-white/20 font-bold border-b-2 border-white"
                    : "hover:bg-white/10"
                }`
              }
            >
              Masters
            </NavLink>
          )}

          {/* Time Claim → ADMIN only */}
          {user?.role === "admin" && (
            <button className="px-4 py-2 rounded-md opacity-80 hover:bg-white/10 h-10">
              Time Claim
            </button>
          )}
        </div>

        <button
          onClick={logout}
          className="ml-auto bg-red-500 hover:bg-red-600 px-4 py-1.5 rounded text-sm font-bold shadow-sm transition"
        >
          Logout
        </button>
      </nav>

      {/* ================= ICON SIDEBAR ================= */}
      <aside className="fixed top-16 left-0 w-16 h-[calc(100vh-64px)] bg-white border-r flex flex-col items-center py-6 gap-8 z-40">

        <NavLink
          to="/"
          className={({ isActive }) =>
            `text-xl transition ${
              isActive ? "text-blue-600" : "text-gray-400 hover:text-blue-600"
            }`
          }
        >
          🏠
        </NavLink>

        {/* Masters icon → ADMIN only */}
        {user?.role === "admin" && (
          <NavLink
            to="/masters/departments"
            className={({ isActive }) =>
              `text-xl transition ${
                isActive
                  ? "text-blue-600"
                  : "text-gray-400 hover:text-blue-600"
              }`
            }
          >
            👥
          </NavLink>
        )}

        <NavLink
          to={userId ? `/user/${userId}/report` : "/reports"}
          className={({ isActive }) =>
            `text-xl transition ${
              isActive
                ? "text-blue-600"
                : "text-gray-400 hover:text-blue-600"
            }`
          }
        >
          📄
        </NavLink>

        <div className="mt-auto flex flex-col gap-6 pb-4 text-gray-300">
          <span className="text-lg cursor-pointer hover:text-blue-500">👤</span>
          <span className="text-lg cursor-pointer hover:text-blue-500">⚙️</span>
        </div>
      </aside>

      {/* ================= TEAM SIDEBAR ================= */}
      <aside className="fixed top-16 left-16 w-56 h-[calc(100vh-64px)] bg-white border-r flex flex-col z-30 shadow-sm">

        <div className="px-6 py-4 border-b">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
            Team Members
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
          {employees.map((emp) => (
            <NavLink
              key={emp.id}
              to={`/user/${emp.id}/dashboard`}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-700 shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`
              }
            >
              {emp.name}
            </NavLink>
          ))}
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="ml-72 pt-16 min-h-screen">
        <div className="p-8 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default MainLayout;