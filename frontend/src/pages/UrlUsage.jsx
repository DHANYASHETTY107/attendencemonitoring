import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useParams } from 'react-router-dom';

const UrlUsage = () => {
  const { userId } = useParams();

  // Team members list (same as MainLayout)
  const teamMembers = [
    { id: 1, name: "embstores" }, { id: 2, name: "navneet" },
    { id: 3, name: "Harshad Parmar" }, { id: 4, name: "Jigar Patel" },
    { id: 5, name: "krishnapal" }, { id: 6, name: "Manthan Vishwakarma" },
    { id: 7, name: "Nirav" }, { id: 8, name: "Ravi Vaghela" },
    { id: 9, name: "sandip" }, { id: 10, name: "krunal" },
    { id: 11, name: "HIREN" }, { id: 12, name: "Priyanka" },
    { id: 13, name: "akash" }, { id: 14, name: "Priya" },
    { id: 15, name: "bhumi hirpara" }, { id: 16, name: "arpit" }
  ];

  // Get the current user name based on userId
  const currentUser = userId ? teamMembers.find(u => u.id === parseInt(userId)) : null;
  const displayName = currentUser ? currentUser.name : "milan gangadiya";

  // 1. Dummy Data
  const usageData = [
    { name: 'Adobe After Effects 2021', time: '42min 17s', value: 42, color: '#f97316' }, // Orange
    { name: 'Adobe Premiere Pro 2023', time: '14min 11s', value: 14, color: '#eab308' }, // Yellow
    { name: 'Google Chrome', time: '11min 08s', value: 11, color: '#a5f3fc' },           // Light Blue
    { name: 'Slack', time: '07min 33s', value: 7, color: '#0ea5e9' },                    // Blue
    { name: 'Microsoft.Media.Player.exe', time: '05min 57s', value: 6, color: '#22c55e' }, // Green
    { name: 'Adobe Media Encoder 2021', time: '05min 18s', value: 5, color: '#a78bfa' },   // Purple
    { name: 'Windows Explorer', time: '04min 27s', value: 4, color: '#ef4444' },           // Red
    { name: 'Notepad.exe', time: '01min 04s', value: 1, color: '#d1d5db' },               // Gray
  ];

  return (
    <div className="p-4 space-y-6 text-gray-700">
      
      {/* 1. Header Section */}
      <div className="bg-blue-600 p-4 rounded-lg shadow flex justify-between items-center text-white">
        <h1 className="text-xl font-bold">{displayName}</h1>
        <div className="flex gap-3">
          <div className="bg-white text-blue-800 p-2 rounded-lg text-xs shadow">
            <p className="opacity-70">Total Usage Time</p>
            <p className="font-black text-lg">01h 33min</p>
          </div>
          <div className="bg-white text-blue-800 p-2 rounded-lg text-xs shadow border-l-4 border-blue-500">
            <p className="opacity-70">Top App</p>
            <p className="font-black text-lg">Adobe After Effects 2021</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* 2. Left Column: Filters and Chart */}
        <div className="w-full lg:w-1/3 space-y-4">
          
          {/* Filter Pills */}
          <div className="flex border border-blue-200 rounded-full p-1 bg-white inline-flex w-full">
            {['Day', 'Week', 'Month', 'Date Range'].map((t) => (
              <button key={t} className={`flex-1 py-1 text-xs rounded-full ${t === 'Day' ? 'bg-blue-600 text-white' : 'text-blue-600'}`}>{t}</button>
            ))}
          </div>

          {/* Dropdown Placeholder */}
          <div className="border border-blue-200 rounded-full px-4 py-2 flex justify-between items-center text-sm text-blue-700 font-bold">
            Application Used <span>▼</span>
          </div>

          {/* Pie Chart */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={usageData} dataKey="value" innerRadius={0} outerRadius={100} paddingAngle={2}>
                  {usageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="white" strokeWidth={2} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="space-y-2 text-[11px]">
            {usageData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }}></div>
                <span className="opacity-70">{item.name} — {item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Right Column: Usage Table */}
        <div className="flex-1 space-y-4">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-3 font-bold">App Name</th>
                  <th className="p-3 font-bold text-right border-l border-white/20">Total Time</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {usageData.map((app, i) => (
                  <tr key={i} className="hover:bg-blue-50/50">
                    <td className="p-3 font-bold text-sm text-gray-700">{app.name}</td>
                    <td className="p-3 text-right font-bold text-sm text-gray-800 border-l border-gray-100">{app.time}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-blue-50 font-black">
                <tr>
                  <td className="p-3 text-right text-sm">Total</td>
                  <td className="p-3 text-right text-sm text-blue-700 border-l border-white">01h 33min</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Pagination Placeholder */}
          <div className="flex justify-center items-center gap-2 mt-4 text-xs">
            <button className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100 text-blue-600">&lt;</button>
            <button className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold">1</button>
            <button className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100 text-blue-600">2</button>
            <button className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100 text-blue-600">&gt;</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UrlUsage;