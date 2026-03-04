import { useState } from "react";
import api from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      window.location.href = "/";
    } catch (err) {
      // axios throws for status codes outside 2xx
      if (err.response) {
        // server responded with status code
        if (err.response.status === 401) {
          alert("Invalid credentials, please try again.");
        } else if (err.response.status === 404) {
          alert("User not found. Please register first.");
        } else {
          alert(`Login failed: ${err.response.data.message || err.response.status}`);
        }
      } else {
        alert("Login request failed. Please check your network or try again later.");
      }
      console.error("Login error:", err);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl mb-4">Login</h2>
        <input className="border p-2 w-full mb-2" placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input type="password" className="border p-2 w-full mb-4" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button onClick={login} className="bg-blue-600 text-white w-full p-2">Login</button>
      </div>
    </div>
  );
};

export default Login;
