import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import API from "../../services/api";

const Month = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [attendanceData, setAttendanceData] = useState([]);
  const [totalWorkMinutes, setTotalWorkMinutes] = useState(0);
  const [loading, setLoading] = useState(true);
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
          "2025-12-25": "Christmas",
        };
        const fullMonth = [];
        let monthlyWorkMinutes = 0;

        for (let day = 1; day <= daysInMonth; day++) {
          const currentDate = new Date(year, month, day);
          const isoDate =
            currentDate.getFullYear() +
            "-" +
            String(currentDate.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(currentDate.getDate()).padStart(2, "0");

          const found = dbData.find((record) => {
            const recordDate = new Date(record.date);

            return (
              recordDate.getFullYear() === year &&
              recordDate.getMonth() === month &&
              recordDate.getDate() === day
            );
          });

          const workMinutes = found ? found.hours * 60 + found.minutes : 0;
          const idleMinutes = found
            ? found.idle_hours * 60 + found.idle_minutes
            : 0;
          monthlyWorkMinutes += workMinutes;

          let status = "Absent";

          if (holidays[isoDate]) {
            status = holidays[isoDate];
          } else if (currentDate.getDay() === 0) {
            status = "Sunday";
          } else if (found && workMinutes > 0) {
            status = "Present";
          }

          fullMonth.push({
            rawDate: isoDate,
            date: currentDate.toLocaleDateString("en-GB", {
              weekday: "short",
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            inTime: found?.in_time ? found.in_time.slice(0, 5) : "--",
            finish: found?.out_time ? found.out_time.slice(0, 5) : "--",
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
            status,
          });
        }

        setAttendanceData(fullMonth);
        setTotalWorkMinutes(monthlyWorkMinutes);
      } catch (err) {
        console.error("Attendance fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [month, userId]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  const monthName = month === 10 ? "November 2025" : "December 2025";
  const totalHours = Math.floor(totalWorkMinutes / 60);
  const totalMinutes = totalWorkMinutes % 60;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mb-6 flex items-center gap-3 sm:gap-4">
        <button onClick={() => setMonth(10)} className="rounded border p-1">
          <ChevronLeft size={18} />
        </button>

        <h2 className="text-lg font-bold sm:text-xl">{monthName}</h2>

        <button onClick={() => setMonth(11)} className="rounded border p-1">
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="mb-4 rounded bg-white p-4 shadow">
        <p className="text-sm text-gray-600">Total Hours Worked This Month</p>
        <p className="text-xl font-bold text-blue-700">
          {`${totalHours.toString().padStart(2, "0")}:${totalMinutes
            .toString()
            .padStart(2, "0")}`}
        </p>
      </div>

      <div className="overflow-hidden rounded bg-white shadow">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px]">
            <thead className="bg-blue-700 text-sm text-white">
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
                  className="cursor-pointer border-b hover:bg-gray-50"
                  onClick={() =>
                    navigate(`/user/${userId}/attendance/day/${row.rawDate}`)
                  }
                >
                  <td className="p-3">{row.date}</td>

                  {row.status !== "Present" ? (
                    <td colSpan={4} className="text-center italic text-blue-600">
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
    </div>
  );
};

export default Month;
