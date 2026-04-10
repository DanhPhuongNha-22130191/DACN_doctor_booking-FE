import { Layout, Menu, Button, Typography } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(sessionStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("accessToken");
    navigate("/login");
  };

  const menuItems = [
    {
      key: "/hospital-admin",
      icon: <HomeOutlined />,
      label: "Quản lý bệnh viện",
    },
    {
      key: "/doctor-admin",
      icon: <UserOutlined />,
      label: "Quản lý bác sĩ",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider breakpoint="lg" collapsedWidth="0">
        <div
          style={{
            color: "#fff",
            textAlign: "center",
            padding: "16px",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          Hospital Admin
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={(e) => navigate(e.key)}
          items={menuItems}
        />
      </Sider>

      {/* Main Layout */}
      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Title level={4} style={{ margin: 0 }}>
            {location.pathname === "/doctor-admin"
              ? "Quản lý bác sĩ"
              : "Quản lý bệnh viện"}
          </Title>

          <div>
            <span style={{ marginRight: 16 }}>
              Xin chào, {user?.username || "Admin"}
            </span>
            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Đăng xuất
            </Button>
          </div>
        </Header>

        <Content
          style={{
            margin: "20px",
            background: "#fff",
            borderRadius: "8px",
            padding: "20px",
          }}
        >
          {/* Nội dung của các trang con */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;