import { useParams } from "react-router-dom";

const Day = () => {
  const { userId } = useParams();

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-3">
        Day Attendance
      </h2>

      <p className="text-gray-600 mb-2">
        User ID: {userId}
      </p>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">In Time</th>
            <th className="p-2 border">Out Time</th>
            <th className="p-2 border">Work Hours</th>
            <th className="p-2 border">Idle Time</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2 border">09:30</td>
            <td className="p-2 border">18:30</td>
            <td className="p-2 border">08:00</td>
            <td className="p-2 border">01:00</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Day;
