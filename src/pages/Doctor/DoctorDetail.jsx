import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppHeader from "../../components/Header";
import axios from "axios";

export default function DoctorDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const doctor = location.state?.doctor || {
    id: 1,
    name: "Nguyễn Văn A",
    phone: "0123456789",
    email: "nguyenvana@hospital.com",
    hospitalName: "Bệnh viện Chợ Rẫy",
    departmentName: "Khoa Tim mạch",
    avatar: "👨‍⚕️",
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (doctor) {
      setLoading(false);
    }
  }, [doctor]);

  if (!doctor) {
    return (
      <>
        <AppHeader />
        <div style={styles.errorContainer}>
          <p>Không có dữ liệu bác sĩ</p>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <AppHeader />
        <div style={styles.loading}>Đang tải thông tin bác sĩ...</div>
      </>
    );
  }

  const handleBooking = () => {
    navigate("/booking", { state: { doctor } });
  };

  return (
    <>
      <AppHeader />
      <div style={styles.container}>
        <div style={styles.wrapper}>
          {/* Header + ảnh đại diện */}
          <div style={styles.profileHeader}>
            <div style={styles.avatarWrapper}>
              <span style={styles.avatarEmoji}>{doctor.avatar}</span>
            </div>
            <div style={styles.headerInfo}>
              <h1 style={styles.name}>{doctor.name}</h1>
              <p style={styles.department}>{doctor.departmentName}</p>
            </div>
          </div>

          {/* Nội dung chính */}
          <div style={styles.contentGrid}>
            {/* Cột trái: thông tin chi tiết */}
            <div style={styles.leftColumn}>
              <div style={styles.card}>
                <h3 style={styles.sectionTitle}>📋 Thông tin liên hệ</h3>
                <div style={styles.infoList}>
                  <div style={styles.infoItem}>
                    <span style={styles.infoIcon}>🏥</span>
                    <span>{doctor.hospitalName}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoIcon}>📞</span>
                    <span>{doctor.phone}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoIcon}>📧</span>
                    <span>{doctor.email}</span>
                  </div>
                </div>
              </div>

              <div style={styles.card}>
                <h3 style={styles.sectionTitle}>📝 Giới thiệu</h3>
                <p style={styles.description}>
                  Bác sĩ {doctor.name} có hơn {doctor.experience} trong lĩnh vực{" "}
                  {doctor.departmentName.toLowerCase()}. Được đào tạo chuyên sâu
                  tại các bệnh viện lớn, tận tâm với bệnh nhân và áp dụng phác đồ
                  điều trị hiện đại.
                </p>
              </div>
            </div>

            {/* Cột phải: đặt lịch */}
            <div style={styles.rightColumn}>
              <div style={styles.bookingCard}>
                <div style={styles.noteBox}>
                  ⏰ Thời gian linh hoạt theo yêu cầu
                </div>
                <button style={styles.bookingBtn} onClick={handleBooking}>
                  📅 Đặt lịch khám ngay
                </button>
                <p style={styles.smallNote}>
                  * Hỗ trợ đặt lịch nhanh chóng, xác nhận qua SMS/Zalo
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    background: "#f4f7fc",
    minHeight: "100vh",
    padding: "40px 24px",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  wrapper: {
    maxWidth: 1200,
    margin: "0 auto",
  },
  profileHeader: {
    background: "white",
    borderRadius: 28,
    padding: "30px 32px",
    marginBottom: 32,
    display: "flex",
    alignItems: "center",
    gap: 28,
    boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
    flexWrap: "wrap",
  },
  avatarWrapper: {
    background: "linear-gradient(145deg, #e0e7ff, #f0f4ff)",
    borderRadius: "50%",
    width: 110,
    height: 110,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmoji: {
    fontSize: 64,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: "2rem",
    fontWeight: 700,
    margin: 0,
    color: "#1e293b",
  },
  department: {
    fontSize: "1rem",
    color: "#4b6bfb",
    fontWeight: 500,
    margin: "6px 0 8px 0",
    background: "#eef2ff",
    display: "inline-block",
    padding: "4px 14px",
    borderRadius: 40,
  },
  rating: {
    fontSize: "0.9rem",
    color: "#475569",
    display: "flex",
    gap: 16,
    marginTop: 8,
  },
  contentGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 340px",
    gap: 28,
  },
  leftColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 28,
  },
  card: {
    background: "white",
    borderRadius: 24,
    padding: "24px 28px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
  },
  sectionTitle: {
    fontSize: "1.3rem",
    fontWeight: 600,
    margin: "0 0 20px 0",
    color: "#0f172a",
  },
  infoList: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  infoItem: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    fontSize: "1rem",
    color: "#334155",
    padding: "4px 0",
  },
  infoIcon: {
    fontSize: "1.2rem",
    width: 32,
  },
  description: {
    fontSize: "0.95rem",
    lineHeight: 1.5,
    color: "#2d3a4b",
    margin: 0,
  },
  rightColumn: {},
  bookingCard: {
    background: "white",
    borderRadius: 24,
    padding: "28px 24px",
    boxShadow: "0 12px 28px rgba(0,0,0,0.08)",
    position: "sticky",
    top: 30,
    border: "1px solid #eef2ff",
  },
  noteBox: {
    background: "#e0f2fe",
    padding: "14px 16px",
    borderRadius: 16,
    fontSize: "0.9rem",
    color: "#0369a1",
    marginBottom: 24,
    textAlign: "center",
    fontWeight: 500,
  },
  bookingBtn: {
    width: "100%",
    background: "linear-gradient(135deg, #0891b2, #06b6d4)",
    color: "white",
    border: "none",
    padding: "16px 0",
    fontSize: "1.1rem",
    fontWeight: 600,
    borderRadius: 44,
    cursor: "pointer",
    transition: "0.2s",
    marginBottom: 16,
    ":hover": {
      opacity: 0.9,
    },
  },
  smallNote: {
    fontSize: "0.7rem",
    textAlign: "center",
    color: "#6c757d",
    margin: 0,
  },
  loading: {
    textAlign: "center",
    padding: 80,
    fontSize: "1.2rem",
    color: "#2c3e66",
  },
  errorContainer: {
    textAlign: "center",
    padding: 60,
  },
};

// Responsive
const mediaQuery = "@media (max-width: 780px)";
styles[mediaQuery] = {
  contentGrid: {
    gridTemplateColumns: "1fr",
  },
  profileHeader: {
    justifyContent: "center",
    textAlign: "center",
  },
};