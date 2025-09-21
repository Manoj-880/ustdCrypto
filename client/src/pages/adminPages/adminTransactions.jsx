import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  DatePicker,
  Select,
  Space,
  Typography,
  Tag,
  Button,
  Row,
  Col,
  Modal,
  message,
  Divider,
  Card,
  Descriptions,
  QRCode,
  Avatar
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  DownloadOutlined,
  FileExcelOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import "../../styles/pages/adminPages/adminTransactions.css";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const AdminTransactions = () => {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 991);

  // Mock data - replace with actual API calls
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockData = [
        {
          key: "1",
          id: "TXN001",
          userName: "John Doe",
          userEmail: "john.doe@example.com",
          type: "deposit",
          usdtQuantity: 1000.0,
          date: "2024-01-15 14:30:00",
          status: "completed",
          description: "Deposit from User Wallet to Company Wallet",
          fee: 0.0,
          balance: 1000.0,
          transactionHash: "0x1234567890abcdef1234567890abcdef12345678",
          fromAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
          toAddress: "0x9876543210fedcba9876543210fedcba98765432"
        },
        {
          key: "2",
          id: "TXN002",
          userName: "Jane Smith",
          userEmail: "jane.smith@example.com",
          type: "claimed_profit",
          usdtQuantity: 2.5,
          date: "2024-01-14 09:15:00",
          status: "completed",
          description: "Claimed Profit (0.25% of balance)",
          fee: 0.0,
          balance: 1002.5,
          transactionHash: "0x2345678901bcdef1234567890abcdef1234567890",
          fromAddress: "0xbcdef1234567890abcdef1234567890abcdef123",
          toAddress: "0x8765432109fedcba9876543210fedcba987654321"
        },
        {
          key: "3",
          id: "TXN003",
          userName: "Bob Wilson",
          userEmail: "bob.wilson@example.com",
          type: "withdraw",
          usdtQuantity: 500.0,
          date: "2024-01-13 16:45:00",
          status: "pending",
          description: "Withdraw from Company Wallet to User Wallet",
          fee: 1.0,
          balance: 501.5,
          transactionHash: "0x3456789012cdef1234567890abcdef12345678901",
          fromAddress: "0xcdef1234567890abcdef1234567890abcdef1234",
          toAddress: "0x7654321098fedcba9876543210fedcba9876543210"
        },
        {
          key: "4",
          id: "TXN004",
          userName: "Alice Johnson",
          userEmail: "alice.johnson@example.com",
          type: "deposit",
          usdtQuantity: 2000.0,
          date: "2024-01-12 11:20:00",
          status: "completed",
          description: "Deposit from User Wallet to Company Wallet",
          fee: 0.0,
          balance: 2501.5,
          transactionHash: "0x4567890123def1234567890abcdef123456789012",
          fromAddress: "0xdef1234567890abcdef1234567890abcdef12345",
          toAddress: "0x6543210987fedcba9876543210fedcba9876543210"
        },
        {
          key: "5",
          id: "TXN005",
          userName: "Charlie Brown",
          userEmail: "charlie.brown@example.com",
          type: "transfer",
          usdtQuantity: 300.0,
          date: "2024-01-11 13:10:00",
          status: "completed",
          description: "Transfer to User ID: U12345",
          fee: 0.0,
          balance: 2201.5,
          transactionHash: "0x5678901234ef1234567890abcdef1234567890123",
          fromAddress: "0xef1234567890abcdef1234567890abcdef123456",
          toAddress: "0x5432109876fedcba9876543210fedcba9876543210"
        }
      ];
      setTransactions(mockData);
      setFilteredTransactions(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 991);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter transactions
  useEffect(() => {
    let filtered = [...transactions];

    // Search by transaction ID or user name
    if (searchText) {
      filtered = filtered.filter(
        (txn) =>
          txn.id.toLowerCase().includes(searchText.toLowerCase()) ||
          txn.userName.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filter by date range
    if (dateRange && dateRange.length === 2) {
      const startDate = dateRange[0].startOf("day");
      const endDate = dateRange[1].endOf("day");
      filtered = filtered.filter((txn) => {
        const txnDate = dayjs(txn.date);
        return txnDate.isAfter(startDate) && txnDate.isBefore(endDate);
      });
    }

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter((txn) => txn.type === typeFilter);
    }

    setFilteredTransactions(filtered);
  }, [transactions, searchText, dateRange, typeFilter]);

  const clearFilters = () => {
    setSearchText("");
    setDateRange(null);
    setTypeFilter("all");
  };

  const handleViewTransaction = (record) => {
    setSelectedTransaction(record);
    setViewModalVisible(true);
  };

  const handleDownloadPDF = () => {
    if (!selectedTransaction) return;

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Header
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.text("Transaction Receipt", pageWidth / 2, 30, { align: "center" });

    // Transaction Details
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    
    let yPosition = 60;
    const lineHeight = 8;

    const details = [
      { label: "Transaction ID:", value: selectedTransaction.id },
      { label: "User Name:", value: selectedTransaction.userName },
      { label: "User Email:", value: selectedTransaction.userEmail },
      { label: "Type:", value: selectedTransaction.type.toUpperCase() },
      { label: "USDT Quantity:", value: `${selectedTransaction.usdtQuantity} USDT` },
      { label: "Date:", value: dayjs(selectedTransaction.date).format("MMM DD, YYYY HH:mm") },
      { label: "Status:", value: selectedTransaction.status.toUpperCase() },
      { label: "Description:", value: selectedTransaction.description },
      { label: "Fee:", value: `${selectedTransaction.fee} USDT` },
      { label: "Balance After:", value: `${selectedTransaction.balance} USDT` },
      { label: "Transaction Hash:", value: selectedTransaction.transactionHash },
      { label: "From Address:", value: selectedTransaction.fromAddress },
      { label: "To Address:", value: selectedTransaction.toAddress }
    ];

    details.forEach(({ label, value }) => {
      pdf.text(label, 20, yPosition);
      pdf.text(value, 80, yPosition);
      yPosition += lineHeight;
    });

    // Footer
    pdf.setFontSize(10);
    pdf.text("Generated on: " + dayjs().format("MMM DD, YYYY HH:mm"), pageWidth / 2, pageHeight - 20, { align: "center" });

    pdf.save(`transaction-${selectedTransaction.id}.pdf`);
    message.success("PDF downloaded successfully!");
  };

  const handleExportExcel = () => {
    // Create workbook
    const workbook = XLSX.utils.book_new();
    
    // Add title and metadata rows
    const titleData = [
      ['TRANSACTION OF ADMIN WALLET ALPHA WAVE'],
      [''],
      ['Generated on: ' + dayjs().format("MMMM DD, YYYY [at] HH:mm")],
      ['Total Transactions: ' + filteredTransactions.length],
      [''],
      ['TRANSACTION DETAILS'],
      ['']
    ];
    
    // Add headers
    const headers = [
      'Transaction ID',
      'User Name', 
      'User Email',
      'Type',
      'USDT Quantity',
      'Date',
      'Status',
      'Description',
      'Fee',
      'Balance After',
      'Transaction Hash'
    ];
    
    // Add transaction data
    const transactionData = filteredTransactions.map(txn => [
      txn.id,
      txn.userName,
      txn.userEmail,
      txn.type.toUpperCase(),
      txn.usdtQuantity,
      dayjs(txn.date).format("MMM DD, YYYY HH:mm"),
      txn.status.toUpperCase(),
      txn.description,
      txn.fee,
      txn.balance,
      txn.transactionHash
    ]);
    
    // Combine all data
    const allData = [
      ...titleData,
      headers,
      ...transactionData
    ];
    
    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(allData);
    
    // Set column widths
    const columnWidths = [
      { wch: 15 }, // Transaction ID
      { wch: 20 }, // User Name
      { wch: 30 }, // User Email
      { wch: 15 }, // Type
      { wch: 15 }, // USDT Quantity
      { wch: 20 }, // Date
      { wch: 12 }, // Status
      { wch: 40 }, // Description
      { wch: 10 }, // Fee
      { wch: 15 }, // Balance After
      { wch: 50 }  // Transaction Hash
    ];
    worksheet['!cols'] = columnWidths;
    
    // Style the title row
    const titleRange = XLSX.utils.decode_range(worksheet['!ref']);
    const titleRow = 0;
    
    // Merge cells for title (spans all columns)
    if (!worksheet['!merges']) worksheet['!merges'] = [];
    worksheet['!merges'].push({
      s: { r: titleRow, c: 0 },
      e: { r: titleRow, c: headers.length - 1 }
    });
    
    // Add the worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Admin Wallet Transactions");
    
    // Generate filename with current date
    const filename = `Admin-Wallet-Alpha-Wave-Transactions-${dayjs().format("YYYY-MM-DD")}.xlsx`;
    
    XLSX.writeFile(workbook, filename);
    message.success("Excel file exported successfully!");
  };

  const getTypeColor = (type) => {
    const colors = {
      deposit: "green",
      withdraw: "red",
      claimed_profit: "blue",
      transfer: "orange",
    };
    return colors[type] || "default";
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: "green",
      pending: "orange",
      failed: "red",
    };
    return colors[status] || "default";
  };

  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "id",
      key: "id",
      width: 140,
      render: (text) => (
        <Text copyable={{ text }} className="transaction-id">
          {text}
        </Text>
      ),
    },
    {
      title: "User Name",
      dataIndex: "userName",
      key: "userName",
      width: 150,
      render: (text, record) => (
        <div>
          <div className="user-name">{text}</div>
          <div className="user-email">{record.userEmail}</div>
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 120,
      render: (type) => (
        <Tag color={getTypeColor(type)}>
          {type.replace("_", " ").toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "USDT Quantity",
      dataIndex: "usdtQuantity",
      key: "usdtQuantity",
      width: 140,
      render: (amount, record) => (
        <div className={`amount ${record.type === "withdraw" || record.type === "transfer" ? "negative" : "positive"}`}>
          {record.type === "withdraw" || record.type === "transfer" ? "-" : "+"}
          {amount.toFixed(2)} USDT
        </div>
      ),
      sorter: (a, b) => a.usdtQuantity - b.usdtQuantity,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 130,
      render: (date) => (
        <div className="date-cell">
          <div className="date">{dayjs(date).format("MMM DD, YYYY")}</div>
          <div className="time">{dayjs(date).format("HH:mm")}</div>
        </div>
      ),
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      render: (_, record) => (
        <Button
          type="text"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewTransaction(record)}
          className="action-btn"
          title="View Details"
        />
      ),
    },
  ];

  // Mobile Card Component
  const renderMobileCard = (transaction) => (
    <Card key={transaction.id} className="mobile-transaction-card" hoverable>
      <div className="mobile-card-header">
        <div className="transaction-id-section">
          <Text className="transaction-id">{transaction.id}</Text>
          <Tag color={getStatusColor(transaction.status)} className="status-tag">
            {transaction.status.toUpperCase()}
          </Tag>
        </div>
        <div className="transaction-type">
          <Tag color={transaction.type === 'deposit' ? 'green' : transaction.type === 'withdrawal' ? 'red' : 'blue'}>
            {transaction.type.toUpperCase()}
          </Tag>
        </div>
      </div>
      
      <Divider className="mobile-divider" />
      
      <div className="mobile-card-content">
        <Row gutter={[16, 8]}>
          <Col span={24}>
            <div className="stat-item">
              <Text type="secondary" className="stat-label">User</Text>
              <div className="user-info">
                <Text strong className="stat-value">{transaction.userName}</Text>
                <Text type="secondary" className="user-email">{transaction.userEmail}</Text>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className="stat-item">
              <Text type="secondary" className="stat-label">Amount</Text>
              <Text 
                strong 
                className={`stat-value amount-value ${transaction.type === 'deposit' ? 'positive' : 'negative'}`}
              >
                {transaction.type === 'deposit' ? '+' : '-'}{transaction.usdtQuantity.toFixed(2)} USDT
              </Text>
            </div>
          </Col>
          <Col span={12}>
            <div className="stat-item">
              <Text type="secondary" className="stat-label">Fee</Text>
              <Text className="stat-value">{transaction.fee.toFixed(2)} USDT</Text>
            </div>
          </Col>
          <Col span={24}>
            <div className="stat-item">
              <Text type="secondary" className="stat-label">Date & Time</Text>
              <Text className="stat-value">{dayjs(transaction.date).format("MMM DD, YYYY [at] HH:mm")}</Text>
            </div>
          </Col>
          <Col span={24}>
            <div className="stat-item">
              <Text type="secondary" className="stat-label">Description</Text>
              <Text className="stat-value description-text">{transaction.description}</Text>
            </div>
          </Col>
        </Row>
      </div>
      
      <Divider className="mobile-divider" />
      
      <div className="mobile-card-actions">
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewTransaction(transaction)}
          className="mobile-action-btn"
          block
        >
          View Details
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="admin-transactions">
      <div className="admin-transactions-header">
        <Title level={2} className="page-title">
          Transaction Management
        </Title>
        <Text type="secondary" className="page-subtitle">
          Monitor and manage all user transactions
        </Text>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Search by Transaction ID or User Name"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="search-input"
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <RangePicker
              placeholder={["Start Date", "End Date"]}
              value={dateRange}
              onChange={setDateRange}
              className="date-picker"
              style={{ width: "100%" }}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Type"
              value={typeFilter}
              onChange={setTypeFilter}
              className="filter-select"
              style={{ width: "100%" }}
            >
              <Option value="all">All Types</Option>
              <Option value="deposit">Deposit</Option>
              <Option value="claimed_profit">Claimed Profit</Option>
              <Option value="withdraw">Withdraw</Option>
              <Option value="transfer">Transfer</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Button
              icon={<ReloadOutlined />}
              onClick={clearFilters}
              className="clear-btn"
            >
              Clear
            </Button>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Button
              icon={<FileExcelOutlined />}
              onClick={handleExportExcel}
              className="export-btn"
            >
              Export Excel
            </Button>
          </Col>
        </Row>
      </div>

      {/* Transactions Table/Cards */}
      <div className="table-section">
        {isMobile ? (
          <div className="mobile-cards-container">
            {filteredTransactions.map(renderMobileCard)}
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredTransactions}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} transactions`,
              className: "transactions-pagination",
            }}
            className="transactions-table"
            scroll={{ x: 800 }}
          />
        )}
      </div>

      {/* Transaction Details Modal */}
      <Modal
        title="Transaction Details"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>,
          <Button
            key="download"
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleDownloadPDF}
          >
            Download PDF
          </Button>,
        ]}
        width={800}
        className="transaction-modal"
      >
        {selectedTransaction && (
          <div className="transaction-details">
            <Card className="receipt-card">
              <div className="receipt-header">
                <Title level={3} className="receipt-title">Transaction Receipt</Title>
                <div className="receipt-id">#{selectedTransaction.id}</div>
              </div>

              <Divider />

              <Descriptions column={1} size="small" className="transaction-info">
                <Descriptions.Item label="Transaction ID">
                  <Text code>{selectedTransaction.id}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="User Name">
                  {selectedTransaction.userName}
                </Descriptions.Item>
                <Descriptions.Item label="User Email">
                  {selectedTransaction.userEmail}
                </Descriptions.Item>
                <Descriptions.Item label="Type">
                  <Tag color={getTypeColor(selectedTransaction.type)}>
                    {selectedTransaction.type.toUpperCase()}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="USDT Quantity">
                  <Text strong className="amount-display">
                    {selectedTransaction.type === "withdraw" || selectedTransaction.type === "transfer" ? "-" : "+"}
                    {selectedTransaction.usdtQuantity} USDT
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Date">
                  {dayjs(selectedTransaction.date).format("MMM DD, YYYY HH:mm")}
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag color={getStatusColor(selectedTransaction.status)}>
                    {selectedTransaction.status.toUpperCase()}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Description">
                  {selectedTransaction.description}
                </Descriptions.Item>
                <Descriptions.Item label="Fee">
                  {selectedTransaction.fee} USDT
                </Descriptions.Item>
                <Descriptions.Item label="Balance After">
                  {selectedTransaction.balance} USDT
                </Descriptions.Item>
                <Descriptions.Item label="Transaction Hash">
                  <Text code className="hash-text">
                    {selectedTransaction.transactionHash}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="From Address">
                  <Text code className="address-text">
                    {selectedTransaction.fromAddress}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="To Address">
                  <Text code className="address-text">
                    {selectedTransaction.toAddress}
                  </Text>
                </Descriptions.Item>
              </Descriptions>

              <Divider />

              <div className="qr-section">
                <Title level={4}>Transaction QR Code</Title>
                <div className="qr-container">
                  <QRCode
                    value={selectedTransaction.transactionHash}
                    size={120}
                    className="transaction-qr"
                  />
                </div>
              </div>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminTransactions;