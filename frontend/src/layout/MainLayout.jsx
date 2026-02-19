// import { NavLink, Outlet, useNavigate } from "react-router-dom";

// const MainLayout = () => {
//   const navigate = useNavigate();

//   const logout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Top Navbar */}
//       <div className="bg-blue-600 text-white px-6 py-3 flex gap-6 items-center">
//         <NavLink to="/masters/departments">Masters</NavLink>
//         <NavLink to="/">Dashboard</NavLink>
//         <NavLink to="/attendance/month">Attendance</NavLink>
//         <NavLink to="">URL</NavLink>
//         <NavLink to="/reports">Report</NavLink>
//         <NavLink to="">Time Taken</NavLink>


//         <button
//           onClick={logout}
//           className="ml-auto bg-red-500 px-3 py-1 rounded"
//         >
//           Logout
//         </button>
//       </div>

//       {/* THIS IS IMPORTANT */}
//       <div className="p-6">
//         <Outlet />
//       </div>
//     </div>
//   );
// };

// export default MainLayout;
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const MainLayout = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ================= TOP NAVBAR ================= */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-blue-600 text-white flex items-center px-6 gap-6 z-50">
        <NavLink to="/masters/departments" className="font-semibold">
          Masters
        </NavLink>
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/attendance/month">Attendance</NavLink>
        <NavLink to="/reports">Report</NavLink>
        <NavLink to="#">Time Claim</NavLink>

        <button
          onClick={logout}
          className="ml-auto bg-red-500 px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>

      {/* ================= ICON SIDEBAR ================= */}
      {/* ================= ICON SIDEBAR ================= */}
<div
  className="fixed top-16 left-0 w-16 h-[calc(100vh-64px)] bg-white border-r
             flex flex-col items-center py-6 gap-8
             z-40"
>
  <NavLink
    to="/"
    className="text-blue-600 text-xl cursor-pointer"
  >
    🏠
  </NavLink>

  <NavLink
    to="/masters/departments"
    className="text-gray-500 text-xl cursor-pointer"
  >
    👥
  </NavLink>

  <NavLink
    to="/reports"
    className="text-gray-500 text-xl cursor-pointer"
  >
    📄
  </NavLink>

  <div className="mt-auto flex flex-col gap-6 pb-4">
    <span className="text-lg cursor-pointer">👤</span>
    <span className="text-lg cursor-pointer">⚙️</span>
  </div>
</div>

      {/* ================= TEAM SIDEBAR ================= */}
      <div className="fixed top-16 left-16 w-56 h-[calc(100vh-64px)] bg-gray-50 border-r 
                px-4 py-4
                z-30 pointer-events-auto">
        
        {/* Team Heading */}
        <h3 className="text-lg font-bold mb-4">
          Team
        </h3>

        {/* Scrollable Team List */}
        <div className="flex-1 overflow-y-auto space-y-3 text-base pr-1">
          {[
            "embstores",
            "navneet",
            "Harshad Parmar",
            "Jigar Patel",
            "krishnapal",
            "Manthan Vishwakarma",
            "Nirav",
            "Ravi Vaghela",
            "sandip",
            "krunal",
            "HIREN",
            "Priyanka",
            "akash",
            "Priya",
            "bhumi hirpara",
            "arpit"
          ].map((name, i) => (
            <div
              key={i}
              className="cursor-pointer hover:text-blue-600 font-medium"
            >
              {name}
            </div>
          ))}
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="ml-72 pt-16 px-8">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;


