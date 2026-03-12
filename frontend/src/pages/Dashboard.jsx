
import React, { useEffect, useState } from "react";
import API from "../services/api";

const Dashboard = () => {

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {

        const res = await API.get("/attendance/month-summary");
        setData(res.data);

      } catch (err) {
        console.error("Dashboard summary error:", err);
      }
    };

    fetchSummary();
  }, []);

  return (

    <div className="space-y-6">

      <h1 className="text-3xl font-bold text-blue-900">
        Attendance Summary (Nov & Dec)
      </h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-50 text-gray-500 text-sm uppercase">

            <tr>

              <th className="p-4 text-left">Employee</th>

              <th className="p-4 text-center">Nov Present</th>
              <th className="p-4 text-center">Nov Absent</th>

              <th className="p-4 text-center">Dec Present</th>
              <th className="p-4 text-center">Dec Absent</th>

            </tr>

          </thead>

          <tbody>

            {data.map((emp, i) => (

              <tr key={i} className="border-t hover:bg-gray-50">

                <td className="p-4 font-semibold">{emp.name}</td>

                <td className="p-4 text-center text-green-600 font-bold">
                  {emp.nov_present}
                </td>

                <td className="p-4 text-center text-red-500 font-bold">
                  {emp.nov_absent}
                </td>

                <td className="p-4 text-center text-green-600 font-bold">
                  {emp.dec_present}
                </td>

                <td className="p-4 text-center text-red-500 font-bold">
                  {emp.dec_absent}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );
};

export default Dashboard;
// import React, { useEffect, useState } from "react";
// import { Users, CalendarCheck, CalendarX, TrendingUp, ChevronRight } from "lucide-react";
// import API from "../services/api";

// const Dashboard = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchSummary = async () => {
//       try {
//         const res = await API.get("/attendance/month-summary");
//         setData(res.data);
//       } catch (err) {
//         console.error("Dashboard summary error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSummary();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex h-96 items-center justify-center">
//         <div className="text-2xl font-bold text-blue-600 animate-bounce">
//           Loading Data...
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-10 animate-in fade-in duration-700 pb-12 px-2">
      
//       {/* 1. LARGE HEADER SECTION */}
//       <div className="flex flex-col md:flex-row justify-between items-end gap-6">
//         <div>
//           <h1 className="text-5xl font-black text-slate-900 tracking-tight">
//             Attendance Summary
//           </h1>
//           <p className="text-xl text-slate-500 font-medium mt-2 flex items-center gap-3">
//             <TrendingUp size={24} className="text-emerald-500" /> 
//             Monthly performance overview for all staff
//           </p>
//         </div>
        
//         <div className="bg-white px-8 py-5 rounded-3xl shadow-xl border border-slate-100 flex items-center gap-5">
//             <div className="p-3 bg-blue-100 text-blue-700 rounded-2xl shadow-inner">
//                 <Users size={32}/>
//             </div>
//             <div>
//                 <p className="text-xs uppercase font-black text-slate-400 tracking-widest">Total Staff</p>
//                 <p className="text-3xl font-black text-slate-800 leading-none mt-1">{data.length}</p>
//             </div>
//         </div>
//       </div>

//       {/* 2. ENHANCED DATA TABLE */}
//       <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/10 border border-slate-100 overflow-hidden">
        
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse">
//             <thead>
//               {/* Top Grouping Header */}
//               <tr className="bg-slate-50/80">
//                 <th className="p-8 text-left w-1/3"></th>
//                 <th colSpan="2" className="py-6 text-center text-sm font-black uppercase tracking-[0.4em] text-blue-600 border-x border-slate-100 bg-blue-50/30">
//                   November 2025
//                 </th>
//                 <th colSpan="2" className="py-6 text-center text-sm font-black uppercase tracking-[0.4em] text-indigo-600 bg-indigo-50/30">
//                   December 2025
//                 </th>
//               </tr>
              
//               {/* Sub-Header */}
//               <tr className="bg-white border-b border-slate-100 text-slate-400 text-xs font-black uppercase tracking-widest">
//                 <th className="px-10 py-5 text-left">Employee Name</th>
//                 <th className="px-6 py-5 text-center border-l border-slate-50">Present</th>
//                 <th className="px-6 py-5 text-center text-rose-500/70">Absent</th>
//                 <th className="px-6 py-5 text-center border-l border-slate-100 text-emerald-600">Present</th>
//                 <th className="px-6 py-5 text-center text-rose-500/70">Absent</th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-slate-50">
//               {data.map((emp, i) => (
//                 <tr key={i} className="hover:bg-slate-50/80 transition-all group">
                  
//                   {/* Big Name and Big Avatar */}
//                   <td className="px-10 py-6">
//                     <div className="flex items-center gap-6">
//                         <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-100 to-white text-slate-400 border border-slate-100 flex items-center justify-center text-lg font-black group-hover:from-blue-600 group-hover:to-blue-500 group-hover:text-white group-hover:rotate-3 transition-all shadow-sm">
//                             {emp.name.substring(0, 2).toUpperCase()}
//                         </div>
//                         <span className="text-2xl font-bold text-slate-800 group-hover:text-blue-700 transition-colors capitalize">
//                             {emp.name.replace(/_/g, ' ')}
//                         </span>
//                     </div>
//                   </td>

//                   {/* November Values - Big Text */}
//                   <td className="px-6 py-6 text-center border-l border-slate-50/50 bg-emerald-50/10">
//                     <div className="inline-flex items-center justify-center w-16 h-12 bg-emerald-100 text-emerald-800 rounded-2xl font-black text-xl shadow-sm border border-emerald-200">
//                         {emp.nov_present}
//                     </div>
//                   </td>
//                   <td className="px-6 py-6 text-center">
//                     <div className={`inline-flex items-center justify-center w-16 h-12 rounded-2xl font-black text-xl shadow-sm border ${emp.nov_absent > 5 ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
//                         {emp.nov_absent}
//                     </div>
//                   </td>

//                   {/* December Values - Big Text */}
//                   <td className="px-6 py-6 text-center border-l border-slate-100 bg-blue-50/10">
//                     <div className="inline-flex items-center justify-center w-16 h-12 bg-blue-100 text-blue-800 rounded-2xl font-black text-xl shadow-sm border border-blue-200">
//                         {emp.dec_present}
//                     </div>
//                   </td>
//                   <td className="px-6 py-6 text-center">
//                     <div className={`inline-flex items-center justify-center w-16 h-12 rounded-2xl font-black text-xl shadow-sm border ${emp.dec_absent > 5 ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
//                         {emp.dec_absent}
//                     </div>
//                   </td>

//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
        
//         {/* Large Clean Footer */}
//         <div className="bg-slate-50 p-6 border-t border-slate-100 text-xs text-slate-400 font-black uppercase text-center tracking-[0.5em]">
//             Official Attendance Data • System Verified
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Dashboard;