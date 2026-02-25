// import { useParams } from "react-router-dom";

// const Month = () => {
//   const { username } = useParams();

//   return (
//     <div className="space-y-6">

//       {/* Header */}
//       <div className="bg-blue-700 text-white p-6 rounded-lg shadow">
//         <h1 className="text-2xl font-bold">{username}</h1>
//       </div>

//       {/* Summary Cards */}
//       <div className="bg-blue-600 p-6 rounded-lg shadow flex justify-between text-white">

//         <div className="bg-white text-blue-700 p-4 rounded w-1/3 text-center shadow">
//           <p>Total Working Time</p>
//           <h2 className="text-xl font-bold">85:17</h2>
//         </div>

//         <div className="bg-white text-blue-700 p-4 rounded w-1/3 text-center shadow">
//           <p>Time Spent</p>
//           <h2 className="text-xl font-bold">96:21</h2>
//         </div>

//         <div className="bg-white text-blue-700 p-4 rounded w-1/3 text-center shadow">
//           <p>Idle Time</p>
//           <h2 className="text-xl font-bold">15:50</h2>
//         </div>

//       </div>

//       {/* Table */}
//       <div className="bg-white rounded shadow overflow-x-auto">
//         <table className="w-full text-sm">
//           <thead className="bg-blue-700 text-white">
//             <tr>
//               <th className="p-3">Date</th>
//               <th>In Time</th>
//               <th>Finish</th>
//               <th>Work</th>
//               <th>Idle</th>
//             </tr>
//           </thead>

//           <tbody>
//             <tr className="border-b">
//               <td className="p-3">01 Oct 2025</td>
//               <td>09:33</td>
//               <td>18:50</td>
//               <td>08:11</td>
//               <td>05:53</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>

//     </div>
//   );
// };

// export default Month;
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Optional: Install lucide-react or use text

const Month = () => {
  const { username, userId } = useParams();
  const navigate = useNavigate();

  // Dummy Data
  const attendanceData = [
    { date: "01 Oct 2025 Wed", inTime: "09:33", finish: "18:50", work: "08:11", idle: "05:53", status: "Present", 
      timeline: [{ type: "work", start: "20%", width: "10%" }, { type: "idle", start: "30%", width: "30%" }, { type: "work", start: "60%", width: "10%" }] },
    { date: "02 Oct 2025 Thu", status: "Absent" },
    { date: "03 Oct 2025 Fri", inTime: "09:21", finish: "18:37", work: "08:05", idle: "01:10", status: "Present",
      timeline: [{ type: "work", start: "18%", width: "22%" }, { type: "idle", start: "40%", width: "5%" }, { type: "work", start: "45%", width: "25%" }] },
    { date: "04 Oct 2025 Sat", inTime: "09:09", finish: "18:50", work: "08:36", idle: "01:02", status: "Present",
      timeline: [{ type: "work", start: "15%", width: "25%" }, { type: "idle", start: "40%", width: "5%" }, { type: "work", start: "45%", width: "28%" }] },
    { date: "05 Oct 2025 Sun", status: "Absent" },
    { date: "06 Oct 2025 Mon", inTime: "09:28", finish: "18:52", work: "08:16", idle: "01:08", status: "Present",
      timeline: [{ type: "work", start: "18%", width: "22%" }, { type: "idle", start: "40%", width: "5%" }, { type: "work", start: "45%", width: "25%" }] },
    { date: "07 Oct 2025 Tue", inTime: "09:55", finish: "18:53", work: "08:02", idle: "00:54", status: "Present",
      timeline: [{ type: "work", start: "22%", width: "20%" }, { type: "idle", start: "42%", width: "5%" }, { type: "work", start: "47%", width: "25%" }] },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans text-gray-700">
      
      {/* 1. Date Navigation & Filters */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <button className="p-1 border rounded-md hover:bg-gray-100"><ChevronLeft size={20} /></button>
          <h2 className="text-xl font-bold text-blue-800">October 2025</h2>
          <button className="p-1 border rounded-md hover:bg-gray-100"><ChevronRight size={20} /></button>
        </div>

        <div className="flex border rounded-full overflow-hidden bg-white shadow-sm">
          {['Day', 'Week', 'Month', 'Date Range'].map((filter) => (
            <button 
              key={filter}
              className={`px-6 py-2 text-sm font-medium transition ${filter === 'Month' ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-50'}`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Summary Cards Container */}
      <div className="bg-blue-600 p-4 rounded-xl shadow-lg grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg p-6 text-center shadow-inner">
          <p className="text-gray-500 text-sm font-medium">Total Working Time</p>
          <h1 className="text-4xl font-bold text-blue-700 mt-1">85:17</h1>
        </div>
        <div className="bg-white rounded-lg p-6 text-center shadow-inner">
          <p className="text-gray-500 text-sm font-medium">Time Spent</p>
          <h1 className="text-4xl font-bold text-blue-700 mt-1">96:21</h1>
        </div>
        <div className="bg-white rounded-lg p-6 text-center shadow-inner">
          <p className="text-gray-500 text-sm font-medium">Idle Time</p>
          <h1 className="text-4xl font-bold text-blue-700 mt-1">15:50</h1>
        </div>
      </div>

      {/* 3. Attendance Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-blue-700 text-white text-xs uppercase tracking-wider">
            <tr>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold text-center">In Time</th>
              <th className="p-4 font-semibold text-center">Finish</th>
              <th className="p-4 font-semibold text-center">Work</th>
              <th className="p-4 font-semibold text-center">Idle</th>
              {/* Timeline headers */}
              {["7 AM", "9 AM", "11 AM", "1 PM", "3 PM", "5 PM", "7 PM", "9 PM", "11 PM", "1 AM", "3 AM", "5 AM"].map(time => (
                <th key={time} className="p-2 text-[10px] border-l border-blue-600/30 text-center min-w-[50px]">{time}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {attendanceData.map((row, idx) => (
              <tr key={idx} className="hover:bg-blue-50/30 transition-colors h-12 cursor-pointer" onClick={() => navigate(`/attendance/${userId}/day`)}>
                <td className="p-4 text-sm font-medium text-gray-600 whitespace-nowrap">{row.date}</td>
                
                {row.status === "Absent" ? (
                  <td colSpan={16} className="text-center font-bold text-blue-600 bg-blue-50/50 py-3 italic">
                    Absent
                  </td>
                ) : (
                  <>
                    <td className="p-4 text-sm text-center text-gray-500">{row.inTime}</td>
                    <td className="p-4 text-sm text-center text-gray-500">{row.finish}</td>
                    <td className="p-4 text-sm text-center font-bold text-gray-700">{row.work}</td>
                    <td className="p-4 text-sm text-center text-gray-400">{row.idle}</td>
                    
                    {/* Timeline visualization cell spanning the time columns */}
                    <td colSpan={12} className="relative p-0 h-full border-l border-gray-100">
                      {/* Background grid lines for timeline */}
                      <div className="absolute inset-0 flex">
                        {[...Array(12)].map((_, i) => (
                          <div key={i} className="flex-1 border-r border-gray-100 last:border-0" />
                        ))}
                      </div>
                      {/* Status Bars */}
                      <div className="absolute inset-y-0 left-0 right-0 flex items-center px-2">
                        <div className="relative w-full h-4 bg-gray-50 rounded-sm">
                          {row.timeline?.map((seg, sIdx) => (
                            <div 
                              key={sIdx}
                              className={`absolute h-full rounded-sm ${seg.type === 'work' ? 'bg-emerald-500' : 'bg-rose-500'}`}
                              style={{ left: seg.start, width: seg.width }}
                            />
                          ))}
                        </div>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Month;