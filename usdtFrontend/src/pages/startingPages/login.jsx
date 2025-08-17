import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Card, Typography, message } from 'antd'
import { login } from '../../api_calls/login'

const { Title, Text } = Typography

const Login = () => {
  const [user, setuser] = useState({});

  const navigate = useNavigate();

  const onFinish = async (values) => {
    const data = {
      email: values.email,
      password: values.password,
    }

    let response = await login(data);
    console.log(response);
    if(response.success){
      setuser(response.data);
      message.success(response.message);
      // Store in localStorage
      localStorage.setItem("user", JSON.stringify(response.data))
      console.log("User saved:", user)
      navigate('/');
    } else {
      message.error(response.message);
      console.log("Error:", response.message)
    }
  }

  return (
    <div className="login-container">
      <Card className="login-card">
        <Title level={2} className="heading">Crypto Trade</Title>
        <Text className="subheading">Login to continue</Text>

        <Form
          className="login-form"
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            // label="Email"
            name="email"
            rules={[{ required: true, message: 'Please enter your email!' }]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            // label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password!' }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block className="btn-primary">
              Login
            </Button>
          </Form.Item>
        </Form>

        <Text className="small-text">
          Don’t have an account? <a href="/register" className="link-text">Sign up</a>
        </Text>
      </Card>
    </div>
  )
}

export default Login