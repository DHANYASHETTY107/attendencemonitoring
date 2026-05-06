import { useEffect, useState } from "react";
import api from "../../services/api";

const Sections = () => {
  const [sections, setSections] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchSections();
    fetchDepartments();
  }, []);

  const fetchSections = async () => {
    const res = await api.get("/sections");
    setSections(res.data);
  };

  const fetchDepartments = async () => {
    const res = await api.get("/departments");
    setDepartments(res.data);
  };

  const addSection = async () => {
    if (!name || !departmentId) return;

    await api.post("/sections", {
      name,
      department_id: departmentId,
      description
    });

    setShow(false);
    setName("");
    setDepartmentId("");
    setDescription("");
    fetchSections(); // refresh from DB
  };

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold">Sections</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          onClick={() => setShow(true)}
        >
          + Add Section
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border bg-white shadow">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-6 py-3 w-20">ID</th>
              <th className="px-6 py-3">Section Name</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Description</th>
            </tr>
          </thead>

          <tbody>
            {sections.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No sections found
                </td>
              </tr>
            ) : (
              sections.map((s) => (
                <tr key={s.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">{s.id}</td>
                  <td className="px-6 py-4">{s.name}</td>
                  <td className="px-6 py-4">{s.department}</td>
                  <td className="px-6 py-4">{s.description}</td>
                </tr>
              ))
            )}
          </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Add Section</h3>

            <input
              placeholder="Section Name"
              className="border px-3 py-2 w-full mb-3 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <select
              className="border px-3 py-2 w-full mb-3 rounded"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            <textarea
              placeholder="Description"
              className="border px-3 py-2 w-full mb-4 rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShow(false)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={addSection}
                className="bg-blue-600 text-white px-4 py-2 rounded"
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

export default Sections;
