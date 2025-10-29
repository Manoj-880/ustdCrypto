import React, { useState, useEffect } from 'react'
import { Card, Statistic, Tag, Typography, Space, Divider, Row, Col, message, Spin, Table, Tooltip } from 'antd'
import { CheckCircleOutlined, DollarOutlined, TrophyOutlined, HistoryOutlined, RiseOutlined, CopyOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { useAuth } from '../../contexts/AuthContext'
import { getProfitsByUserId } from '../../api_calls/profitApi'
import '../../styles/pages/userPages/profits.css'

const { Title, Text } = Typography

const Profits = () => {
  const [profitTransactions, setProfitTransactions] = useState([])
  const [totalProfitsEarned, setTotalProfitsEarned] = useState(0)
  const [currentBalance, setCurrentBalance] = useState(0)
  const [loading, setLoading] = useState(false)
  const [lastProfitAdded, setLastProfitAdded] = useState(null)
  
  const { user } = useAuth()

  const loadProfitsData = async () => {
    if (!user || !user._id) {
      message.error('User not authenticated')
      return
    }

    setLoading(true)
    try {
      const response = await getProfitsByUserId(user._id)
      if (response.success) {
        const { currentProfit, totalProfitsEarned, profitTransactions, lastProfitAdded } = response.data
        
        setCurrentBalance(user.balance ? parseFloat(user.balance) : 0)
        setTotalProfitsEarned(totalProfitsEarned)
        setProfitTransactions(profitTransactions)
        setLastProfitAdded(lastProfitAdded ? dayjs(lastProfitAdded) : null)
      } else {
        message.error(response.message || 'Failed to load profits data')
      }
    } catch (error) {
      console.error('Error loading profits data:', error)
      message.error('Failed to load profits data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfitsData()
  }, [user])

  if (loading) {
    return (
      <div className="profits-page">
        <div className="profits-header">
          <Title level={1} className="page-title">Profits</Title>
          <Text className="page-subtitle">Track your profit performance and earnings</Text>
        </div>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '20px' }}>
            <Text>Loading profits data...</Text>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="profits-page">
      <div className="profits-header">
        <Title level={1} className="page-title">Profits</Title>
        <Text className="page-subtitle">Track your profit performance and earnings</Text>
      </div>
      
      {/* Main Profit Display Section */}
      <div className="main-profit-section">
        <Card className="main-profit-card">
          <div className="main-profit-content">
            <div className="profit-header">
              <div className="profit-icon">
                <RiseOutlined />
              </div>
              <div className="profit-info">
                <Title level={3} className="profit-title">Auto-Added Profits</Title>
                <Text className="profit-subtitle">Profits are automatically added to your balance</Text>
              </div>
            </div>
            
            <div className="profit-amount">
              <Statistic
                value={totalProfitsEarned}
                prefix={<DollarOutlined />}
                precision={2}
                valueStyle={{ 
                  color: '#52c41a',
                  fontSize: '2.5rem',
                  fontWeight: 'bold'
                }}
              />
            </div>

            <div className="auto-profit-info">
              <div className="auto-profit-status">
                <CheckCircleOutlined className="auto-icon" />
                <Text className="auto-text">Profits automatically added to balance</Text>
              </div>
              
              {lastProfitAdded && (
                <div className="last-profit-info">
                  <Text className="last-profit-label">Last profit added:</Text>
                  <Text className="last-profit-date">
                    {lastProfitAdded.format('MMM DD, YYYY [at] HH:mm')}
                  </Text>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Total Profits Summary */}
      <div className="profit-summary-cards">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Card className="profit-summary-card">
              <Statistic
                title="Total Earned"
                value={totalProfitsEarned}
                prefix={<DollarOutlined />}
                precision={2}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card className="profit-summary-card">
              <Statistic
                title="Current Balance"
                value={currentBalance}
                prefix={<DollarOutlined />}
                precision={2}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card className="profit-summary-card">
              <Statistic
                title="Profit Transactions"
                value={profitTransactions.length}
                prefix={<TrophyOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Profit Transactions History */}
      <div className="claimed-profits-section">
        <Card className="claimed-profits-card">
          <div className="section-header">
            <Title level={4} className="section-title">Profit Transactions History</Title>
          </div>
          
          <Divider />
          
          <Table
            dataSource={profitTransactions}
            columns={[
              {
                title: 'Time',
                dataIndex: 'date',
                key: 'time',
                render: (date) => {
                  const d = dayjs(date);
                  const day = d.format('D');
                  const month = d.format('MMM').toLowerCase();
                  const year = d.format('YYYY');
                  const time = d.format('HH.mm');
                  return `${day} ${month}, ${year} ${time}`;
                },
                sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
              },
              {
                title: 'Amount',
                dataIndex: 'quantity',
                key: 'amount',
                render: (amount) => (
                  <Text style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-success)' }}>
                    +${parseFloat(amount).toFixed(2)}
                  </Text>
                ),
                sorter: (a, b) => parseFloat(a.quantity) - parseFloat(b.quantity),
              },
              {
                title: 'Source',
                key: 'source',
                dataIndex: 'lockinId',
                render: (lockin) => {
                  if (!lockin || !lockin.name) {
                    return <Text type="secondary">N/A</Text>;
                  }
                  return <Text style={{ fontWeight: 'var(--font-weight-medium)' }}>{lockin.name}</Text>;
                },
              },
              {
                title: 'Lockin Plan',
                key: 'lockinPlan',
                dataIndex: 'lockinId',
                render: (lockin) => {
                  if (!lockin || !lockin.planDuration) {
                    return <Text type="secondary">N/A</Text>;
                  }
                  return <Text>{lockin.planDuration} days</Text>;
                },
              },
              {
                title: 'Transaction ID',
                dataIndex: 'transactionId',
                key: 'transactionId',
                render: (id, record) => {
                  const txId = id || record._id;
                  return (
                    <Tooltip title={txId}>
                      <Space>
                        <Text
                          style={{
                            fontFamily: 'var(--font-family-mono)',
                            maxWidth: '150px',
                            display: 'inline-block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {txId}
                        </Text>
                        <CopyOutlined
                          style={{ cursor: 'pointer', color: 'var(--color-primary)' }}
                          onClick={() => {
                            navigator.clipboard.writeText(txId);
                            message.success('Transaction ID copied!');
                          }}
                        />
                      </Space>
                    </Tooltip>
                  );
                },
              },
              {
                title: 'Status',
                key: 'status',
                render: () => (
                  <Tag color="green" icon={<CheckCircleOutlined />}>
                    Auto Added
                  </Tag>
                ),
              },
            ]}
            rowKey="_id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} transactions`,
              position: ['bottomRight'],
            }}
            loading={loading}
            locale={{
              emptyText: 'No profit transactions yet',
            }}
            className="profit-transactions-table"
          />
        </Card>
      </div>
    </div>
  )
}

export default Profits