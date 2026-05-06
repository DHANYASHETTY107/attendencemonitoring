import { useEffect, useState } from "react";
import api from "../../services/api";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    const res = await api.get("/departments");
    setDepartments(res.data);
  };

  const addDepartment = async () => {
    if (!name.trim()) return;

    await api.post("/departments", { name, description });
    setShow(false);
    setName("");
    setDescription("");
    fetchDepartments(); // refresh from DB
  };

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold">Departments</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          onClick={() => setShow(true)}
        >
          + Add Department
        </button>
      </div>

      {/* Table Card */}
      <div className="overflow-hidden rounded-lg border bg-white shadow">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-6 py-3 text-sm font-semibold text-gray-700 w-20">
                ID
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                Department Name
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                Description
              </th>
            </tr>
          </thead>

          <tbody>
            {departments.length === 0 ? (
              <tr>
                <td
                  colSpan="3"
                  className="text-center py-6 text-gray-500"
                >
                  No departments found
                </td>
              </tr>
            ) : (
              departments.map((dept) => (
                <tr
                  key={dept.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {dept.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {dept.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {dept.description}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          </table>
        </div>
      </div>

      {/* Add Department Modal */}
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h3 className="font-semibold text-lg mb-4">
              Add Department
            </h3>

            <input
              placeholder="Department Name"
              className="border px-3 py-2 w-full mb-3 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <textarea
              placeholder="Description"
              className="border px-3 py-2 w-full mb-4 rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShow(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={addDepartment}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;
