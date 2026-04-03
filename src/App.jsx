import { useState } from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  HomeOutlined,
  UserOutlined
} from "@ant-design/icons";

import HospitalAdmin from "./Admin/HospitalAdmin";
import DoctorAdmin from "./Admin/DoctorAdmin";

const { Header, Sider, Content } = Layout;

const App = () => {
  const [currentPage, setCurrentPage] = useState("hospital");

  const renderPage = () => {
    switch (currentPage) {
      case "doctor":
        return <DoctorAdmin />;
      case "dashboard":
        return <h2>Dashboard (chưa làm)</h2>;
      default:
        return <HospitalAdmin />;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      
      {/* SIDEBAR */}
      <Sider breakpoint="lg" collapsedWidth="0">
        <div style={{ color: "#fff", padding: 16, fontSize: 18 }}>
          Admin
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[currentPage]}
          onClick={(e) => setCurrentPage(e.key)} // ⭐ QUAN TRỌNG
          items={[
            {
              key: "dashboard",
              icon: <DashboardOutlined />,
              label: "Dashboard"
            },
            {
              key: "hospital",
              icon: <HomeOutlined />,
              label: "Bệnh viện"
            },
            {
              key: "doctor",
              icon: <UserOutlined />,
              label: "Bác sĩ"
            }
          ]}
        />
      </Sider>

      {/* MAIN */}
      <Layout>
        
        {/* HEADER */}
        <Header
          style={{
            background: "#fff",
            padding: "0 20px",
            fontWeight: "bold"
          }}
        >
          Hospital Admin System
        </Header>

        {/* CONTENT */}
        <Content style={{ margin: "20px" }}>
          {renderPage()} {/* ⭐ render theo menu */}
        </Content>

      </Layout>
    </Layout>
  );
};

export default App;