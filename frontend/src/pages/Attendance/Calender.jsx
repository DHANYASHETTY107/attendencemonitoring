
// import React, { useState } from "react";
// import { useParams } from "react-router-dom";
// import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Info } from "lucide-react";

// const Calender = () => {
//   const { userId } = useParams();
//   const [currentMonth, setCurrentMonth] = useState("February 2026");

//   // Mock data for the calendar days
//   const daysInMonth = 28; // For Feb 2026
//   const startDayOffset = 0; // Starts on Sunday

//   const attendanceData = Array.from({ length: daysInMonth }, (_, i) => {
//     const day = i + 1;
//     let status = "present";
//     if ([2, 14, 25].includes(day)) status = "absent";
//     if ([5, 12, 21].includes(day)) status = "late";
//     if ([1, 7, 8, 15, 21, 22].includes(day)) status = "weekend";
    
//     return { day, status };
//   });

//   const getStatusStyles = (status) => {
//     switch (status) {
//       case "present": return "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100";
//       case "absent": return "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100";
//       case "late": return "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100";
//       case "weekend": return "bg-gray-50 border-gray-100 text-gray-400";
//       default: return "bg-white text-gray-700";
//     }
//   };

//   return (
//     <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
//       {/* 1. Main Calendar Card */}
//       <div className="flex-1 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        
//         {/* Header Navigation */}
//         <div className="p-6 bg-blue-600 text-white flex justify-between items-center">
//           <div className="flex items-center gap-3">
//             <CalendarIcon size={24} className="opacity-80" />
//             <h2 className="text-2xl font-black tracking-tight">{currentMonth}</h2>
//           </div>
//           <div className="flex gap-2">
//             <button className="p-2 hover:bg-white/20 rounded-xl transition"><ChevronLeft /></button>
//             <button className="p-2 hover:bg-white/20 rounded-xl transition"><ChevronRight /></button>
//           </div>
//         </div>

//         {/* Calendar Grid */}
//         <div className="p-6">
//           {/* Weekday Labels */}
//           <div className="grid grid-cols-7 mb-4">
//             {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
//               <div key={d} className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest py-2">
//                 {d}
//               </div>
//             ))}
//           </div>

//           {/* Days Grid */}
//           <div className="grid grid-cols-7 gap-3">
//             {attendanceData.map((item) => (
//               <div
//                 key={item.day}
//                 className={`group relative h-24 sm:h-32 border-2 rounded-2xl flex flex-col p-3 transition-all cursor-pointer transform hover:scale-105 hover:shadow-lg ${getStatusStyles(item.status)}`}
//               >
//                 <span className="text-lg font-black">{item.day}</span>
                
//                 {/* Visual Status Indicator */}
//                 <div className="mt-auto flex justify-between items-end">
//                   <span className="text-[10px] font-bold uppercase tracking-tighter opacity-70">
//                     {item.status !== "weekend" ? item.status : ""}
//                   </span>
//                   {item.status === "present" && <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>}
//                   {item.status === "absent" && <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></div>}
//                   {item.status === "late" && <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]"></div>}
//                 </div>

//                 {/* Hover Tooltip/Detail (Hidden by default) */}
//                 <div className="absolute inset-0 bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex flex-col items-center justify-center p-2 text-center">
//                   <p className="text-[10px] text-gray-500 font-bold uppercase">Log Info</p>
//                   <p className="text-xs font-bold text-blue-800">In: 09:30 AM</p>
//                   <p className="text-xs font-bold text-blue-800">Out: 06:30 PM</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* 2. Right Stats Sidebar */}
//       <div className="w-full lg:w-80 flex flex-col gap-6">
        
//         {/* User Info Card */}
//         <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-100">
//           <div className="flex items-center gap-4 mb-4">
//             <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-bold">
//               #{userId}
//             </div>
//             <div>
//               <h4 className="font-bold text-gray-800">User Summary</h4>
//               <p className="text-xs text-gray-400">Month-to-date analysis</p>
//             </div>
//           </div>
          
//           <div className="space-y-3">
//             <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl">
//               <span className="text-sm font-medium text-emerald-800">Present Days</span>
//               <span className="font-black text-emerald-600 text-lg">19</span>
//             </div>
//             <div className="flex justify-between items-center p-3 bg-rose-50 rounded-xl">
//               <span className="text-sm font-medium text-rose-800">Total Absents</span>
//               <span className="font-black text-rose-600 text-lg">03</span>
//             </div>
//             <div className="flex justify-between items-center p-3 bg-amber-50 rounded-xl">
//               <span className="text-sm font-medium text-amber-800">Late Arrivals</span>
//               <span className="font-black text-amber-600 text-lg">03</span>
//             </div>
//           </div>
//         </div>

//         {/* Legend Card */}
//         <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-100 flex-1">
//           <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
//             <Info size={16} className="text-blue-500" /> Legend
//           </h4>
//           <ul className="space-y-4">
//             <li className="flex items-center gap-3">
//               <div className="w-4 h-4 rounded-md bg-emerald-500"></div>
//               <span className="text-sm text-gray-600 font-medium">Regular Present</span>
//             </li>
//             <li className="flex items-center gap-3">
//               <div className="w-4 h-4 rounded-md bg-amber-500"></div>
//               <span className="text-sm text-gray-600 font-medium">Late (after 09:45 AM)</span>
//             </li>
//             <li className="flex items-center gap-3">
//               <div className="w-4 h-4 rounded-md bg-rose-500"></div>
//               <span className="text-sm text-gray-600 font-medium">Absent / On Leave</span>
//             </li>
//             <li className="flex items-center gap-3">
//               <div className="w-4 h-4 rounded-md bg-gray-200"></div>
//               <span className="text-sm text-gray-600 font-medium">Weekends</span>
//             </li>
//           </ul>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Calender;
import React from "react";
import { useParams } from "react-router-dom";

const Calender = () => {
  const { userId } = useParams();

  // Create an array for 28 days (February)
  const days = Array.from({ length: 28 }, (_, i) => {
    const day = i + 1;
    let status = "Present";
    
    // Simple logic for colors
    if ([2, 14, 25].includes(day)) status = "Absent";
    if ([5, 12].includes(day)) status = "Late";
    if ([1, 7, 8, 15, 21, 22].includes(day)) status = "Weekend";

    return { day, status };
  });

  return (
    <div className="p-4 bg-white rounded border border-gray-200 shadow-sm">
      
      {/* Title */}
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <h2 className="text-xl font-bold">February 2026</h2>
        <div className="flex gap-2">
          <button className="border px-3 py-1 rounded hover:bg-gray-50">&lt;</button>
          <button className="border px-3 py-1 rounded hover:bg-gray-50">&gt;</button>
        </div>
      </div>

      {/* Week Header */}
      <div className="grid grid-cols-7 gap-1 text-center font-semibold text-gray-500 mb-2">
        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((item) => (
          <div
            key={item.day}
            className={`h-20 border p-2 flex flex-col justify-between 
              ${item.status === 'Present' ? 'bg-green-50 border-green-200' : ''}
              ${item.status === 'Absent' ? 'bg-red-50 border-red-200' : ''}
              ${item.status === 'Late' ? 'bg-yellow-50 border-yellow-200' : ''}
              ${item.status === 'Weekend' ? 'bg-gray-50 border-gray-100' : ''}
            `}
          >
            <span className="font-bold">{item.day}</span>
            <span className="text-[10px] text-gray-600">{item.status}</span>
          </div>
        ))}
      </div>

      {/* Simple Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-sm pt-4 border-t">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-200 border border-green-400"></div>
          <span>Present</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-200 border border-red-400"></div>
          <span>Absent</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-200 border border-yellow-400"></div>
          <span>Late</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-100 border border-gray-300"></div>
          <span>Weekend</span>
        </div>
      </div>

      <p className="mt-4 text-[10px] text-gray-400">Attendance for User: {userId}</p>
    </div>
  );
};

export default Calender;