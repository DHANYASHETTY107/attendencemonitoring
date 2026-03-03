
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import API from "../../services/api";

const Day = () => {
  const { userId } = useParams();

  // TEMP (can be dynamic later)
  const selectedDate = "2025-12-17";

  const [dayData, setDayData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDay = async () => {
      try {
        const res = await API.get(
          `/attendance/user/${userId}/day/${selectedDate}`
        );
        setDayData(res.data);
      } catch (err) {
        console.error("Day attendance error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDay();
  }, [userId]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (!dayData) return <div className="p-6 text-red-500">No data available</div>;

  const formatMinutes = (m) =>
    `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(
      2,
      "0"
    )}`;

  return (
    <div className="space-y-6 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center bg-white p-4 rounded shadow">
        <div className="flex items-center gap-4">
          <ChevronLeft />
          <h2 className="font-bold">
            {new Date(dayData.date).toDateString()}
          </h2>
          <ChevronRight />
        </div>
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs">
          PRESENT
        </span>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-600 text-white p-4 rounded">
          <p>Total Work</p>
          <h2 className="text-2xl">
            {formatMinutes(dayData.work_minutes)}
          </h2>
        </div>

        <div className="bg-white p-4 rounded border">
          <p>Time</p>
          <h2 className="text-xl">
            {dayData.in_time?.slice(0, 5)} – {dayData.out_time?.slice(0, 5)}
          </h2>
        </div>

        <div className="bg-white p-4 rounded border">
          <p>Idle</p>
          <h2 className="text-2xl">
            {formatMinutes(dayData.idle_minutes)}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Day;
