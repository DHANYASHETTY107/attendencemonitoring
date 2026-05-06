import React, { useEffect, useMemo, useState } from "react";
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const empRes = await API.get(`/employees/${userId}`);
        const emp = empRes.data;
        setEmployee(emp);

        if (!emp?.id) {
          setAttendance([]);
          return;
        }

        const attRes = await API.get(`/attendance/employee/${emp.id}`);
        const normalized = attRes.data.map((record) => {
          const date = new Date(record.date);

          return {
            ...record,
            date:
              date.getFullYear() +
              "-" +
              String(date.getMonth() + 1).padStart(2, "0") +
              "-" +
              String(date.getDate()).padStart(2, "0"),
          };
        });

        setAttendance(normalized);
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const attendanceMap = useMemo(() => {
    const map = {};

    attendance.forEach((record) => {
      map[record.date] = record;
    });

    return map;
  }, [attendance]);

  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

  const selectedKey = selectedDate
    ? `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(
        selectedDate
      ).padStart(2, "0")}`
    : null;

  const selectedRecord = selectedKey ? attendanceMap[selectedKey] : null;

  const nextMonth = () => {
    setSelectedDate(null);

    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((year) => year + 1);
    } else {
      setCurrentMonth((month) => month + 1);
    }
  };

  const prevMonth = () => {
    setSelectedDate(null);

    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((year) => year - 1);
    } else {
      setCurrentMonth((month) => month - 1);
    }
  };

  if (loading) {
    return <div className="p-4 text-gray-500 sm:p-8">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-blue-600 p-4 text-white sm:p-6">
        <h1 className="text-xl font-bold sm:text-2xl">
          {employee?.name || "Employee"}
        </h1>

        <div className="mt-3 flex items-center justify-between gap-3">
          <button
            onClick={prevMonth}
            className="rounded-md p-2 text-xl hover:bg-white/10"
          >
            &lt;
          </button>

          <span className="text-center text-sm font-semibold sm:text-base">
            {new Date(currentYear, currentMonth - 1).toLocaleString("default", {
              month: "long",
            })}{" "}
            {currentYear}
          </span>

          <button
            onClick={nextMonth}
            className="rounded-md p-2 text-xl hover:bg-white/10"
          >
            &gt;
          </button>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {Array.from({ length: daysInMonth }, (_, index) => index + 1).map(
            (day) => {
              const key = `${currentYear}-${String(currentMonth).padStart(
                2,
                "0"
              )}-${String(day).padStart(2, "0")}`;
              const record = attendanceMap[key];
              const date = new Date(key);

              let label = "";

              if (record) {
                label = `${record.hours}h ${record.minutes}m`;
              } else if (date.getDay() === 0) {
                label = "Sunday";
              } else if (key === "2025-12-25") {
                label = "Holiday";
              } else {
                label = "Absent";
              }

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDate(day)}
                  className={`cursor-pointer rounded-lg p-2 text-center sm:p-3 ${
                    selectedDate === day
                      ? "bg-black text-white"
                      : "bg-white text-black"
                  } min-w-[64px] sm:min-w-[70px]`}
                >
                  <div className="font-bold">{day}</div>
                  <div className="mt-1 text-[11px] sm:text-xs">{label}</div>
                </div>
              );
            }
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-blue-600 p-5 text-center text-white sm:p-8">
        {selectedRecord ? (
          <>
            <h3 className="opacity-80">{selectedRecord.date}</h3>
            <h1 className="mt-2 text-4xl font-bold sm:text-6xl">
              {selectedRecord.hours}h {selectedRecord.minutes}m
            </h1>
            <p className="mt-4">
              {selectedRecord.in_time || "--"} - {selectedRecord.out_time || "--"}
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
