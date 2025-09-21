import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  DatePicker,
  Select,
  Space,
  Card,
  Typography,
  Tag,
  Button,
  Tooltip,
  Row,
  Col,
  Statistic,
  Modal,
  Divider,
  Avatar,
} from "antd";
import { SearchOutlined, ReloadOutlined, EyeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import TransactionDetails from "./components/transactionDetails";
import "../../styles/pages/userPages/transactions.css";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const Transactions = () => {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState(null);

  const [typeFilter, setTypeFilter] = useState("all");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 991);

  // Mock data - replace with actual API calls
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockData = [
        {
          id: "TXN001",
          type: "deposit",
          amount: 1000.0,
          status: "completed",
          date: "2024-01-15 14:30:00",
          description: "Deposit from User Wallet to Company Wallet",
          fee: 0.0,
          balance: 1000.0,
        },
        {
          id: "TXN002",
          type: "claimed_profit",
          amount: 2.5,
          status: "completed",
          date: "2024-01-14 09:15:00",
          description: "Claimed Profit (0.25% of balance)",
          fee: 0.0,
          balance: 1002.5,
        },
        {
          id: "TXN003",
          type: "withdraw",
          amount: 500.0,
          status: "pending",
          date: "2024-01-13 16:45:00",
          description: "Withdraw from Company Wallet to User Wallet",
          fee: 1.0,
          balance: 501.5,
        },
        {
          id: "TXN004",
          type: "deposit",
          amount: 2000.0,
          status: "completed",
          date: "2024-01-12 11:20:00",
          description: "Deposit from User Wallet to Company Wallet",
          fee: 0.0,
          balance: 2501.5,
        },
        {
          id: "TXN005",
          type: "transfer",
          amount: 300.0,
          status: "completed",
          date: "2024-01-11 13:10:00",
          description: "Transfer to User ID: U12345",
          fee: 0.0,
          balance: 2201.5,
        },
        {
          id: "TXN006",
          type: "claimed_profit",
          amount: 5.5,
          status: "completed",
          date: "2024-01-10 10:30:00",
          description: "Claimed Profit (0.25% of balance)",
          fee: 0.0,
          balance: 2207.0,
        },
        {
          id: "TXN007",
          type: "deposit",
          amount: 750.0,
          status: "completed",
          date: "2024-01-09 15:45:00",
          description: "Deposit from User Wallet to Company Wallet",
          fee: 0.0,
          balance: 2957.0,
        },
        {
          id: "TXN008",
          type: "withdraw",
          amount: 1000.0,
          status: "failed",
          date: "2024-01-08 08:20:00",
          description: "Withdraw from Company Wallet to User Wallet",
          fee: 0.0,
          balance: 2957.0,
        },
        {
          id: "TXN009",
          type: "transfer",
          amount: 150.0,
          status: "completed",
          date: "2024-01-07 12:30:00",
          description: "Transfer to User ID: U67890",
          fee: 0.0,
          balance: 2807.0,
        },
        {
          id: "TXN010",
          type: "claimed_profit",
          amount: 7.02,
          status: "completed",
          date: "2024-01-06 14:20:00",
          description: "Claimed Profit (0.25% of balance)",
          fee: 0.0,
          balance: 2814.02,
        },
      ];
      setTransactions(mockData);
      setFilteredTransactions(mockData);
      setPagination((prev) => ({ ...prev, total: mockData.length }));
      setLoading(false);
    }, 1000);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...transactions];

    // Search by transaction ID
    if (searchText) {
      filtered = filtered.filter(
        (txn) =>
          txn.id.toLowerCase().includes(searchText.toLowerCase()) ||
          txn.description.toLowerCase().includes(searchText.toLowerCase())
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
    setPagination((prev) => ({ ...prev, current: 1, total: filtered.length }));
  }, [transactions, searchText, dateRange, typeFilter]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 991);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTableChange = (paginationInfo) => {
    setPagination((prev) => ({
      ...prev,
      current: paginationInfo.current,
      pageSize: paginationInfo.pageSize,
    }));
  };

  const clearFilters = () => {
    setSearchText("");
    setDateRange(null);
    setTypeFilter("all");
  };

  const showTransactionDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedTransaction(null);
  };

  // const getStatusColor = (status) => {
  //   switch (status) {
  //     case 'completed': return 'success';
  //     case 'pending': return 'warning';
  //     case 'failed': return 'error';
  //     default: return 'default';
  //   }
  // };

  // const getTypeColor = (type) => {
  //   switch (type) {
  //     case 'deposit': return 'green';
  //     case 'claimed_profit': return 'blue';
  //     case 'withdraw': return 'red';
  //     case 'transfer': return 'orange';
  //     default: return 'default';
  //   }
  // };

  const formatCurrency = (amount) => {
    return (
      new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount) + " USDT"
    );
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
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 160,
      render: (amount, record) => (
        <div className="amount-cell">
          <div
            className={`amount ${
              record.type === "withdraw" || record.type === "transfer"
                ? "negative"
                : "positive"
            }`}
          >
            {record.type === "withdraw" || record.type === "transfer"
              ? "↓"
              : "↑"}{" "}
            {formatCurrency(amount)}
          </div>
          {record.fee > 0 && (
            <div className="fee">Fee: {formatCurrency(record.fee)}</div>
          )}
        </div>
      ),
      sorter: (a, b) => a.amount - b.amount,
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
    // {
    //   title: "Description",
    //   dataIndex: "description",
    //   key: "description",
    //   width: 300,
    //   ellipsis: true,
    //   render: (text) => (
    //     <Tooltip title={text}>
    //       <span className="description">{text}</span>
    //     </Tooltip>
    //   ),
    // },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      width: 140,
      render: (balance) => (
        <div className="balance-cell">{formatCurrency(balance)}</div>
      ),
      sorter: (a, b) => a.balance - b.balance,
    },
    {
      title: "Actions",
      key: "actions",
      width: 90,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              className="action-btn"
              onClick={() => showTransactionDetails(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const totalAmount = filteredTransactions.reduce((sum, txn) => {
    if (txn.type === "deposit" || txn.type === "claimed_profit")
      return sum + txn.amount;
    if (txn.type === "withdraw" || txn.type === "transfer")
      return sum - txn.amount;
    return sum;
  }, 0);

  const completedTransactions = filteredTransactions.filter(
    (txn) => txn.status === "completed"
  ).length;

  const renderMobileCard = (transaction) => (
    <Card key={transaction.id} className="mobile-transaction-card" hoverable>
      <div className="mobile-card-header">
        <div className="transaction-id-section">
          <Text className="transaction-id">{transaction.id}</Text>
          <Tag color={transaction.status === 'completed' ? 'success' : transaction.status === 'pending' ? 'warning' : 'error'} className="status-tag">
            {transaction.status.toUpperCase()}
          </Tag>
        </div>
        <div className="transaction-type">
          <Tag color={transaction.type === 'deposit' ? 'green' : transaction.type === 'claimed_profit' ? 'blue' : transaction.type === 'withdraw' ? 'red' : 'orange'}>
            {transaction.type.replace('_', ' ').toUpperCase()}
          </Tag>
        </div>
      </div>
      
      <Divider className="mobile-divider" />
      
      <div className="mobile-card-content">
        <Row gutter={[16, 8]}>
          <Col span={12}>
            <div className="stat-item">
              <Text type="secondary" className="stat-label">Amount</Text>
              <Text 
                strong 
                className={`stat-value amount-value ${transaction.type === 'deposit' || transaction.type === 'claimed_profit' ? 'positive' : 'negative'}`}
              >
                {transaction.type === 'deposit' || transaction.type === 'claimed_profit' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </Text>
            </div>
          </Col>
          <Col span={12}>
            <div className="stat-item">
              <Text type="secondary" className="stat-label">Fee</Text>
              <Text className="stat-value">{formatCurrency(transaction.fee)}</Text>
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
    <div className="transactions-page">
      <div className="transactions-header">
        <Title level={2} className="page-title">
          Transactions
        </Title>
        <Text type="secondary" className="page-subtitle">
          View and manage your transaction history
        </Text>
      </div>

      {/* Summary Cards */}
      <Row gutter={[16, 16]} className="summary-cards">
        <Col xs={24} sm={12} md={6}>
          <Card size="small" className="summary-card">
            <Statistic
              title="Total Transactions"
              value={filteredTransactions.length}
              valueStyle={{ fontSize: "1.5rem" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" className="summary-card">
            <Statistic
              title="Completed"
              value={completedTransactions}
              valueStyle={{ fontSize: "1.5rem", color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" className="summary-card">
            <Statistic
              title="Net Amount"
              value={totalAmount}
              precision={2}
              suffix=" USDT"
              valueStyle={{
                fontSize: "1.5rem",
                color: totalAmount >= 0 ? "#52c41a" : "#ff4d4f",
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" className="summary-card">
            <Statistic
              title="Success Rate"
              value={
                filteredTransactions.length > 0
                  ? (
                      (completedTransactions / filteredTransactions.length) *
                      100
                    ).toFixed(1)
                  : 0
              }
              suffix="%"
              valueStyle={{ fontSize: "1.5rem", color: "#1677ff" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="filters-card">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Search by Transaction ID or Description"
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
            />
          </Col>

          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Type"
              value={typeFilter}
              onChange={setTypeFilter}
              className="filter-select"
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
        </Row>
      </Card>

      {/* Transactions Table/Cards */}
      <Card className="table-card">
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
              ...pagination,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} transactions`,
            }}
            onChange={handleTableChange}
            className="transactions-table"
            scroll={{ x: 960 }}
          />
        )}
      </Card>

      {/* Transaction Details Modal */}
      <Modal
        title="Transaction Details"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width="1000px"
        className="transaction-modal transaction-details-modal"
        destroyOnClose
        centered={false}
        maskClosable={true}
        keyboard={true}
      >
        <TransactionDetails transaction={selectedTransaction} />
      </Modal>
    </div>
  );
};

export default Transactions;
