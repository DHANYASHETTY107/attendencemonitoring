
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");

  const login = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/", { replace: true });
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          alert("Invalid password");
        } else if (err.response.status === 404) {
          alert("User not found");
        } else if (err.response.status === 503) {
          alert(err.response.data?.message || "Database connection failed");
        } else {
          const message = err.response?.data?.message || "Login failed";
          alert(`Login failed: ${message}`);
        }
      } else {
        alert(`Server error: ${err.message || "Unknown error"}`);
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-blue-700 px-4 py-8">

      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg sm:p-8">

        <h1 className="text-2xl font-bold text-center mb-2">
          Attendance System
        </h1>

        <p className="text-gray-500 text-center mb-6">
          Sign in with email and password
        </p>

        {/* ROLE SELECTOR */}
        <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setRole("employee")}
            className={`flex-1 py-2 rounded-lg ${
              role === "employee"
                ? "bg-blue-600 text-white"
                : "text-gray-600"
            }`}
          >
            Employee
          </button>

          <button
            onClick={() => setRole("admin")}
            className={`flex-1 py-2 rounded-lg ${
              role === "admin"
                ? "bg-blue-600 text-white"
                : "text-gray-600"
            }`}
          >
            Admin
          </button>
        </div>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Enter email"
          className="border p-3 rounded w-full mb-3"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Enter password"
          className="border p-3 rounded w-full mb-4"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* LOGIN BUTTON */}
        <button
          onClick={login}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded-lg font-semibold"
        >
          Login
        </button>

      </div>

    </div>
  );
};

export default Login;
