import { Layout } from "antd";
import AppHeader from "../../components/Header";
import Hero  from "../../components/Hero";
import Card  from "../../components/Card";
import HospitalList from "../../components/HospitalList";
const { Content } = Layout;

const Home = () => {
  return (
    <Layout>
      <AppHeader />
      <Content>
        <Hero />
        <Card />
        <HospitalList />
      </Content>
    </Layout>
  );
};

export default Home;