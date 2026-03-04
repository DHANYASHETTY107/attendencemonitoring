
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import API from "../services/api";

// const Reports = () => {
//   const { userId } = useParams();
//   const [reportData, setReportData] = useState([]);
//   const [totalTime, setTotalTime] = useState("0h 0m");

//   useEffect(() => {
//     fetchReport();
//   }, [userId]);

//   const fetchReport = async () => {
//     try {
//       const res = await API.get(`/attendance/report/${userId}`);
//       const dbData = res.data;

//       // Get current month & year
//       const today = new Date();
//       const year = today.getFullYear();
//       const month = today.getMonth(); // 0 based

//       const daysInMonth = new Date(year, month + 1, 0).getDate();

//       let totalMinutes = 0;

//       // Create full month data
//       const fullMonthData = [];

//       for (let i = 1; i <= daysInMonth; i++) {
//         const dayStr = i.toString().padStart(2, "0");

//         const found = dbData.find((d) => d.day === dayStr);

//         if (found) {
//           totalMinutes += Math.round(found.hours * 60);
//           fullMonthData.push(found);
//         } else {
//           fullMonthData.push({
//             day: dayStr,
//             hours: 0,
//             display: "Absent",
//           });
//         }
//       }

//       const h = Math.floor(totalMinutes / 60);
//       const m = totalMinutes % 60;

//       setTotalTime(`${h}h ${m}m`);
//       setReportData(fullMonthData);

//     } catch (err) {
//       console.error("Report error:", err);
//     }
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <div className="bg-blue-600 text-white p-4 rounded-md font-bold text-xl uppercase">
//         Attendance Report
//       </div>

//       <div className="bg-white p-8 rounded-2xl shadow-lg relative">
//         <div className="absolute top-6 right-10 text-3xl font-black text-gray-800">
//           {totalTime}
//         </div>

//         <div className="h-[450px] w-full mt-10">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart data={reportData}>
//               <CartesianGrid vertical={false} stroke="#f0f0f0" />
//               <XAxis dataKey="day" />
//               <YAxis tickFormatter={(v) => `${v}h`} />
//               <Tooltip />

//              <Bar
//   dataKey="hours"
//   radius={[6, 6, 0, 0]}
//   fill="#1061d4"
//   shape={(props) => {
//     const { x, y, width, height, index } = props;
//     const item = reportData[index];

//     const isAbsent = item.display === "Absent";

//     return (
//       <>
//         {/* Bar */}
//         <rect
//           x={x}
//           y={y}
//           width={width}
//           height={height}
//           fill={isAbsent ? "#ffd6d6" : "#1061d4"}
//           rx="6"
//         />

//         {/* Vertical Absent Text */}
//         {isAbsent && (
//           <text
//             x={x + width / 2}
//             y={y - 20}
//             fill="red"
//             fontSize="11"
//             fontWeight="bold"
//             textAnchor="middle"
//             transform={`rotate(-90 ${x + width / 2} ${y - 20})`}
//           >
//             Absent
//           </text>
//         )}
//       </>
//     );
//   }}
//   label={(props) => {
//     const { x, y, width, index } = props;
//     const item = reportData[index];

//     if (!item || item.display === "Absent") return null;

//     return (
//       <text
//         x={x + width / 2}
//         y={y - 10}
//         fill="#333"
//         fontSize="11"
//         fontWeight="bold"
//         textAnchor="middle"
//       >
//         {item.display}
//       </text>
//     );
//   }}
// />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Reports;
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import API from "../services/api";

const Reports = () => {
  const { userId } = useParams();

  const [fullMonthData, setFullMonthData] = useState([]);
  const [visibleData, setVisibleData] = useState([]);
  const [totalTime, setTotalTime] = useState("0h 0m");
  const [startIndex, setStartIndex] = useState(0);

  const ITEMS_PER_PAGE = 15;

  useEffect(() => {
    fetchReport();
  }, [userId]);

  useEffect(() => {
    const slice = fullMonthData.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
    setVisibleData(slice);
  }, [startIndex, fullMonthData]);

  const fetchReport = async () => {
    try {
      const res = await API.get(`/attendance/report/${userId}`);
      const dbData = res.data;

      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      let totalMinutes = 0;
      const completeData = [];

      for (let i = 1; i <= daysInMonth; i++) {
        const dayStr = i.toString().padStart(2, "0");

        const found = dbData.find((d) => {
          const date = new Date(d.day || d.date);
          const dStr = date.getDate().toString().padStart(2, "0");
          return dStr === dayStr;
        });

        if (found) {
          const minutes = found.total_work_minutes || 0;
          const hours = minutes / 60;

          totalMinutes += minutes;

          completeData.push({
            day: dayStr,
            hours: hours,
            display: hours.toFixed(1) + "h",
          });
        } else {
          completeData.push({
            day: dayStr,
            hours: 0,
            display: "Absent",
          });
        }
      }

      const h = Math.floor(totalMinutes / 60);
      const m = totalMinutes % 60;

      setTotalTime(`${h}h ${m}m`);
      setFullMonthData(completeData);
    } catch (err) {
      console.error("Report fetch error:", err);
    }
  };

  const handleNext = () => {
    if (startIndex + ITEMS_PER_PAGE < fullMonthData.length) {
      setStartIndex(startIndex + ITEMS_PER_PAGE);
    }
  };

  const handlePrev = () => {
    if (startIndex - ITEMS_PER_PAGE >= 0) {
      setStartIndex(startIndex - ITEMS_PER_PAGE);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-md font-bold text-xl uppercase flex justify-between">
        <span>Attendance Report</span>
        <span>{totalTime}</span>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-6 font-semibold text-lg">
        <button
          onClick={handlePrev}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          {"<"}
        </button>

        <span>
          {startIndex + 1} -{" "}
          {Math.min(startIndex + ITEMS_PER_PAGE, fullMonthData.length)}
        </span>

        <button
          onClick={handleNext}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          {">"}
        </button>
      </div>

      {/* Chart */}
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <div className="h-[450px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={visibleData}>
              <CartesianGrid vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="day" />
              <YAxis tickFormatter={(v) => `${v}h`} />
              <Tooltip
                formatter={(value) => `${value.toFixed(2)} hours`}
              />

              <Bar
                dataKey="hours"
                fill="#1061d4"
                radius={[6, 6, 0, 0]}
                label={(props) => {
                  const { x, y, width, index } = props;
                  const item = visibleData[index];

                  if (!item) return null;

                  if (item.display === "Absent") {
                    return (
                      <text
                        x={x + width / 2}
                        y={y - 10}
                        fill="red"
                        fontSize="11"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        A
                      </text>
                    );
                  }

                  return (
                    <text
                      x={x + width / 2}
                      y={y - 10}
                      fill="#333"
                      fontSize="11"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {item.display}
                    </text>
                  );
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Reports;