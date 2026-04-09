// HospitalList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function HospitalList() {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  // API base URL (thay đổi theo backend của bạn)
  const API_BASE_URL = "http://localhost:8080/api";

  useEffect(() => {
    fetchHospitals();
  }, []);

  const handleViewDoctors = (hospital) => {
    // Chuyển sang trang danh sách bác sĩ
    navigate("/doctors", {
      state: {
        selectedHospital: {
          id: hospital.id,
          name: hospital.name,
          address: hospital.address,
          phone: hospital.phone,
          email: hospital.email
        }
      }
    });
  };
  const fetchHospitals = async () => {
    try {
      setLoading(true);
      // Gọi API lấy danh sách bệnh viện
      const response = await axios.get(`${API_BASE_URL}/hospitals/active`);
      setHospitals(response.data);
      setError(null);
    } catch (err) {
      console.error("Lỗi khi tải danh sách bệnh viện:", err);
      setError("Không thể tải danh sách bệnh viện. Vui lòng thử lại sau.");

      // Nếu có lỗi, dùng dữ liệu mẫu để test
      const mockData = [
        {
          id: 1,
          name: "Bệnh viện Chợ Rẫy",
          address: "201B Nguyễn Chí Thanh, Phường 12, Quận 5, TP.HCM",
          phone: "02838554137",
          email: "choray@bvchoray.vn",
          created_at: "2026-04-01 10:00:00",
          updated_at: "2026-04-01 10:00:00",
        },
        {
          id: 2,
          name: "Bệnh viện Đại học Y Dược",
          address: "215 Hồng Bàng, Phường 11, Quận 5, TP.HCM",
          phone: "02838554269",
          email: "bvyd@umc.edu.vn",
          created_at: "2026-04-02 09:30:00",
          updated_at: "2026-04-02 09:30:00",
        },
        {
          id: 3,
          name: "Bệnh viện Nhân dân 115",
          address: "527 Sư Vạn Hạnh, Phường 12, Quận 10, TP.HCM",
          phone: "02838654249",
          email: "bv115@tphcm.gov.vn",
          created_at: "2026-04-03 08:15:00",
          updated_at: "2026-04-03 08:15:00",
        },
        {
          id: 4,
          name: "Bệnh viện Nhi Đồng 1",
          address: "341 Sư Vạn Hạnh, Phường 10, Quận 10, TP.HCM",
          phone: "02839271111",
          email: "nhidong1@bvnhi.org.vn",
          created_at: "2026-04-04 14:20:00",
          updated_at: "2026-04-04 14:20:00",
        },
        {
          id: 5,
          name: "Bệnh viện Tâm Đức",
          address: "4 Đường số 3, KDC Bình Hưng, Quận 8, TP.HCM",
          phone: "02838631818",
          email: "info@tamduchospital.vn",
          created_at: "2026-04-05 11:00:00",
          updated_at: "2026-04-05 11:00:00",
        },
        {
          id: 6,
          name: "Bệnh viện Quốc tế City",
          address: "3 Đường 3A, KDC Bình Hưng, Quận 8, TP.HCM",
          phone: "02862802020",
          email: "contact@cityinternationalhospital.com",
          created_at: "2026-04-06 16:45:00",
          updated_at: "2026-04-06 16:45:00",
        },
      ];
      setHospitals(mockData);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = (hospital) => {
    // Chuyển sang trang đặt lịch với thông tin bệnh viện
    navigate("/booking", {
      state: {
        hospital: {
          id: hospital.id,
          name: hospital.name,
          address: hospital.address,
          phone: hospital.phone,
          email: hospital.email
        }
      }
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Đang tải danh sách bệnh viện...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        {/* <div style={styles.iconWrapper}>🏥</div> */}
        <h1 style={styles.title}>
          Đặt lịch khám bệnh
        </h1>
        <p style={styles.subtitle}>
          Chọn bệnh viện bạn muốn đặt lịch • {hospitals.length} bệnh viện đối tác
        </p>
      </div>

      {error && (
        <div style={styles.errorBanner}>
          ⚠️ {error}
        </div>
      )}

      <div style={styles.grid}>
        {hospitals.map((hospital) => (
          <div
            key={hospital.id}
            style={{
              ...styles.card,
              ...(hoveredCard === hospital.id && styles.cardHover),
            }}
            onMouseEnter={() => setHoveredCard(hospital.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={styles.cardHeader}>
              <div style={styles.hospitalIcon}>🏥</div>
              <h2 style={styles.name}>{hospital.name}</h2>
            </div>

            <div style={styles.cardContent}>
              <div style={styles.infoRow}>
                <span style={styles.infoIcon}>📍</span>
                <span style={styles.infoText}>{hospital.address}</span>
              </div>

              <div style={styles.infoRow}>
                <span style={styles.infoIcon}>📞</span>
                <span style={styles.infoText}>
                  <a href={`tel:${hospital.phone}`} style={styles.link}>
                    {hospital.phone}
                  </a>
                </span>
              </div>

              <div style={styles.infoRow}>
                <span style={styles.infoIcon}>📧</span>
                <span style={styles.infoText}>
                  <a href={`mailto:${hospital.email}`} style={styles.link}>
                    {hospital.email}
                  </a>
                </span>
              </div>

              <div style={styles.divider} />




              <button
                onClick={() => handleViewDoctors(hospital)}
                style={styles.bookingButton}
                onMouseEnter={(e) => {
                  e.target.style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "scale(1)";
                }}
              >
                <span>👨‍⚕️</span>
                Xem bác sĩ
                <span style={styles.arrow}>→</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Hướng dẫn sử dụng */}
      <div style={styles.guide}>
        <div style={styles.guideItem}>
          <div style={styles.guideIcon}>1</div>
          <div>
            <h4>Chọn bệnh viện</h4>
            <p>Xem thông tin chi tiết từng bệnh viện</p>
          </div>
        </div>
        <div style={styles.guideLine}>→</div>
        <div style={styles.guideItem}>
          <div style={styles.guideIcon}>2</div>
          <div>
            <h4>Nhấn "Đặt lịch ngay"</h4>
            <p>Chuyển sang trang đặt lịch</p>
          </div>
        </div>
        <div style={styles.guideLine}>→</div>
        <div style={styles.guideItem}>
          <div style={styles.guideIcon}>3</div>
          <div>
            <h4>Hoàn tất đặt lịch</h4>
            <p>Chọn ngày giờ và xác nhận</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "50px 24px",
    background: "#f0f2f5",
    minHeight: "100vh",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "#f0f2f5",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #667eea",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  header: {
    textAlign: "center",
    marginBottom: "48px",
  },
  iconWrapper: {
    fontSize: "56px",
    marginBottom: "16px",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "700",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "12px",
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "#666",
    margin: 0,
  },
  errorBanner: {
    background: "#fee",
    color: "#c00",
    padding: "12px 20px",
    borderRadius: "12px",
    marginBottom: "24px",
    textAlign: "center",
    maxWidth: "600px",
    margin: "0 auto 24px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
    gap: "28px",
    maxWidth: "1300px",
    margin: "0 auto",
  },
  card: {
    background: "white",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    transition: "all 0.3s ease",
    cursor: "pointer",
  },
  cardHover: {
    transform: "translateY(-6px)",
    boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
  },
  cardHeader: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "24px 20px",
    color: "white",
    position: "relative",
  },
  hospitalIcon: {
    fontSize: "40px",
    marginBottom: "12px",
  },
  name: {
    fontSize: "1.4rem",
    margin: "0 0 8px 0",
    fontWeight: "700",
    lineHeight: 1.3,
  },
  idBadge: {
    position: "absolute",
    top: "16px",
    right: "16px",
    background: "rgba(255,255,255,0.2)",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "500",
  },
  cardContent: {
    padding: "20px",
  },
  infoRow: {
    display: "flex",
    alignItems: "flex-start",
    marginBottom: "12px",
    color: "#555",
    fontSize: "14px",
    lineHeight: 1.5,
  },
  infoIcon: {
    fontSize: "18px",
    marginRight: "12px",
    minWidth: "24px",
  },
  infoText: {
    flex: 1,
    wordBreak: "break-word",
  },
  link: {
    color: "#667eea",
    textDecoration: "none",
    transition: "color 0.2s",
  },
  divider: {
    height: "1px",
    background: "#eee",
    margin: "16px 0",
  },
  timeInfo: {
    background: "#f8f9fa",
    padding: "12px",
    borderRadius: "12px",
    marginBottom: "20px",
    fontSize: "12px",
  },
  timeRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "6px",
    color: "#666",
  },
  bookingButton: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    border: "none",
    borderRadius: "14px",
    color: "white",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },
  arrow: {
    fontSize: "16px",
    transition: "transform 0.2s ease",
  },
  guide: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "24px",
    maxWidth: "800px",
    margin: "60px auto 0",
    padding: "32px 24px",
    background: "white",
    borderRadius: "28px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
    flexWrap: "wrap",
  },
  guideItem: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    flex: 1,
    minWidth: "180px",
  },
  guideIcon: {
    width: "44px",
    height: "44px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "20px",
    fontWeight: "bold",
  },
  guideLine: {
    fontSize: "24px",
    color: "#ccc",
    fontWeight: "300",
  },
};

// Thêm CSS animation
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    button:hover .arrow {
      transform: translateX(5px);
    }
    
    a:hover {
      color: #764ba2 !important;
      text-decoration: underline !important;
    }
  `;
  document.head.appendChild(styleSheet);
}