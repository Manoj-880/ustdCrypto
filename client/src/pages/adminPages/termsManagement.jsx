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
    FileTextOutlined,
    InfoCircleOutlined,
    MinusCircleOutlined
} from '@ant-design/icons';
import { createTerms, getAllTerms, updateTerms, deleteTerms } from '../../api_calls/termsApi';
import '../../styles/pages/adminPages/termsManagement.css';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const TermsManagement = () => {
    const [terms, setTerms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingTerms, setEditingTerms] = useState(null);
    const [form] = Form.useForm();

    // Load terms on component mount
    useEffect(() => {
        loadTerms();
    }, []);

    const loadTerms = async () => {
        setLoading(true);
        try {
            const response = await getAllTerms();
            if (response.success) {
                setTerms(response.data);
            } else {
                message.error(response.message || 'Failed to load terms');
            }
        } catch (error) {
            console.error('Error loading terms:', error);
            message.error('Failed to load terms');
        } finally {
            setLoading(false);
        }
    };

    const handleAddTerms = () => {
        setEditingTerms(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEditTerms = (record) => {
        setEditingTerms(record);
        form.setFieldsValue({
            title: record.title,
            content: record.content,
            sections: record.sections || []
        });
        setIsModalVisible(true);
    };

    const handleDeleteTerms = async (id) => {
        try {
            const response = await deleteTerms(id);
            if (response.success) {
                message.success('Terms deleted successfully');
                loadTerms();
            } else {
                message.error(response.message || 'Failed to delete terms');
            }
        } catch (error) {
            console.error('Error deleting terms:', error);
            message.error('Failed to delete terms');
        }
    };

    const handleModalSubmit = async (values) => {
        try {
            let response;
            if (editingTerms) {
                response = await updateTerms(editingTerms._id, values);
            } else {
                response = await createTerms(values);
            }

            if (response.success) {
                message.success(editingTerms ? 'Terms updated successfully' : 'Terms created successfully');
                setIsModalVisible(false);
                form.resetFields();
                loadTerms();
            } else {
                message.error(response.message || 'Failed to save terms');
            }
        } catch (error) {
            console.error('Error saving terms:', error);
            message.error('Failed to save terms');
        }
    };

    return (
        <div className="terms-management">
            <div className="page-header">
                <Title level={2}>
                    <FileTextOutlined /> Terms & Conditions Management
                </Title>
                <Text type="secondary">
                    Manage terms and conditions content for your users
                </Text>
            </div>

            <Card className="table-card">
                <div className="table-header">
                    <Row justify="space-between" align="middle">
                        <Col>
                            <Title level={4}>All Terms & Conditions ({terms.length})</Title>
                        </Col>
                        <Col>
                            <Button
                                className="add-btn"
                                icon={<PlusOutlined />}
                                onClick={handleAddTerms}
                            >
                                Add New Terms
                            </Button>
                        </Col>
                    </Row>
                </div>

                <div className="terms-list-container">
                    {loading ? (
                        <div className="loading-container">
                            <Text>Loading terms...</Text>
                        </div>
                    ) : (
                        <List
                            className="terms-list"
                            dataSource={terms}
                            renderItem={(item) => (
                                <List.Item className="terms-item">
                                    <div className="terms-content">
                                        <div className="terms-header">
                                            <Title level={4} className="terms-title">
                                                {item.title}
                                            </Title>
                                            <Text type="secondary" className="terms-date">
                                                Last updated: {new Date(item.lastUpdated).toLocaleDateString()}
                                            </Text>
                                        </div>
                                        <Text className="terms-preview">
                                            {item.content.substring(0, 200)}...
                                        </Text>
                                        {item.sections && item.sections.length > 0 && (
                                            <Text type="secondary" className="terms-sections-count">
                                                {item.sections.length} section(s)
                                            </Text>
                                        )}
                                    </div>
                                    <div className="terms-actions">
                                        <Space>
                                            <Button
                                                className="action-btn"
                                                size="small"
                                                icon={<EditOutlined />}
                                                onClick={() => handleEditTerms(item)}
                                            >
                                                Edit
                                            </Button>
                                            <Popconfirm
                                                title="Are you sure you want to delete these terms?"
                                                onConfirm={() => handleDeleteTerms(item._id)}
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
                className="admin-modal terms-modal"
                title={
                    <div>
                        <InfoCircleOutlined style={{ marginRight: 8 }} />
                        {editingTerms ? 'Edit Terms & Conditions' : 'Add New Terms & Conditions'}
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
                            placeholder="Enter the terms title" 
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
                            placeholder="Enter the main terms and conditions content"
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
                                {editingTerms ? 'Update Terms' : 'Create Terms'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default TermsManagement;
