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
  Modal,
  Divider,
  Pagination,
} from "antd";
import { SearchOutlined, ReloadOutlined, EyeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useAuth } from "../../contexts/AuthContext";
import { getTransactionsByUserId } from "../../api_calls/transactionsApi";
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
  const { user } = useAuth();

  // Load transactions from backend
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user?._id) return;
      setLoading(true);
      try {
        const response = await getTransactionsByUserId(user._id);
        console.log(response);
        if (response?.success && Array.isArray(response.data)) {
          // Map backend transaction model to UI shape
          const mapped = response.data.map((t) => {
            // Use the same mapping logic as backend controller
            let type = t.type || "deposit";
            let description = t.description || "";
            
            // Map backend transaction types to frontend expected types
            switch (t.type) {
              case 'ADMIN_ADD':
              case 'cash':
              case 'CASH':
                type = "deposit";
                description = t.description || "Admin added balance";
                break;
              case 'TRANSFER_OUT':
                type = "transfer";
                description = t.description || `Transfer out to ${t.activeWalleteId}`;
                break;
              case 'TRANSFER_IN':
                type = "deposit";
                description = t.description || `Transfer in from ${t.userWalletId}`;
                break;
              case 'WITHDRAWAL_REQUEST':
              case 'withdraw':
                type = "withdraw";
                description = t.description || "Withdrawal request";
                break;
              case 'claimed_profit':
                type = "profit";
                description = t.description || "Claimed profit";
                break;
              case 'DAILY_PROFIT':
                type = "profit";
                description = t.description || "Daily profit earned";
                break;
              case 'REFERRAL_BONUS':
                type = "bonus";
                description = t.description || "Referral bonus earned";
                break;
              default:
                type = "deposit";
                description = t.description || "Deposit transaction";
            }

            return {
              id: t.id || t.transactionId || t._id,
              type: type,
              amount: Number(t.usdtQuantity || t.quantity || 0),
              status: t.status || "completed",
              date: t.date,
              description: description,
              fee: Number(t.fee || 0),
              balance: Number(t.balance || 0), // Use the balance from backend mapping
            };
          });
          setTransactions(mapped);
          setFilteredTransactions(mapped);
          setPagination((prev) => ({ ...prev, total: mapped.length }));
        } else {
          setTransactions([]);
          setFilteredTransactions([]);
          setPagination((prev) => ({ ...prev, total: 0 }));
        }
      } catch (e) {
        setTransactions([]);
        setFilteredTransactions([]);
        setPagination((prev) => ({ ...prev, total: 0 }));
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

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

  const handlePaginationChange = (page, pageSize) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize: pageSize,
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
      width: 180,
      render: (text) => (
        <div className="transaction-id-cell">
          <Text className="transaction-id-text" copyable={{ text }}>
            {text}
          </Text>
        </div>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 180,
      render: (amount, record) => (
        <div className="amount-cell">
          <div
            className={`amount-value ${
              record.type === "withdraw" || record.type === "transfer"
                ? "negative"
                : "positive"
            }`}
          >
            <span className="amount-icon">
              {record.type === "withdraw" || record.type === "transfer"
                ? "↓"
                : "↑"}
            </span>
            <span className="amount-text">
              {formatCurrency(amount)}
            </span>
          </div>
          {record.fee > 0 && (
            <div className="fee-text">Fee: {formatCurrency(record.fee)}</div>
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


  const renderMobileCard = (transaction) => (
    <Card key={transaction.id} className="mobile-transaction-card" hoverable>
      <div className="mobile-card-header">
        <div className="transaction-id-section">
          <Text className="transaction-id-text" copyable={{ text: transaction.id }}>
            {transaction.id}
          </Text>
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
                <span className="amount-icon">
                  {transaction.type === 'deposit' || transaction.type === 'claimed_profit' ? '+' : '-'}
                </span>
                <span className="amount-text">
                  {formatCurrency(transaction.amount)}
                </span>
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
          onClick={() => showTransactionDetails(transaction)}
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
          <>
            <Table
              columns={columns}
              dataSource={filteredTransactions.slice(
                (pagination.current - 1) * pagination.pageSize,
                pagination.current * pagination.pageSize
              )}
              rowKey="id"
              loading={loading}
              pagination={false}
              className="transactions-table"
              scroll={{ x: 960 }}
            />
            <div className="pagination-container">
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                showSizeChanger={true}
                showQuickJumper={true}
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} of ${total} transactions`
                }
                onChange={handlePaginationChange}
                onShowSizeChange={handlePaginationChange}
                className="transactions-pagination"
              />
            </div>
          </>
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
