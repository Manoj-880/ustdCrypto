/**
 * USDT Investment Platform - Main Server Entry Point
 * 
 * This is the primary Express.js server that handles all API requests for the USDT investment platform.
 * It manages user authentication, payment processing, profit calculations, and administrative functions.
 * 
 * Key Features:
 * - RESTful API endpoints for frontend communication
 * - Automated daily profit distribution via cron jobs
 * - Rate limiting and security measures
 * - CORS configuration for cross-origin requests
 * - Request logging and monitoring
 * - MongoDB database integration
 * 
 * @author USDT Platform Team
 * @version 1.0.0
 * @since 2024
 */

require('dotenv').config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
const ipaddr = require("ipaddr.js");
const corn = require("node-cron");

const paymentController = require("./controllers/paymentController");

const app = express();

/**
 * Configure Express to trust proxy headers for accurate IP address detection
 * This is essential for rate limiting and security when behind reverse proxies
 */
app.set('trust proxy', 1);

/**
 * CORS (Cross-Origin Resource Sharing) Configuration
 * 
 * This configuration controls which domains can access our API endpoints.
 * It supports both development and production environments with different rules.
 * 
 * Development Mode: Allows all localhost origins for local development
 * Production Mode: Only allows specific whitelisted domains
 * 
 * @param {string} origin - The origin domain making the request
 * @param {function} callback - Function to call with CORS decision
 */
const corsOptions = {
  origin: function (origin, callback) {
    if (process.env.NODE_ENV === 'development') {
      if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }
    }
    
    if (!origin) {
      return callback(null, true);
    }

    const allowedOrigins = process.env.ALLOWED_ORIGINS ? 
      process.env.ALLOWED_ORIGINS.split(',') : [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173',
        'https://www.secureusdt.com',
        'https://api.secureusdt.com',
        'https://secureusdt.com'
      ];

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Session-ID', 'X-User-ID']
};

app.use(cors(corsOptions));

/**
 * Request Logging Configuration using Morgan
 * 
 * This middleware logs all HTTP requests to both console and file for monitoring and debugging.
 * It captures request details including method, URL, status code, response time, and IP address.
 * 
 * Log Files: Stored in ./logs/request.log for persistent logging
 * Console Output: Simplified format for real-time monitoring
 */
const filePath = path.join(__dirname, "logs", "request.log");
const accessLogStream = fs.createWriteStream(filePath, { flags: "a" });

morgan.token('timestamp', () => {
  return new Date().toISOString();
});

morgan.token('ip', (req) => {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
});

app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan(':method :url :status :response-time ms'));

/**
 * Rate Limiting Configuration
 * 
 * Implements IP-based rate limiting to prevent abuse and DDoS attacks.
 * Uses subnet-based grouping (/24 for IPv4) to limit requests per IP range.
 * 
 * Configuration:
 * - Window: 15 minutes (configurable via RATE_LIMIT_WINDOW_MS)
 * - Max Requests: 100 per window (configurable via RATE_LIMIT_MAX_REQUESTS)
 * - Grouping: IP subnet-based to prevent circumvention
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {string} - IP subnet identifier for rate limiting
 */
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  keyGenerator: (req, res) => {
    const clientIp =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    try {
      const addr = ipaddr.parse(clientIp);
      if (addr.kind() === "ipv4") {
        const octets = addr.octets;
        return `${octets[0]}.${octets[1]}.${octets[2]}.0/24`;
      }
      if (addr.kind() === "ipv6") {
        return addr.range();
      }
    } catch (e) {
      return clientIp;
    }
  },
  message: { error: "Too many requests from this IP range, try again later." },
});

app.use(limiter);

/**
 * Automated Profit Distribution Cron Job
 * 
 * This cron job automatically distributes daily profits to all users with active lock-ins.
 * It runs every minute to ensure frequent profit distribution.
 * 
 * Schedule: "* * * * *" (every minute)
 * Timezone: Asia/Kolkata (IST)
 * 
 * The job calls paymentController.addProfit() which:
 * 1. Fetches all users with active lock-ins
 * 2. Calculates daily profit based on interest rates
 * 3. Updates user balances and profit totals
 * 4. Creates transaction records for audit trail
 * 5. Handles referral bonus distribution
 * 
 * Error handling ensures the job continues even if individual user processing fails.
 */
corn.schedule(
  process.env.PROFIT_CRON_SCHEDULE || "* * * * *",
  async () => {
    try {
      console.log("⏰ [CRON] Cron job triggered at:", new Date().toISOString());
      await paymentController.addProfit();
    } catch (error) {
      console.error("Error running addProfit cron:", error);
    }
  },
  {
    timezone: process.env.CRON_TIMEZONE || "Asia/Kolkata",
  }
);

console.log("🕐 [CRON] Profit cron job scheduled:", process.env.PROFIT_CRON_SCHEDULE || "* * * * *");
console.log("🌍 [CRON] Cron timezone:", process.env.CRON_TIMEZONE || "Asia/Kolkata");

/**
 * Backup Interval-Based Profit Distribution
 * 
 * This serves as a fallback mechanism in case the cron job fails or is disabled.
 * It calculates the exact time until the next 8 AM IST and schedules the profit distribution.
 * 
 * Activation: Controlled by USE_INTERVAL_BACKUP environment variable
 * 
 * The system:
 * 1. Calculates milliseconds until next 8 AM IST
 * 2. Schedules profit distribution using setTimeout
 * 3. Automatically reschedules for the next day after completion
 * 4. Continues scheduling even if individual runs fail
 * 
 * This ensures profit distribution continues even if cron jobs are disabled or fail.
 */
let cronInterval = null;
if (process.env.USE_INTERVAL_BACKUP === 'true') {
  console.log("🔄 [BACKUP] Starting interval-based profit addition (daily at 8 AM IST)");
  
  const getNext8AM = () => {
    const now = new Date();
    const ist8AM = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
    ist8AM.setHours(8, 0, 0, 0);
    
    if (ist8AM <= now) {
      ist8AM.setDate(ist8AM.getDate() + 1);
    }
    
    return ist8AM.getTime() - now.getTime();
  };
  
  const scheduleNext = () => {
    const delay = getNext8AM();
    console.log(`⏰ [INTERVAL] Next profit addition scheduled in ${Math.round(delay / 1000 / 60)} minutes`);
    
    cronInterval = setTimeout(async () => {
      try {
        console.log("⏰ [INTERVAL] Interval-based profit addition triggered at:", new Date().toISOString());
        await paymentController.addProfit();
        scheduleNext();
      } catch (error) {
        console.error("❌ [INTERVAL] Error in interval-based profit addition:", error);
        scheduleNext();
      }
    }, delay);
  };
  
  scheduleNext();
}

/**
 * Middleware Configuration
 * 
 * Body parser middleware to handle JSON request bodies.
 * This is essential for processing API requests with JSON payloads.
 */
app.use(bodyParser.json());

/**
 * MongoDB Database Connection
 * 
 * Establishes connection to MongoDB database using the connection string from environment variables.
 * The connection is essential for all data operations including user management, transactions, and profit calculations.
 * 
 * Connection String: Retrieved from MONGODB_URI environment variable
 * Error Handling: Logs connection errors and continues server startup
 */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

/**
 * Health Check Endpoint
 * 
 * Provides a simple endpoint to verify server status and uptime.
 * Used by monitoring systems and load balancers to check server health.
 * 
 * @route GET /api/health
 * @returns {Object} Server status information including uptime and timestamp
 */
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/**
 * API Route Configuration
 * 
 * All API routes are organized by functionality and mounted on specific paths.
 * Each route file contains related endpoints for a specific feature area.
 * 
 * Route Structure:
 * - /api/users - User management and registration
 * - /api/login - Authentication and login
 * - /api/transactions - Transaction history and management
 * - /api/payment - Payment processing and verification
 * - /api/wallets - Wallet management
 * - /api/lockin-plans - Investment plan management
 * - /api/lockins - User lock-in management
 * - /api/admin - Administrative functions
 * - /api/dashboard - Dashboard data and analytics
 * - /api/withdrawal-requests - Withdrawal request handling
 * - /api/faq - FAQ management
 * - /api/profits - Profit calculation and distribution
 * - /api/transfers - Internal user transfers
 * - /api/contact - Contact form handling
 * - /api/email-verification - Email verification system
 */
let user = require("./routes/userRoutes");
let login = require("./routes/loginRoute");
let transactions = require("./routes/transactionRoute");
let payments = require("./routes/paymentRoute");
let wallet = require("./routes/walletRoutes");
let lockinPlans = require("./routes/lockinPlansRoute");
let lockins = require("./routes/lockinRoute");
let admin = require("./routes/adminRoute");
let dashboard = require("./routes/dashboardRoute");
let withdrawalRequests = require("./routes/withdrawalRequestsRoute");
let faq = require("./routes/faqRoute");
let profit = require("./routes/profitRoute");
let transfer = require("./routes/transferRoute");
let contact = require("./routes/contactRoute");
let emailVerification = require("./routes/emailVerificationRoute");

app.use("/api/users", user);
app.use("/api/login", login);
app.use("/api/transactions", transactions);
app.use("/api/payment", payments);
app.use("/api/wallets", wallet);
app.use("/api/lockin-plans", lockinPlans);
app.use("/api/lockins", lockins);
app.use("/api/admin", admin);
app.use("/api/dashboard", dashboard);
app.use("/api/withdrawal-requests", withdrawalRequests);
app.use("/api/faq", faq);
app.use("/api/profits", profit);
app.use("/api/transfers", transfer);
app.use("/api/contact", contact);
app.use("/api/email-verification", emailVerification);

/**
 * Server Startup
 * 
 * Starts the Express server on the configured port.
 * Default port is 5002, but can be overridden with PORT environment variable.
 * 
 * @param {number} PORT - Server port number (default: 5002)
 */
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));