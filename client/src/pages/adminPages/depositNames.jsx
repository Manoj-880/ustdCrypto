import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  List,
  message,
  Popconfirm,
  Row,
  Space,
  Typography,
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import {
  createDepositName,
  deleteDepositName,
  getAllDepositNames,
} from "../../api_calls/depositNameApi";
import "../../styles/pages/adminPages/depositNames.css";

const { Title, Text } = Typography;

const DepositNames = () => {
  const [names, setNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form] = Form.useForm();

  const loadDepositNames = async () => {
    setLoading(true);
    try {
      const response = await getAllDepositNames();
      if (response.success) {
        setNames(response.data || []);
      } else {
        message.error(response.message || "Failed to load deposit names");
      }
    } catch (error) {
      console.error("Load deposit names error:", error);
      message.error("Failed to load deposit names");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepositNames();
  }, []);

  const handleCreate = async (values) => {
    setCreating(true);
    try {
      const response = await createDepositName({ name: values.name });
      if (response.success) {
        message.success("Deposit name added");
        form.resetFields();
        loadDepositNames();
      } else {
        message.error(response.message || "Failed to add deposit name");
      }
    } catch (error) {
      console.error("Create deposit name error:", error);
      message.error("Failed to add deposit name");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteDepositName(id);
      if (response.success) {
        message.success("Deposit name deleted");
        loadDepositNames();
      } else {
        message.error(response.message || "Failed to delete deposit name");
      }
    } catch (error) {
      console.error("Delete deposit name error:", error);
      message.error("Failed to delete deposit name");
    }
  };

  return (
    <div className="deposit-names-page">
      <div className="page-header">
        <Title level={2}>
          <TagsOutlined /> Deposit Names
        </Title>
        <Text type="secondary">
          Manage selectable names for admin balance additions
        </Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={10}>
          <Card className="deposit-card">
            <Title level={4}>Add New Name</Title>
            <Form form={form} layout="vertical" onFinish={handleCreate}>
              <Form.Item
                name="name"
                label="Name"
                rules={[
                  { required: true, message: "Please enter a name" },
                  { min: 2, message: "Name must be at least 2 characters" },
                  { max: 60, message: "Name cannot exceed 60 characters" },
                ]}
              >
                <Input placeholder="Example: Promo Bonus" size="large" />
              </Form.Item>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                htmlType="submit"
                loading={creating}
                className="deposit-add-btn"
              >
                Add Name
              </Button>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={14}>
          <Card className="deposit-card">
            <Title level={4}>Available Names ({names.length})</Title>
            <List
              loading={loading}
              dataSource={names}
              locale={{ emptyText: "No deposit names added yet" }}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Popconfirm
                      key={`delete-${item._id}`}
                      title="Delete this deposit name?"
                      onConfirm={() => handleDelete(item._id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button danger type="text" icon={<DeleteOutlined />}>
                        Delete
                      </Button>
                    </Popconfirm>,
                  ]}
                >
                  <Space>
                    <TagsOutlined />
                    <Text strong>{item.name}</Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DepositNames;
