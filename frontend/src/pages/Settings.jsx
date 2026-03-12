
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../services/api";

// const Settings = () => {

//   const navigate = useNavigate();

//   const user = JSON.parse(localStorage.getItem("user"));

//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const changePassword = async () => {

//     if (!password || !confirmPassword) {
//       alert("Please fill all fields");
//       return;
//     }

//     if (password !== confirmPassword) {
//       alert("Passwords do not match");
//       return;
//     }

//     try {

//       setLoading(true);

//       await API.post("/users/change-password", {
//         userId: user.id,
//         password: password
//       });

//       alert("Password updated successfully");

//       // redirect back to dashboard
//       navigate(`/user/${user.emp_code}/dashboard`);

//     } catch (err) {

//       console.error(err);
//       alert("Failed to update password");

//     } finally {
//       setLoading(false);
//     }

//   };

//   return (
//     <div className="p-8 max-w-xl">

//       <h1 className="text-2xl font-bold mb-6">
//         Settings
//       </h1>

//       <div className="bg-white shadow rounded p-6 space-y-4">

//         <h2 className="text-lg font-semibold">
//           Change Password
//         </h2>

//         <div>
//           <label className="block text-sm mb-1">
//             New Password
//           </label>

//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="border w-full p-2 rounded"
//             placeholder="Enter new password"
//           />
//         </div>

//         <div>
//           <label className="block text-sm mb-1">
//             Confirm Password
//           </label>

//           <input
//             type="password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             className="border w-full p-2 rounded"
//             placeholder="Confirm password"
//           />
//         </div>

//         <button
//           onClick={changePassword}
//           disabled={loading}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           {loading ? "Updating..." : "Change Password"}
//         </button>

//       </div>

//     </div>
//   );
// };

// export default Settings;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Settings = () => {

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const changePassword = async () => {

    if (!password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {

      setLoading(true);

      await API.post("/users/change-password", {
        userId: user.id,
        password: password
      });

      alert("Password updated successfully");

      navigate(`/user/${user.emp_code}/dashboard`);

    } catch (err) {

      console.error(err);
      alert("Failed to update password");

    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="p-8 max-w-xl">

      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="bg-white shadow rounded p-6 space-y-4">

        <h2 className="text-lg font-semibold">Change Password</h2>

        {/* New Password */}
        <div>
          <label className="block text-sm mb-1">New Password</label>

          <div className="relative">

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border w-full p-2 rounded pr-10"
              placeholder="Enter new password"
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 cursor-pointer text-gray-500"
            >
              {showPassword ? "🙈" : "👁"}
            </span>

          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm mb-1">Confirm Password</label>

          <div className="relative">

            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border w-full p-2 rounded pr-10"
              placeholder="Confirm password"
            />

            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2 cursor-pointer text-gray-500"
            >
              {showConfirmPassword ? "🙈" : "👁"}
            </span>

          </div>
        </div>

        <button
          onClick={changePassword}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Updating..." : "Change Password"}
        </button>

      </div>

    </div>
  );
};

export default Settings;