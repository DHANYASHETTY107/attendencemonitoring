
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import API from "../services/api";

const Reports = () => {
  const { userId } = useParams();

  const [data, setData] = useState([]);
  const [visibleData, setVisibleData] = useState([]);
  const [totalTime, setTotalTime] = useState("0h 0m");
  const [startIndex, setStartIndex] = useState(0);

  // NEW
  const [month, setMonth] = useState(12);

  const ITEMS_PER_PAGE = 15;

  useEffect(() => {
    fetchReport();
  }, [userId, month]);

  useEffect(() => {
    const slice = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    setVisibleData(slice);
  }, [data, startIndex]);

  const fetchReport = async () => {
    try {
      const res = await API.get(`/attendance/report/${userId}?month=${month}`);

      const reportData = res.data;

      let totalMinutes = 0;

      reportData.forEach((d) => {
        if (d.hours) {
          totalMinutes += Math.round(d.hours * 60);
        }
      });

      const h = Math.floor(totalMinutes / 60);
      const m = totalMinutes % 60;

      setTotalTime(`${h}h ${m}m`);
      setData(reportData);
      setStartIndex(0);
    } catch (err) {
      console.error("Report error:", err);
    }
  };

  const handleNext = () => {
    if (startIndex + ITEMS_PER_PAGE < data.length) {
      setStartIndex(startIndex + ITEMS_PER_PAGE);
    }
  };

  const handlePrev = () => {
    if (startIndex - ITEMS_PER_PAGE >= 0) {
      setStartIndex(startIndex - ITEMS_PER_PAGE);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-3 rounded-md bg-blue-600 p-4 text-white sm:flex-row sm:items-center sm:justify-between">
        <span className="text-base font-bold uppercase sm:text-xl">
          ATTENDANCE REPORT ({month === 11 ? "November" : "December"})
        </span>
        <span className="text-sm font-semibold sm:text-base">{totalTime}</span>
      </div>

      {/* Month Switch */}
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={() => setMonth(11)}
          className={`px-4 py-1 rounded ${month === 11 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          November
        </button>

        <button
          onClick={() => setMonth(12)}
          className={`px-4 py-1 rounded ${month === 12 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          December
        </button>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-base font-semibold sm:text-lg">

        <button
          onClick={handlePrev}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          {"<"}
        </button>

        <span>
          {startIndex + 1} -{" "}
          {Math.min(startIndex + ITEMS_PER_PAGE, data.length)}
        </span>

        <button
          onClick={handleNext}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          {">"}
        </button>

      </div>

      {/* Chart */}
      <div className="rounded-2xl bg-white p-4 shadow-lg sm:p-8">
        <div className="h-[280px] w-full sm:h-[360px] lg:h-[450px]">

          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={visibleData}>

              <CartesianGrid vertical={false} stroke="#f0f0f0" />

              <XAxis dataKey="day" tick={{ fontSize: 11 }} />

              <YAxis tickFormatter={(v) => `${v}h`} tick={{ fontSize: 11 }} />

              <Tooltip />

              <Bar
                dataKey="hours"
                fill="#1061d4"
                radius={[6, 6, 0, 0]}
                label={(props) => {
                  const { x, y, width, index } = props;
                  const item = visibleData[index];

                  if (!item) return null;

                  if (item.display === "Absent") {
                    return (
                      <text
                        x={x + width / 2}
                        y={y - 10}
                        fill="red"
                        fontSize="11"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        A
                      </text>
                    );
                  }

                  if (item.display === "Sunday") {
                    return (
                      <text
                        x={x + width / 2}
                        y={y - 10}
                        fill="gray"
                        fontSize="11"
                        textAnchor="middle"
                      >
                        S
                      </text>
                    );
                  }

                  return (
                    <text
                      x={x + width / 2}
                      y={y - 10}
                      fill="#333"
                      fontSize="11"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {item.display}
                    </text>
                  );
                }}
              />

            </BarChart>
          </ResponsiveContainer>

        </div>
      </div>

    </div>
  );
};

export default Reports;
