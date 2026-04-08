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
  Select,
  message
} from "antd";

const API_DOCTOR = "http://localhost:8080/api/doctors";
const API_HOSPITAL = "http://localhost:8080/api/hospitals";
const API_DEPARTMENT = "http://localhost:8080/api/departments";

const DoctorAdmin = () => {
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [departments, setDepartments] = useState([]);
const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  const [openDetail, setOpenDetail] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [form] = Form.useForm();

  // ================= FETCH =================
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_DOCTOR);
      setDoctors(res.data);
    } catch (err) {
      console.error(err);
      message.error("Lỗi tải bác sĩ");
    }
    setLoading(false);
  };
  //
  const handleSearch = async (value) => {
  try {
    setLoading(true);

    // Nếu không nhập → load lại toàn bộ
    if (!value) {
      fetchDoctors();
      return;
    }

    const res = await axios.get(`${API_DOCTOR}/search`, {
      params: { keyword: value }
    });

    setDoctors(res.data);
  } catch (err) {
    console.error(err);
    message.error("Lỗi tìm kiếm");
  }
  setLoading(false);
};

  const fetchHospitals = async () => {
    try {
      const res = await axios.get(API_HOSPITAL);
      setHospitals(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(API_DEPARTMENT);
      setDepartments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchHospitals();
    fetchDepartments();
  }, []);

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        name: values.name,
        phone: values.phone,
        email: values.email,
        status: values.status,
        hospital: { id: values.hospital_id },
        department: { id: values.department_id }
      };

      if (editingDoctor) {
        await axios.put(`${API_DOCTOR}/${editingDoctor.id}`, payload);
        message.success("Cập nhật thành công");
      } else {
        await axios.post(API_DOCTOR, payload);
        message.success("Thêm thành công");
      }

      setOpenForm(false);
      setEditingDoctor(null);
      form.resetFields();
      fetchDoctors();
    } catch (err) {
      console.error(err);
      message.error("Lỗi xử lý");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_DOCTOR}/${id}`);
      message.success("Xóa thành công");
      fetchDoctors();
    } catch (err) {
      console.error(err);
      message.error("Xóa thất bại");
    }
  };

  // ================= EDIT =================
  const openEdit = (record) => {
    setEditingDoctor(record);

    form.setFieldsValue({
      ...record,
      hospital_id: record.hospital?.id,
      department_id: record.department?.id
    });

    setOpenForm(true);
  };

  // ================= TABLE =================
  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Tên bác sĩ", dataIndex: "name" },
    { title: "SĐT", dataIndex: "phone" },
    { title: "Email", dataIndex: "email" },
    {
      title: "Bệnh viện",
      render: (_, record) => record.hospital?.name
    },
    {
      title: "Khoa",
      render: (_, record) => record.department?.name
    },
    { title: "Trạng thái", dataIndex: "status" },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              setSelectedDoctor(record);
              setOpenDetail(true);
            }}
          >
            Xem
          </Button>

          <Button onClick={() => openEdit(record)}>Sửa</Button>

          <Popconfirm
            title="Xóa bác sĩ?"
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
      <h2>Quản lý bác sĩ</h2>

<Space style={{ marginBottom: 16 }}>
  <Input.Search
    placeholder="Tìm bác sĩ..."
    allowClear
    enterButton="Tìm"
    onSearch={handleSearch} // bấm Enter
    onChange={(e) => setKeyword(e.target.value)}
    style={{ width: 300 }}
  />

  <Button
    type="primary"
    onClick={() => {
      setEditingDoctor(null);
      form.resetFields();
      setOpenForm(true);
    }}
  >
    + Thêm bác sĩ
  </Button>
</Space>

      <Table
        columns={columns}
        dataSource={doctors}
        rowKey="id"
        loading={loading}
      />

      {/* FORM */}
      <Modal
        title={editingDoctor ? "Cập nhật bác sĩ" : "Thêm bác sĩ"}
        open={openForm}
        onCancel={() => setOpenForm(false)}
        onOk={handleSubmit}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên bác sĩ" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="phone" label="SĐT">
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>

          <Form.Item
            name="hospital_id"
            label="Bệnh viện"
            rules={[{ required: true }]}
          >
            <Select placeholder="Chọn bệnh viện">
              {hospitals.map((h) => (
                <Select.Option key={h.id} value={h.id}>
                  {h.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="department_id"
            label="Khoa"
            rules={[{ required: true }]}
          >
            <Select placeholder="Chọn khoa">
              {departments.map((d) => (
                <Select.Option key={d.id} value={d.id}>
                  {d.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="status" label="Trạng thái">
            <Select>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* DETAIL */}
      <Modal
        title="Chi tiết bác sĩ"
        open={openDetail}
        onCancel={() => setOpenDetail(false)}
        footer={null}
      >
        {selectedDoctor && (
          <div>
            <p><b>ID:</b> {selectedDoctor.id}</p>
            <p><b>Tên:</b> {selectedDoctor.name}</p>
            <p><b>SĐT:</b> {selectedDoctor.phone}</p>
            <p><b>Email:</b> {selectedDoctor.email}</p>
            <p><b>Bệnh viện:</b> {selectedDoctor.hospital?.name}</p>
            <p><b>Khoa:</b> {selectedDoctor.department?.name}</p>
            <p><b>Trạng thái:</b> {selectedDoctor.status}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DoctorAdmin;