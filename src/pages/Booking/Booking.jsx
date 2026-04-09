// BookingPage.jsx - Phiên bản gọi API thật
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import AppHeader from "../../components/Header";

// Cấu hình API base URL
const API_BASE_URL = "http://localhost:8080/api";

export default function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // DỮ LIỆU MẪU ĐỂ TEST - Nếu không có doctor từ trang trước thì dùng dữ liệu mẫu
  const mockDoctor = {
    id: 1,
    name: "BS. Nguyễn Văn An",
    phone: "0901234567",
    email: "bs.an@choray.vn",
    hospital: "Bệnh viện Chợ Rẫy",
    department: "Tim mạch",
    price: 350000,
    experience: "15 năm",
    degree: "Tiến sĩ, Bác sĩ chính"
  };

  // Sử dụng doctor từ state hoặc dùng dữ liệu mẫu
  const doctor = location.state?.doctor || mockDoctor;

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bookingCode, setBookingCode] = useState("");

  // DỮ LIỆU MẪU CHO FORM - Điền sẵn thông tin để test
  const [formData, setFormData] = useState({
    patientName: "Nguyễn Thị Khách Hàng",
    patientPhone: "0988888888",
    patientEmail: "khachhang@example.com",
    patientBirthday: "1990-05-15",
    patientGender: "female",
    patientAddress: "123 Đường Lê Lợi, Quận 1, TP.HCM",
    bookingDate: "",
    bookingTime: "",
    symptoms: "Đau ngực, khó thở khi gắng sức",
    bookingType: "offline",
    agreeTerms: false,
  });

  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [errors, setErrors] = useState({});
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Tạo danh sách ngày khả dụng (7 ngày tới)
  useEffect(() => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // Chỉ lấy ngày từ hôm nay trở đi
      dates.push({
        value: date.toISOString().split('T')[0],
        label: formatDate(date),
      });
    }
    setAvailableDates(dates);
  }, []);

  // Gọi API lấy khung giờ khả dụng khi chọn ngày
  useEffect(() => {
    if (formData.bookingDate) {
      fetchAvailableTimeSlots();
    }
  }, [formData.bookingDate]);

  // Hàm gọi API lấy danh sách khung giờ khả dụng
  const fetchAvailableTimeSlots = async () => {
    setLoadingSlots(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/bookings/slots`, {
        params: {
          doctorId: doctor.id,
          date: formData.bookingDate
        }
      });

      // Chuyển đổi dữ liệu từ API sang format UI
      const slots = response.data.map(slot => ({
        time: slot.startTime.substring(0, 5), // Lấy HH:MM
        available: slot.status === "available" && slot.isAvailable === true,
        slotId: slot.id,
        startTime: slot.startTime,
        endTime: slot.endTime
      }));

      setAvailableTimes(slots);
    } catch (error) {
      console.error("Lỗi khi lấy khung giờ:", error);
      // Nếu API lỗi, hiển thị thông báo
      setAvailableTimes([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Hàm gọi API tạo đặt lịch
  const createBookingAPI = async (bookingData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/bookings`, bookingData);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi đặt lịch:", error);
      throw error;
    }
  };

  const formatDate = (date) => {
    const days = ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
    return `${days[date.getDay()]}, ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.patientName.trim()) newErrors.patientName = "Vui lòng nhập họ tên";
    if (!formData.patientPhone.trim()) newErrors.patientPhone = "Vui lòng nhập số điện thoại";
    else if (!/^[0-9]{10}$/.test(formData.patientPhone)) newErrors.patientPhone = "Số điện thoại không hợp lệ";
    if (!formData.patientEmail.trim()) newErrors.patientEmail = "Vui lòng nhập email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.patientEmail)) newErrors.patientEmail = "Email không hợp lệ";
    if (!formData.patientBirthday) newErrors.patientBirthday = "Vui lòng chọn ngày sinh";
    if (!formData.patientGender) newErrors.patientGender = "Vui lòng chọn giới tính";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.bookingDate) newErrors.bookingDate = "Vui lòng chọn ngày khám";
    if (!formData.bookingTime) newErrors.bookingTime = "Vui lòng chọn giờ khám";
    if (!formData.agreeTerms) newErrors.agreeTerms = "Vui lòng đồng ý với điều khoản";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setSubmitting(true);

    try {
      // Tìm slotId từ time đã chọn
      const selectedSlot = availableTimes.find(t => t.time === formData.bookingTime);

      if (!selectedSlot) {
        throw new Error("Không tìm thấy thông tin khung giờ");
      }

      // Chuẩn bị dữ liệu gửi lên API
      const bookingRequest = {
        doctorId: doctor.id,
        timeSlotId: selectedSlot.slotId,
        appointmentDate: formData.bookingDate,
        appointmentTime: formData.bookingTime + ":00", // Thêm :00 cho đúng format TIME
        symptoms: formData.symptoms,
        bookingType: formData.bookingType
      };

      // Gọi API tạo đặt lịch
      const result = await createBookingAPI(bookingRequest);

      setBookingCode(result.bookingCode);
      setSubmitted(true);

      // Lưu vào localStorage để backup
      const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
      bookings.push({
        ...formData,
        doctor: doctor,
        bookingCode: result.bookingCode,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem("bookings", JSON.stringify(bookings));

    } catch (error) {
      console.error("Đặt lịch thất bại:", error);
      alert("Đặt lịch thất bại! Vui lòng thử lại sau.");
    } finally {
      setSubmitting(false);
    }
  };

  // Nếu đã đặt lịch thành công
  if (submitted) {
    return (
      <>
        <AppHeader />
        <div style={styles.successContainer}>
          <div style={styles.successIcon}>🎉</div>
          <h1 style={styles.successTitle}>Đặt lịch thành công!</h1>
          <p style={styles.successMessage}>
            Cảm ơn bạn đã tin tưởng sử dụng dịch vụ của chúng tôi
          </p>

          <div style={styles.bookingInfo}>
            <h3>Thông tin đặt lịch</h3>
            <div style={styles.infoCard}>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Mã đặt lịch:</span>
                <span style={styles.infoValueCode}>{bookingCode}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Bác sĩ:</span>
                <span style={styles.infoValue}>{doctor.name}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Bệnh viện:</span>
                <span style={styles.infoValue}>{doctor.hospital}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Khoa:</span>
                <span style={styles.infoValue}>{doctor.department}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Ngày khám:</span>
                <span style={styles.infoValue}>
                  {formData.bookingDate && new Date(formData.bookingDate).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Giờ khám:</span>
                <span style={styles.infoValue}>{formData.bookingTime}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Bệnh nhân:</span>
                <span style={styles.infoValue}>{formData.patientName}</span>
              </div>
            </div>
          </div>

          <div style={styles.successActions}>
            <button onClick={() => navigate("/")} style={styles.homeButton}>
              🏠 Về trang chủ
            </button>
            <button onClick={() => window.print()} style={styles.printButton}>
              🖨️ In thông tin
            </button>
          </div>

          <p style={styles.note}>
            * Vui lòng mang theo mã đặt lịch và giấy tờ tùy thân khi đến khám
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <AppHeader />
      <div style={styles.container}>
        {/* Breadcrumb */}
        <div style={styles.breadcrumb}>
          <span style={styles.breadcrumbItem} onClick={() => navigate("/")}>
            Trang chủ
          </span>
          <span style={styles.breadcrumbSeparator}>›</span>
          <span style={styles.breadcrumbItem} onClick={() => navigate("/doctors")}>
            Bác sĩ
          </span>
          <span style={styles.breadcrumbSeparator}>›</span>
          <span style={styles.breadcrumbItemActive}>
            Đặt lịch khám
          </span>
        </div>

        <div style={styles.mainContent}>
          {/* Left Column - Form đặt lịch */}
          <div style={styles.formColumn}>
            <div style={styles.header}>
              <div style={styles.iconWrapper}>📅</div>
              <h1 style={styles.title}>Đặt lịch khám bệnh</h1>
              <p style={styles.subtitle}>Vui lòng điền đầy đủ thông tin bên dưới</p>
            </div>

            {/* Steps Indicator */}
            <div style={styles.steps}>
              <div style={{ ...styles.step, ...(step >= 1 && styles.stepActive) }}>
                <div style={{ ...styles.stepNumber, ...(step >= 1 && styles.stepNumberActive) }}>1</div>
                <div style={{ ...styles.stepLabel, ...(step >= 1 && styles.stepLabelActive) }}>Thông tin bệnh nhân</div>
              </div>
              <div style={styles.stepLine}></div>
              <div style={{ ...styles.step, ...(step >= 2 && styles.stepActive) }}>
                <div style={{ ...styles.stepNumber, ...(step >= 2 && styles.stepNumberActive) }}>2</div>
                <div style={{ ...styles.stepLabel, ...(step >= 2 && styles.stepLabelActive) }}>Chọn lịch khám</div>
              </div>
              <div style={styles.stepLine}></div>
              <div style={{ ...styles.step, ...(step >= 3 && styles.stepActive) }}>
                <div style={{ ...styles.stepNumber, ...(step >= 3 && styles.stepNumberActive) }}>3</div>
                <div style={{ ...styles.stepLabel, ...(step >= 3 && styles.stepLabelActive) }}>Xác nhận</div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div style={styles.formSection}>
                  <h3 style={styles.sectionTitle}>👤 Thông tin cá nhân</h3>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Họ và tên *</label>
                    <input
                      type="text"
                      name="patientName"
                      value={formData.patientName}
                      onChange={handleInputChange}
                      placeholder="Nhập họ tên đầy đủ"
                      style={styles.input}
                    />
                    {errors.patientName && <span style={styles.errorText}>{errors.patientName}</span>}
                  </div>

                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Số điện thoại *</label>
                      <input
                        type="tel"
                        name="patientPhone"
                        value={formData.patientPhone}
                        onChange={handleInputChange}
                        placeholder="090xxxxxxx"
                        style={styles.input}
                      />
                      {errors.patientPhone && <span style={styles.errorText}>{errors.patientPhone}</span>}
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Email *</label>
                      <input
                        type="email"
                        name="patientEmail"
                        value={formData.patientEmail}
                        onChange={handleInputChange}
                        placeholder="example@gmail.com"
                        style={styles.input}
                      />
                      {errors.patientEmail && <span style={styles.errorText}>{errors.patientEmail}</span>}
                    </div>
                  </div>

                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Ngày sinh *</label>
                      <input
                        type="date"
                        name="patientBirthday"
                        value={formData.patientBirthday}
                        onChange={handleInputChange}
                        style={styles.input}
                      />
                      {errors.patientBirthday && <span style={styles.errorText}>{errors.patientBirthday}</span>}
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Giới tính *</label>
                      <select
                        name="patientGender"
                        value={formData.patientGender}
                        onChange={handleInputChange}
                        style={styles.select}
                      >
                        <option value="">Chọn giới tính</option>
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                        <option value="other">Khác</option>
                      </select>
                      {errors.patientGender && <span style={styles.errorText}>{errors.patientGender}</span>}
                    </div>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Địa chỉ</label>
                    <input
                      type="text"
                      name="patientAddress"
                      value={formData.patientAddress}
                      onChange={handleInputChange}
                      placeholder="Nhập địa chỉ liên lạc"
                      style={styles.input}
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div style={styles.formSection}>
                  <h3 style={styles.sectionTitle}>📅 Chọn lịch khám</h3>


                  <div style={styles.formGroup}>
                    <label style={styles.label}>Chọn ngày khám *</label>
                    <div style={styles.dateGrid}>
                      {availableDates.map((date) => (
                        <button
                          key={date.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, bookingDate: date.value, bookingTime: "" }))}
                          style={{
                            ...styles.dateButton,
                            ...(formData.bookingDate === date.value && styles.dateButtonActive),
                          }}
                        >
                          {date.label}
                        </button>
                      ))}
                    </div>
                    {errors.bookingDate && <span style={styles.errorText}>{errors.bookingDate}</span>}
                  </div>

                  {formData.bookingDate && (
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Chọn giờ khám *</label>
                      {loadingSlots ? (
                        <div style={{ textAlign: "center", padding: "20px" }}>Đang tải khung giờ...</div>
                      ) : (
                        <div style={styles.timeGrid}>
                          {availableTimes.map((time) => (
                            <button
                              key={time.time}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, bookingTime: time.time }))}
                              style={{
                                ...styles.timeButton,
                                ...(formData.bookingTime === time.time && styles.timeButtonActive),
                                ...(!time.available && styles.timeButtonDisabled),
                              }}
                              disabled={!time.available}
                            >
                              {time.time}
                              {!time.available && <span style={styles.bookedBadge}>Hết</span>}
                            </button>
                          ))}
                        </div>
                      )}
                      {errors.bookingTime && <span style={styles.errorText}>{errors.bookingTime}</span>}
                    </div>
                  )}

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Triệu chứng / Lý do khám</label>
                    <textarea
                      name="symptoms"
                      value={formData.symptoms}
                      onChange={handleInputChange}
                      placeholder="Mô tả triệu chứng hoặc lý do bạn muốn khám..."
                      rows="4"
                      style={styles.textarea}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Hình thức khám</label>
                    <div style={styles.radioGroup}>
                      <label style={styles.radioLabel}>
                        <input
                          type="radio"
                          name="bookingType"
                          value="offline"
                          checked={formData.bookingType === "offline"}
                          onChange={handleInputChange}
                        />
                        <span>🏥 Khám trực tiếp</span>
                      </label>
                      <label style={styles.radioLabel}>
                        <input
                          type="radio"
                          name="bookingType"
                          value="online"
                          checked={formData.bookingType === "online"}
                          onChange={handleInputChange}
                        />
                        <span>💻 Khám từ xa (Telehealth)</span>
                      </label>
                    </div>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleInputChange}
                      />
                      <span>Tôi đồng ý với <a href="#" style={styles.termsLink}>điều khoản sử dụng</a> và chính sách bảo mật</span>
                    </label>
                    {errors.agreeTerms && <span style={styles.errorText}>{errors.agreeTerms}</span>}
                  </div>
                </div>
              )}

              <div style={styles.buttonGroup}>
                {step === 2 && (
                  <button type="button" onClick={handleBack} style={styles.backButton}>
                    ← Quay lại
                  </button>
                )}
                {step === 1 && (
                  <button type="button" onClick={handleNext} style={styles.nextButton}>
                    Tiếp theo →
                  </button>
                )}
                {step === 2 && (
                  <button type="submit" disabled={submitting} style={styles.submitButton}>
                    {submitting ? "Đang xử lý..." : "Xác nhận đặt lịch"}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Right Column - Thông tin bác sĩ */}
          <div style={styles.infoColumn}>
            <div style={styles.doctorCard}>
              <h3 style={styles.infoTitle}>👨‍⚕️ Thông tin bác sĩ</h3>
              <div style={styles.doctorDetail}>
                <div style={styles.doctorAvatarLarge}>
                  {doctor.name.charAt(doctor.name.length - 1)}
                </div>
                <h4 style={styles.doctorFullName}>{doctor.name}</h4>
                <p style={styles.doctorSpecialty}>{doctor.department}</p>
                <p style={styles.doctorHospital}>{doctor.hospital}</p>
                <div style={styles.doctorExp}>⭐ {doctor.experience} kinh nghiệm</div>
                <div style={styles.divider}></div>
                <div style={styles.contactInfo}>
                  <div>📞 {doctor.phone}</div>
                  <div>📧 {doctor.email}</div>
                </div>
              </div>
            </div>

            <div style={styles.infoCard}>
              <h3 style={styles.infoTitle}>📋 Hướng dẫn đặt lịch</h3>
              <ul style={styles.guideList}>
                <li>✓ Điền đầy đủ thông tin cá nhân</li>
                <li>✓ Chọn ngày giờ khám phù hợp</li>
                <li>✓ Xác nhận thông tin đặt lịch</li>
                <li>✓ Nhận mã đặt lịch qua email/SMS</li>
                <li>✓ Đến khám đúng giờ đã hẹn</li>
              </ul>
            </div>

            <div style={styles.noteCard}>
              <div style={styles.noteIcon}>💡</div>
              <div>
                <strong>Lưu ý:</strong>
                <ul style={styles.noteList}>
                  <li>Vui lòng đến trước giờ hẹn 15 phút</li>
                  <li>Mang theo CCCD/CMND khi đi khám</li>
                  <li>Hủy lịch trước ít nhất 2 giờ</li>
                </ul>
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
    padding: "30px 24px 50px",
    background: "#f0f2f5",
    minHeight: "calc(100vh - 70px)",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  demoBanner: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    padding: "12px 20px",
    borderRadius: "12px",
    maxWidth: "1300px",
    margin: "0 auto 20px",
    textAlign: "center",
    fontSize: "14px",
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
  },
  breadcrumbSeparator: {
    color: "#ccc",
    fontSize: "18px",
  },
  breadcrumbItemActive: {
    color: "#666",
    fontWeight: "500",
  },
  mainContent: {
    maxWidth: "1300px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1fr 380px",
    gap: "30px",
  },
  formColumn: {
    background: "white",
    borderRadius: "24px",
    padding: "32px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  header: {
    textAlign: "center",
    marginBottom: "32px",
  },
  iconWrapper: {
    fontSize: "48px",
    marginBottom: "12px",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "700",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#666",
  },
  steps: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "32px",
    padding: "0 20px",
  },
  step: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    flex: 1,
  },
  stepNumber: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#e0e0e0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    color: "#999",
  },
  stepNumberActive: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
  },
  stepLabel: {
    fontSize: "12px",
    color: "#999",
  },
  stepLabelActive: {
    color: "#667eea",
    fontWeight: "600",
  },
  stepLine: {
    flex: 1,
    height: "2px",
    background: "#e0e0e0",
  },
  formSection: {
    marginBottom: "24px",
  },
  sectionTitle: {
    fontSize: "1.2rem",
    fontWeight: "600",
    color: "#333",
    marginBottom: "20px",
    paddingBottom: "10px",
    borderBottom: "2px solid #f0f2f5",
  },
  formGroup: {
    marginBottom: "20px",
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "500",
    color: "#555",
    fontSize: "14px",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    fontSize: "14px",
    outline: "none",
  },
  select: {
    width: "100%",
    padding: "12px 16px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    fontSize: "14px",
    background: "white",
    cursor: "pointer",
    outline: "none",
  },
  textarea: {
    width: "100%",
    padding: "12px 16px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    fontSize: "14px",
    fontFamily: "inherit",
    resize: "vertical",
    outline: "none",
  },
  errorText: {
    color: "#dc3545",
    fontSize: "12px",
    marginTop: "5px",
    display: "block",
  },
  doctorSummary: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "16px",
    background: "#f8f9fa",
    borderRadius: "12px",
    marginBottom: "24px",
  },
  doctorAvatar: {
    width: "50px",
    height: "50px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "bold",
    color: "white",
  },
  doctorName: {
    fontWeight: "600",
    fontSize: "16px",
    marginBottom: "4px",
  },
  doctorInfo: {
    fontSize: "13px",
    color: "#666",
  },
  doctorPrice: {
    fontSize: "13px",
    color: "#28a745",
    fontWeight: "600",
    marginTop: "4px",
  },
  dateGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
    gap: "10px",
  },
  dateButton: {
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    background: "white",
    cursor: "pointer",
    fontSize: "13px",
    position: "relative",
  },
  dateButtonActive: {
    borderColor: "#43e97b",
    background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    color: "white",
  },
  dateButtonDisabled: {
    background: "#f5f5f5",
    cursor: "not-allowed",
    opacity: 0.5,
  },
  weekendBadge: {
    position: "absolute",
    top: "-5px",
    right: "-5px",
    background: "#ff9800",
    color: "white",
    fontSize: "10px",
    padding: "2px 4px",
    borderRadius: "4px",
  },
  timeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
    gap: "10px",
  },
  timeButton: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    background: "white",
    cursor: "pointer",
    fontSize: "14px",
    position: "relative",
  },
  timeButtonActive: {
    borderColor: "#43e97b",
    background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    color: "white",
  },
  timeButtonDisabled: {
    background: "#f5f5f5",
    cursor: "not-allowed",
    opacity: 0.5,
  },
  bookedBadge: {
    position: "absolute",
    bottom: "-8px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#dc3545",
    color: "white",
    fontSize: "8px",
    padding: "2px 4px",
    borderRadius: "4px",
    whiteSpace: "nowrap",
  },
  radioGroup: {
    display: "flex",
    gap: "20px",
  },
  radioLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    fontSize: "14px",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    fontSize: "14px",
  },
  termsLink: {
    color: "#667eea",
    textDecoration: "none",
  },
  buttonGroup: {
    display: "flex",
    gap: "16px",
    marginTop: "24px",
  },
  nextButton: {
    flex: 1,
    padding: "14px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
  backButton: {
    flex: 1,
    padding: "14px",
    background: "#f0f2f5",
    color: "#666",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
  submitButton: {
    flex: 1,
    padding: "14px",
    background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
  infoColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  doctorCard: {
    background: "white",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  infoTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "16px",
    color: "#333",
  },
  doctorDetail: {
    textAlign: "center",
  },
  doctorAvatarLarge: {
    width: "80px",
    height: "80px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "36px",
    fontWeight: "bold",
    color: "white",
    margin: "0 auto 16px",
  },
  doctorFullName: {
    fontSize: "1.2rem",
    fontWeight: "600",
    marginBottom: "8px",
  },
  doctorSpecialty: {
    color: "#667eea",
    fontSize: "14px",
    marginBottom: "4px",
  },
  doctorHospital: {
    color: "#666",
    fontSize: "13px",
    marginBottom: "8px",
  },
  doctorExp: {
    color: "#f59e0b",
    fontSize: "12px",
    marginBottom: "16px",
  },
  divider: {
    height: "1px",
    background: "#f0f2f5",
    margin: "16px 0",
  },
  contactInfo: {
    fontSize: "13px",
    color: "#666",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  infoCard: {
    background: "white",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  guideList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  noteCard: {
    background: "#fff3e0",
    borderRadius: "24px",
    padding: "20px",
    display: "flex",
    gap: "12px",
  },
  noteIcon: {
    fontSize: "24px",
  },
  noteList: {
    marginTop: "8px",
    paddingLeft: "20px",
    fontSize: "13px",
    color: "#666",
  },
  successContainer: {
    padding: "50px 24px",
    background: "#f0f2f5",
    minHeight: "calc(100vh - 70px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  successIcon: {
    fontSize: "80px",
    marginBottom: "24px",
  },
  successTitle: {
    fontSize: "2rem",
    color: "#28a745",
    marginBottom: "12px",
  },
  successMessage: {
    fontSize: "1.1rem",
    color: "#666",
    marginBottom: "32px",
  },
  bookingInfo: {
    maxWidth: "500px",
    width: "100%",
    marginBottom: "32px",
  },
  infoCardBooking: {
    background: "white",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #f0f2f5",
  },
  infoLabel: {
    fontWeight: "500",
    color: "#666",
  },
  infoValue: {
    color: "#333",
  },
  infoValueCode: {
    color: "#667eea",
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  successActions: {
    display: "flex",
    gap: "16px",
    marginBottom: "24px",
  },
  homeButton: {
    padding: "12px 24px",
    background: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
  },
  printButton: {
    padding: "12px 24px",
    background: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
  },
  note: {
    fontSize: "12px",
    color: "#999",
    textAlign: "center",
  },
};