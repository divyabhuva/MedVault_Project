import { useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../api/axios";

const Register = () => {

  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
    });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await api.post(
        "/auth/register",
        formData
      );

      alert(
        "Registration successful"
      );

      navigate("/");

    } catch (error) {

      alert(
        error.response?.data?.detail
        ||
        "Registration failed"
      );
    }
  };

  return (

    <div className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gray-100
    ">

      <div className="
        bg-white
        p-8
        rounded-xl
        shadow-md
        w-full
        max-w-md
      ">

        <h1 className="
          text-3xl
          font-bold
          text-center
          mb-6
        ">
          Register
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            type="text"

            name="name"

            placeholder="Full Name"

            onChange={handleChange}

            className="
              w-full
              border
              p-3
              rounded-lg
            "

            required
          />

          <input
            type="email"

            name="email"

            placeholder="Email"

            onChange={handleChange}

            className="
              w-full
              border
              p-3
              rounded-lg
            "

            required
          />

          <input
            type="password"

            name="password"

            placeholder="Password"

            onChange={handleChange}

            className="
              w-full
              border
              p-3
              rounded-lg
            "

            required
          />

          <button
            type="submit"

            className="
              w-full
              bg-blue-600
              hover:bg-blue-700
              text-white
              py-3
              rounded-lg
              font-semibold
            "
          >
            Register
          </button>

        </form>

      </div>

    </div>
  );
};

export default Register;