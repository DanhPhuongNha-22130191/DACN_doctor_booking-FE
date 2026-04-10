import { Input, Button, Tag, Statistic, Row, Col, Card } from "antd";
import { 
  SearchOutlined, 
  CalendarOutlined, 
  StarOutlined, 
  SafetyOutlined,
  ClockCircleOutlined,
  ArrowRightOutlined,
  HeartOutlined,
  EnvironmentOutlined
} from "@ant-design/icons";
import { useState } from "react";

const Hero = () => {
  const [searchValue, setSearchValue] = useState("");

  // Thống kê nổi bật
  const stats = [
    { value: 1000, suffix: "+", title: "Bác sĩ chuyên khoa", icon: <StarOutlined /> },
    { value: 25, suffix: "+", title: "Bệnh viện liên kết", icon: <SafetyOutlined /> },
    { value: 100, suffix: "+", title: "Phòng khám đối tác", icon: <EnvironmentOutlined /> },
    { value: 50000, suffix: "+", title: "Khách hàng tin dùng", icon: <HeartOutlined /> }
  ];

  // Gợi ý tìm kiếm phổ biến
  const popularSearches = [
    "Bác sĩ Nhi", "Bác sĩ Tim mạch", "Bác sĩ Da liễu", "Khám tổng quát", "Xét nghiệm máu"
  ];

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 0%, #1a73e8 100%)",
        padding: "60px 40px 80px",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: "absolute",
          top: "-50%",
          right: "-10%",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)",
          borderRadius: "50%"
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-30%",
          left: "-5%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)",
          borderRadius: "50%"
        }}
      />

      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "60px",
          position: "relative",
          zIndex: 2
        }}
      >
        {/* LEFT CONTENT */}
        <div style={{ flex: 1, maxWidth: "600px" }}>
          {/* Badge */}
          <div
            style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(10px)",
              padding: "6px 16px",
              borderRadius: "40px",
              marginBottom: "24px",
              fontSize: "14px",
              fontWeight: "500"
            }}
          >
            🌟 Nền tảng đặt khám uy tín #1 Việt Nam
          </div>

          <h1
            style={{
              fontSize: "52px",
              fontWeight: "800",
              marginBottom: "20px",
              lineHeight: "1.2",
              background: "linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
          >
            Đặt lịch khám
            <br />
            <span style={{ color: "#FFD700", WebkitTextFillColor: "#FFD700" }}>
              Nhanh chóng - Tiện lợi
            </span>
          </h1>

          <p
            style={{
              fontSize: "18px",
              lineHeight: "1.6",
              marginBottom: "32px",
              color: "rgba(255,255,255,0.95)",
              opacity: 0.95
            }}
          >
            Kết nối với hơn 1000 bác sĩ hàng đầu, 25 bệnh viện lớn và 100+ phòng khám 
            chuyên khoa trên toàn quốc. Đặt lịch dễ dàng, nhận số thứ tự và khung giờ 
            khám trước.
          </p>

          {/* Search Box nâng cao */}
          <div
            style={{
              background: "white",
              borderRadius: "60px",
              padding: "8px",
              boxShadow: "0 20px 35px -10px rgba(0,0,0,0.2)",
              marginBottom: "24px"
            }}
          >
            <Input
              size="large"
              placeholder="🔍 Tìm theo tên bác sĩ, bệnh viện, chuyên khoa..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              suffix={
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  style={{
                    borderRadius: "40px",
                    height: "48px",
                    background: "linear-gradient(135deg, #1a73e8 0%, #0d5bba 100%)",
                    border: "none",
                    fontWeight: 600
                  }}
                >
                  Tìm kiếm
                </Button>
              }
              style={{
                borderRadius: "60px",
                height: "58px",
                fontSize: "16px",
                paddingLeft: "24px",
                border: "none",
                boxShadow: "none"
              }}
            />
          </div>

          {/* Popular searches */}
          <div style={{ marginBottom: "32px" }}>
            <div style={{ fontSize: "14px", marginBottom: "12px", opacity: 0.9 }}>
              🔥 Tìm kiếm phổ biến:
            </div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {popularSearches.map((item, index) => (
                <Tag
                  key={index}
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    color: "white",
                    padding: "6px 16px",
                    borderRadius: "40px",
                    cursor: "pointer",
                    fontSize: "13px",
                    transition: "all 0.2s"
                  }}
                  onClick={() => setSearchValue(item)}
                >
                  {item}
                </Tag>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <Row gutter={[24, 16]}>
            {stats.map((stat, index) => (
              <Col span={6} key={index}>
                <Statistic
                  value={stat.value}
                  suffix={stat.suffix}
                  title={
                    <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "13px" }}>
                      {stat.title}
                    </span>
                  }
                  valueStyle={{
                    color: "white",
                    fontSize: "24px",
                    fontWeight: "bold"
                  }}
                  prefix={stat.icon}
                />
              </Col>
            ))}
          </Row>
        </div>

        {/* RIGHT CONTENT - Image với hiệu ứng */}
        <div style={{ flex: 1, position: "relative" }}>
          {/* Decorative circles */}
          <div
            style={{
              position: "absolute",
              top: "-20px",
              right: "-20px",
              width: "150px",
              height: "150px",
              background: "radial-gradient(circle, rgba(255,215,0,0.3) 0%, rgba(255,215,0,0) 70%)",
              borderRadius: "50%",
              zIndex: 1
            }}
          />
          
          {/* Main image */}
          <div
            style={{
              position: "relative",
              borderRadius: "30px",
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              transition: "transform 0.3s ease",
              animation: "float 3s ease-in-out infinite"
            }}
          >
            <img
              src="https://cdn.youmed.vn/wp-content/themes/youmed/images/your-medical-booking.webp"
              alt="Doctor consultation"
              style={{
                width: "100%",
                height: "auto",
                display: "block"
              }}
            />
            
            {/* Overlay card */}
            <Card
              style={{
                position: "absolute",
                bottom: "30px",
                left: "30px",
                right: "30px",
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(10px)",
                borderRadius: "16px",
                border: "none",
                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)"
              }}
              bodyStyle={{ padding: "16px" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <CalendarOutlined style={{ fontSize: "24px", color: "#1a73e8" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                    Đặt lịch ngay hôm nay
                  </div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    Nhận ưu đãi đặc biệt khi đặt lịch online
                  </div>
                </div>
                <ArrowRightOutlined style={{ color: "#1a73e8" }} />
              </div>
            </Card>
          </div>

          {/* Floating badge */}
          <div
            style={{
              position: "absolute",
              top: "20%",
              left: "-20px",
              background: "white",
              padding: "12px 20px",
              borderRadius: "50px",
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              animation: "slideIn 0.5s ease-out"
            }}
          >
            <ClockCircleOutlined style={{ fontSize: "20px", color: "#1a73e8" }} />
            <div>
              <div style={{ fontWeight: "bold", fontSize: "14px" }}>Đặt lịch nhanh</div>
              <div style={{ fontSize: "12px", color: "#666" }}>Chỉ 2 phút</div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @media (max-width: 1024px) {
            .hero-container {
              flex-direction: column;
              text-align: center;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Hero;