
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import API from "../../services/api";

const Month = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH MONTH DATA
  // =========================
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await API.get(`/attendance/employee/${userId}`);

        const mapped = res.data.map((row) => {
          const workMinutes = (row.hours || 0) * 60 + (row.minutes || 0);
          const idleMinutes =
            (row.idle_hours || 0) * 60 + (row.idle_minutes || 0);

          return {
  rawDate: row.date, // ✅ ADD THIS

  date: new Date(row.date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    weekday: "short",
  }),

  inTime: row.in_time ? row.in_time.slice(0, 5) : "--",
  finish: row.out_time ? row.out_time.slice(0, 5) : "--",

  work: `${Math.floor(workMinutes / 60)
    .toString()
    .padStart(2, "0")}:${(workMinutes % 60)
    .toString()
    .padStart(2, "0")}`,

  idle: `${Math.floor(idleMinutes / 60)
    .toString()
    .padStart(2, "0")}:${(idleMinutes % 60)
    .toString()
    .padStart(2, "0")}`,

  status: workMinutes > 0 ? "Present" : "Absent",

  timeline:
    workMinutes > 0
      ? [{ type: "work", start: "20%", width: "60%" }]
      : [],
};
        });

        setAttendanceData(mapped);
      } catch (err) {
        console.error("Month attendance error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [userId]);

  if (loading) {
    return <div className="p-6 text-gray-500">Loading month data…</div>;
  }

  // =========================
  // SUMMARY CALCULATIONS
  // =========================
  const totalWorkMinutes = attendanceData.reduce((sum, r) => {
    const [h, m] = r.work.split(":").map(Number);
    return sum + h * 60 + m;
  }, 0);

  const totalIdleMinutes = attendanceData.reduce((sum, r) => {
    const [h, m] = r.idle.split(":").map(Number);
    return sum + h * 60 + m;
  }, 0);

  const totalWorkHours = Math.floor(totalWorkMinutes / 60);
  const totalWorkMins = totalWorkMinutes % 60;

  const totalIdleHours = Math.floor(totalIdleMinutes / 60);
  const totalIdleMins = totalIdleMinutes % 60;

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans text-gray-700">

      {/* ================= DATE NAV ================= */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <button className="p-1 border rounded-md hover:bg-gray-100">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-xl font-bold text-blue-800">December 2025</h2>
          <button className="p-1 border rounded-md hover:bg-gray-100">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="flex border rounded-full overflow-hidden bg-white shadow-sm">
          {["Day", "Week", "Month", "Date Range"].map((filter) => (
            <button
              key={filter}
              className={`px-6 py-2 text-sm font-medium transition ${
                filter === "Month"
                  ? "bg-blue-600 text-white"
                  : "text-blue-600 hover:bg-blue-50"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* ================= SUMMARY CARDS ================= */}
      <div className="bg-blue-600 p-4 rounded-xl shadow-lg grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg p-6 text-center shadow-inner">
          <p className="text-gray-500 text-sm font-medium">Total Working Time</p>
          <h1 className="text-4xl font-bold text-blue-700 mt-1">
            {totalWorkHours.toString().padStart(2, "0")}:
            {totalWorkMins.toString().padStart(2, "0")}
          </h1>
        </div>

        <div className="bg-white rounded-lg p-6 text-center shadow-inner">
          <p className="text-gray-500 text-sm font-medium">Time Spent</p>
          <h1 className="text-4xl font-bold text-blue-700 mt-1">--</h1>
        </div>

        <div className="bg-white rounded-lg p-6 text-center shadow-inner">
          <p className="text-gray-500 text-sm font-medium">Idle Time</p>
          <h1 className="text-4xl font-bold text-blue-700 mt-1">
            {totalIdleHours.toString().padStart(2, "0")}:
            {totalIdleMins.toString().padStart(2, "0")}
          </h1>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-blue-700 text-white text-xs uppercase tracking-wider">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4 text-center">In Time</th>
              <th className="p-4 text-center">Finish</th>
              <th className="p-4 text-center">Work</th>
              <th className="p-4 text-center">Idle</th>
              {["7 AM","9 AM","11 AM","1 PM","3 PM","5 PM","7 PM","9 PM","11 PM","1 AM","3 AM","5 AM"]
                .map(t => (
                  <th key={t} className="p-2 text-[10px] text-center min-w-[50px]">
                    {t}
                  </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {attendanceData.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-blue-50/30 transition cursor-pointer"
                onClick={() =>
  navigate(`/user/${userId}/attendance/day/${row.rawDate}`)
}
              >
                <td className="p-4 font-medium">{row.date}</td>

                {row.status === "Absent" ? (
                  <td colSpan={16} className="text-center text-blue-600 italic">
                    Absent
                  </td>
                ) : (
                  <>
                    <td className="p-4 text-center">{row.inTime}</td>
                    <td className="p-4 text-center">{row.finish}</td>
                    <td className="p-4 text-center font-bold">{row.work}</td>
                    <td className="p-4 text-center">{row.idle}</td>

                    <td colSpan={12} className="relative p-0">
                      <div className="absolute inset-0 flex">
                        {[...Array(12)].map((_, i) => (
                          <div key={i} className="flex-1 border-r border-gray-100" />
                        ))}
                      </div>
                      <div className="relative h-4 mx-2 bg-gray-100 rounded">
                        {row.timeline.map((seg, i) => (
                          <div
                            key={i}
                            className="absolute h-full bg-emerald-500 rounded"
                            style={{ left: seg.start, width: seg.width }}
                          />
                        ))}
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
