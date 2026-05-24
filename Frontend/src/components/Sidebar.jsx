import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const location = useLocation();

  const { user } = useAuth();

  const menuClass = (path) => {
    return `block px-4 py-3 rounded-lg font-medium transition ${
      location.pathname === path
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-gray-200"
    }`;
  };

  return (
    <div className="w-64 min-h-screen bg-white shadow-md p-5">
      {/* Heading */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800">
          Dashboard Menu
        </h2>
      </div>

      {/* Menu */}
      <div className="space-y-3">
        {/* Dashboard */}
        <Link
          to="/dashboard"
          className={menuClass("/dashboard")}
        >
          Dashboard
        </Link>

        {/* Inventory */}
        <Link
          to="/inventory"
          className={menuClass("/inventory")}
        >
          Inventory
        </Link>

        {/* Prescriptions */}
        <Link
          to="/prescriptions"
          className={menuClass(
            "/prescriptions"
          )}
        >
          Prescriptions
        </Link>

        {/* Admin Only */}
        {user?.role === "admin" && (
          <Link
            to="/add-drug"
            className={menuClass("/add-drug")}
          >
            Add Drug
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;