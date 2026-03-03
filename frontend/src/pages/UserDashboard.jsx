
import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

const UserDashboard = () => {
  const { userId } = useParams();

  const [employee, setEmployee] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentMonth, setCurrentMonth] = useState(12);
  const [currentYear, setCurrentYear] = useState(2025);
  const [selectedDate, setSelectedDate] = useState(null);

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1️⃣ Get employee using userId
        const empRes = await API.get(`/employees/${userId}`);
        const emp = empRes.data;
        setEmployee(emp);

        if (!emp?.id) {
          setAttendance([]);
          return;
        }

        // 2️⃣ Use employee.id for attendance
        const attRes = await API.get(
          `/attendance/employee/${emp.id}`
        );

        const normalized = attRes.data.map((r) => ({
          ...r,
          date: r.date.slice(0, 10), // YYYY-MM-DD
        }));

        setAttendance(normalized);
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // =========================
  // DATE → RECORD MAP
  // =========================
  const attendanceMap = useMemo(() => {
    const map = {};
    attendance.forEach((r) => {
      map[r.date] = r;
    });
    return map;
  }, [attendance]);

  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

  // =========================
  // SELECTED DAY
  // =========================
  const selectedKey = selectedDate
    ? `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(
        selectedDate
      ).padStart(2, "0")}`
    : null;

  const selectedRecord = selectedKey
    ? attendanceMap[selectedKey]
    : null;

  // =========================
  // MONTH NAVIGATION
  // =========================
  const nextMonth = () => {
    setSelectedDate(null);
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const prevMonth = () => {
    setSelectedDate(null);
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  if (loading) {
    return <div className="p-8 text-gray-500">Loading dashboard…</div>;
  }

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="bg-blue-600 text-white p-6 rounded-xl">
        <h1 className="text-2xl font-bold">
          {employee?.name || "Employee"}
        </h1>

        <div className="flex justify-between items-center mt-2">
          <button onClick={prevMonth} className="text-xl">
            &lt;
          </button>
          <span className="font-semibold">
            {new Date(currentYear, currentMonth - 1).toLocaleString("default", {
              month: "long",
            })}{" "}
            {currentYear}
          </span>
          <button onClick={nextMonth} className="text-xl">
            &gt;
          </button>
        </div>

        {/* ================= CALENDAR ================= */}
        <div className="flex gap-2 overflow-x-auto mt-4 pb-2">
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const key = `${currentYear}-${String(currentMonth).padStart(
              2,
              "0"
            )}-${String(day).padStart(2, "0")}`;

            const record = attendanceMap[key];

            return (
              <div
                key={day}
                onClick={() => setSelectedDate(day)}
                className={`min-w-[60px] p-3 text-center rounded-lg cursor-pointer ${
                  selectedDate === day
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }`}
              >
                <div className="font-bold">{day}</div>
                <div className="text-xs">
                  {record ? `${record.hours}h` : "0h"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= DAY DETAILS ================= */}
      <div className="bg-blue-600 text-white p-8 rounded-2xl text-center">
        {selectedRecord ? (
          <>
            <h3 className="opacity-80">{selectedRecord.date}</h3>
            <h1 className="text-6xl font-bold mt-2">
              {selectedRecord.hours}h {selectedRecord.minutes}m
            </h1>
            <p className="mt-4">
              {selectedRecord.in_time || "--"} –{" "}
              {selectedRecord.out_time || "--"}
            </p>
          </>
        ) : (
          <h3>Select a day</h3>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;