import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";

import Sidebar from "../components/Sidebar";

import api from "../api/axios";

const Prescriptions = () => {

  
  const [prescriptions, setPrescriptions] =
    useState([]);

  const [drugs, setDrugs] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedDrug, setSelectedDrug] =
    useState(null);

  const [formData, setFormData] =
    useState({
      patient_name: "",
      doctor_name: "",
      drug_name: "",
      quantity: "",
    });

  // ===============================
  // LOAD DATA
  // ===============================
  useEffect(() => {

    fetchPrescriptions();

    fetchDrugs();

  }, []);

 
  const fetchPrescriptions = async () => {

    try {

      const response =
        await api.get("/prescriptions");

      setPrescriptions(response.data);

    } catch (error) {

      console.log(error);

      alert(
        "Failed to fetch prescriptions"
      );

    } finally {

      setLoading(false);

    }
  };


  const fetchDrugs = async () => {

    try {

      const response =
        await api.get("/drugs");

      setDrugs(response.data);

    } catch (error) {

      console.log(error);
    }
  };


  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "drug_name") {

      const drug = drugs.find(
        (d) => d.name === value
      );

      setSelectedDrug(drug);
    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      selectedDrug &&
      Number(formData.quantity)
      >
      selectedDrug.stock_quantity
    ) {

      alert(`
Insufficient stock.

Available stock:
${selectedDrug.stock_quantity}
      `);

      return;
    }

    try {

      await api.post(
        "/prescriptions",
        {
          ...formData,

          quantity:
            Number(formData.quantity),
        }
      );

      alert(
        "Prescription created successfully"
      );

      // RESET FORM
      setFormData({
        patient_name: "",
        doctor_name: "",
        drug_name: "",
        quantity: "",
      });

      setSelectedDrug(null);

      fetchPrescriptions();

      fetchDrugs();

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.detail
        ||
        "Failed to create prescription"
      );
    }
  };


  const handleDispense = async (id) => {

    try {

      const response =
        await api.patch(
          `/prescriptions/${id}/dispense`
        );

      alert(`
Prescription dispensed successfully.

Remaining stock:
${response.data.remaining_stock}
      `);

      fetchPrescriptions();

      fetchDrugs();

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.detail
        ||
        "Failed to dispense"
      );
    }
  };


  const handleCancel = async (id) => {

    try {

      await api.patch(
        `/prescriptions/${id}/cancel`
      );

      alert(
        "Prescription cancelled"
      );

      fetchPrescriptions();

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.detail
        ||
        "Failed to cancel"
      );
    }
  };

  return (

    <div>

      <Navbar />

      <div className="flex">

        <Sidebar />

        <div className="
          flex-1
          min-h-screen
          bg-gray-100
          p-6
        ">

        
          <div className="mb-8">

            <h1 className="
              text-4xl
              font-bold
              text-gray-800
            ">
              Prescriptions
            </h1>

            <p className="
              text-gray-500
              mt-2
            ">
              Create and manage
              patient prescriptions
            </p>

          </div>

        
          <div className="
            bg-white
            p-6
            rounded-xl
            shadow-md
            mb-8
          ">

            <h2 className="
              text-2xl
              font-bold
              mb-6
            ">
              Create Prescription
            </h2>

            <form
              onSubmit={handleSubmit}
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-6
              "
            >

              {/* PATIENT */}
              <div>

                <label className="
                  block
                  mb-2
                  font-medium
                ">
                  Patient Name
                </label>

                <input
                  type="text"

                  name="patient_name"

                  value={formData.patient_name}

                  onChange={handleChange}

                  placeholder="Enter patient name"

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

              {/* DOCTOR */}
              <div>

                <label className="
                  block
                  mb-2
                  font-medium
                ">
                  Doctor Name
                </label>

                <input
                  type="text"

                  name="doctor_name"

                  value={formData.doctor_name}

                  onChange={handleChange}

                  placeholder="Enter doctor name"

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

              {/* DRUG */}
              <div>

                <label className="
                  block
                  mb-2
                  font-medium
                ">
                  Select Drug
                </label>

                <select
                  name="drug_name"

                  value={formData.drug_name}

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
                >

                  <option value="">
                    Select Drug
                  </option>

                  {drugs.map((drug) => (

                    <option
                      key={drug.id}
                      value={drug.name}
                    >
                      {drug.name}
                    </option>

                  ))}

                </select>

                {/* AVAILABLE STOCK */}
                {selectedDrug && (

                  <div className="mt-3">

                    <p className="
                      text-sm
                      font-medium
                      text-gray-600
                    ">
                      Available Stock:
                      <span className="
                        ml-2
                        text-blue-600
                        font-bold
                      ">
                        {
                          selectedDrug
                          .stock_quantity
                        }
                      </span>
                    </p>

                    {/* LOW STOCK */}
                    {
                      selectedDrug.stock_quantity
                      <=
                      selectedDrug.low_stock_threshold
                      && (

                        <p className="
                          text-red-500
                          text-sm
                          font-semibold
                          mt-1
                        ">
                          Low Stock Alert
                        </p>

                      )
                    }

                  </div>

                )}

              </div>

              {/* QUANTITY */}
              <div>

                <label className="
                  block
                  mb-2
                  font-medium
                ">
                  Quantity
                </label>

                <input
                  type="number"

                  name="quantity"

                  value={formData.quantity}

                  onChange={handleChange}

                  placeholder="Enter quantity"

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

              {/* SUBMIT */}
              <div className="md:col-span-2">

                <button
                  type="submit"

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
                  Create Prescription
                </button>

              </div>

            </form>

          </div>

         
          {loading ? (

            <div className="
              text-center
              text-xl
              font-semibold
            ">
              Loading prescriptions...
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
                      Patient
                    </th>

                    <th className="p-4 text-left">
                      Drug
                    </th>

                    <th className="p-4 text-left">
                      Doctor
                    </th>

                    <th className="p-4 text-left">
                      Quantity
                    </th>

                    <th className="p-4 text-left">
                      Status
                    </th>

                    <th className="p-4 text-left">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {prescriptions.length > 0 ? (

                    prescriptions.map((item) => (

                      <tr
                        key={item.id}

                        className="
                          border-b
                          hover:bg-gray-50
                        "
                      >

                        <td className="p-4">
                          {item.patient_name}
                        </td>

                        <td className="p-4">
                          {item.drug_name}
                        </td>

                        <td className="p-4">
                          {item.doctor_name}
                        </td>

                        <td className="
                          p-4
                          font-semibold
                        ">
                          {item.quantity}
                        </td>

                        {/* STATUS */}
                        <td className="p-4">

                          <span
                            className={`
                              px-3
                              py-1
                              rounded-full
                              text-sm
                              font-semibold
                              ${
                                item.status ===
                                "dispensed"

                                ? "bg-green-100 text-green-600"

                                : item.status ===
                                  "cancelled"

                                ? "bg-red-100 text-red-600"

                                : "bg-yellow-100 text-yellow-600"
                              }
                            `}
                          >
                            {item.status}
                          </span>

                        </td>

                        {/* ACTIONS */}
                        <td className="p-4">

                          {item.status ===
                            "pending" && (

                            <div className="
                              flex
                              gap-3
                            ">

                              <button
                                onClick={() =>
                                  handleDispense(item.id)
                                }

                                className="
                                  bg-green-500
                                  hover:bg-green-600
                                  text-white
                                  px-4
                                  py-2
                                  rounded-lg
                                "
                              >
                                Dispense
                              </button>

                              <button
                                onClick={() =>
                                  handleCancel(item.id)
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
                                Cancel
                              </button>

                            </div>

                          )}

                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>

                      <td
                        colSpan="6"

                        className="
                          text-center
                          p-6
                          text-gray-500
                        "
                      >
                        No prescriptions found
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

export default Prescriptions;