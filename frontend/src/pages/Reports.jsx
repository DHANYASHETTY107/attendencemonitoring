
// import React from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// // Custom label component
// const CustomLabel = (props) => {
//   const { x, y, width, value, index } = props;
//   const displayValue = reportData[index]?.display || '';
//   return (
//     <text 
//       x={x + width / 2} 
//       y={y - 5} 
//       fill="#333" 
//       fontSize={11} 
//       fontWeight="bold" 
//       textAnchor="middle"
//     >
//       {displayValue}
//     </text>
//   );
// };

// // 1. Dummy data based on your image
// const reportData = [
//   { day: '01', hours: 8.18, display: '08h 11m' },
//   { day: '02', hours: 0.1, display: '00m' }, // Small value to show label
//   { day: '03', hours: 8.08, display: '08h 05m' },
//   { day: '04', hours: 8.60, display: '08h 36m' },
//   { day: '05', hours: 0.1, display: '00m' },
//   { day: '06', hours: 8.26, display: '08h 16m' },
//   { day: '07', hours: 7.98, display: '07h 59m' },
//   { day: '08', hours: 8.95, display: '08h 57m' },
//   { day: '09', hours: 8.65, display: '08h 39m' },
//   { day: '10', hours: 8.25, display: '08h 15m' },
//   { day: '11', hours: 7.91, display: '07h 55m' },
//   { day: '12', hours: 0.1, display: '00m' },
//   { day: '13', hours: 8.45, display: '08h 27m' },
//   { day: '14', hours: 1.76, display: '01h 46m' },
//   { day: '15', hours: 0.1, display: '00m' },
// ];

// const Reports = () => {
//   return (
//     <div className="p-2 space-y-6">
      
//       {/* Blue Header Bar */}
//       <div className="bg-blue-600 text-white p-4 rounded-md shadow-sm">
//         <h1 className="text-xl font-bold">Milan Gangadiya</h1>
//       </div>

//       {/* Filter Buttons & Date Display */}
//       <div className="flex flex-col items-end space-y-3">
//         <div className="flex border border-blue-200 rounded-full p-1 bg-white shadow-sm">
//           {['Day', 'Week', 'Month', 'Date Range'].map((tab) => (
//             <button
//               key={tab}
//               className={`px-6 py-1.5 rounded-full text-sm font-medium transition ${
//                 tab === 'Date Range' ? 'bg-blue-700 text-white' : 'text-blue-700 hover:bg-blue-50'
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>
//         <div className="border border-blue-200 rounded-lg px-4 py-1 text-sm text-gray-500 bg-white shadow-sm">
//           01 Oct 2025 - 14 Oct 2025
//         </div>
//       </div>

//       {/* Main Chart Card */}
//       <div className="bg-white p-8 rounded-2xl shadow-lg relative border border-gray-100">
        
//         {/* Total Time Top Right */}
//         <div className="absolute top-6 right-10 text-3xl font-black text-gray-800">
//           85h 10m
//         </div>

//         {/* Chart Container */}
//         <div className="h-[450px] w-full mt-10">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart data={reportData} margin={{ top: 30, right: 30, left: 0, bottom: 20 }}>
//               <CartesianGrid vertical={false} stroke="#f0f0f0" />
              
//               <XAxis 
//                 dataKey="day" 
//                 axisLine={false} 
//                 tickLine={false} 
//                 tick={{fontSize: 12, fill: '#999'}} 
//                 dy={15}
//               />
              
//               <YAxis 
//                 axisLine={false} 
//                 tickLine={false} 
//                 tick={{fontSize: 12, fill: '#999'}}
//                 tickFormatter={(value) => `${value}h`}
//                 domain={[0, 11]}
//                 ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11]}
//               />

//               <Tooltip cursor={{fill: '#f8fafc'}} />

//               {/* Custom Label for top of bars */}
//               <Bar 
//                 dataKey="hours" 
//                 fill="#1061d4" 
//                 radius={[8, 8, 0, 0]} 
//                 barSize={50}
//                 label={<CustomLabel />}
//               />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default Reports;
import React from 'react';
import { useParams } from 'react-router-dom'; // 1. Import useParams
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const reportData = [
  { day: '01', hours: 8.18, display: '08h 11m' },
  { day: '02', hours: 0.1, display: '00m' },
  { day: '03', hours: 8.08, display: '08h 05m' },
  { day: '04', hours: 8.60, display: '08h 36m' },
  { day: '05', hours: 0.1, display: '00m' },
  { day: '06', hours: 8.26, display: '08h 16m' },
  { day: '07', hours: 7.98, display: '07h 59m' },
  { day: '08', hours: 8.95, display: '08h 57m' },
  { day: '09', hours: 8.65, display: '08h 39m' },
  { day: '10', hours: 8.25, display: '08h 15m' },
  { day: '11', hours: 7.91, display: '07h 55m' },
  { day: '12', hours: 0.1, display: '00m' },
  { day: '13', hours: 8.45, display: '08h 27m' },
  { day: '14', hours: 1.76, display: '01h 46m' },
  { day: '15', hours: 0.1, display: '00m' },
];

const Reports = () => {
  const { userId } = useParams(); // 2. Get the ID from the URL

  // 3. The Team List (Make sure IDs match your sidebar)
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

  // 4. Find the correct name
  const currentUser = teamMembers.find(u => u.id === parseInt(userId)) || { name: "User Not Found" };

  return (
    <div className="p-2 space-y-6">
      
      {/* 5. Blue Header Bar - NOW DYNAMIC */}
      <div className="bg-blue-600 text-white p-4 rounded-md shadow-sm font-bold text-xl uppercase tracking-wide">
        {currentUser.name}
      </div>

      {/* Filter Buttons Section */}
      <div className="flex flex-col items-end space-y-3">
        <div className="flex border border-blue-200 rounded-full p-1 bg-white shadow-sm">
          {['Day', 'Week', 'Month', 'Date Range'].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-1.5 rounded-full text-sm font-medium transition ${
                tab === 'Date Range' ? 'bg-blue-700 text-white' : 'text-blue-700 hover:bg-blue-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="border border-blue-200 rounded-lg px-4 py-1 text-sm text-gray-500 bg-white shadow-sm">
          01 Oct 2025 - 14 Oct 2025
        </div>
      </div>

      {/* Main Chart Card */}
      <div className="bg-white p-8 rounded-2xl shadow-lg relative border border-gray-100">
        
        <div className="absolute top-6 right-10 text-3xl font-black text-gray-800">
          85h 10m
        </div>

        <div className="h-[450px] w-full mt-10">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reportData} margin={{ top: 30, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#999'}} dy={15} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#999'}} tickFormatter={(v) => `${v}h`} domain={[0, 11]} />
              <Tooltip cursor={{fill: '#f8fafc'}} />
              <Bar 
  dataKey="hours" 
  fill="#1061d4" 
  radius={[8, 8, 0, 0]} 
  barSize={50}
  label={(props) => {
    const { x, y, width, index } = props;
    const labelText = reportData[index] ? reportData[index].display : "";
    return (
      <text x={x + width / 2} y={y - 10} fill="#333" fontSize={11} fontWeight="bold" textAnchor="middle">
        {labelText}
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