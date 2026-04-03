import HospitalAdmin from "./Admin/HospitalAdmin";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  HomeOutlined,
  UserOutlined
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

const App = () => {
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
          defaultSelectedKeys={["hospital"]}
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
          🏥 Hospital Admin System
        </Header>

        {/* CONTENT */}
        <Content style={{ margin: "20px" }}>
          <HospitalAdmin />
        </Content>

      </Layout>
    </Layout>
  );
};

export default App;