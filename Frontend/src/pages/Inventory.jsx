import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";

import Sidebar from "../components/Sidebar";

import api from "../api/axios";

import { Link } from "react-router-dom";

const Inventory = () => {

  // =========================
  // STATES
  // =========================
  const [drugs, setDrugs] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  // =========================
  // GET LOGGED USER
  // =========================
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {

    fetchDrugs();

  }, []);

  // =========================
  // FETCH DRUGS
  // =========================
  const fetchDrugs = async () => {

    try {

      const response = await api.get(
        "/drugs"
      );

      setDrugs(response.data);

    } catch (error) {

      console.log(error);

      alert("Failed to fetch drugs");

    } finally {

      setLoading(false);

    }
  };

  // =========================
  // DELETE DRUG
  // =========================
  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this drug?"
    );

    if (!confirmDelete) return;

    try {

      await api.delete(`/drugs/${id}`);

      alert("Drug deleted successfully");

      fetchDrugs();

    } catch (error) {

      console.log(error);

      alert("Failed to delete drug");

    }
  };

  // =========================
  // SEARCH FILTER
  // =========================
  const filteredDrugs = drugs.filter(
    (drug) =>
      drug.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
  );

  return (

    <div>

      <Navbar />

      <div className="flex">

        <Sidebar />

        <div className="flex-1 min-h-screen bg-gray-100 p-6">

          {/* =========================
              PAGE HEADER
          ========================= */}
          <div className="
            flex
            flex-col
            md:flex-row
            md:items-center
            md:justify-between
            gap-4
            mb-6
          ">

            <div>

              <h1 className="
                text-4xl
                font-bold
                text-gray-800
              ">
                Drug Inventory
              </h1>

              <p className="
                text-gray-500
                mt-2
              ">
                Manage medicines and stock
              </p>

            </div>

            {/* ADD DRUG */}
            {user?.role === "admin" && (

              <Link
                to="/add-drug"
                className="
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  px-6
                  py-3
                  rounded-lg
                  font-semibold
                "
              >
                + Add Drug
              </Link>

            )}

          </div>

          {/* =========================
              SEARCH BAR
          ========================= */}
          <div className="mb-6">

            <input
              type="text"

              placeholder="Search medicine..."

              value={search}

              onChange={(e) =>
                setSearch(e.target.value)
              }

              className="
                w-full
                md:w-96
                border
                border-gray-300
                rounded-lg
                p-3
                outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            />

          </div>

          
          {loading ? (

            <div className="
              text-center
              text-xl
              font-semibold
            ">
              Loading inventory...
            </div>

          ) : (

            <div className="
              bg-white
              rounded-xl
              shadow-md
              overflow-x-auto
            ">

              <table className="w-full">

                
                <thead className="
                  bg-blue-600
                  text-white
                ">

                  <tr>

                    <th className="p-4 text-left">
                      Drug Name
                    </th>

                    <th className="p-4 text-left">
                      Generic Name
                    </th>

                    <th className="p-4 text-left">
                      Category
                    </th>

                    <th className="p-4 text-left">
                      Unit
                    </th>

                    <th className="p-4 text-left">
                      Stock
                    </th>

                    <th className="p-4 text-left">
                      Threshold
                    </th>

                    <th className="p-4 text-left">
                      Status
                    </th>

                    {user?.role === "admin" && (

                      <th className="p-4 text-left">
                        Actions
                      </th>

                    )}

                  </tr>

                </thead>

                
                <tbody>

                  {filteredDrugs.length > 0 ? (

                    filteredDrugs.map((drug) => {

                      
                      const isLowStock =
                        drug.stock_quantity
                        <=
                        drug.low_stock_threshold;

                      return (

                        <tr
                          key={drug.id}

                          className={`
                            border-b
                            hover:bg-gray-50
                            ${
                              isLowStock
                                ? "bg-red-50"
                                : ""
                            }
                          `}
                        >

                          {/* DRUG NAME */}
                          <td className="
                            p-4
                            font-semibold
                          ">
                            {drug.name}
                          </td>

                          {/* GENERIC NAME */}
                          <td className="p-4">
                            {drug.generic_name}
                          </td>

                          {/* CATEGORY */}
                          <td className="p-4">
                            {drug.category}
                          </td>

                          {/* UNIT */}
                          <td className="p-4">
                            {drug.unit_of_measure}
                          </td>

                          {/* STOCK */}
                          <td
                            className={`
                              p-4
                              font-bold
                              ${
                                isLowStock
                                  ? "text-red-600"
                                  : "text-green-600"
                              }
                            `}
                          >
                            {drug.stock_quantity}
                          </td>

                          {/* THRESHOLD */}
                          <td className="p-4">
                            {drug.low_stock_threshold}
                          </td>

                          {/* STATUS */}
                          <td className="p-4">

                            {isLowStock ? (

                              <span className="
                                bg-red-100
                                text-red-600
                                px-3
                                py-1
                                rounded-full
                                text-sm
                                font-semibold
                              ">
                                Low Stock
                              </span>

                            ) : (

                              <span className="
                                bg-green-100
                                text-green-600
                                px-3
                                py-1
                                rounded-full
                                text-sm
                                font-semibold
                              ">
                                In Stock
                              </span>

                            )}

                          </td>

                          {/* ADMIN ACTIONS */}
                          {user?.role === "admin" && (

                            <td className="
                              p-4
                              flex
                              gap-3
                            ">

                              {/* EDIT */}
                              <Link
                                to={`/edit-drug/${drug.id}`}
                                className="
                                  bg-yellow-500
                                  hover:bg-yellow-600
                                  text-white
                                  px-4
                                  py-2
                                  rounded-lg
                                "
                              >
                                Edit
                              </Link>

                              {/* DELETE */}
                              <button
                                onClick={() =>
                                  handleDelete(drug.id)
                                }

                                className="
                                  bg-red-500
                                  hover:bg-red-600
                                  text-white
                                  px-4
                                  py-2
                                  rounded-lg
                                "
                              >
                                Delete
                              </button>

                            </td>

                          )}

                        </tr>
                      );
                    })

                  ) : (

                    <tr>

                      <td
                        colSpan="8"

                        className="
                          text-center
                          p-6
                          text-gray-500
                        "
                      >
                        No drugs found
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>
      </div>
    </div>
  );
};

export default Inventory;