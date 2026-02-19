import { useParams } from "react-router-dom";

const Month = () => {
  const { userId } = useParams();

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-4">
        Monthly Attendance
      </h2>

      <p className="text-gray-600 mb-4">
        User ID: {userId}
      </p>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">In</th>
            <th className="p-2 border">Out</th>
            <th className="p-2 border">Work</th>
            <th className="p-2 border">Idle</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2 border">01 Oct</td>
            <td className="p-2 border">09:30</td>
            <td className="p-2 border">18:30</td>
            <td className="p-2 border">08:00</td>
            <td className="p-2 border">01:00</td>
          </tr>
          <tr>
            <td className="p-2 border">02 Oct</td>
            <td colSpan="4" className="p-2 border text-center text-red-500">
              Absent
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Month;
;
