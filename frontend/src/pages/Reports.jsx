
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

  const ITEMS_PER_PAGE = 15;

  useEffect(() => {
    fetchReport();
  }, [userId]);

  useEffect(() => {
    const slice = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    setVisibleData(slice);
  }, [data, startIndex]);

  const fetchReport = async () => {
    try {
      const res = await API.get(`/attendance/report/${userId}`);
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
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-md font-bold text-xl uppercase flex justify-between">
        <span>ATTENDANCE REPORT</span>
        <span>{totalTime}</span>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-6 font-semibold text-lg">

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
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <div className="h-[450px] w-full">

          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={visibleData}>

              <CartesianGrid vertical={false} stroke="#f0f0f0" />

              <XAxis dataKey="day" />

              <YAxis tickFormatter={(v) => `${v}h`} />

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