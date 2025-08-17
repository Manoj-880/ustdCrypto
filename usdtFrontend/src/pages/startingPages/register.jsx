import React from 'react'
import { Form, Input, Button, Card, Typography, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { register } from '../../api_calls/login'

const { Title, Text } = Typography

const Register = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { password, confirmPassword, ...rest } = values;

    if (password !== confirmPassword) {
      message.error("Passwords do not match!");
      return;
    }

    const user = {
      ...rest,
      password,
    }

    let response = await register(user);
    if(response.success) {
      // Save to localStorage (for demo)
      localStorage.setItem("user", JSON.stringify(response.data))
      console.log("User Registered:", response.data);
      message.success(response.message);
      navigate('/');
    }else {
      message.error(response.message);
    }
  }

  return (
    <div className="register-container">
      <Card className="register-card">
        <Title level={2} className="heading">Create Account</Title>
        <Text className="subheading">Register to start trading</Text>

        <Form
          className="register-form"
          layout="vertical"
          onFinish={onFinish}
        >
          {/* Row 1: First + Last Name */}
          <div className="form-row">
            <Form.Item
              name="firstName"
              rules={[{ required: true, message: 'Please enter your first name!' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="First Name" />
            </Form.Item>
            <Form.Item
              name="lastName"
              rules={[{ required: true, message: 'Please enter your last name!' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="Last Name" />
            </Form.Item>
          </div>

          {/* Row 2: Email + Mobile */}
          <div className="form-row">
            <Form.Item
              name="email"
              rules={[{ required: true, type: 'email', message: 'Please enter a valid email!' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="mobile"
              rules={[{ required: true, message: 'Please enter your mobile number!' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="Mobile Number" />
            </Form.Item>
          </div>

          {/* Row 3: Wallet ID */}
          <Form.Item
            name="walletKey"
            rules={[{ required: true, message: 'Please enter your USDT wallet address!' }]}
          >
            <Input placeholder="USDT Wallet Address" />
          </Form.Item>

          {/* Row 4: Password + Confirm Password */}
          <div className="form-row">
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please enter your password!' }]}
              style={{ flex: 1 }}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              rules={[{ required: true, message: 'Please confirm your password!' }]}
              style={{ flex: 1 }}
            >
              <Input.Password placeholder="Confirm Password" />
            </Form.Item>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit" block className="btn-primary">
              Register
            </Button>
          </Form.Item>
        </Form>

        <Text className="small-text">
          Already have an account? <a href="/login" className="link-text">Login</a>
        </Text>
      </Card>
    </div>
  )
}

export default Register