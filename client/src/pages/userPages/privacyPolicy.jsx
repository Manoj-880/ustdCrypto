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
    SafetyOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import { getLatestPrivacyPolicy } from '../../api_calls/privacyPolicyApi';
import '../../styles/pages/userPages/privacyPolicy.css';

const { Title, Text, Paragraph } = Typography;

const PrivacyPolicy = () => {
    const [policy, setPolicy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadPrivacyPolicy();
    }, []);

    const loadPrivacyPolicy = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getLatestPrivacyPolicy();
            if (response.success) {
                setPolicy(response.data);
            } else {
                setError(response.message || 'Failed to load privacy policy');
            }
        } catch (error) {
            console.error('Error loading privacy policy:', error);
            setError('Failed to load privacy policy');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="privacy-policy-page">
                <div className="loading-container">
                    <Spin size="large" />
                    <Text>Loading privacy policy...</Text>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="privacy-policy-page">
                <Alert
                    message="Error"
                    description={error}
                    type="error"
                    showIcon
                    action={
                        <button 
                            className="retry-btn"
                            onClick={loadPrivacyPolicy}
                        >
                            Retry
                        </button>
                    }
                />
            </div>
        );
    }

    if (!policy) {
        return (
            <div className="privacy-policy-page">
                <Alert
                    message="No Content"
                    description="No privacy policy is currently available."
                    type="info"
                    showIcon
                />
            </div>
        );
    }

    return (
        <div className="privacy-policy-page">
            <div className="page-header">
                <Title level={1} className="page-title">
                    <SafetyOutlined /> Privacy Policy
                </Title>
                <div className="last-updated">
                    <CalendarOutlined />
                    <Text type="secondary">
                        Last updated: {new Date(policy.lastUpdated).toLocaleDateString()}
                    </Text>
                </div>
            </div>

            <Card className="privacy-policy-card">
                <div className="privacy-policy-content">
                    <Title level={2} className="policy-main-title">
                        {policy.title}
                    </Title>
                    
                    <Paragraph className="policy-main-content">
                        {policy.content}
                    </Paragraph>

                    {policy.sections && policy.sections.length > 0 && (
                        <div className="policy-sections">
                            {policy.sections.map((section, index) => (
                                <div key={index} className="policy-section">
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
                                    
                                    {index < policy.sections.length - 1 && <Divider />}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default PrivacyPolicy;
