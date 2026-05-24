import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../api/axios";

const EditDrug = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    name: "",
    generic_name: "",
    category: "",
    stock_quantity: "",
    unit_of_measure: "",
    low_stock_threshold: "",
  });

  const [loading, setLoading] = useState(true);

  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    // ONLY ADMIN CAN ACCESS
    if (user?.role !== "admin") {
      alert("Only admin can edit drugs");

      navigate("/inventory");

      return;
    }

    fetchDrug();
  }, []);

  const fetchDrug = async () => {
    try {
      const response = await api.get("/drugs");

      const drug = response.data.find((item) => item.id === Number(id));

      if (drug) {
        setFormData({
          name: drug.name || "",
          generic_name: drug.generic_name || "",
          category: drug.category || "",
          stock_quantity: drug.stock_quantity || "",
          unit_of_measure: drug.unit_of_measure || "",
          low_stock_threshold: drug.low_stock_threshold || "",
        });
      }
    } catch (error) {
      console.log(error);

      alert("Failed to fetch drug");
    } finally {
      setLoading(false);
    }
  };

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

    if (Number(formData.stock_quantity) < 0) {
      alert("Stock quantity cannot be negative");

      return false;
    }

    if (Number(formData.low_stock_threshold) < 0) {
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
      setUpdating(true);

      await api.put(`/drugs/${id}`, {
        ...formData,

        stock_quantity: Number(formData.stock_quantity),

        low_stock_threshold: Number(formData.low_stock_threshold),
      });

      alert("Drug updated successfully");

      navigate("/inventory");
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.detail || "Failed to update drug");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Loading Drug...
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div className="flex">
        <Sidebar />

        <div className="flex-1 min-h-screen bg-gray-100 p-6">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
            {/* HEADING */}
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold text-gray-800">Edit Drug</h1>

              <p className="text-gray-500 mt-2">Update medicine details</p>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* DRUG NAME */}
              <div>
                <label className="block mb-2 font-medium">Drug Name</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter drug name"
                  className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* GENERIC NAME */}
              <div>
                <label className="block mb-2 font-medium">Generic Name</label>

                <input
                  type="text"
                  name="generic_name"
                  value={formData.generic_name}
                  onChange={handleChange}
                  placeholder="Enter generic name"
                  className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* CATEGORY */}
              <div>
                <label className="block mb-2 font-medium">Category</label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>

                  <option value="Tablet">Tablet</option>

                  <option value="Capsule">Capsule</option>

                  <option value="Syrup">Syrup</option>

                  <option value="Injection">Injection</option>
                </select>
              </div>

              {/* STOCK */}
              <div>
                <label className="block mb-2 font-medium">Stock Quantity</label>

                <input
                  type="number"
                  name="stock_quantity"
                  value={formData.stock_quantity}
                  onChange={handleChange}
                  placeholder="Enter stock quantity"
                  className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* UNIT */}
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
                  <option value="">Select Unit</option>

                  <option value="Strip">Strip</option>

                  <option value="Bottle">Bottle</option>

                  <option value="Piece">Piece</option>

                  <option value="Box">Box</option>
                </select>
              </div>

              {/* THRESHOLD */}
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

              {/* BUTTON */}
              <div className="md:col-span-2 flex justify-center mt-4">
                <button
                  type="submit"
                  disabled={updating}
                  className={`px-10 py-3 rounded-lg text-white font-semibold transition ${
                    updating
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {updating ? "Updating Drug..." : "Update Drug"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDrug;
