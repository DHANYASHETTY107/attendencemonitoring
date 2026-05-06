
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import API from "../../services/api";

const Calendar = () => {

  const { userId } = useParams();

  const year = 2025;

  // 11 = November , 12 = December
  const [month, setMonth] = useState(12);

  const [attendanceMap, setAttendanceMap] = useState({});

  useEffect(() => {

    const fetchAttendance = async () => {

      try {

        const res = await API.get(
          `/attendance/user/${userId}/month/${year}/${month}`
        );

        const map = {};

        res.data.forEach((item) => {

          const date = new Date(item.date)
            .toISOString()
            .split("T")[0];

          map[date] = item.total_work_minutes;

        });

        setAttendanceMap(map);

      } catch (err) {

        console.error("Calendar fetch error:", err);

      }

    };

    fetchAttendance();

  }, [userId, month]);

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDay = new Date(year, month - 1, 1).getDay();

  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {

    const dateObj = new Date(year, month - 1, day);

    const currentDate = dateObj.toISOString().split("T")[0];

    const dayOfWeek = dateObj.getDay();

    let status = "Absent";

    // =========================
    // GOVERNMENT HOLIDAYS (FIXED)
    // =========================

    const localMonth = dateObj.getMonth() + 1;
    const localDay = dateObj.getDate();

    if (localMonth === 11 && localDay === 1) {

      status = "Holiday";

    }
    else if (localMonth === 12 && localDay === 25) {

      status = "Holiday";

    }

    // =========================
    // SUNDAY
    // =========================

    else if (dayOfWeek === 0) {

      status = "Sunday";

    }

    // =========================
    // PRESENT
    // =========================

    else if (attendanceMap[currentDate]) {

      status = "Present";

    }

    days.push({
      day,
      status,
      date: currentDate
    });

  }

  const monthName =
    month === 11 ? "November 2025" : "December 2025";

  return (

    <div className="rounded border border-gray-200 bg-white p-3 shadow-sm sm:p-4">

      {/* HEADER */}

      <div className="mb-4 flex items-center justify-between border-b pb-4">

        <div className="flex items-center gap-2 sm:gap-3">

          <button
            onClick={() => setMonth(11)}
            className="border rounded p-1"
          >
            <ChevronLeft size={18} />
          </button>

          <h2 className="text-lg font-bold sm:text-xl">{monthName}</h2>

          <button
            onClick={() => setMonth(12)}
            className="border rounded p-1"
          >
            <ChevronRight size={18} />
          </button>

        </div>

      </div>

      {/* WEEK HEADER */}

      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-gray-500 sm:text-sm">

        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>

      </div>

      {/* CALENDAR GRID */}

      <div className="grid grid-cols-7 gap-1 sm:gap-2">

        {days.map((item, index) =>

          item ? (

            <div
              key={index}
              className={`flex h-16 flex-col justify-between border p-1.5 sm:h-20 sm:p-2
                ${item.status === "Present" ? "bg-green-50 border-green-300" : ""}
                ${item.status === "Absent" ? "bg-red-50 border-red-200" : ""}
                ${item.status === "Sunday" ? "bg-gray-100 border-gray-300" : ""}
                ${item.status === "Holiday" ? "bg-blue-100 border-blue-300" : ""}
              `}
            >

              <span className="text-sm font-bold sm:text-base">{item.day}</span>

              <span className="text-[9px] text-gray-600 sm:text-[10px]">

               {item.status === "Holiday"
  ? (item.date.includes("-11-01")
      ? "Holiday"
      : "Holiday")
  : item.status}

              </span>

            </div>

          ) : (

            <div key={index}></div>

          )

        )}

      </div>

      {/* LEGEND */}

      <div className="mt-6 flex flex-wrap gap-4 border-t pt-4 text-xs sm:text-sm">

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
