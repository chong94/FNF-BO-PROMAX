import { Form, Input, Button, Typography, notification } from "antd";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { login } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import "./LoginPage.css"; // ✅ Import your CSS here

function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification(); // ✅ Latest AntD v5 standard

  const onFinish = async (values: any) => {
    try {
      const response = await loginUser({
        username: values.email,
        password: values.password,
      });

      if (response.code === 1) {
        dispatch(login());
        navigate("/dashboard");
        api.success({
          message: "Login Successful",
          description: "Welcome back!",
          placement: "topRight",
        });
      } else {
        api.error({
          message: "Login Failed",
          description: response.message || "Please check your credentials.",
          placement: "topRight",
        });
      }
    } catch (error) {
      console.error("Network or server error", error);
      api.error({
        message: "Network Error",
        description: "Unable to reach server. Please try again later.",
        placement: "topRight",
      });
    }
  };

  return (
    <>
      {contextHolder}{" "}
      {/* 👈 Must render contextHolder for useNotification to work */}
      <div className="login-page">
        <div className="login-card">
          <Typography.Title level={2} className="login-title">
            Login
          </Typography.Title>

          <Form name="login" layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please input your Email!" }]}
            >
              <Input placeholder="Email" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
