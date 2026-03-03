
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";

const Calendar = () => {
  const { userId } = useParams();

  const year = 2025;
  const month = 12; // December

  const [attendanceMap, setAttendanceMap] = useState({});

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await API.get(
          `/attendance/user/${userId}/month/${year}/${month}`
        );

        const map = {};

        res.data.forEach((item) => {
          const formattedDate = new Date(item.date)
            .toISOString()
            .split("T")[0]; // yyyy-mm-dd

          map[formattedDate] = item.total_work_minutes;
        });

        setAttendanceMap(map);
      } catch (err) {
        console.error("Calendar fetch error:", err);
      }
    };

    fetchAttendance();
  }, [userId]);

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDay = new Date(year, month - 1, 1).getDay();

  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month - 1, day)
      .toISOString()
      .split("T")[0];

    let status = "Absent";

    const dayOfWeek = new Date(year, month - 1, day).getDay();

    if (dayOfWeek === 0) {
      status = "Sunday";
    } else if (currentDate === "2025-12-25") {
      status = "Holiday";
    } else if (attendanceMap[currentDate]) {
      status = "Present";
    }

    days.push({ day, status });
  }

  return (
    <div className="p-4 bg-white rounded border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <h2 className="text-xl font-bold">December 2025</h2>
      </div>

      {/* Week Header */}
      <div className="grid grid-cols-7 gap-1 text-center font-semibold text-gray-500 mb-2">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((item, index) =>
          item ? (
            <div
              key={index}
              className={`h-20 border p-2 flex flex-col justify-between 
                ${item.status === "Present" ? "bg-green-50 border-green-300" : ""}
                ${item.status === "Absent" ? "bg-red-50 border-red-200" : ""}
                ${item.status === "Sunday" ? "bg-gray-100 border-gray-300" : ""}
                ${item.status === "Holiday" ? "bg-blue-100 border-blue-300" : ""}
              `}
            >
              <span className="font-bold">{item.day}</span>
              <span className="text-[10px] text-gray-600">
                {item.status === "Holiday"
                  ? "Christmas"
                  : item.status}
              </span>
            </div>
          ) : (
            <div key={index}></div>
          )
        )}
      </div>

      {/* Legend */}
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
          <div className="w-3 h-3 bg-gray-200 border border-gray-400"></div>
          <span>Sunday</span>
        </div>

        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-200 border border-blue-400"></div>
          <span>Government Holiday</span>
        </div>
      </div>

      <p className="mt-4 text-[10px] text-gray-400">
        Attendance for User: {userId}
      </p>
    </div>
  );
};

export default Calendar;