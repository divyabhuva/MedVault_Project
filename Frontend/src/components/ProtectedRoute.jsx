import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({
  children,
  allowedRoles = [],
}) => {


  const { user } = useAuth();


  const token =
    localStorage.getItem("token");

  
  if (!token || !user) {

    return (
      <Navigate
        to="/"
        replace
      />
    );
  }


  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">

        <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md w-full text-center">

          {/* ICON */}
          <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl font-bold">
            !
          </div>

          {/* HEADING */}
          <h1 className="text-4xl font-bold text-red-500 mb-4">
            Access Denied
          </h1>

          {/* MESSAGE */}
          <p className="text-gray-600 mb-6 leading-relaxed">

            You do not have permission
            to access this page.

          </p>

          {/* USER ROLE */}
          <div className="bg-gray-100 rounded-lg p-4 mb-6">

            <p className="text-sm text-gray-500">
              Logged in as
            </p>

            <p className="font-bold text-lg text-blue-600 capitalize">
              {user.role}
            </p>

          </div>

          {/* BUTTON */}
          <button
            onClick={() =>
              window.history.back()
            }
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Go Back
          </button>

        </div>

      </div>
    );
  }

 
  return children;
};

export default ProtectedRoute;