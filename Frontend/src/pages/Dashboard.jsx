import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../api/axios";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Dashboard = () => {

  const [stats, setStats] = useState({
    totalDrugs: 0,
    lowStock: 0,
    prescriptionsToday: 0,
    dispensedToday: 0,
  });

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);


  const fetchDashboardData =
    async () => {

      try {

        const response =
          await api.get(
            "/dashboard/stats"
          );

        setStats(response.data);

      } catch (error) {

        console.log(error);

        alert(
          "Failed to load dashboard"
        );

      } finally {

        setLoading(false);

      }
    };

  // =========================
  // BAR CHART DATA
  // =========================
  const barData = [
    {
      name: "Drugs",
      value: stats.totalDrugs,
    },
    {
      name: "Low Stock",
      value: stats.lowStock,
    },
    {
      name: "Prescriptions",
      value:
        stats.prescriptionsToday,
    },
    {
      name: "Dispensed",
      value:
        stats.dispensedToday,
    },
  ];

  // =========================
  // PIE CHART DATA
  // =========================
  const pieData = [
    {
      name: "Dispensed",
      value:
        stats.dispensedToday,
    },
    {
      name: "Pending",
      value:
        stats.prescriptionsToday -
        stats.dispensedToday,
    },
  ];

  const COLORS = [
    "#2563eb",
    "#f59e0b",
  ];

  return (
    <div>

      <Navbar />

      <div className="flex">

        <Sidebar />

        <div className="flex-1 min-h-screen bg-gray-100 p-6">

          {/* HEADING */}
          <div className="mb-8">

            <h1 className="text-4xl font-bold text-gray-800">
              Dashboard
            </h1>

            <p className="text-gray-500 mt-2">
              Welcome to MedVault
              Pharmacy System
            </p>

          </div>

          {/* LOADING */}
          {loading ? (
            <div className="text-center text-xl font-semibold">
              Loading...
            </div>
          ) : (
            <>

              {/* STATS CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* TOTAL DRUGS */}
                <div className="bg-white rounded-xl shadow-md p-6">

                  <h2 className="text-gray-500 text-lg">
                    Total Drugs
                  </h2>

                  <p className="text-4xl font-bold text-blue-600 mt-4">
                    {stats.totalDrugs}
                  </p>

                </div>

                {/* LOW STOCK */}
                <div className="bg-white rounded-xl shadow-md p-6">

                  <h2 className="text-gray-500 text-lg">
                    Low Stock
                  </h2>

                  <p className="text-4xl font-bold text-red-500 mt-4">
                    {stats.lowStock}
                  </p>

                </div>

                {/* PRESCRIPTIONS */}
                <div className="bg-white rounded-xl shadow-md p-6">

                  <h2 className="text-gray-500 text-lg">
                    Prescriptions Today
                  </h2>

                  <p className="text-4xl font-bold text-yellow-500 mt-4">
                    {stats.prescriptionsToday}
                  </p>

                </div>

                {/* DISPENSED */}
                <div className="bg-white rounded-xl shadow-md p-6">

                  <h2 className="text-gray-500 text-lg">
                    Dispensed Today
                  </h2>

                  <p className="text-4xl font-bold text-green-600 mt-4">
                    {stats.dispensedToday}
                  </p>

                </div>

              </div>

              {/* CHARTS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">

                {/* BAR CHART */}
                <div className="bg-white rounded-xl shadow-md p-6">

                  <h2 className="text-2xl font-bold mb-6">
                    Inventory Analytics
                  </h2>

                  <ResponsiveContainer
                    width="100%"
                    height={300}
                  >

                    <BarChart data={barData}>

                      <XAxis dataKey="name" />

                      <YAxis />

                      <Tooltip />

                      <Bar dataKey="value" />

                    </BarChart>

                  </ResponsiveContainer>

                </div>

                {/* PIE CHART */}
                <div className="bg-white rounded-xl shadow-md p-6">

                  <h2 className="text-2xl font-bold mb-6">
                    Prescription Status
                  </h2>

                  <ResponsiveContainer
                    width="100%"
                    height={300}
                  >

                    <PieChart>

                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label
                      >

                        {pieData.map(
                          (
                            entry,
                            index
                          ) => (
                            <Cell
                              key={index}
                              fill={
                                COLORS[
                                  index %
                                    COLORS.length
                                ]
                              }
                            />
                          )
                        )}

                      </Pie>

                      <Tooltip />

                    </PieChart>

                  </ResponsiveContainer>

                </div>

              </div>

              {/* QUICK INFO */}
              <div className="mt-10 bg-white rounded-xl shadow-md p-6">

                <h2 className="text-2xl font-bold mb-4">
                  System Overview
                </h2>

                <div className="space-y-3 text-gray-700">

                  <p>
                    • Manage drug inventory efficiently
                  </p>

                  <p>
                    • Monitor low stock medicines
                  </p>

                  <p>
                    • Create and dispense prescriptions
                  </p>

                  <p>
                    • Track pharmacy activities daily
                  </p>

                </div>

              </div>

            </>
          )}

        </div>

      </div>

    </div>
  );
};

export default Dashboard;