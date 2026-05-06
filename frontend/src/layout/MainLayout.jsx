import {
  FileText,
  Home,
  Menu,
  Settings,
  User,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import API from "../services/api";

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const pathParts = location.pathname.split("/");
  const userId = pathParts[1] === "user" ? pathParts[2] : null;

  const [employees, setEmployees] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await API.get("/employees");

        if (user?.role === "admin") {
          setEmployees(res.data);
        } else {
          setEmployees(res.data.filter((emp) => emp.id === user?.emp_code));
        }
      } catch (err) {
        console.error("Failed to load employees", err);
      }
    };

    fetchEmployees();
  }, [user?.emp_code, user?.role]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const navBase =
    "flex min-h-10 items-center rounded-md px-3 py-2 text-sm transition sm:text-base";

  const employeeLinkClass = ({ isActive }) =>
    `block rounded-lg px-4 py-2 text-sm font-bold transition-all ${
      isActive
        ? "bg-blue-50 text-blue-700 shadow-sm"
        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
    }`;

  const renderPrimaryNav = (mobile = false) => (
    <div
      className={
        mobile
          ? "flex flex-col gap-2"
          : "hidden min-w-0 flex-1 items-center gap-1 overflow-x-auto lg:flex"
      }
    >
      <NavLink
        to={userId ? `/user/${userId}/dashboard` : "/"}
        className={({ isActive }) =>
          `${navBase} ${
            isActive
              ? "border-b-2 border-white bg-white/20 font-bold"
              : "hover:bg-white/10"
          }`
        }
      >
        Dashboard
      </NavLink>

      <NavLink
        to={userId ? `/user/${userId}/attendance` : "#"}
        className={({ isActive }) =>
          `${navBase} ${
            !userId
              ? "pointer-events-none cursor-not-allowed opacity-40"
              : isActive
              ? "border-b-2 border-white bg-white/20 font-bold"
              : "hover:bg-white/10"
          }`
        }
      >
        Attendance
      </NavLink>

      {user?.role === "admin" && (
        <NavLink
          to={userId ? `/user/${userId}/url` : "#"}
          className={({ isActive }) =>
            `${navBase} ${
              !userId
                ? "pointer-events-none cursor-not-allowed opacity-40"
                : isActive
                ? "border-b-2 border-white bg-white/20 font-bold"
                : "hover:bg-white/10"
            }`
          }
        >
          URL
        </NavLink>
      )}

      <NavLink
        to={userId ? `/user/${userId}/report` : "#"}
        className={({ isActive }) =>
          `${navBase} ${
            !userId
              ? "pointer-events-none cursor-not-allowed opacity-40"
              : isActive
              ? "border-b-2 border-white bg-white/20 font-bold"
              : "hover:bg-white/10"
          }`
        }
      >
        Report
      </NavLink>

      {user?.role === "admin" && (
        <NavLink
          to="/masters/departments"
          className={({ isActive }) =>
            `${navBase} ${
              isActive
                ? "border-b-2 border-white bg-white/20 font-bold"
                : "hover:bg-white/10"
            }`
          }
        >
          Masters
        </NavLink>
      )}

      {user?.role === "admin" && (
        <button type="button" className={`${navBase} opacity-80 hover:bg-white/10`}>
          Time Claim
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <nav className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center gap-3 bg-[#1a73e8] px-4 text-white shadow-md sm:px-6">
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/20 lg:hidden"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="shrink-0 text-base font-bold italic tracking-tight sm:text-xl">
          ATTENDANCE
        </div>

        {renderPrimaryNav()}

        <button
          onClick={logout}
          className="ml-auto shrink-0 rounded bg-red-500 px-3 py-2 text-xs font-bold shadow-sm transition hover:bg-red-600 sm:px-4 sm:py-1.5 sm:text-sm"
        >
          Logout
        </button>
      </nav>

      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-x-4 top-20 z-40 rounded-2xl bg-white p-4 shadow-2xl lg:hidden">
            <div className="space-y-4">
              <div className="rounded-xl bg-[#1a73e8] p-3 text-white">
                {renderPrimaryNav(true)}
              </div>

              <div className="rounded-xl border border-gray-200">
                <div className="border-b px-4 py-3">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                    Team Members
                  </h3>
                </div>

                <div className="max-h-64 space-y-1 overflow-y-auto px-2 py-3">
                  {employees.map((emp) => (
                    <NavLink
                      key={emp.id}
                      to={`/user/${emp.id}/dashboard`}
                      className={employeeLinkClass}
                    >
                      {emp.name}
                    </NavLink>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <NavLink
                  to={`/user/${user?.emp_code}/dashboard`}
                  className="rounded-xl border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700"
                >
                  Profile
                </NavLink>
                <NavLink
                  to={`/user/${user?.emp_code}/settings`}
                  className="rounded-xl border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700"
                >
                  Settings
                </NavLink>
              </div>
            </div>
          </div>
        </>
      )}

      <aside className="fixed top-16 left-0 z-40 hidden h-[calc(100vh-64px)] w-16 flex-col items-center gap-8 border-r bg-white py-6 lg:flex">
        <NavLink
          to="/"
          aria-label="Home"
          className={({ isActive }) =>
            `text-gray-400 transition hover:text-blue-600 ${
              isActive ? "text-blue-600" : ""
            }`
          }
        >
          <Home size={20} />
        </NavLink>

        {user?.role === "admin" && (
          <NavLink
            to="/masters/departments"
            aria-label="Masters"
            className={({ isActive }) =>
              `text-gray-400 transition hover:text-blue-600 ${
                isActive ? "text-blue-600" : ""
              }`
            }
          >
            <Users size={20} />
          </NavLink>
        )}

        <NavLink
          to={userId ? `/user/${userId}/report` : "/"}
          aria-label="Reports"
          className={({ isActive }) =>
            `text-gray-400 transition hover:text-blue-600 ${
              isActive ? "text-blue-600" : ""
            }`
          }
        >
          <FileText size={20} />
        </NavLink>

        <div className="mt-auto flex flex-col gap-6 pb-4">
          <NavLink
            to={`/user/${user?.emp_code}/dashboard`}
            aria-label="Profile"
            className="text-gray-400 transition hover:text-blue-600"
          >
            <User size={20} />
          </NavLink>

          <NavLink
            to={`/user/${user?.emp_code}/settings`}
            aria-label="Settings"
            className="text-gray-400 transition hover:text-blue-600"
          >
            <Settings size={20} />
          </NavLink>
        </div>
      </aside>

      <aside className="fixed top-16 left-16 z-30 hidden h-[calc(100vh-64px)] w-56 flex-col border-r bg-white shadow-sm lg:flex">
        <div className="border-b px-6 py-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            Team Members
          </h3>
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
          {employees.map((emp) => (
            <NavLink
              key={emp.id}
              to={`/user/${emp.id}/dashboard`}
              className={employeeLinkClass}
            >
              {emp.name}
            </NavLink>
          ))}
        </div>
      </aside>

      <main className="min-h-screen pt-16 lg:ml-72">
        <div className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
