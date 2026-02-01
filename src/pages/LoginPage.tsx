import { Form, Input, Button, Typography, notification } from "antd";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import "./LoginPage.css";

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();

  const onFinish = async (values: any) => {
    try {
      const response = await loginUser({
        username: values.email,
        password: values.password,
      });

      if (response.code === 1) {
        localStorage.setItem("isLogin", "true");
        dispatch(login());

        api.success({ message: "Welcome back!" });
        navigate("/dashboard");
      } else {
        api.error({ message: response.message || "Invalid credentials" });
      }
    } catch (error) {
      api.error({
        message: "Network Error",
        description: "Server unreachable.",
      });
    }
  };

  return (
    <>
      {contextHolder}
      <div className="login-page">
        <div className="login-card">
          <Typography.Title level={2}>Agent Backoffice</Typography.Title>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item label="Email" name="email" rules={[{ required: true }]}>
              <Input placeholder="Enter username" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true }]}
            >
              <Input.Password placeholder="Enter password" />
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
