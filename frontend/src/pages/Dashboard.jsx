
import React, { useEffect, useState } from "react";
import API from "../services/api";

const Dashboard = () => {

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {

        const res = await API.get("/attendance/month-summary");
        setData(res.data);

      } catch (err) {
        console.error("Dashboard summary error:", err);
      }
    };

    fetchSummary();
  }, []);

  return (

    <div className="space-y-6">

      <h1 className="text-2xl font-bold text-blue-900 sm:text-3xl">
        Attendance Summary (Nov & Dec)
      </h1>

      <div className="overflow-hidden rounded-xl bg-white shadow">

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">

            <thead className="bg-gray-50 text-xs uppercase text-gray-500 sm:text-sm">

              <tr>

                <th className="p-3 text-left sm:p-4">Employee</th>

                <th className="p-3 text-center sm:p-4">Nov Present</th>
                <th className="p-3 text-center sm:p-4">Nov Absent</th>

                <th className="p-3 text-center sm:p-4">Dec Present</th>
                <th className="p-3 text-center sm:p-4">Dec Absent</th>

              </tr>

            </thead>

            <tbody>

              {data.map((emp, i) => (

                <tr key={i} className="border-t hover:bg-gray-50">

                  <td className="p-3 font-semibold sm:p-4">{emp.name}</td>

                  <td className="p-3 text-center font-bold text-green-600 sm:p-4">
                    {emp.nov_present}
                  </td>

                  <td className="p-3 text-center font-bold text-red-500 sm:p-4">
                    {emp.nov_absent}
                  </td>

                  <td className="p-3 text-center font-bold text-green-600 sm:p-4">
                    {emp.dec_present}
                  </td>

                  <td className="p-3 text-center font-bold text-red-500 sm:p-4">
                    {emp.dec_absent}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>
        </div>

      </div>

    </div>

  );
};

export default Dashboard;
