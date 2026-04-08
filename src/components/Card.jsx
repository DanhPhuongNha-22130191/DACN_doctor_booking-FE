import React from "react";
import { Card as AntCard, Button } from "antd";
import { 
  PhoneOutlined, 
  CalendarOutlined, 
  UserOutlined,
  ArrowRightOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";

const ServiceCard = ({ number, title, description, icon, features, color, delay }) => {
  return (
    <div
      className="service-card"
      style={{
        animation: `fadeInUp 0.6s ease-out ${delay}s both`
      }}
    >
      <div
        style={{
          position: "relative",
          background: "white",
          borderRadius: "24px",
          padding: "32px",
          height: "100%",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          cursor: "pointer",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 20px 40px -12px rgba(0,0,0,0.1)",
          border: "1px solid rgba(0,0,0,0.05)",
          overflow: "hidden"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-8px)";
          e.currentTarget.style.boxShadow = "0 20px 40px -12px rgba(26, 115, 232, 0.2)";
          e.currentTarget.style.borderColor = "rgba(26, 115, 232, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05), 0 20px 40px -12px rgba(0,0,0,0.1)";
          e.currentTarget.style.borderColor = "rgba(0,0,0,0.05)";
        }}
      >
        {/* Decorative background */}
        <div
          style={{
            position: "absolute",
            top: "-20%",
            right: "-10%",
            width: "150px",
            height: "150px",
            background: `linear-gradient(135deg, ${color}10 0%, ${color}05 100%)`,
            borderRadius: "50%",
            opacity: 0.5,
            zIndex: 0
          }}
        />

        {/* Number badge */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            width: "48px",
            height: "48px",
            background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            fontWeight: "bold",
            color: "white",
            boxShadow: `0 4px 10px ${color}40`,
            zIndex: 1
          }}
        >
          {number}
        </div>

        {/* Icon */}
        <div
          style={{
            fontSize: "48px",
            marginBottom: "24px",
            position: "relative",
            zIndex: 1
          }}
        >
          {icon}
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "700",
            marginBottom: "16px",
            color: "#1a1a1a",
            position: "relative",
            zIndex: 1
          }}
        >
          {title}
        </h2>

        {/* Divider */}
        <div
          style={{
            height: "3px",
            width: "50px",
            background: `linear-gradient(90deg, ${color} 0%, ${color}60 100%)`,
            marginBottom: "20px",
            borderRadius: "3px",
            position: "relative",
            zIndex: 1
          }}
        />

        {/* Description */}
        <p
          style={{
            fontSize: "15px",
            lineHeight: "1.6",
            color: "#666",
            marginBottom: "24px",
            position: "relative",
            zIndex: 1
          }}
        >
          {description}
        </p>

        {/* Features list */}
        {features && (
          <div style={{ marginBottom: "24px", position: "relative", zIndex: 1 }}>
            {features.map((feature, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "8px",
                  fontSize: "13px",
                  color: "#555"
                }}
              >
                <CheckCircleOutlined style={{ color, fontSize: "14px" }} />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        )}

        {/* Button */}
        <Button
          type="link"
          style={{
            padding: 0,
            color,
            fontWeight: 600,
            position: "relative",
            zIndex: 1
          }}
        >
          Tìm hiểu thêm <ArrowRightOutlined />
        </Button>
      </div>
    </div>
  );
};

export default function MedicalCards() {
  const cardsData = [
    {
      number: "01",
      title: "Gọi tổng đài",
      description: "Đội ngũ chuyên viên y tế 24/7 sẵn sàng tư vấn triệu chứng, hướng dẫn chuyên khoa phù hợp và giới thiệu bác sĩ hàng đầu.",
      icon: <PhoneOutlined style={{ color: "#1a73e8" }} />,
      color: "#1a73e8",
      features: ["Hỗ trợ 24/7", "Tư vấn miễn phí", "Đội ngũ chuyên nghiệp"],
      delay: "0s"
    },
    {
      number: "02",
      title: "Đặt lịch hẹn",
      description: "Đặt lịch khám trực tuyến dễ dàng hoặc yêu cầu dịch vụ khẩn cấp. Hệ thống xác nhận nhanh chóng qua SMS và Email.",
      icon: <CalendarOutlined style={{ color: "#f59e0b" }} />,
      color: "#f59e0b",
      features: ["Xác nhận tức thì", "Nhắc lịch tự động", "Hỗ trợ khẩn cấp 24/7"],
      delay: "0.1s"
    },
    {
      number: "03",
      title: "Tìm bác sĩ",
      description: "Kết nối với hơn 1000 bác sĩ chuyên khoa hàng đầu, xem đánh giá và lựa chọn bác sĩ phù hợp với nhu cầu của bạn.",
      icon: <UserOutlined style={{ color: "#10b981" }} />,
      color: "#10b981",
      features: ["Hồ sơ bác sĩ chi tiết", "Đánh giá thực tế", "Đặt lịch nhanh chóng"],
      delay: "0.2s"
    }
  ];

  return (
    <div
      style={{
        padding: "60px 40px 80px",
        background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
        position: "relative"
      }}
    >
      {/* Section Header */}
      <div
        style={{
          textAlign: "center",
          maxWidth: "800px",
          margin: "0 auto 60px",
          position: "relative"
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "4px 12px",
            background: "linear-gradient(135deg, #1a73e8 0%, #00b14f 100%)",
            borderRadius: "40px",
            fontSize: "12px",
            fontWeight: "600",
            color: "white",
            marginBottom: "16px"
          }}
        >
          QUY TRÌNH ĐƠN GIẢN
        </div>
        
        <h2
          style={{
            fontSize: "36px",
            fontWeight: "700",
            marginBottom: "16px",
            background: "linear-gradient(135deg, #1a1a1a 0%, #4a5568 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}
        >
          Đặt lịch khám chỉ với 3 bước đơn giản
        </h2>
        
        <p
          style={{
            fontSize: "16px",
            color: "#718096",
            lineHeight: "1.6"
          }}
        >
          Quy trình nhanh chóng, tiện lợi giúp bạn tiết kiệm thời gian và nhận được sự chăm sóc y tế tốt nhất
        </p>
      </div>

      {/* Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "32px",
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 20px"
        }}
      >
        {cardsData.map((card, index) => (
          <ServiceCard key={index} {...card} />
        ))}
      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .service-card {
            animation: fadeInUp 0.6s ease-out forwards;
          }
          
          @media (max-width: 768px) {
            .service-card {
              animation: none;
            }
          }
        `}
      </style>
    </div>
  );
}