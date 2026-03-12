
// import { useState } from "react";
// import api from "../services/api";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const login = async () => {
//     if (!email || !password) {
//       alert("Please enter both email and password.");
//       return;
//     }

//     try {
//       const res = await api.post("/auth/login", { email, password });

//       // store token
//       localStorage.setItem("token", res.data.token);

//       // NEW: store logged in user info (role + emp_code)
//       localStorage.setItem("user", JSON.stringify(res.data.user));

//       // redirect
//       window.location.href = "/";
      
//     } catch (err) {
//       if (err.response) {
//         if (err.response.status === 401) {
//           alert("Invalid credentials, please try again.");
//         } else if (err.response.status === 404) {
//           alert("User not found. Please register first.");
//         } else {
//           alert(`Login failed: ${err.response.data.message || err.response.status}`);
//         }
//       } else {
//         alert("Login request failed. Please check your network or try again later.");
//       }
//       console.error("Login error:", err);
//     }
//   };

//   return (
//     <div className="h-screen flex justify-center items-center bg-gray-100">
//       <div className="bg-white p-6 rounded shadow w-80">
//         <h2 className="text-xl mb-4">Login</h2>

//         <input
//           className="border p-2 w-full mb-2"
//           placeholder="Email"
//           onChange={e => setEmail(e.target.value)}
//         />

//         <input
//           type="password"
//           className="border p-2 w-full mb-4"
//           placeholder="Password"
//           onChange={e => setPassword(e.target.value)}
//         />

//         <button
//           onClick={login}
//           className="bg-blue-600 text-white w-full p-2"
//         >
//           Login
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Login;
import { useState } from "react";
import api from "../services/api";

const Login = () => {
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

      window.location.href = "/";
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          alert("Invalid password");
        } else if (err.response.status === 404) {
          alert("User not found");
        } else {
          alert("Login failed");
        }
      } else {
        alert("Server error");
      }
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-700">

      <div className="bg-white p-8 rounded-xl shadow-lg w-96">

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