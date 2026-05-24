import { useState } from "react";

import {
  useNavigate,
  Link
} from "react-router-dom";

import api from "../api/axios";

import { useAuth } from "../context/AuthContext";

const Login = () => {

  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

 
  const [loading, setLoading] =
    useState(false);

 
  const handleChange = (e) => {

    setFormData({
      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };

  
  const handleSubmit = async (e) => {

    e.preventDefault();

  
    if (
      !formData.email ||
      !formData.password
    ) {

      alert(
        "Please fill all fields"
      );

      return;
    }

    try {

      setLoading(true);

      
      const response = await api.post(
        "/auth/login",
        formData
      );

      console.log(response.data);

     
      login(
        response.data.user,

        response.data.token
      );

      
      localStorage.setItem(
        "token",

        response.data.token
      );

      localStorage.setItem(
        "user",

        JSON.stringify(
          response.data.user
        )
      );

      alert(
        "Login successful"
      );

      
      if (
        response.data.user.role
        ===
        "admin"
      ) {

        navigate("/dashboard");

      } else {

        navigate("/prescriptions");
      }

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.detail
        ||
        "Invalid credentials"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gray-100
      px-4
    ">

      <div className="
        bg-white
        w-full
        max-w-md
        p-8
        rounded-2xl
        shadow-lg
      ">

        <div className="
          text-center
          mb-8
        ">

          <h1 className="
            text-4xl
            font-bold
            text-blue-600
          ">
            MedVault
          </h1>

          <p className="
            text-gray-500
            mt-2
          ">
            Pharmacy Management System
          </p>

        </div>

        
        <form
          onSubmit={handleSubmit}

          className="space-y-5"
        >

          {/* EMAIL */}
          <div>

            <label className="
              block
              mb-2
              font-medium
            ">
              Email
            </label>

            <input
              type="email"

              name="email"

              placeholder="Enter email"

              value={formData.email}

              onChange={handleChange}

              className="
                w-full
                border
                border-gray-300
                rounded-lg
                p-3
                outline-none
                focus:ring-2
                focus:ring-blue-500
              "

              required
            />

          </div>

          {/* PASSWORD */}
          <div>

            <label className="
              block
              mb-2
              font-medium
            ">
              Password
            </label>

            <input
              type="password"

              name="password"

              placeholder="Enter password"

              value={formData.password}

              onChange={handleChange}

              className="
                w-full
                border
                border-gray-300
                rounded-lg
                p-3
                outline-none
                focus:ring-2
                focus:ring-blue-500
              "

              required
            />

          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"

            disabled={loading}

            className={`
              w-full
              py-3
              rounded-lg
              text-white
              font-semibold
              transition

              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }
            `}
          >

            {
              loading
                ? "Logging in..."
                : "Login"
            }

          </button>

        </form>

       
        <div className="
          mt-6
          text-center
        ">

          <p className="text-gray-600">

            Don't have an account?

            <Link
              to="/register"

              className="
                text-blue-600
                font-semibold
                ml-2
                hover:underline
              "
            >
              Register
            </Link>

          </p>

        </div>


      
        </div>

      </div>

    
  );
};

export default Login;