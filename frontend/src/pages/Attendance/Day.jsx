
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import API from "../../services/api";

const Day = () => {
  const { userId, date } = useParams();

  // Use route `:date` if provided, otherwise default to today
  const [selectedDate, setSelectedDate] = useState(
    date || null
  );

  const [dayData, setDayData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDay = async (d) => {
      try {
        const res = await API.get(`/attendance/user/${userId}/day/${d}`);
        return res.data; // may be null
      } catch (err) {
        console.error("Day attendance error:", err);
        return null;
      }
    };

    const init = async () => {
      // If date provided via route, use it
      if (date) {
        setSelectedDate(date);
        await fetchDay(date);
        return;
      }

      // Otherwise fetch employee month list (dashboard) and pick the latest date
      try {
        const res = await API.get(`/attendance/employee/${userId}`);
        if (Array.isArray(res.data) && res.data.length > 0) {
          const last = res.data[res.data.length - 1];
          const d = last.date; // backend returns DATE(date) as date (yyyy-mm-dd)
          setSelectedDate(d);

          const dayRes = await fetchDay(d);
          if (dayRes) {
            setDayData(dayRes);
            setLoading(false);
            return;
          }

          // Fallback: build dayData from the dashboard row if specific day endpoint returned null
          const workMinutes = (last.hours || 0) * 60 + (last.minutes || 0);
          const idleMinutes = (last.idle_hours || 0) * 60 + (last.idle_minutes || 0);

          setDayData({
            date: last.date,
            in_time: last.in_time || null,
            out_time: last.out_time || null,
            work_minutes: workMinutes,
            idle_minutes: idleMinutes,
          });

          setLoading(false);
          return;
        }

        // no attendance rows
        setDayData(null);
      } catch (err) {
        console.error("Day init error:", err);
        setDayData(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [userId, date]);

  const navigate = useNavigate();

  const formatISO = (d) => d.toISOString().split("T")[0];

  const changeBy = async (days) => {
    if (!selectedDate) return;
    const dt = new Date(selectedDate);
    dt.setDate(dt.getDate() + days);
    const newDate = formatISO(dt);

    setLoading(true);
    setSelectedDate(newDate);

    // update URL so user can share/bookmark
    navigate(`/user/${userId}/attendance/day/${newDate}`);

    try {
      const res = await API.get(`/attendance/user/${userId}/day/${newDate}`);
      if (res.data) {
        setDayData(res.data);
      } else {
        setDayData(null);
      }
    } catch (err) {
      console.error("Day change fetch error:", err);
      setDayData(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading…</div>;

  // Determine which date to display
  const displayedDate = selectedDate || dayData?.date || new Date().toISOString().split("T")[0];

  // Determine status: Sunday, Holiday, Present or Absent
  const weekday = new Date(displayedDate).getDay();
  let status = "Absent";
  if (weekday === 0) status = "Sunday";
  else if (displayedDate === "2025-12-25") status = "Holiday";
  else if (dayData && (dayData.work_minutes || 0) > 0) status = "Present";

  const formatMinutes = (m) =>
    `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(
      2,
      "0"
    )}`;

  // Values to show when dayData is missing
  const workMinutes = dayData ? dayData.work_minutes || 0 : 0;
  const idleMinutes = dayData ? dayData.idle_minutes || 0 : 0;
  const inTime = dayData?.in_time ? dayData.in_time.slice(0, 5) : "--";
  const outTime = dayData?.out_time ? dayData.out_time.slice(0, 5) : "--";

  const badgeClasses =
    status === "Present"
      ? "bg-green-100 text-green-700"
      : status === "Sunday"
      ? "bg-gray-100 text-gray-700"
      : status === "Holiday"
      ? "bg-blue-100 text-blue-700"
      : "bg-red-100 text-red-700";

  return (
    <div className="space-y-6 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center bg-white p-4 rounded shadow">
        <div className="flex items-center gap-4">
          <button
            className="p-2 rounded hover:bg-gray-100"
            onClick={() => changeBy(-1)}
            aria-label="Previous day"
          >
            <ChevronLeft />
          </button>

          <h2 className="font-bold">{new Date(displayedDate).toDateString()}</h2>

          <button
            className="p-2 rounded hover:bg-gray-100"
            onClick={() => changeBy(1)}
            aria-label="Next day"
          >
            <ChevronRight />
          </button>
        </div>
        <span className={`${badgeClasses} px-3 py-1 rounded text-xs`}>{status.toUpperCase()}</span>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-600 text-white p-4 rounded">
          <p>Total Work</p>
          <h2 className="text-2xl">{formatMinutes(workMinutes)}</h2>
        </div>

        <div className="bg-white p-4 rounded border">
          <p>Time</p>
          <h2 className="text-xl">{inTime} – {outTime}</h2>
        </div>

        <div className="bg-white p-4 rounded border">
          <p>Idle</p>
          <h2 className="text-2xl">{formatMinutes(idleMinutes)}</h2>
        </div>
      </div>
    </div>
  );
};

export default Day;
