import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Space,
  message,
  Popconfirm,
  Typography,
  Row,
  Col,
  Statistic,
  Tag,
  Tooltip,
  Pagination
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  PercentageOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { getAllLockinPlans, createLockinPlan, updateLockinPlan, deleteLockinPlan } from '../../api_calls/lockinApi';
import '../../styles/pages/adminPages/lockinPlans.css';

const { Title, Text } = Typography;

const LockinPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    try {
      const response = await getAllLockinPlans();
      if (response.success) {
        setPlans(response.data);
        setPagination(prev => ({
          ...prev,
          total: response.data.length
        }));
      } else {
        message.error(response.message || 'Failed to load lock-in plans');
      }
    } catch (error) {
      console.error('Error loading lock-in plans:', error);
      message.error('Failed to load lock-in plans');
    } finally {
      setLoading(false);
    }
  };

  const handlePaginationChange = (page, pageSize) => {
    setPagination(prev => ({
      ...prev,
      current: page,
      pageSize: pageSize
    }));
  };

  const handleAddPlan = () => {
    setEditingPlan(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditPlan = (record) => {
    setEditingPlan(record);
    form.setFieldsValue({
      planName: record.planName,
      duration: record.duration,
      interestRate: record.interestRate,
      description: record.description || ''
    });
    setIsModalVisible(true);
  };

  const handleDeletePlan = async (id) => {
    try {
      const response = await deleteLockinPlan(id);
      if (response.success) {
        message.success('Lock-in plan deleted successfully');
        loadPlans();
      } else {
        message.error(response.message || 'Failed to delete lock-in plan');
      }
    } catch (error) {
      console.error('Error deleting lock-in plan:', error);
      message.error('Failed to delete lock-in plan');
    }
  };

  const handleModalSubmit = async (values) => {
    try {
      let response;
      if (editingPlan) {
        response = await updateLockinPlan(editingPlan._id, values);
      } else {
        response = await createLockinPlan(values);
      }

      if (response.success) {
        message.success(editingPlan ? 'Lock-in plan updated successfully' : 'Lock-in plan created successfully');
        setIsModalVisible(false);
        form.resetFields();
        loadPlans();
      } else {
        message.error(response.message || 'Failed to save lock-in plan');
      }
    } catch (error) {
      console.error('Error saving lock-in plan:', error);
      message.error('Failed to save lock-in plan');
    }
  };

  const columns = [
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration) => (
        <Space>
          <ClockCircleOutlined style={{ color: '#1677ff' }} />
          <Text strong>{duration} days</Text>
        </Space>
      ),
      sorter: (a, b) => a.duration - b.duration,
    },
    {
      title: 'Interest Rate',
      dataIndex: 'interestRate',
      key: 'interestRate',
      render: (rate) => (
        <Space>
          <PercentageOutlined style={{ color: '#52c41a' }} />
          <Text strong style={{ color: '#52c41a' }}>{rate}%</Text>
        </Space>
      ),
      sorter: (a, b) => a.interestRate - b.interestRate,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (description) => (
        <Text type="secondary">{description || 'No description'}</Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit Plan">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEditPlan(record)}
              className="action-btn"
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this lock-in plan?"
            description="This action cannot be undone."
            onConfirm={() => handleDeletePlan(record._id)}
            okText="Yes"
            cancelText="No"
            okType="danger"
          >
            <Tooltip title="Delete Plan">
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                className="delete-btn"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Calculate statistics
  const totalPlans = plans.length;
  const averageDuration = plans.length > 0 ? Math.round(plans.reduce((sum, plan) => sum + plan.duration, 0) / plans.length) : 0;
  const averageInterestRate = plans.length > 0 ? (plans.reduce((sum, plan) => sum + plan.interestRate, 0) / plans.length).toFixed(2) : 0;

  return (
    <div className="lockin-plans-page">
      <div className="page-header">
        <Title level={2}>
          <ClockCircleOutlined /> Lock-In Plans Management
        </Title>
        <Text type="secondary">
          Manage lock-in duration plans and interest rates
        </Text>
      </div>

      {/* Summary Cards */}
      <Row gutter={[16, 16]} className="summary-cards">
        <Col xs={24} sm={8}>
          <Card className="summary-card">
            <Statistic
              title="Total Plans"
              value={totalPlans}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="summary-card">
            <Statistic
              title="Average Duration"
              value={averageDuration}
              suffix="days"
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="summary-card">
            <Statistic
              title="Average Interest Rate"
              value={averageInterestRate}
              suffix="%"
              prefix={<PercentageOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Plans Table */}
      <Card className="table-card">
        <div className="table-header">
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={4}>Lock-In Plans ({totalPlans})</Title>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddPlan}
                className="add-btn"
              >
                Add New Plan
              </Button>
            </Col>
          </Row>
        </div>

        <Table
          columns={columns}
          dataSource={plans.slice(
            (pagination.current - 1) * pagination.pageSize,
            pagination.current * pagination.pageSize
          )}
          rowKey="_id"
          loading={loading}
          pagination={false}
          className="plans-table"
        />
        
        {/* Pagination below table */}
        <div className="pagination-container">
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={handlePaginationChange}
            onShowSizeChange={handlePaginationChange}
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} of ${total} plans`
            }
            className="plans-pagination"
          />
        </div>
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        className="admin-modal"
        title={
          <div>
            <InfoCircleOutlined style={{ marginRight: 8 }} />
            {editingPlan ? 'Edit Lock-In Plan' : 'Add New Lock-In Plan'}
          </div>
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleModalSubmit}
        >
          <Form.Item
            name="planName"
            label="Plan Name"
            rules={[
              { required: true, message: 'Please enter the plan name' },
              { min: 2, message: 'Plan name must be at least 2 characters' }
            ]}
          >
            <Input
              placeholder="Enter plan name (e.g., 30-Day Plan)"
              size="large"
              className="form-input"
            />
          </Form.Item>

          <Form.Item
            name="duration"
            label="Duration (Days)"
            rules={[
              { required: true, message: 'Please enter the duration' },
              { type: 'number', min: 1, message: 'Duration must be at least 1 day' }
            ]}
          >
            <InputNumber
              placeholder="Enter duration in days"
              size="large"
              className="form-input"
              style={{ width: '100%' }}
              min={1}
            />
          </Form.Item>

          <Form.Item
            name="interestRate"
            label="Interest Rate (%)"
            rules={[
              { required: true, message: 'Please enter the interest rate' },
              { type: 'number', min: 0, max: 100, message: 'Interest rate must be between 0 and 100' }
            ]}
          >
            <InputNumber
              placeholder="Enter interest rate percentage"
              size="large"
              className="form-input"
              style={{ width: '100%' }}
              min={0}
              max={100}
              step={0.1}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description (Optional)"
          >
            <Input.TextArea
              placeholder="Enter plan description"
              size="large"
              className="form-textarea"
              rows={4}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button
                className="ant-btn-default"
                onClick={() => setIsModalVisible(false)}
                size="large"
              >
                Cancel
              </Button>
              <Button
                className="ant-btn-primary"
                htmlType="submit"
                size="large"
              >
                {editingPlan ? 'Update Plan' : 'Create Plan'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LockinPlans;
