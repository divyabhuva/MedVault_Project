import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const Navbar = () => {

  const navigate = useNavigate();

  const { user, logout } = useAuth();

 
  const handleLogout = async () => {

    try {

      // GET TOKEN
      const token = localStorage.getItem("token");

      // CALL LOGOUT API
      await api.post(
        "/auth/logout",
        {},
        {
          params: {
            token: token
          }
        }
      );

      console.log("Logout success");

    } catch (error) {

      console.log(error);

    } finally {

      logout();

     
      navigate("/");

    }
  };

  return (
    <div className="bg-white shadow-md px-6 py-4 flex justify-between items-center">

      {/* LOGO */}
      <div>
        <h1 className="text-2xl font-bold text-blue-600">
          MedVault
        </h1>
      </div>

      {/* USER SECTION */}
      <div className="flex items-center gap-4">

        {/* USER INFO */}
        <div className="text-right">

          <p className="font-semibold">
            {user?.name}
          </p>

          <p className="text-sm text-gray-500 capitalize">
            {user?.role}
          </p>

        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-medium transition"
        >
          Logout
        </button>

      </div>

    </div>
  );
};

export default Navbar;