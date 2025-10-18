import React, { useState, useEffect } from 'react';
import {
    Button,
    Modal,
    Form,
    Input,
    Space,
    Popconfirm,
    message,
    Typography,
    Card,
    Row,
    Col,
    List,
    Divider,
    Select
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SafetyOutlined,
    InfoCircleOutlined,
    MinusCircleOutlined
} from '@ant-design/icons';
import { createPrivacyPolicy, getAllPrivacyPolicies, updatePrivacyPolicy, deletePrivacyPolicy } from '../../api_calls/privacyPolicyApi';
import '../../styles/pages/adminPages/privacyPolicyManagement.css';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const PrivacyPolicyManagement = () => {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingPolicy, setEditingPolicy] = useState(null);
    const [form] = Form.useForm();

    // Load policies on component mount
    useEffect(() => {
        loadPolicies();
    }, []);

    const loadPolicies = async () => {
        setLoading(true);
        try {
            const response = await getAllPrivacyPolicies();
            if (response.success) {
                setPolicies(response.data);
            } else {
                message.error(response.message || 'Failed to load privacy policies');
            }
        } catch (error) {
            console.error('Error loading privacy policies:', error);
            message.error('Failed to load privacy policies');
        } finally {
            setLoading(false);
        }
    };

    const handleAddPolicy = () => {
        setEditingPolicy(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEditPolicy = (record) => {
        setEditingPolicy(record);
        form.setFieldsValue({
            title: record.title,
            content: record.content,
            sections: record.sections || []
        });
        setIsModalVisible(true);
    };

    const handleDeletePolicy = async (id) => {
        try {
            const response = await deletePrivacyPolicy(id);
            if (response.success) {
                message.success('Privacy policy deleted successfully');
                loadPolicies();
            } else {
                message.error(response.message || 'Failed to delete privacy policy');
            }
        } catch (error) {
            console.error('Error deleting privacy policy:', error);
            message.error('Failed to delete privacy policy');
        }
    };

    const handleModalSubmit = async (values) => {
        try {
            let response;
            if (editingPolicy) {
                response = await updatePrivacyPolicy(editingPolicy._id, values);
            } else {
                response = await createPrivacyPolicy(values);
            }

            if (response.success) {
                message.success(editingPolicy ? 'Privacy policy updated successfully' : 'Privacy policy created successfully');
                setIsModalVisible(false);
                form.resetFields();
                loadPolicies();
            } else {
                message.error(response.message || 'Failed to save privacy policy');
            }
        } catch (error) {
            console.error('Error saving privacy policy:', error);
            message.error('Failed to save privacy policy');
        }
    };

    return (
        <div className="privacy-policy-management">
            <div className="page-header">
                <Title level={2}>
                    <SafetyOutlined /> Privacy Policy Management
                </Title>
                <Text type="secondary">
                    Manage privacy policy content for your users
                </Text>
            </div>

            <Card className="table-card">
                <div className="table-header">
                    <Row justify="space-between" align="middle">
                        <Col>
                            <Title level={4}>All Privacy Policies ({policies.length})</Title>
                        </Col>
                        <Col>
                            <Button
                                className="add-btn"
                                icon={<PlusOutlined />}
                                onClick={handleAddPolicy}
                            >
                                Add New Policy
                            </Button>
                        </Col>
                    </Row>
                </div>

                <div className="policies-list-container">
                    {loading ? (
                        <div className="loading-container">
                            <Text>Loading privacy policies...</Text>
                        </div>
                    ) : (
                        <List
                            className="policies-list"
                            dataSource={policies}
                            renderItem={(item) => (
                                <List.Item className="policy-item">
                                    <div className="policy-content">
                                        <div className="policy-header">
                                            <Title level={4} className="policy-title">
                                                {item.title}
                                            </Title>
                                            <Text type="secondary" className="policy-date">
                                                Last updated: {new Date(item.lastUpdated).toLocaleDateString()}
                                            </Text>
                                        </div>
                                        <Text className="policy-preview">
                                            {item.content.substring(0, 200)}...
                                        </Text>
                                        {item.sections && item.sections.length > 0 && (
                                            <Text type="secondary" className="policy-sections-count">
                                                {item.sections.length} section(s)
                                            </Text>
                                        )}
                                    </div>
                                    <div className="policy-actions">
                                        <Space>
                                            <Button
                                                className="action-btn"
                                                size="small"
                                                icon={<EditOutlined />}
                                                onClick={() => handleEditPolicy(item)}
                                            >
                                                Edit
                                            </Button>
                                            <Popconfirm
                                                title="Are you sure you want to delete this privacy policy?"
                                                onConfirm={() => handleDeletePolicy(item._id)}
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <Button
                                                    className="delete-btn"
                                                    size="small"
                                                    icon={<DeleteOutlined />}
                                                >
                                                    Delete
                                                </Button>
                                            </Popconfirm>
                                        </Space>
                                    </div>
                                </List.Item>
                            )}
                        />
                    )}
                </div>
            </Card>

            <Modal
                className="admin-modal privacy-policy-modal"
                title={
                    <div>
                        <InfoCircleOutlined style={{ marginRight: 8 }} />
                        {editingPolicy ? 'Edit Privacy Policy' : 'Add New Privacy Policy'}
                    </div>
                }
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                }}
                footer={null}
                width={800}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleModalSubmit}
                >
                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[
                            { required: true, message: 'Please enter the title' },
                            { min: 5, message: 'Title must be at least 5 characters' }
                        ]}
                    >
                        <Input 
                            placeholder="Enter the privacy policy title" 
                            size="large"
                            className="form-input"
                        />
                    </Form.Item>

                    <Form.Item
                        name="content"
                        label="Main Content"
                        rules={[
                            { required: true, message: 'Please enter the main content' },
                            { min: 50, message: 'Content must be at least 50 characters' }
                        ]}
                    >
                        <TextArea
                            rows={6}
                            placeholder="Enter the main privacy policy content"
                            size="large"
                            className="form-textarea"
                        />
                    </Form.Item>

                    <Form.List name="sections">
                        {(fields, { add, remove }) => (
                            <>
                                <Divider orientation="left">Additional Sections</Divider>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Card key={key} size="small" className="section-card">
                                        <Row gutter={16}>
                                            <Col span={24}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'type']}
                                                    label="Section Type"
                                                    rules={[{ required: true, message: 'Please select section type' }]}
                                                >
                                                    <Select placeholder="Select section type">
                                                        <Option value="paragraph">Paragraph</Option>
                                                        <Option value="points">Points</Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col span={24}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'content']}
                                                    label="Section Content"
                                                    rules={[{ required: true, message: 'Please enter section content' }]}
                                                >
                                                    <TextArea rows={3} placeholder="Enter section content" />
                                                </Form.Item>
                                            </Col>
                                            <Col span={24}>
                                                <Form.Item
                                                    noStyle
                                                    shouldUpdate={(prevValues, currentValues) => {
                                                        return prevValues.sections?.[name]?.type !== currentValues.sections?.[name]?.type;
                                                    }}
                                                >
                                                    {({ getFieldValue }) => {
                                                        const sectionType = getFieldValue(['sections', name, 'type']);
                                                        if (sectionType === 'points') {
                                                            return (
                                                                <Form.List name={[name, 'points']}>
                                                                    {(pointFields, { add: addPoint, remove: removePoint }) => (
                                                                        <>
                                                                            <Text strong>Points:</Text>
                                                                            {pointFields.map(({ key: pointKey, name: pointName, ...pointRestField }) => (
                                                                                <Form.Item
                                                                                    key={pointKey}
                                                                                    {...pointRestField}
                                                                                    name={[pointName]}
                                                                                    style={{ marginBottom: 8 }}
                                                                                >
                                                                                    <Input.Group compact>
                                                                                        <Input
                                                                                            style={{ width: 'calc(100% - 32px)' }}
                                                                                            placeholder="Enter point"
                                                                                        />
                                                                                        <Button
                                                                                            icon={<MinusCircleOutlined />}
                                                                                            onClick={() => removePoint(pointName)}
                                                                                        />
                                                                                    </Input.Group>
                                                                                </Form.Item>
                                                                            ))}
                                                                            <Button
                                                                                type="dashed"
                                                                                onClick={() => addPoint()}
                                                                                block
                                                                                style={{ marginBottom: 16 }}
                                                                            >
                                                                                Add Point
                                                                            </Button>
                                                                        </>
                                                                    )}
                                                                </Form.List>
                                                            );
                                                        }
                                                        return null;
                                                    }}
                                                </Form.Item>
                                            </Col>
                                            <Col span={24}>
                                                <Button
                                                    type="link"
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    onClick={() => remove(name)}
                                                >
                                                    Remove Section
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Card>
                                ))}
                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        block
                                        icon={<PlusOutlined />}
                                    >
                                        Add Section
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>

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
                                {editingPolicy ? 'Update Policy' : 'Create Policy'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default PrivacyPolicyManagement;
