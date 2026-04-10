import React, { useState } from "react";
import { Card, Form, Input, Button, Typography, Alert, message } from "antd";
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, IdcardOutlined } from "@ant-design/icons";
import { registerUser } from "../../service/authService";
import AppHeader from "../../components/Header";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const handleRegister = async (values) => {
    setLoading(true);
    setServerError("");

    try {
      const payload = {
        username: values.username.trim(),
        password: values.password,
        email: values.email.trim(),
        fullName: values.fullName?.trim() || "",
        phone: values.phone?.trim() || "",
      };

      const data = await registerUser(payload);

      message.success("Đăng ký thành công!");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
      console.log("Register success:", data);


    } catch (error) {
      console.error("Register error:", error);

      const errorMessage =
        error?.response?.data?.message ||
        "Đăng ký thất bại. Vui lòng thử lại.";

      setServerError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppHeader />
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #e6f4ff 0%, #f6ffed 100%)",
          padding: 16,
        }}
      >
        <Card
          style={{
            width: 460,
            borderRadius: 20,
            boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <Title level={2} style={{ marginBottom: 8 }}>
              Đăng ký tài khoản
            </Title>
            <Text type="secondary">
              Tạo tài khoản bệnh nhân để đặt lịch khám
            </Text>
          </div>

          {serverError && (
            <Alert
              message={serverError}
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}

          <Form layout="vertical" onFinish={handleRegister} autoComplete="off">
            <Form.Item
              label="Họ và tên"
              name="fullName"
              rules={[
                { required: true, message: "Vui lòng nhập họ và tên" },
              ]}
            >
              <Input
                prefix={<IdcardOutlined />}
                placeholder="Nhập họ và tên"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Tên đăng nhập"
              name="username"
              rules={[
                { required: true, message: "Vui lòng nhập tên đăng nhập" },
                { min: 3, message: "Tên đăng nhập phải có ít nhất 3 ký tự" },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Nhập tên đăng nhập"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Nhập email"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại" },
              ]}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="Nhập số điện thoại"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu" },
                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nhập mật khẩu"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Xác nhận mật khẩu"
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Mật khẩu xác nhận không khớp"));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nhập lại mật khẩu"
                size="large"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={loading}
                style={{
                  height: 46,
                  borderRadius: 12,
                  fontWeight: 600,
                }}
              >
                Đăng ký
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default Register;