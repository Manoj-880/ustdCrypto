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
    Collapse
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    QuestionCircleOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import { createFAQ, getAllFAQs, updateFAQ, deleteFAQ } from '../../api_calls/faqApi';
import '../../styles/pages/adminPages/faqManagement.css';

const { Title, Text } = Typography;
const { TextArea } = Input;

const FAQManagement = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingFAQ, setEditingFAQ] = useState(null);
    const [form] = Form.useForm();

    // Load FAQs on component mount
    useEffect(() => {
        loadFAQs();
    }, []);

    const loadFAQs = async () => {
        setLoading(true);
        try {
            const response = await getAllFAQs();
            if (response.success) {
                setFaqs(response.data);
            } else {
                message.error(response.message || 'Failed to load FAQs');
            }
        } catch (error) {
            console.error('Error loading FAQs:', error);
            message.error('Failed to load FAQs');
        } finally {
            setLoading(false);
        }
    };

    const handleAddFAQ = () => {
        setEditingFAQ(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEditFAQ = (record) => {
        setEditingFAQ(record);
        form.setFieldsValue({
            question: record.question,
            answer: record.answer
        });
        setIsModalVisible(true);
    };

    const handleDeleteFAQ = async (id) => {
        try {
            const response = await deleteFAQ(id);
            if (response.success) {
                message.success('FAQ deleted successfully');
                loadFAQs();
            } else {
                message.error(response.message || 'Failed to delete FAQ');
            }
        } catch (error) {
            console.error('Error deleting FAQ:', error);
            message.error('Failed to delete FAQ');
        }
    };

    const handleModalSubmit = async (values) => {
        try {
            let response;
            if (editingFAQ) {
                response = await updateFAQ(editingFAQ._id, values);
            } else {
                response = await createFAQ(values);
            }

            if (response.success) {
                message.success(editingFAQ ? 'FAQ updated successfully' : 'FAQ created successfully');
                setIsModalVisible(false);
                form.resetFields();
                loadFAQs();
            } else {
                message.error(response.message || 'Failed to save FAQ');
            }
        } catch (error) {
            console.error('Error saving FAQ:', error);
            message.error('Failed to save FAQ');
        }
    };

    // Create accordion items from FAQs
    const accordionItems = faqs.map((faq) => ({
        key: faq._id,
        label: (
            <div className="faq-accordion-header">
                <Text strong className="faq-question">{faq.question}</Text>
                <Space className="faq-actions">
                    <Button
                        className="action-btn"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEditFAQ(faq);
                        }}
                    />
                    <Popconfirm
                        title="Are you sure you want to delete this FAQ?"
                        onConfirm={() => handleDeleteFAQ(faq._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            className="delete-btn"
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </Popconfirm>
                </Space>
            </div>
        ),
        children: (
            <div className="faq-answer">
                <Text>{faq.answer}</Text>
            </div>
        ),
    }));


    return (
        <div className="faq-management">
            <div className="page-header">
                <Title level={2}>
                    <QuestionCircleOutlined /> FAQ Management
                </Title>
                <Text type="secondary">
                    Manage frequently asked questions for your users
                </Text>
            </div>

            <Card className="table-card">
                <div className="table-header">
                    <Row justify="space-between" align="middle">
                        <Col>
                            <Title level={4}>All FAQs ({faqs.length})</Title>
                        </Col>
                        <Col>
                            <Button
                                className="add-btn"
                                icon={<PlusOutlined />}
                                onClick={handleAddFAQ}
                            >
                                Add New FAQ
                            </Button>
                        </Col>
                    </Row>
                </div>

                <div className="faq-accordion-container">
                    {loading ? (
                        <div className="loading-container">
                            <Text>Loading FAQs...</Text>
                        </div>
                    ) : (
                        <Collapse
                            className="faq-accordion"
                            items={accordionItems}
                            expandIconPosition="end"
                            size="large"
                        />
                    )}
                </div>
            </Card>

            <Modal
                className="admin-modal"
                title={
                    <div>
                        <InfoCircleOutlined style={{ marginRight: 8 }} />
                        {editingFAQ ? 'Edit FAQ' : 'Add New FAQ'}
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
                        name="question"
                        label="Question"
                        rules={[
                            { required: true, message: 'Please enter the question' },
                            { min: 10, message: 'Question must be at least 10 characters' }
                        ]}
                    >
                        <Input 
                            placeholder="Enter the FAQ question" 
                            size="large"
                            className="form-input"
                        />
                    </Form.Item>

                    <Form.Item
                        name="answer"
                        label="Answer"
                        rules={[
                            { required: true, message: 'Please enter the answer' },
                            { min: 20, message: 'Answer must be at least 20 characters' }
                        ]}
                    >
                        <TextArea
                            rows={6}
                            placeholder="Enter the detailed answer"
                            size="large"
                            className="form-textarea"
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
                                {editingFAQ ? 'Update FAQ' : 'Create FAQ'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default FAQManagement;
