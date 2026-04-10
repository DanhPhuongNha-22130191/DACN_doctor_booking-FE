// DoctorsPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import AppHeader from "../../components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DoctorsPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { selectedHospital } = location.state || {};

    const [doctors, setDoctors] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedDepartment, setSelectedDepartment] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hoveredCard, setHoveredCard] = useState(null);

    // API base URL
    const API_BASE_URL = "http://localhost:8080/api";

    // Lấy danh sách bác sĩ theo bệnh viện
    useEffect(() => {
        if (selectedHospital?.id) {
            fetchDoctorsByHospital(selectedHospital.id);
        } else {
            // Nếu không có selectedHospital (trường hợp truy cập trực tiếp vào trang)
            // Có thể redirect về trang chủ hoặc hiển thị thông báo
            setLoading(false);
            setError("Vui lòng chọn bệnh viện trước");
        }
    }, [selectedHospital]);

    // Lấy danh sách khoa theo bệnh viện
    useEffect(() => {
        if (selectedHospital?.id) {
            fetchDepartmentsByHospital(selectedHospital.id);
        }
    }, [selectedHospital]);

    const fetchDoctorsByHospital = async (hospitalId) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${API_BASE_URL}/doctors/hospital/${hospitalId}`);
            setDoctors(response.data);
        } catch (err) {
            console.error("Lỗi khi tải danh sách bác sĩ:", err);
            setError("Không thể tải danh sách bác sĩ. Vui lòng thử lại sau.");
            setDoctors([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchDepartmentsByHospital = async (hospitalId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/departments/hospital/${hospitalId}`);
            setDepartments(response.data);
        } catch (err) {
            console.error("Lỗi khi tải danh sách khoa:", err);
            setDepartments([]);
        }
    };

    // Filter và Search
    const filteredDoctors = doctors.filter((doc) => {
        const matchStatus = filterStatus === "all" ? true : doc.status === filterStatus;
        const matchDepartment = selectedDepartment === "all" ? true : doc.departmentId === parseInt(selectedDepartment);

        const keyword = search.toLowerCase();
        const matchSearch =
            doc.name?.toLowerCase().includes(keyword) ||
            doc.departmentName?.toLowerCase().includes(keyword);

        return matchStatus && matchDepartment && matchSearch;
    });

    // DoctorsPage.jsx - Sửa hàm handleBooking
    const handleBooking = (doctor) => {
        // Kiểm tra token hoặc thông tin người dùng
        const token = localStorage.getItem("accessToken");
        const user = localStorage.getItem("user");

        if (!token || !user) {
            // Hiển thị thông báo
            alert("Vui lòng đăng nhập để đặt lịch khám!");

            // Chuyển hướng đến trang đăng nhập và lưu lại trang hiện tại
            navigate("/login", {
                state: {
                    from: location.pathname,
                    doctor,
                    hospital: selectedHospital
                }
            });
            return;
        }

        // Nếu đã đăng nhập, chuyển sang trang booking
        navigate("/booking", {
            state: {
                doctor: {
                    id: doctor.id,
                    name: doctor.name,
                    phone: doctor.phone,
                    email: doctor.email,
                    hospital: selectedHospital?.name || doctor.hospitalName,
                    department: doctor.departmentName,
                },
                hospital: selectedHospital
            }
        });
    };

    if (loading) {
        return (
            <>
                <AppHeader />
                <div style={styles.loadingContainer}>
                    <div style={styles.spinner}></div>
                    <p>Đang tải danh sách bác sĩ tại {selectedHospital?.name}...</p>
                </div>
            </>
        );
    }

    if (error && !selectedHospital) {
        return (
            <>
                <AppHeader />
                <div style={styles.container}>
                    <div style={styles.errorContainer}>
                        <div style={styles.errorIcon}>⚠️</div>
                        <h2>Không có thông tin bệnh viện</h2>
                        <p>Vui lòng quay lại trang chủ và chọn bệnh viện</p>
                        <button onClick={() => navigate("/")} style={styles.backButton}>
                            ← Về trang chủ
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <AppHeader />
            <div style={styles.container}>
                {/* Breadcrumb / Navigation */}
                <div style={styles.breadcrumb}>
                    <span style={styles.breadcrumbItem} onClick={() => navigate("/")}>
                        Trang chủ
                    </span>
                    <span style={styles.breadcrumbSeparator}>›</span>
                    <span
                        style={styles.breadcrumbItem}
                        onClick={() => navigate("/hospitals")}
                    >
                        Danh sách bệnh viện
                    </span>
                    <span style={styles.breadcrumbSeparator}>›</span>
                    <span style={styles.breadcrumbItemActive}>
                        Bác sĩ tại {selectedHospital?.name}
                    </span>
                </div>

                <div style={styles.header}>
                    <div style={styles.iconWrapper}>👨‍⚕️</div>
                    <h1 style={styles.title}>
                        Bác sĩ tại {selectedHospital?.name}
                    </h1>
                    <p style={styles.subtitle}>
                        {filteredDoctors.length} bác sĩ đang sẵn sàng phục vụ bạn
                    </p>
                </div>

                {/* Thông báo lỗi nếu có */}
                {error && (
                    <div style={styles.errorBanner}>
                        <span>⚠️</span> {error}
                        <button onClick={() => fetchDoctorsByHospital(selectedHospital?.id)} style={styles.retryBtn}>
                            Thử lại
                        </button>
                    </div>
                )}

                {/* Search và Filter Section */}
                <div style={styles.filterSection}>
                    <div style={styles.searchBox}>
                        <span style={styles.searchIcon}>🔍</span>
                        <input
                            type="text"
                            placeholder="Tìm theo tên bác sĩ, khoa..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={styles.searchInput}
                        />
                    </div>
                </div>


                {/* Danh sách bác sĩ */}
                <div style={styles.grid}>
                    {filteredDoctors.map((doctor) => (
                        <div
                            key={doctor.id}
                            style={{
                                ...styles.card,
                                ...(hoveredCard === doctor.id && styles.cardHover),
                            }}
                            onMouseEnter={() => setHoveredCard(doctor.id)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <div style={styles.cardHeader}>
                                <div style={styles.avatar}>
                                    {doctor.name?.charAt(doctor.name.length - 1) || "👨‍⚕️"}
                                </div>
                                <div style={{ ...styles.statusBadge, ...(doctor.status === "active" ? styles.activeBadge : styles.inactiveBadge) }}>
                                    {doctor.status === "active" ? "🟢 Đang hoạt động" : "🔴 Tạm ngưng"}
                                </div>
                            </div>

                            <div style={styles.cardContent}>
                                <h2 style={styles.doctorName}>{doctor.name}</h2>

                                {doctor.degree && (
                                    <div style={styles.badgeContainer}>
                                        <span style={styles.degreeBadge}>{doctor.degree}</span>
                                        {doctor.experience && (
                                            <span style={styles.expBadge}>🎓 {doctor.experience} kinh nghiệm</span>
                                        )}
                                    </div>
                                )}

                                <div style={styles.infoRow}>
                                    <span style={styles.infoIcon}>🏥</span>
                                    <span style={styles.infoText}>{selectedHospital?.name}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoIcon}>🏬</span>
                                    <span style={styles.infoText}>{doctor.departmentName}</span>
                                </div>

                                <div style={styles.infoRow}>
                                    <span style={styles.infoIcon}>📞</span>
                                    <span style={styles.infoText}>
                                        <a href={`tel:${doctor.phone}`} style={styles.link}>
                                            {doctor.phone}
                                        </a>
                                    </span>
                                </div>

                                <div style={styles.infoRow}>
                                    <span style={styles.infoIcon}>📧</span>
                                    <span style={styles.infoText}>
                                        <a href={`mailto:${doctor.email}`} style={styles.link}>
                                            {doctor.email}
                                        </a>
                                    </span>
                                </div>

                                <button
                                    onClick={() => handleBooking(doctor)}
                                    disabled={doctor.status !== "active"}
                                    style={{
                                        ...styles.bookingButton,
                                        opacity: doctor.status !== "active" ? 0.5 : 1,
                                        cursor: doctor.status !== "active" ? "not-allowed" : "pointer",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (doctor.status === "active") {
                                            e.target.style.transform = "scale(1.02)";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = "scale(1)";
                                    }}
                                >
                                    <span>📅</span>
                                    {doctor.status === "active" ? "Đặt lịch khám với bác sĩ này" : "Tạm thời không nhận lịch"}
                                    <span style={styles.arrow}>→</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredDoctors.length === 0 && !error && (
                    <div style={styles.noResult}>
                        <div style={styles.noResultIcon}>😢</div>
                        <h3>Không tìm thấy bác sĩ</h3>
                        <p>Vui lòng thử lại với từ khóa khác hoặc chọn khoa khác</p>
                    </div>
                )}
            </div>
        </>
    );
}

const styles = {
    container: {
        padding: "30px 24px 50px",
        background: "#f0f2f5",
        minHeight: "calc(100vh - 70px)",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
    },
    breadcrumb: {
        maxWidth: "1300px",
        margin: "0 auto 20px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "14px",
    },
    breadcrumbItem: {
        color: "#667eea",
        cursor: "pointer",
        transition: "color 0.2s",
        "&:hover": {
            textDecoration: "underline",
        },
    },
    breadcrumbSeparator: {
        color: "#ccc",
        fontSize: "18px",
    },
    breadcrumbItemActive: {
        color: "#666",
        fontWeight: "500",
    },
    loadingContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 70px)",
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        maxWidth: "600px",
        margin: "0 auto 24px",
    },
    retryBtn: {
        background: "#c00",
        color: "white",
        border: "none",
        padding: "6px 16px",
        borderRadius: "20px",
        cursor: "pointer",
        fontSize: "13px",
    },
    errorContainer: {
        textAlign: "center",
        padding: "80px 20px",
        background: "white",
        borderRadius: "24px",
        maxWidth: "500px",
        margin: "80px auto",
    },
    errorIcon: {
        fontSize: "64px",
        marginBottom: "20px",
    },
    backButton: {
        marginTop: "24px",
        padding: "12px 24px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        border: "none",
        borderRadius: "12px",
        color: "white",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
    },
    filterSection: {
        maxWidth: "1200px",
        margin: "0 auto 32px",
    },
    searchBox: {
        display: "flex",
        alignItems: "center",
        background: "white",
        borderRadius: "50px",
        padding: "8px 20px",
        marginBottom: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    },
    searchIcon: {
        fontSize: "20px",
        marginRight: "12px",
        color: "#999",
    },
    searchInput: {
        flex: 1,
        border: "none",
        outline: "none",
        fontSize: "16px",
        padding: "12px 0",
        background: "transparent",
    },
    filterGroup: {
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
    },
    select: {
        flex: 1,
        minWidth: "180px",
        padding: "10px 16px",
        border: "1px solid #ddd",
        borderRadius: "12px",
        fontSize: "14px",
        background: "white",
        cursor: "pointer",
        outline: "none",
    },
    statusFilter: {
        display: "flex",
        gap: "8px",
    },
    statusBtn: {
        padding: "8px 20px",
        borderRadius: "25px",
        border: "none",
        fontSize: "14px",
        fontWeight: "500",
        cursor: "pointer",
        transition: "all 0.2s",
    },
    hospitalInfo: {
        display: "flex",
        alignItems: "flex-start",
        gap: "16px",
        background: "white",
        padding: "20px 24px",
        borderRadius: "16px",
        maxWidth: "1200px",
        margin: "0 auto 32px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        borderLeft: "4px solid #667eea",
    },
    hospitalInfoIcon: {
        fontSize: "32px",
    },
    hospitalInfoContent: {
        flex: 1,
    },
    hospitalContact: {
        display: "flex",
        gap: "24px",
        marginTop: "8px",
        fontSize: "13px",
        color: "#888",
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
        padding: "30px 20px 20px",
        position: "relative",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    avatar: {
        width: "80px",
        height: "80px",
        background: "rgba(255,255,255,0.2)",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "36px",
        fontWeight: "bold",
        color: "white",
        border: "3px solid rgba(255,255,255,0.5)",
    },
    statusBadge: {
        padding: "6px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "500",
        background: "rgba(255,255,255,0.95)",
    },
    activeBadge: {
        color: "#28a745",
        background: "#d4edda",
    },
    inactiveBadge: {
        color: "#dc3545",
        background: "#f8d7da",
    },
    cardContent: {
        padding: "20px",
    },
    doctorName: {
        fontSize: "1.3rem",
        color: "#2c3e50",
        marginBottom: "12px",
        fontWeight: "700",
    },
    badgeContainer: {
        display: "flex",
        gap: "8px",
        marginBottom: "16px",
        flexWrap: "wrap",
    },
    degreeBadge: {
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        padding: "4px 12px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: "500",
    },
    expBadge: {
        background: "#f0f2f5",
        color: "#f59e0b",
        padding: "4px 12px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: "500",
    },
    infoRow: {
        display: "flex",
        alignItems: "center",
        marginBottom: "10px",
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
    bookingButton: {
        width: "100%",
        marginTop: "20px",
        padding: "14px",
        background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
        border: "none",
        borderRadius: "14px",
        color: "white",
        fontSize: "15px",
        fontWeight: "600",
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
    noResult: {
        textAlign: "center",
        padding: "60px 20px",
        background: "white",
        borderRadius: "24px",
        maxWidth: "500px",
        margin: "40px auto",
    },
    noResultIcon: {
        fontSize: "64px",
        marginBottom: "16px",
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
    
    .breadcrumb-item:hover {
      text-decoration: underline;
    }
  `;
    document.head.appendChild(styleSheet);
}