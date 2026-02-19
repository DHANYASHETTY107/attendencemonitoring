// // import { Link } from "react-router-dom";

// // const Sidebar = () => {
// //   return (
// //     <div className="w-64 bg-blue-700 text-white p-4">
// //       <h2 className="text-xl font-bold mb-6">Attendance</h2>
// //       <nav className="space-y-3">
// //            <ul>   
// //         <li><Link to="/">Dashboard</Link></li>
// //         <li><Link to="/departments">Departments</Link></li>
// //         <li><Link to="/sections">Sections</Link></li>
// //         <li><Link to="/attendance/month">Attendance</Link></li>
// //         <li><Link to="/reports">Reports</Link></li>
// //         </ul> 
        
// //       </nav>
// //     </div>
// //   );
// // };

// // export default Sidebar;
// import { NavLink } from "react-router-dom";

// const teamMembers = [
//   "embstores",
//   "navneet",
//   "Harshad Parmar",
//   "Jigar Patel",
//   "krishnapal",
//   "Manthan Vishwakarma",
//   "Nirav",
//   "Ravi Vaghela",
//   "sandip",
//   "krunal",
//   "HIREN",
//   "Priyanka",
//   "akash",
//   "Priya",
//   "bhumi hirpara",
//   "arpit"
// ];

// const Sidebar = () => {
//   return (
//     <>
//       {/* Icon Sidebar */}
//       <div className="fixed top-16 left-0 w-16 h-[calc(100vh-64px)] bg-white border-r flex flex-col items-center py-6 gap-8">
//         <NavLink
//   to="/"
//   className="cursor-pointer select-none"
// >
//   <span className="text-blue-600 text-xl">🏠</span>
// </NavLink>
//         <span className="text-gray-500 text-xl">👥</span>
//         <span className="text-gray-500 text-xl">📄</span>

//         <div className="mt-auto flex flex-col gap-6 pb-4">
//           <span>👤</span>
//           <span>⚙️</span>
//         </div>
//       </div>

//       {/* Team Sidebar */}
//       <div className="fixed top-16 left-16 w-56 h-[calc(100vh-64px)] bg-gray-50 border-r flex flex-col">
//         {/* Team Header */}
//         <div className="px-4 py-3 border-b">
//           <h3 style={{ color: "red", fontSize: "30px" }}>Team</h3>
//         </div>

//         {/* Scrollable Team List */}
//         <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
//           {teamMembers.map((name, index) => (
//             <div
//               key={index}
//               className="text-base font-medium text-gray-700 hover:text-blue-600 cursor-pointer"
//             >
//               {name}
//             </div>
//           ))}
//         </div>

//         {/* Bottom Icons */}
//         <div className="border-t px-4 py-3 flex justify-center gap-6 text-gray-600">
//           <span>👤</span>
//           <span>⚙️</span>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Sidebar;


import { NavLink } from "react-router-dom";

const teamMembers = [
  { id: 1, name: "embstores" },
  { id: 2, name: "navneet" },
  { id: 3, name: "Harshad Parmar" },
  { id: 4, name: "Jigar Patel" },
  { id: 5, name: "krishnapal" },
  { id: 6, name: "Manthan Vishwakarma" },
  { id: 7, name: "Nirav" },
  { id: 8, name: "Ravi Vaghela" },
  { id: 9, name: "sandip" },
  { id: 10, name: "krunal" },
  { id: 11, name: "HIREN" },
  { id: 12, name: "Priyanka" },
  { id: 13, name: "akash" },
  { id: 14, name: "Priya" },
  { id: 15, name: "bhumi hirpara" },
  { id: 16, name: "arpit" }
];

const Sidebar = () => {
  return (
    <>
      {/* ================= ICON SIDEBAR ================= */}
      <div className="fixed top-16 left-0 w-16 h-[calc(100vh-64px)] bg-white border-r flex flex-col items-center py-6 gap-8 z-40">
        <NavLink to="/" className="text-blue-600 text-xl">
          🏠
        </NavLink>

        <NavLink
          to="/masters/departments"
          className="text-gray-500 text-xl"
        >
          👥
        </NavLink>

        <NavLink to="/reports" className="text-gray-500 text-xl">
          📄
        </NavLink>

        <div className="mt-auto flex flex-col gap-6 pb-4">
          <span className="text-lg cursor-pointer">👤</span>
          <span className="text-lg cursor-pointer">⚙️</span>
        </div>
      </div>

      {/* ================= TEAM SIDEBAR ================= */}
      <div className="fixed top-16 left-16 w-56 h-[calc(100vh-64px)] bg-gray-50 border-r flex flex-col z-30">
        
        {/* Team Header */}
        <div className="px-4 py-3 border-b">
          <h3 className="text-lg font-bold">Team</h3>
        </div>

        {/* Scrollable Team List */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {teamMembers.map((user) => (
            <NavLink
              key={user.id}
              to={`/attendance/${user.id}/month`}
              className={({ isActive }) =>
                `block font-medium cursor-pointer ${
                  isActive ? "text-blue-600" : "text-gray-700"
                } hover:text-blue-600`
              }
            >
              {user.name}
            </NavLink>
          ))}
        </div>

        {/* Bottom Icons */}
        <div className="border-t px-4 py-3 flex justify-center gap-6 text-gray-600">
          <span className="cursor-pointer">👤</span>
          <span className="cursor-pointer">⚙️</span>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
