// App.js
import { Routes, Route } from "react-router-dom"; // Chỉ import Routes, Route, không import BrowserRouter nữa
import Home from "./pages/Home/Home";
import Doctor from "./pages/Doctor/DoctorsPage";
import Booking from "./pages/Booking/Booking";
import Login from "./pages/Login/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/doctors" element={<Doctor />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;