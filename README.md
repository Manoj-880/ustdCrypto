# SecureUSDT - Cryptocurrency Investment Platform

A comprehensive full-stack cryptocurrency investment platform built with React and Node.js, featuring automated profit distribution, secure wallet management, and professional invoice generation.

## 🚀 Project Overview

SecureUSDT is a sophisticated investment platform that allows users to invest in USDT (Tether) through various lock-in plans, earn daily profits, and manage their cryptocurrency portfolio with advanced security features and automated systems.

## 🏗️ Architecture

### Frontend (React + Vite)
- **Framework**: React 19.1.1 with Vite 7.1.2
- **UI Library**: Ant Design 5.27.1
- **Styling**: Bootstrap 5.3.7 + Custom CSS
- **State Management**: React Context API
- **Routing**: React Router DOM 7.8.2
- **HTTP Client**: Axios 1.11.0

### Backend (Node.js + Express)
- **Runtime**: Node.js with Express 5.1.0
- **Database**: MongoDB with Mongoose 8.17.1
- **Authentication**: JWT-based authentication
- **Email Service**: AWS SES integration
- **PDF Generation**: jsPDF + html2canvas
- **Blockchain Integration**: TronWeb for USDT transactions

## 📁 Project Structure

```
usdt/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── api_calls/        # API integration layer
│   │   ├── components/       # Reusable UI components
│   │   ├── contexts/         # React Context providers
│   │   ├── pages/           # Page components
│   │   │   ├── adminPages/  # Admin dashboard pages
│   │   │   ├── userPages/   # User dashboard pages
│   │   │   ├── static/      # Public pages
│   │   │   └── startingPages/ # Auth pages
│   │   └── styles/          # CSS styling
│   └── dist/                # Production build
└── usdtBackend/             # Node.js Backend
    ├── controllers/         # Business logic
    ├── models/             # Database schemas
    ├── repos/              # Data access layer
    ├── routes/             # API endpoints
    ├── services/           # External services
    ├── middleware/          # Custom middleware
    └── logs/               # Application logs
```

## 🔧 Key Features

### 💰 Investment Management
- **Lock-in Plans**: Multiple investment plans with different interest rates
- **Automated Profits**: Daily profit distribution via cron jobs
- **Referral System**: Bonus rewards for successful referrals
- **Balance Management**: Real-time balance tracking and updates

### 🔐 Security Features
- **JWT Authentication**: Secure user authentication
- **Role-based Access**: Separate admin and user interfaces
- **Rate Limiting**: IP-based request rate limiting
- **CORS Protection**: Configurable cross-origin resource sharing
- **Input Validation**: Comprehensive data validation

### 📧 Communication System
- **Email Notifications**: Automated email system using AWS SES
- **PDF Invoices**: Professional invoice generation for transactions
- **Email Templates**: Responsive HTML email templates
- **Multi-language Support**: Template-based email content

### 📊 Admin Dashboard
- **User Management**: Complete user administration
- **Transaction Monitoring**: Real-time transaction tracking
- **Withdrawal Processing**: Manual withdrawal approval system
- **Analytics**: Comprehensive dashboard analytics
- **FAQ Management**: Dynamic FAQ system

### 💳 Payment Integration
- **USDT Transactions**: TronWeb integration for USDT transfers
- **Transaction Verification**: Blockchain transaction validation
- **Internal Transfers**: User-to-user transfer system
- **Withdrawal Processing**: Secure withdrawal request handling

## 🛠️ Technical Implementation

### Frontend Architecture

#### Component Structure
- **Layout Components**: Admin and user-specific layouts
- **Protected Routes**: Role-based route protection
- **Modal Components**: Reusable modal dialogs
- **Navigation**: Dynamic navigation based on user role

#### State Management
```javascript
// Context-based state management
const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);
```

#### API Integration
- Centralized API calls in `/api_calls` directory
- Axios interceptors for request/response handling
- Error handling and loading states

### Backend Architecture

#### MVC Pattern Implementation
- **Models**: Mongoose schemas for data modeling
- **Controllers**: Business logic and request handling
- **Routes**: API endpoint definitions
- **Repositories**: Data access abstraction layer

#### Database Design
```javascript
// User Model Example
const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  balance: { type: String, default: "0" },
  profit: { type: String, default: "0" },
  referredBy: { type: String },
  walletId: { type: String },
  isVerified: { type: Boolean, default: false }
});
```

#### Automated Systems
- **Cron Jobs**: Daily profit distribution at 8:00 AM IST
- **Email Automation**: Transaction-based email notifications
- **PDF Generation**: Automated invoice creation
- **Logging**: Comprehensive request and error logging

### Security Implementation

#### Authentication Flow
1. User registration with email verification
2. JWT token generation upon successful login
3. Token validation middleware for protected routes
4. Role-based access control

#### Data Protection
- Environment variable management for sensitive data
- Input sanitization and validation
- SQL injection prevention through Mongoose
- XSS protection in email templates

## 🔄 Business Logic

### Investment System
1. **User Registration**: Email verification required
2. **Deposit Process**: USDT transaction verification via blockchain
3. **Lock-in Creation**: Investment plan assignment
4. **Daily Profit Calculation**: Automated profit distribution
5. **Withdrawal Process**: Admin approval workflow

### Profit Distribution Algorithm
```javascript
// Daily profit calculation
const dailyProfit = activeLockins
  .filter(lockin => lockin.status === "ACTIVE")
  .map(lockin => {
    const dailyRate = lockin.interestRate / 100;
    return lockin.amount * dailyRate;
  })
  .reduce((sum, profit) => sum + profit, 0);
```

### Referral System
- Automatic referral bonus calculation
- Multi-level referral tracking
- Bonus distribution on successful referrals

## 📱 User Experience

### Responsive Design
- Mobile-first approach
- Bootstrap grid system
- Ant Design responsive components
- Custom CSS for enhanced styling

### User Interface Features
- **Dashboard**: Comprehensive user dashboard
- **Transaction History**: Detailed transaction tracking
- **Profile Management**: User profile and settings
- **Investment Tracking**: Real-time investment monitoring
- **Withdrawal Requests**: Easy withdrawal request system

### Admin Interface
- **User Management**: Complete user administration
- **Transaction Monitoring**: Real-time transaction oversight
- **Withdrawal Processing**: Manual approval workflow
- **Analytics Dashboard**: Business intelligence metrics

## 🔧 Development Setup

### Prerequisites
- Node.js (v18+)
- MongoDB
- Git

### Installation Steps
1. Clone the repository
2. Install frontend dependencies: `cd client && npm install`
3. Install backend dependencies: `cd usdtBackend && npm install`
4. Configure environment variables
5. Start MongoDB service
6. Run backend: `npm start`
7. Run frontend: `npm run dev`

### Environment Configuration
- Database connection strings
- JWT secret keys
- Email service credentials
- Blockchain API endpoints

## 🚀 Deployment

### Production Build
- Frontend: Vite production build with optimization
- Backend: Node.js with PM2 process management
- Database: MongoDB Atlas cloud deployment
- Email: AWS SES production configuration

### Security Considerations
- Environment variable protection
- HTTPS implementation
- Database connection security
- API rate limiting
- CORS configuration

## 📊 Performance Optimizations

### Frontend Optimizations
- Code splitting with React.lazy()
- Image optimization
- Bundle size optimization
- Caching strategies

### Backend Optimizations
- Database indexing
- Query optimization
- Caching mechanisms
- Connection pooling

## 🔍 Monitoring & Logging

### Application Monitoring
- Request logging with Morgan
- Error tracking and reporting
- Performance metrics
- User activity monitoring

### Log Management
- Structured logging format
- Log rotation and archival
- Error alerting system
- Audit trail maintenance

## 🛡️ Security Measures

### Data Security
- Encryption at rest and in transit
- Secure password hashing
- JWT token security
- Input validation and sanitization

### API Security
- Rate limiting per IP
- CORS policy enforcement
- Request validation
- Error handling without data leakage

## 📈 Scalability Considerations

### Database Scaling
- MongoDB sharding strategies
- Index optimization
- Query performance tuning
- Connection management

### Application Scaling
- Horizontal scaling with load balancers
- Microservices architecture potential
- Caching layer implementation
- CDN integration for static assets

## 🎯 Future Enhancements

### Planned Features
- Mobile application development
- Advanced analytics dashboard
- Multi-currency support
- Enhanced security features
- API documentation with Swagger

### Technical Improvements
- Microservices migration
- Container orchestration
- Advanced monitoring
- Automated testing suite

## 📝 Development Guidelines

### Code Standards
- ESLint configuration for code quality
- Consistent naming conventions
- Modular component architecture
- Comprehensive error handling

### Testing Strategy
- Unit testing for business logic
- Integration testing for APIs
- End-to-end testing for user flows
- Performance testing for scalability

## 🤝 Contributing

### Development Workflow
1. Feature branch creation
2. Code implementation
3. Testing and validation
4. Code review process
5. Merge to main branch

### Code Quality
- Automated linting
- Code review requirements
- Documentation standards
- Performance benchmarks

---

## 📞 Contact

For technical inquiries or collaboration opportunities, please reach out through professional channels.

**Note**: This project demonstrates full-stack development capabilities with modern web technologies, automated systems, and comprehensive security implementations suitable for production environments.
