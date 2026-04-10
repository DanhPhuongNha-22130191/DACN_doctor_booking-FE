import { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Input,
  Space,
  Table,
  Modal,
  Form,
  Popconfirm,
  message
} from "antd";

const API_URL = "http://localhost:8080/api/hospitals";

const HospitalAdmin = () => {
  const [hospitals, setHospitals] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [editingHospital, setEditingHospital] = useState(null);

  const [openDetail, setOpenDetail] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);

  const [form] = Form.useForm();

  // ================= FETCH =================
  const fetchHospitals = async (keyword = "") => {
  setLoading(true);
  try {
    const res = await axios.get(`${API_URL}/search`, {
      params: { keyword }
    });
    setHospitals(res.data);
  } catch (error) {
    console.error(error);
    message.error("Lỗi tải bệnh viện");
  } finally {
    setLoading(false);
  }
  };

  useEffect(() => {
  const delayDebounce = setTimeout(() => {
    fetchHospitals(search);
  }, 500); // 500ms debounce

  return () => clearTimeout(delayDebounce);
  }, [search]);

  useEffect(() => {
    fetchHospitals();
  }, [search]);

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingHospital) {
        await axios.put(`${API_URL}/admin/${editingHospital.id}`, values);
        message.success("Cập nhật thành công");
      } else {
        await axios.post(API_URL, values);
        message.success("Thêm thành công");
      }

      setOpenForm(false);
      setEditingHospital(null);
      form.resetFields();
      fetchHospitals();
    } catch {
      message.error("Lỗi xử lý");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      message.success("Xóa thành công");
      fetchHospitals();
    } catch {
      message.error("Xóa thất bại");
    }
  };

  // ================= EDIT =================
  const openEdit = (record) => {
    setEditingHospital(record);
    form.setFieldsValue(record);
    setOpenForm(true);
  };

  // ================= TABLE =================
  const columns = [
    {
      title: "ID",
      dataIndex: "id"
    },
    {
      title: "Tên bệnh viện",
      dataIndex: "name"
    },
    {
      title: "Địa chỉ",
      dataIndex: "address"
    },
    {
      title: "SĐT",
      dataIndex: "phone"
    },
    {
      title: "Email",
      dataIndex: "email"
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              setSelectedHospital(record);
              setOpenDetail(true);
            }}
          >
            Xem
          </Button>

          <Button onClick={() => openEdit(record)}>Sửa</Button>

          <Popconfirm
            title="Xóa bệnh viện?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Quản lý bệnh viện</h2>

      {/* SEARCH */}
      <Space style={{ marginBottom: 16 }}>
        <Input
  placeholder="Tìm bệnh viện..."
  allowClear
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  style={{ width: 250 }}
/>

        <Button
          type="primary"
          onClick={() => {
            setEditingHospital(null);
            form.resetFields();
            setOpenForm(true);
          }}
        >
          + Thêm bệnh viện
        </Button>
      </Space>

      {/* TABLE */}
      <Table
        columns={columns}
        dataSource={hospitals}
        rowKey="id"
        loading={loading}
      />

      {/* FORM */}
      <Modal
        title={editingHospital ? "Cập nhật bệnh viện" : "Thêm bệnh viện"}
        open={openForm}
        onCancel={() => setOpenForm(false)}
        onOk={handleSubmit}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên bệnh viện"
            rules={[{ required: true, message: "Nhập tên!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="address" label="Địa chỉ">
            <Input />
          </Form.Item>

          <Form.Item name="phone" label="Số điện thoại">
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ type: "email", message: "Email không hợp lệ" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* DETAIL */}
      <Modal
        title="Chi tiết bệnh viện"
        open={openDetail}
        onCancel={() => setOpenDetail(false)}
        footer={null}
      >
        {selectedHospital && (
          <div>
            <p><b>ID:</b> {selectedHospital.id}</p>
            <p><b>Tên:</b> {selectedHospital.name}</p>
            <p><b>Địa chỉ:</b> {selectedHospital.address}</p>
            <p><b>SĐT:</b> {selectedHospital.phone}</p>
            <p><b>Email:</b> {selectedHospital.email}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HospitalAdmin;