import { useParams } from "react-router-dom";

const Calender = () => {
  const { userId } = useParams();

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-bold mb-3">
        Calender View
      </h2>

      <p className="text-gray-600">
        Calendar attendance for User ID: {userId}
      </p>

      <div className="mt-4 text-gray-500">
        (Calendar UI will be added later)
      </div>
    </div>
  );
};

export default Calender;

