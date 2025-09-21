import React, { useState, useEffect } from 'react'
import { Card, Button, Statistic, Tag, Progress, Typography, Space, Divider, Row, Col, message } from 'antd'
import { ClockCircleOutlined, CheckCircleOutlined, DollarOutlined, TrophyOutlined, HistoryOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import '../../styles/pages/userPages/profits.css'

const { Title, Text } = Typography

const Profits = () => {
  const [timeLeft, setTimeLeft] = useState(null)
  const [canClaim, setCanClaim] = useState(false)
  const [claimedProfits, setClaimedProfits] = useState([])
  const [totalProfits, setTotalProfits] = useState(0)
  const [currentProfit, setCurrentProfit] = useState(0)

  // Mock data - in real app, this would come from API
  const mockData = {
    lastClaimedTime: dayjs().subtract(20, 'hours'), // 20 hours ago
    currentProfit: 125.50,
    claimedProfits: [
      { id: 1, amount: 98.75, claimedAt: dayjs().subtract(2, 'days'), status: 'claimed' },
      { id: 2, amount: 87.25, claimedAt: dayjs().subtract(3, 'days'), status: 'claimed' },
      { id: 3, amount: 112.30, claimedAt: dayjs().subtract(4, 'days'), status: 'claimed' },
      { id: 4, amount: 95.80, claimedAt: dayjs().subtract(5, 'days'), status: 'claimed' },
      { id: 5, amount: 103.45, claimedAt: dayjs().subtract(6, 'days'), status: 'claimed' },
    ]
  }

  useEffect(() => {
    // Initialize data
    setClaimedProfits(mockData.claimedProfits)
    setCurrentProfit(mockData.currentProfit)
    setTotalProfits(mockData.claimedProfits.reduce((sum, profit) => sum + profit.amount, 0))

    // Calculate time left
    const calculateTimeLeft = () => {
      const now = dayjs()
      const lastClaimed = mockData.lastClaimedTime
      const nextClaimTime = lastClaimed.add(24, 'hours')
      const timeDiff = nextClaimTime.diff(now)

      if (timeDiff <= 0) {
        setTimeLeft(null)
        setCanClaim(true)
      } else {
        const hours = Math.floor(timeDiff / (1000 * 60 * 60))
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000)
        setTimeLeft({ hours, minutes, seconds })
        setCanClaim(false)
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleClaimProfit = () => {
    if (!canClaim) return

    // Add current profit to claimed list
    const newClaimedProfit = {
      id: Date.now(),
      amount: currentProfit,
      claimedAt: dayjs(),
      status: 'claimed'
    }

    setClaimedProfits(prev => [newClaimedProfit, ...prev])
    setTotalProfits(prev => prev + currentProfit)
    setCurrentProfit(0)
    setCanClaim(false)
    
    message.success(`Successfully claimed $${currentProfit.toFixed(2)} profit!`)
  }

  const formatTimeLeft = () => {
    if (!timeLeft) return 'Ready to claim!'
    return `${timeLeft.hours.toString().padStart(2, '0')}:${timeLeft.minutes.toString().padStart(2, '0')}:${timeLeft.seconds.toString().padStart(2, '0')}`
  }

  const getProgressPercentage = () => {
    if (!timeLeft) return 100
    const totalSeconds = 24 * 60 * 60
    const remainingSeconds = timeLeft.hours * 3600 + timeLeft.minutes * 60 + timeLeft.seconds
    return ((totalSeconds - remainingSeconds) / totalSeconds) * 100
  }

  return (
    <div className="profits-page">
      <div className="profits-header">
        <Title level={1} className="page-title">Profits</Title>
        <Text className="page-subtitle">Track your profit performance and earnings</Text>
      </div>
      
      {/* Main Profit Claim Section */}
      <div className="main-profit-section">
        <Card className="main-profit-card">
          <div className="main-profit-content">
            <div className="profit-header">
              <div className="profit-icon">
                <TrophyOutlined />
              </div>
              <div className="profit-info">
                <Title level={3} className="profit-title">Current Profit</Title>
                <Text className="profit-subtitle">Available for claiming</Text>
              </div>
            </div>
            
            <div className="profit-amount">
              <Statistic
                value={currentProfit}
                prefix={<DollarOutlined />}
                precision={2}
                valueStyle={{ 
                  color: canClaim ? '#52c41a' : '#1890ff',
                  fontSize: '2.5rem',
                  fontWeight: 'bold'
                }}
              />
            </div>

            <div className="timer-section">
              {canClaim ? (
                <div className="claim-ready">
                  <CheckCircleOutlined className="ready-icon" />
                  <Text className="ready-text">Ready to claim!</Text>
                </div>
              ) : (
                <div className="timer-container">
                  <div className="timer-icon">
                    <ClockCircleOutlined />
                  </div>
                  <div className="timer-content">
                    <Text className="timer-label">Time remaining</Text>
                    <Text className="timer-value">{formatTimeLeft()}</Text>
                  </div>
                </div>
              )}
              
              <div className="progress-container">
                <Progress
                  percent={getProgressPercentage()}
                  strokeColor={{
                    '0%': '#1890ff',
                    '100%': '#52c41a',
                  }}
                  trailColor="#2a2a2a"
                  strokeWidth={8}
                  showInfo={false}
                />
              </div>
            </div>

            <Button
              type="primary"
              size="large"
              className="claim-button"
              disabled={!canClaim}
              onClick={handleClaimProfit}
              icon={<DollarOutlined />}
            >
              {canClaim ? 'Claim Profit' : 'Wait for Timer'}
            </Button>
          </div>
        </Card>
      </div>

      {/* Total Profits Summary */}
      <div className="profit-summary-cards">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Card className="profit-summary-card">
              <Statistic
                title="Total Claimed"
                value={totalProfits}
                prefix={<DollarOutlined />}
                precision={2}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card className="profit-summary-card">
              <Statistic
                title="Available Now"
                value={currentProfit}
                prefix={<DollarOutlined />}
                precision={2}
                valueStyle={{ color: canClaim ? '#52c41a' : '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card className="profit-summary-card">
              <Statistic
                title="Total Claims"
                value={claimedProfits.length}
                prefix={<TrophyOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Claimed Profits History */}
      <div className="claimed-profits-section">
        <Card className="claimed-profits-card">
          <div className="section-header">
            <HistoryOutlined className="section-icon" />
            <Title level={4} className="section-title">Claimed Profits History</Title>
          </div>
          
          <Divider />
          
          {claimedProfits.length === 0 ? (
            <div className="empty-state">
              <Text className="empty-text">No profits claimed yet</Text>
            </div>
          ) : (
            <div className="profits-list">
              {claimedProfits.map((profit) => (
                <div key={profit.id} className="profit-item">
                  <div className="profit-item-content">
                    <div className="profit-item-info">
                      <Text className="profit-amount">${profit.amount.toFixed(2)}</Text>
                      <Text className="profit-date">
                        {profit.claimedAt.format('MMM DD, YYYY [at] HH:mm')}
                      </Text>
                    </div>
                    <div className="profit-status">
                      <Tag color="green" icon={<CheckCircleOutlined />}>
                        Claimed
                      </Tag>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default Profits