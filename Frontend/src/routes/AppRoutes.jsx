import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Inventory from "../pages/Inventory";
import AddDrug from "../pages/AddDrug";
import EditDrug from "../pages/EditDrug";
import Prescriptions from "../pages/Prescriptions";
import NotFound from "../pages/NotFound";

import ProtectedRoute from "../components/ProtectedRoute";
import Register from "../pages/Register";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin", "pharmacist"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/inventory"
        element={
          <ProtectedRoute allowedRoles={["admin", "pharmacist"]}>
            <Inventory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/prescriptions"
        element={
          <ProtectedRoute allowedRoles={["admin", "pharmacist"]}>
            <Prescriptions />
          </ProtectedRoute>
        }
      />
      <Route path="/register" element={<Register />} />

      <Route
        path="/add-drug"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AddDrug />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-drug/:id"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <EditDrug />
          </ProtectedRoute>
        }
      />

      <Route path="/home" element={<Navigate to="/dashboard" />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
