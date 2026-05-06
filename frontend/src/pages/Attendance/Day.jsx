import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import API from "../../services/api";

const Day = () => {
  const { userId, date } = useParams();
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(date || null);
  const [dayData, setDayData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDay = async (value) => {
      try {
        const res = await API.get(`/attendance/user/${userId}/day/${value}`);
        return res.data;
      } catch (err) {
        console.error("Day attendance error:", err);
        return null;
      }
    };

    const init = async () => {
      if (date) {
        setSelectedDate(date);
        const data = await fetchDay(date);
        setDayData(data);
        setLoading(false);
        return;
      }

      try {
        const res = await API.get(`/attendance/employee/${userId}`);

        if (Array.isArray(res.data) && res.data.length > 0) {
          const last = res.data[res.data.length - 1];
          const latestDate = last.date;
          setSelectedDate(latestDate);

          const data = await fetchDay(latestDate);

          if (data) {
            setDayData(data);
            setLoading(false);
            return;
          }

          const workMinutes = (last.hours || 0) * 60 + (last.minutes || 0);
          const idleMinutes =
            (last.idle_hours || 0) * 60 + (last.idle_minutes || 0);

          setDayData({
            date: last.date,
            in_time: last.in_time || null,
            out_time: last.out_time || null,
            work_minutes: workMinutes,
            idle_minutes: idleMinutes,
          });
        } else {
          setDayData(null);
        }
      } catch (err) {
        console.error("Day init error:", err);
        setDayData(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [date, userId]);

  const formatISO = (value) => value.toISOString().split("T")[0];

  const changeBy = async (days) => {
    if (!selectedDate) return;

    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + days);

    const formattedDate = formatISO(nextDate);
    setLoading(true);
    setSelectedDate(formattedDate);
    navigate(`/user/${userId}/attendance/day/${formattedDate}`);

    try {
      const res = await API.get(`/attendance/user/${userId}/day/${formattedDate}`);
      setDayData(res.data || null);
    } catch (err) {
      console.error("Day change fetch error:", err);
      setDayData(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  const displayedDate =
    selectedDate || dayData?.date || new Date().toISOString().split("T")[0];
  const weekday = new Date(displayedDate).getDay();
  const holidays = {
    "2025-12-25": "Holiday",
  };

  let status = "Absent";

  if (weekday === 0) {
    status = "Sunday";
  } else if (holidays[displayedDate]) {
    status = holidays[displayedDate];
  } else if (dayData && (dayData.work_minutes || 0) > 0) {
    status = "Present";
  }

  const formatMinutes = (minutes) =>
    `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(
      minutes % 60
    ).padStart(2, "0")}`;

  const workMinutes = status === "Present" ? dayData?.work_minutes || 0 : 0;
  const idleMinutes = status === "Present" ? dayData?.idle_minutes || 0 : 0;
  const inTime =
    status === "Present" && dayData?.in_time ? dayData.in_time.slice(0, 5) : "--";
  const outTime =
    status === "Present" && dayData?.out_time ? dayData.out_time.slice(0, 5) : "--";

  const badgeClasses =
    status === "Present"
      ? "bg-green-100 text-green-700"
      : status === "Sunday"
      ? "bg-gray-100 text-gray-700"
      : status === "Holiday"
      ? "bg-blue-100 text-blue-700"
      : "bg-red-100 text-red-700";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded bg-white p-4 shadow sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            className="rounded p-2 hover:bg-gray-100"
            onClick={() => changeBy(-1)}
            aria-label="Previous day"
          >
            <ChevronLeft />
          </button>

          <h2 className="text-sm font-bold sm:text-base">
            {new Date(displayedDate).toDateString()}
          </h2>

          <button
            className="rounded p-2 hover:bg-gray-100"
            onClick={() => changeBy(1)}
            aria-label="Next day"
          >
            <ChevronRight />
          </button>
        </div>

        <span className={`${badgeClasses} w-fit rounded px-3 py-1 text-xs`}>
          {status.toUpperCase()}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded bg-blue-600 p-4 text-white">
          <p>Total Work</p>
          <h2 className="text-2xl">{formatMinutes(workMinutes)}</h2>
        </div>

        <div className="rounded border bg-white p-4">
          <p>Time</p>
          <h2 className="text-xl">
            {inTime} - {outTime}
          </h2>
        </div>

        <div className="rounded border bg-white p-4">
          <p>Idle</p>
          <h2 className="text-2xl">{formatMinutes(idleMinutes)}</h2>
        </div>
      </div>
    </div>
  );
};

export default Day;
