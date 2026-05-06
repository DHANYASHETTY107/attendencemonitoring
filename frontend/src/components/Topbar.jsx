import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between">
      <h1 className="font-semibold">Dashboard</h1>
      <button
        className="text-red-500"
        onClick={() => {
          localStorage.clear();
          navigate("/login", { replace: true });
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Topbar;
