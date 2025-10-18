import React, { useState, useEffect } from 'react';
import {
    Typography,
    Card,
    Spin,
    Alert,
    Divider,
    List
} from 'antd';
import {
    FileTextOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import { getLatestTerms } from '../../api_calls/termsApi';
import '../../styles/pages/userPages/terms.css';

const { Title, Text, Paragraph } = Typography;

const Terms = () => {
    const [terms, setTerms] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadTerms();
    }, []);

    const loadTerms = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getLatestTerms();
            if (response.success) {
                setTerms(response.data);
            } else {
                setError(response.message || 'Failed to load terms and conditions');
            }
        } catch (error) {
            console.error('Error loading terms:', error);
            setError('Failed to load terms and conditions');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="terms-page">
                <div className="loading-container">
                    <Spin size="large" />
                    <Text>Loading terms and conditions...</Text>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="terms-page">
                <Alert
                    message="Error"
                    description={error}
                    type="error"
                    showIcon
                    action={
                        <button 
                            className="retry-btn"
                            onClick={loadTerms}
                        >
                            Retry
                        </button>
                    }
                />
            </div>
        );
    }

    if (!terms) {
        return (
            <div className="terms-page">
                <Alert
                    message="No Content"
                    description="No terms and conditions are currently available."
                    type="info"
                    showIcon
                />
            </div>
        );
    }

    return (
        <div className="terms-page">
            <div className="page-header">
                <Title level={1} className="page-title">
                    <FileTextOutlined /> Terms & Conditions
                </Title>
                <div className="last-updated">
                    <CalendarOutlined />
                    <Text type="secondary">
                        Last updated: {new Date(terms.lastUpdated).toLocaleDateString()}
                    </Text>
                </div>
            </div>

            <Card className="terms-card">
                <div className="terms-content">
                    <Title level={2} className="terms-main-title">
                        {terms.title}
                    </Title>
                    
                    <Paragraph className="terms-main-content">
                        {terms.content}
                    </Paragraph>

                    {terms.sections && terms.sections.length > 0 && (
                        <div className="terms-sections">
                            {terms.sections.map((section, index) => (
                                <div key={index} className="terms-section">
                                    {section.type === 'paragraph' ? (
                                        <Paragraph className="section-content">
                                            {section.content}
                                        </Paragraph>
                                    ) : (
                                        <div className="section-points">
                                            <ul className="points-list">
                                                {section.points && section.points.map((point, pointIndex) => (
                                                    <li key={pointIndex} className="point-item">
                                                        {point}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    
                                    {index < terms.sections.length - 1 && <Divider />}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default Terms;
