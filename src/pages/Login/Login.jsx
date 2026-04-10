// LoginPage.jsx
import React, { useState } from 'react';
import './Login.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppHeader from "../../components/Header";
import { useNavigate } from 'react-router-dom';

import {
  FaHospitalUser,
  FaUserMd,
  FaCalendarCheck,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';

const LoginPage = ({ onLogin, goRegister }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    toast.warning("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  try {
    setLoading(true);

    const res = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: email,
        password: password
      })
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      toast.error(data.error || "Sai tài khoản hoặc mật khẩu!");
      return;
    }

    // 🔹 Lấy role từ response
    const userRole = data.role || data.user?.role;

    // 🔹 Chuẩn hóa dữ liệu người dùng
    const userData = {
      ...data,
      username: data.username || email,
      email: data.email || email,
      role: userRole
    };

    // 🔹 Lưu thông tin user và token
    if (rememberMe) {
      localStorage.setItem("user", JSON.stringify(userData));
      if (data.token) {
        localStorage.setItem("accessToken", data.token);
      }
    } else {
      sessionStorage.setItem("user", JSON.stringify(userData));
      if (data.token) {
        sessionStorage.setItem("accessToken", data.token);
      }
    }

    // 🔹 Gọi callback onLogin nếu có
    if (onLogin) {
      onLogin();
    }

    // 🔹 Điều hướng theo role
    if (userRole === "ADMIN") {
      toast.success("Đăng nhập quản trị thành công!");
      setTimeout(() => {
        navigate("/doctor-admin"); // Đường dẫn tới trang HospitalAdmin
      }, 1000);
      return;
    }

    if (userRole === "PATIENT") {
      toast.success("Đăng nhập thành công!");
      setTimeout(() => {
        navigate("/");
        window.location.reload(); // Cập nhật header
      }, 1000);
      return;
    }

    // 🔹 Trường hợp role không hợp lệ
    toast.error("Vai trò người dùng không hợp lệ!");
  } catch (err) {
    console.error(err);
    toast.error("Lỗi kết nối server!");
  } finally {
    setLoading(false);
  }
  };

  return (
    <>
      <AppHeader />
      <div className="login-container">
        {/* LEFT */}
        <div className="login-image">
          <div className="overlay">
            <div className="brand">
              <h1>NLMedi</h1>
              <p>Đặt lịch khám thông minh</p>
            </div>

            <div className="features">
              <div className="feature">
                <FaHospitalUser className="feature-icon" />
                <span>Hơn 500+ bệnh viện liên kết</span>
              </div>

              <div className="feature">
                <FaUserMd className="feature-icon" />
                <span>Bác sĩ đầu ngành</span>
              </div>

              <div className="feature">
                <FaCalendarCheck className="feature-icon" />
                <span>Đặt lịch nhanh chóng 24/7</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="login-form-wrapper">
          <div className="login-form">
            <div className="form-header">
              <h2>Chào mừng trở lại</h2>
              <p>Đăng nhập để đặt lịch khám dễ dàng</p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* EMAIL */}
              <div className="input-group">
                <label>Username</label>
                <div className="input-icon">
                  <FaEnvelope className="icon" />
                  <input
                    type="text"
                    placeholder="Nhập username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="input-group">
                <label>Mật khẩu</label>
                <div className="input-icon">
                  <FaLock className="icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              {/* OPTIONS */}
              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Ghi nhớ đăng nhập</span>
                </label>

                <a href="#" className="forgot-link">
                  Quên mật khẩu?
                </a>
              </div>

              {/* BUTTON */}
              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>

              {/* REGISTER */}
              <div className="register-link">
                Chưa có tài khoản?{" "}
                <span
                  onClick={() => navigate("/login")} style={{ color: "#3b82f6", cursor: "pointer" }}
                >
                  Đăng ký ngay
                </span>
              </div>
            </form>
          </div>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          pauseOnHover
          theme="colored"
        />
      </div>
    </>
  );
};

export default LoginPage;