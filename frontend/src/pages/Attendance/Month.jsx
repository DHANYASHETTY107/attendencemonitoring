
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import API from "../../services/api";

const Month = () => {

  const { userId } = useParams();
  const navigate = useNavigate();

  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Month state (10 = Nov, 11 = Dec)
  const [month, setMonth] = useState(11);
  const year = 2025;

  useEffect(() => {

    const fetchAttendance = async () => {

      try {

        const res = await API.get(`/attendance/employee/${userId}`);
        const dbData = res.data;

        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const holidays = {
          "2025-11-01": "Karnataka Rajyotsava",
          "2025-12-25": "Christmas"
        };

        const fullMonth = [];

        for (let i = 1; i <= daysInMonth; i++) {

          const currentDate = new Date(year, month, i);

          const isoDate =
            currentDate.getFullYear() + "-" +
            String(currentDate.getMonth() + 1).padStart(2, "0") + "-" +
            String(currentDate.getDate()).padStart(2, "0");

          // match exact DB record
          const found = dbData.find((r) => {
            const d = new Date(r.date);
            return (
              d.getFullYear() === year &&
              d.getMonth() === month &&
              d.getDate() === i
            );
          });

          const workMinutes = found
            ? (found.hours * 60 + found.minutes)
            : 0;

          const idleMinutes = found
            ? (found.idle_hours * 60 + found.idle_minutes)
            : 0;

          let status = "Absent";

          if (holidays[isoDate]) {
            status = holidays[isoDate];
          }
          else if (currentDate.getDay() === 0) {
            status = "Sunday";
          }
          else if (found && workMinutes > 0) {
            status = "Present";
          }

          fullMonth.push({

            rawDate: isoDate,

            date: currentDate.toLocaleDateString("en-GB", {
              weekday: "short",
              day: "2-digit",
              month: "short",
              year: "numeric"
            }),

            inTime: found?.in_time ? found.in_time.slice(0, 5) : "--",
            finish: found?.out_time ? found.out_time.slice(0, 5) : "--",

            work:
              `${Math.floor(workMinutes / 60).toString().padStart(2, "0")}:${(workMinutes % 60).toString().padStart(2, "0")}`,

            idle:
              `${Math.floor(idleMinutes / 60).toString().padStart(2, "0")}:${(idleMinutes % 60).toString().padStart(2, "0")}`,

            status
          });
        }

        setAttendanceData(fullMonth);

      } catch (err) {
        console.error("Attendance fetch error:", err);
      } finally {
        setLoading(false);
      }

    };

    fetchAttendance();

  }, [userId, month]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  const monthName = month === 10 ? "November 2025" : "December 2025";

  return (

    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Month Navigation */}

      <div className="flex items-center gap-4 mb-6">

        <button
          onClick={() => setMonth(10)}
          className="border rounded p-1"
        >
          <ChevronLeft size={18} />
        </button>

        <h2 className="text-xl font-bold">
          {monthName}
        </h2>

        <button
          onClick={() => setMonth(11)}
          className="border rounded p-1"
        >
          <ChevronRight size={18} />
        </button>

      </div>

      {/* Table */}

      <div className="bg-white shadow rounded">

        <table className="w-full">

          <thead className="bg-blue-700 text-white text-sm">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3 text-center">In Time</th>
              <th className="p-3 text-center">Finish</th>
              <th className="p-3 text-center">Work</th>
              <th className="p-3 text-center">Idle</th>
            </tr>
          </thead>

          <tbody>

            {attendanceData.map((row, index) => (

              <tr
                key={index}
                className="border-b hover:bg-gray-50 cursor-pointer"
                onClick={() =>
                  navigate(`/user/${userId}/attendance/day/${row.rawDate}`)
                }
              >

                <td className="p-3">{row.date}</td>

                {row.status !== "Present" ? (

                  <td colSpan={4} className="text-center text-blue-600 italic">
                    {row.status}
                  </td>

                ) : (

                  <>
                    <td className="text-center">{row.inTime}</td>
                    <td className="text-center">{row.finish}</td>
                    <td className="text-center font-semibold">{row.work}</td>
                    <td className="text-center">{row.idle}</td>
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