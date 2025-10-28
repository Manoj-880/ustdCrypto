import React from "react";
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Button, 
  Divider, 
  Space, 
  Tag, 
  Descriptions,
  Statistic,
  Badge
} from "antd";
import "../../../styles/components/transactionDetails.css";
import { 
  FilePdfOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  CloseCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  SwapOutlined,
  RiseOutlined,
  DollarOutlined,
  CalendarOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";
import unifiedPdfService from "../../../services/unifiedPdfService";

const { Title, Text } = Typography;

const TransactionDetails = ({ transaction }) => {
  if (!transaction) return null;

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <ArrowUpOutlined style={{ color: '#52c41a' }} />;
      case 'withdraw':
        return <ArrowDownOutlined style={{ color: '#ff4d4f' }} />;
      case 'claimed_profit':
        return <RiseOutlined style={{ color: '#1677ff' }} />;
      case 'transfer':
        return <SwapOutlined style={{ color: '#fa8c16' }} />;
      default:
        return <DollarOutlined style={{ color: '#8c8c8c' }} />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'pending':
        return <ClockCircleOutlined style={{ color: '#faad14' }} />;
      case 'failed':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return <InfoCircleOutlined style={{ color: '#8c8c8c' }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'deposit': return 'green';
      case 'claimed_profit': return 'blue';
      case 'withdraw': return 'red';
      case 'transfer': return 'orange';
      default: return 'default';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount) + " USDT";
  };

  const generatePDF = () => {
    try {
      const doc = unifiedPdfService.generateTransactionInvoice(transaction);
      unifiedPdfService.downloadPDF(doc, `Transaction_${transaction.id}_Receipt.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="transaction-details">
      {/* Header Section */}
      <div className="transaction-header">
        <div className="transaction-icon">
          {getTransactionIcon(transaction.type)}
        </div>
        <div>
          <Title level={3} className="details-title">
            Transaction Details
          </Title>
          <Text className="transaction-id" copyable={{ text: transaction.id }}>
            {transaction.id}
          </Text>
        </div>
      </div>

      {/* Status Section */}
      <div className="transaction-status-section">
        <div className="status-item">
          <Tag 
            color={getTypeColor(transaction.type)} 
            className="type-tag"
          >
            {transaction.type.replace('_', ' ').toUpperCase()}
          </Tag>
        </div>
        <div className="status-item">
          <Tag 
            color={getStatusColor(transaction.status)} 
            className="status-tag"
          >
            {transaction.status.toUpperCase()}
          </Tag>
        </div>
      </div>

      {/* Main Transaction Info */}
      <div className="transaction-info-section">
        <Title level={4} className="section-title">
          Transaction Information
        </Title>
        
        <div className="transaction-data-grid">
          <div className="data-item">
            <div className="data-label">Amount</div>
            <div className="data-value">
              <Statistic
                value={transaction.amount}
                precision={2}
                suffix=" USDT"
                valueStyle={{
                  color: transaction.type === 'withdraw' || transaction.type === 'transfer' 
                    ? '#ff4d4f' 
                    : '#52c41a',
                  fontSize: '1.2rem',
                  fontWeight: 600
                }}
                prefix={
                  transaction.type === 'withdraw' || transaction.type === 'transfer' 
                    ? <ArrowDownOutlined /> 
                    : <ArrowUpOutlined />
                }
              />
            </div>
          </div>

          <div className="data-item">
            <div className="data-label">Fee</div>
            <div className="data-value">
              <Statistic
                value={transaction.fee}
                precision={2}
                suffix=" USDT"
                valueStyle={{
                  color: transaction.fee > 0 ? '#ff4d4f' : '#8c8c8c',
                  fontSize: '1rem',
                  fontWeight: 500
                }}
              />
            </div>
          </div>

          <div className="data-item">
            <div className="data-label">Balance After</div>
            <div className="data-value">
              <Statistic
                value={transaction.balance}
                precision={2}
                suffix=" USDT"
                valueStyle={{
                  color: '#1677ff',
                  fontSize: '1.1rem',
                  fontWeight: 600
                }}
              />
            </div>
          </div>

          <div className="data-item">
            <div className="data-label">Date & Time</div>
            <div className="data-value">
              <Space direction="vertical" size={2}>
                <Text strong>{dayjs(transaction.date).format("MMM DD, YYYY")}</Text>
                <Text type="secondary">{dayjs(transaction.date).format("HH:mm:ss")}</Text>
              </Space>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="additional-info">
        <Title level={4} className="section-title">
          Additional Information
        </Title>
        
        <Descriptions 
          bordered 
          column={1}
          className="transaction-descriptions"
          labelStyle={{ 
            backgroundColor: 'var(--color-bg)', 
            color: 'var(--color-text)',
            fontWeight: 600,
            width: '200px'
          }}
          contentStyle={{ 
            backgroundColor: 'transparent', 
            color: 'var(--color-text)' 
          }}
        >
          <Descriptions.Item label="Transaction ID">
            <Text className="transaction-id-text" copyable={{ text: transaction.id }}>
              {transaction.id}
            </Text>
          </Descriptions.Item>
          
          <Descriptions.Item label="Description">
            <Text>{transaction.description || "No description provided"}</Text>
          </Descriptions.Item>
          
          <Descriptions.Item label="Transaction Type">
            <Tag color={getTypeColor(transaction.type)} className="type-tag">
              {transaction.type.replace('_', ' ').toUpperCase()}
            </Tag>
          </Descriptions.Item>
          
          <Descriptions.Item label="Status">
            <Tag color={getStatusColor(transaction.status)} className="status-tag">
              {transaction.status.toUpperCase()}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </div>

      {/* Download Section */}
      <div className="download-section">
        <Button
          type="primary"
          icon={<FilePdfOutlined />}
          size="large"
          onClick={generatePDF}
          className="download-btn"
        >
          Download Receipt
        </Button>
      </div>
    </div>
  );
};

export default TransactionDetails;
