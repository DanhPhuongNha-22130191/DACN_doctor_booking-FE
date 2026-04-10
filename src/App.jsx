import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import DoctorsPage from "./pages/Doctor/DoctorsPage";
import Booking from "./pages/Booking/Booking";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

import HospitalAdmin from "./Admin/HospitalAdmin";
import DoctorAdmin from "./Admin/DoctorAdmin";
import AdminLayout from "./Admin/AdminLayout";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/doctors" element={<DoctorsPage />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin Routes với Navbar */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        {/* Route mặc định */}
        <Route index element={<Navigate to="hospitals" replace />} />

        {/* Các trang con */}
        <Route path="hospitals" element={<HospitalAdmin />} />
        <Route path="doctors" element={<DoctorAdmin />} />
      </Route>

      {/* Redirect các đường dẫn cũ (nếu có) */}
      <Route path="/hospital-admin" element={<Navigate to="/admin/hospitals" replace />} />
      <Route path="/doctor-admin" element={<Navigate to="/admin/doctors" replace />} />

      {/* Route không tồn tại */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;