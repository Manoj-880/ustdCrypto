import React, { useState, useEffect } from 'react';
import {
    Card,
    Collapse,
    Typography,
    Empty,
    Spin,
    message,
    Button
} from 'antd';
import {
    QuestionCircleOutlined
} from '@ant-design/icons';
import { getAllFAQs } from '../../api_calls/faqApi';
import '../../styles/pages/userPages/faq.css';

const { Title, Text } = Typography;
const { Panel } = Collapse;

const FAQ = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(false);

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



    return (
        <div className="faq-page">
            <div className="faq-header">
                <Title level={2}>
                    <QuestionCircleOutlined /> Frequently Asked Questions
                </Title>
                <Text type="secondary">
                    Find answers to common questions about our platform
                </Text>
            </div>


            <div className="faq-content">
                {loading ? (
                    <div className="loading-container">
                        <Spin size="large" />
                        <Text>Loading FAQs...</Text>
                    </div>
                ) : faqs.length === 0 ? (
                    <Empty
                        description="No FAQs found"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                ) : (
                    <Collapse
                        accordion
                        expandIconPosition="right"
                        className="faq-collapse"
                    >
                        {faqs.map((faq, index) => (
                            <Panel
                                key={faq._id}
                                header={
                                    <div className="faq-header-content">
                                        <div className="faq-question">
                                            <Text strong>{faq.question}</Text>
                                        </div>
                                    </div>
                                }
                            >
                                <div className="faq-answer">
                                    <Text>{faq.answer}</Text>
                                </div>
                            </Panel>
                        ))}
                    </Collapse>
                )}
            </div>

            <div className="faq-help">
                <div className="help-content">
                    <Title level={3} className="help-title">
                        Still need help?
                    </Title>
                    <Text className="help-description">
                        Can't find what you're looking for? Our support team is here to help.
                    </Text>
                    <Button type="primary" size="large" className="help-button">
                        Contact Support
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
