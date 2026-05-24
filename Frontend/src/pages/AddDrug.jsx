import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const AddDrug = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    generic_name: "",
    category: "",
    stock_quantity: "",
    unit_of_measure: "",
    low_stock_threshold: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (
      !formData.name ||
      !formData.generic_name ||
      !formData.category ||
      !formData.stock_quantity ||
      !formData.unit_of_measure ||
      !formData.low_stock_threshold
    ) {
      alert("Please fill all fields");
      return false;
    }

    if (formData.stock_quantity < 0) {
      alert("Stock quantity cannot be negative");
      return false;
    }

    if (formData.low_stock_threshold < 0) {
      alert("Threshold cannot be negative");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...formData,
        stock_quantity: Number(formData.stock_quantity),
        low_stock_threshold: Number(
          formData.low_stock_threshold
        ),
      };

      const response = await api.post("/drugs", payload);

      console.log(response.data);

      alert("Drug added successfully");

      navigate("/inventory");
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to add drug"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="flex">
        <Sidebar />

        <div className="flex-1 min-h-screen bg-gray-100 p-6">
          <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8">
            <h1 className="text-3xl font-bold mb-8 text-center">
              Add New Drug
            </h1>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Drug Name */}
              <div>
                <label className="block mb-2 font-medium">
                  Drug Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter drug name"
                  className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Generic Name */}
              <div>
                <label className="block mb-2 font-medium">
                  Generic Name
                </label>

                <input
                  type="text"
                  name="generic_name"
                  value={formData.generic_name}
                  onChange={handleChange}
                  placeholder="Enter generic name"
                  className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block mb-2 font-medium">
                  Category
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">
                    Select Category
                  </option>

                  <option value="Tablet">
                    Tablet
                  </option>

                  <option value="Capsule">
                    Capsule
                  </option>

                  <option value="Syrup">
                    Syrup
                  </option>

                  <option value="Injection">
                    Injection
                  </option>
                </select>
              </div>

              {/* Stock Quantity */}
              <div>
                <label className="block mb-2 font-medium">
                  Stock Quantity
                </label>

                <input
                  type="number"
                  name="stock_quantity"
                  value={formData.stock_quantity}
                  onChange={handleChange}
                  placeholder="Enter stock quantity"
                  className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Unit */}
              <div>
                <label className="block mb-2 font-medium">
                  Unit Of Measure
                </label>

                <select
                  name="unit_of_measure"
                  value={formData.unit_of_measure}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">
                    Select Unit
                  </option>

                  <option value="Strip">
                    Strip
                  </option>

                  <option value="Bottle">
                    Bottle
                  </option>

                  <option value="Piece">
                    Piece
                  </option>

                  <option value="Box">
                    Box
                  </option>
                </select>
              </div>

              {/* Low Stock Threshold */}
              <div>
                <label className="block mb-2 font-medium">
                  Low Stock Threshold
                </label>

                <input
                  type="number"
                  name="low_stock_threshold"
                  value={formData.low_stock_threshold}
                  onChange={handleChange}
                  placeholder="Enter threshold"
                  className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2 flex justify-center mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-8 py-3 rounded-lg text-white font-semibold transition ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {loading
                    ? "Adding Drug..."
                    : "Add Drug"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDrug;