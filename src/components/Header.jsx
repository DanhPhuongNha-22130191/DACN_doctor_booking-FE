import { Layout, Menu, Button, Badge, Avatar, Dropdown, Space } from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  MessageOutlined,
  MedicineBoxOutlined,
  RobotOutlined,
  LoginOutlined,
  DownOutlined,
  GlobalOutlined,
  LogoutOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const { Header } = Layout;

const AppHeader = () => {
  const navigate = useNavigate();
  const [currentKey, setCurrentKey] = useState("");
  const [user, setUser] = useState(null);

  // Kiểm tra user đã đăng nhập chưa
  useEffect(() => {
    const checkLoginStatus = () => {
      const localUser = localStorage.getItem("user");
      const sessionUser = sessionStorage.getItem("user");

      const userData = localUser || sessionUser;

      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (error) {
          console.error("Error parsing user data:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);

    return () => window.removeEventListener("storage", checkLoginStatus);
  }, []);

  const menuItems = [
    {
      key: "booking",
      label: "Đặt khám",
      icon: <CalendarOutlined />,
      onClick: () => {
        setCurrentKey("booking");
        navigate("/booking");
      }
    },
    {
      key: "consult",
      label: "Tư vấn trực tuyến",
      icon: <MessageOutlined />,
      onClick: () => setCurrentKey("consult")
    },
    {
      key: "news",
      label: "Tin Y tế",
      icon: <MedicineBoxOutlined />,
      onClick: () => setCurrentKey("news")
    },
    {
      key: "assistant",
      label: "Trợ lý y khoa",
      icon: <RobotOutlined />,
      onClick: () => setCurrentKey("assistant")
    },
    {
      key: "doctor",
      label: "Dành cho Bác sĩ",
      icon: <UserOutlined />,
      onClick: () => setCurrentKey("doctor")
    }
  ];

  // Menu dropdown cho ngôn ngữ
  const languageMenu = {
    items: [
      { key: "vi", label: "Tiếng Việt" },
      { key: "en", label: "English" },
    ],
  };

  // Menu dropdown cho user đã đăng nhập
  const userMenu = {
    items: [
      {
        key: "profile",
        label: "Thông tin cá nhân",
        icon: <UserOutlined />,
        onClick: () => navigate("/profile")
      },
      {
        key: "booking-history",
        label: "Lịch sử đặt khám",
        icon: <CalendarOutlined />,
        onClick: () => navigate("/booking-history")
      },
      {
        type: "divider"
      },
      {
        key: "logout",
        label: "Đăng xuất",
        icon: <LogoutOutlined />,
        onClick: () => {
          localStorage.removeItem("user");
          sessionStorage.removeItem("user");
          setUser(null);
          navigate("/");
          window.location.reload(); // Reload để cập nhật UI
        },
        danger: true
      }
    ],
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#ffffff",
          padding: "0 48px",
          height: "72px",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
          backdropFilter: "blur(0px)",
        }}
      >
        {/* LOGO */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            transition: "transform 0.2s ease",
          }}
          onClick={() => navigate("/")}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <div
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              background: "linear-gradient(135deg, #1a73e8 0%, #00b14f 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            You
          </div>
          <div
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              background: "linear-gradient(135deg, #00b14f 0%, #1a73e8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Med
          </div>
        </div>

        {/* MENU */}
        <Menu
          mode="horizontal"
          selectedKeys={[currentKey]}
          style={{
            flex: 1,
            justifyContent: "center",
            background: "transparent",
            borderBottom: "none",
            fontSize: "15px",
            fontWeight: 500,
            minWidth: "auto",
          }}
          items={menuItems}
          itemIcon={(item) => item?.icon}
          className="custom-menu"
        />

        {/* RIGHT SECTION */}
        <Space size="middle">
          {/* Nút ngôn ngữ */}
          <Dropdown menu={languageMenu} placement="bottomRight" arrow>
            <Button
              type="text"
              icon={<GlobalOutlined />}
              style={{
                height: "40px",
                borderRadius: "8px",
                color: "#5f6368",
                border: "1px solid #e0e0e0",
              }}
            >
              <Space>
                VN
                <DownOutlined style={{ fontSize: "10px" }} />
              </Space>
            </Button>
          </Dropdown>

          {/* Kiểm tra đã đăng nhập chưa */}
          {user ? (
            // Đã đăng nhập - hiển thị avatar user
            <Dropdown menu={userMenu} placement="bottomRight" arrow>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  padding: "4px 8px",
                  borderRadius: "20px",
                  transition: "all 0.2s ease",
                  background: "#f5f5f5",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#e6f7ff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#f5f5f5";
                }}
              >
                <Avatar
                  icon={<UserOutlined />}
                  style={{
                    backgroundColor: "#1a73e8",
                    marginRight: "8px",
                  }}
                />
                <span style={{ fontWeight: 500, color: "#333" }}>
                  {user.username || user.email || "User"}
                </span>
              </div>
            </Dropdown>
          ) : (
            // Chưa đăng nhập - hiển thị nút đăng nhập/đăng ký
            <>
              <Button
                type="primary"
                icon={<LoginOutlined />}
                style={{
                  height: "40px",
                  padding: "0 24px",
                  borderRadius: "10px",
                  fontWeight: 600,
                  fontSize: "14px",
                  background: "linear-gradient(135deg, #1a73e8 0%, #0d5bba 100%)",
                  border: "none",
                  boxShadow: "0 2px 6px rgba(26, 115, 232, 0.25)",
                  transition: "all 0.2s ease",
                }}
                onClick={() => navigate("/login")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(26, 115, 232, 0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 6px rgba(26, 115, 232, 0.25)";
                }}
              >
                Đăng nhập
              </Button>

              <Button
                style={{
                  height: "40px",
                  padding: "0 24px",
                  borderRadius: "10px",
                  fontWeight: 600,
                  fontSize: "14px",
                  border: "1px solid #1a73e8",
                  color: "#1a73e8",
                  background: "transparent",
                }}
                onClick={() => navigate("/register")}
              >
                Đăng ký
              </Button>
            </>
          )}
        </Space>
      </Header>

      {/* Viền gradient dưới header */}
      <div
        style={{
          height: "3px",
          background: "linear-gradient(90deg, #1a73e8 0%, #00b14f 50%, #1a73e8 100%)",
          position: "sticky",
          top: "72px",
          zIndex: 999,
        }}
      />
    </>
  );
};

// Thêm CSS styles cho menu
const style = document.createElement('style');
style.textContent = `
  .custom-menu .ant-menu-item {
    padding: 0 20px !important;
    margin: 0 4px !important;
    border-radius: 8px !important;
    transition: all 0.2s ease !important;
  }
  
  .custom-menu .ant-menu-item:hover {
    background: rgba(26, 115, 232, 0.04) !important;
    color: #1a73e8 !important;
  }
  
  .custom-menu .ant-menu-item-selected {
    color: #1a73e8 !important;
    border-bottom: 2px solid #1a73e8 !important;
    background: transparent !important;
  }
  
  .custom-menu .ant-menu-item .anticon {
    margin-right: 8px !important;
    font-size: 16px !important;
  }
`;
document.head.appendChild(style);

export default AppHeader;