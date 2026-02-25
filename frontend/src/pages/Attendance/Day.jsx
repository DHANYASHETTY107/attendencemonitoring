// import { useParams } from "react-router-dom";

// const Day = () => {
//   const { userId } = useParams();

//   return (
//     <div className="bg-white p-4 rounded shadow">
//       <h2 className="text-lg font-bold mb-3">
//         Day Attendance
//       </h2>

//       <p className="text-gray-600 mb-2">
//         User ID: {userId}
//       </p>

//       <table className="w-full border">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="p-2 border">In Time</th>
//             <th className="p-2 border">Out Time</th>
//             <th className="p-2 border">Work Hours</th>
//             <th className="p-2 border">Idle Time</th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr>
//             <td className="p-2 border">09:30</td>
//             <td className="p-2 border">18:30</td>
//             <td className="p-2 border">08:00</td>
//             <td className="p-2 border">01:00</td>
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Day;
import React from "react";
import { useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Clock, Coffee, Monitor } from "lucide-react";

const Day = () => {
  const { userId } = useParams();

  // Dummy data for a specific day
  const dayDetails = {
    date: "21 Feb 2026",
    totalWork: "08:11",
    totalSpent: "09:30",
    idleTime: "01:19",
    sessions: [
      { start: "09:33", end: "13:00", type: "Work", duration: "03:27", status: "Active" },
      { start: "13:00", end: "14:00", type: "Break/Idle", duration: "01:00", status: "Idle" },
      { start: "14:00", end: "18:50", type: "Work", duration: "04:50", status: "Active" },
    ]
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* 1. Date Selector & Action Bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full transition"><ChevronLeft size={20}/></button>
          <div className="text-center">
            <h2 className="text-xl font-bold text-blue-900">{dayDetails.date}</h2>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Friday</p>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full transition"><ChevronRight size={20}/></button>
        </div>
        
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">PRESENT</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">ON TIME</span>
        </div>
      </div>

      {/* 2. Summary Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
          <Monitor className="absolute -right-4 -bottom-4 text-white/10" size={100} />
          <p className="text-blue-100 text-sm font-medium">Total Working Time</p>
          <h3 className="text-4xl font-black mt-2">{dayDetails.totalWork}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border-b-4 border-emerald-500">
          <div className="flex items-center gap-3 text-emerald-600 mb-2">
            <Clock size={18} />
            <p className="text-sm font-bold uppercase tracking-wide">Time Spent</p>
          </div>
          <h3 className="text-4xl font-black text-gray-800">{dayDetails.totalSpent}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border-b-4 border-rose-500">
          <div className="flex items-center gap-3 text-rose-600 mb-2">
            <Coffee size={18} />
            <p className="text-sm font-bold uppercase tracking-wide">Idle Time</p>
          </div>
          <h3 className="text-4xl font-black text-gray-800">{dayDetails.idleTime}</h3>
        </div>
      </div>

      {/* 3. Detailed Timeline View */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
          <h4 className="font-bold text-gray-700">Activity Breakdown</h4>
          <p className="text-xs text-gray-500 italic font-medium text-right">User ID: #{userId}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-gray-400 text-[11px] uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Session Type</th>
                <th className="px-6 py-4 text-center font-semibold">Start Time</th>
                <th className="px-6 py-4 text-center font-semibold">End Time</th>
                <th className="px-6 py-4 text-center font-semibold">Duration</th>
                <th className="px-6 py-4 text-right font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {dayDetails.sessions.map((session, index) => (
                <tr key={index} className="hover:bg-blue-50/30 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${session.type === 'Work' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                      <span className="font-bold text-gray-700">{session.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-500 font-medium">{session.start}</td>
                  <td className="px-6 py-4 text-center text-gray-500 font-medium">{session.end}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-gray-100 px-3 py-1 rounded-lg text-sm font-bold text-gray-600">
                      {session.duration}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`text-xs font-bold ${session.status === 'Active' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      ● {session.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Visual Progress Bar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h4 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wide">Day Progress</h4>
        <div className="relative w-full h-8 bg-gray-100 rounded-xl overflow-hidden flex">
            <div className="h-full bg-emerald-500" style={{ width: '40%' }} title="Work"></div>
            <div className="h-full bg-rose-500/80" style={{ width: '15%' }} title="Break"></div>
            <div className="h-full bg-emerald-500" style={{ width: '45%' }} title="Work"></div>
        </div>
        <div className="flex gap-6 mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-sm"></div> Working</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-rose-500 rounded-sm"></div> Idle/Break</div>
        </div>
      </div>
    </div>
  );
};

export default Day;