
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Settings = () => {

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

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

    if (!user?.id) {
      alert("Session expired. Please login again.");
      navigate("/login", { replace: true });
      return;
    }

    try {

      setLoading(true);

      await API.post("/users/change-password", {
        userId: user.id,
        password
      });

      alert("Password updated successfully");
      setPassword("");
      setConfirmPassword("");

      navigate(`/user/${user.emp_code}/dashboard`);

    } catch (err) {

      console.error(err);
      const errorMessage =
        err?.response?.data?.message || err?.message || "Unknown error";
      alert(`Failed to update password: ${errorMessage}`);

    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="mx-auto w-full max-w-xl px-1 sm:px-0">

      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">Settings</h1>

      <div className="space-y-4 rounded-xl bg-white p-4 shadow sm:p-6">

        <h2 className="text-lg font-semibold">Change Password</h2>

        {/* New Password */}
        <div>
          <label className="block text-sm mb-1">New Password</label>

          <div className="relative">

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border p-3 pr-10"
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
              className="w-full rounded border p-3 pr-10"
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
          className="w-full rounded bg-blue-600 px-4 py-3 text-white hover:bg-blue-700 sm:w-auto"
        >
          {loading ? "Updating..." : "Change Password"}
        </button>

      </div>

    </div>
  );
};

export default Settings;
