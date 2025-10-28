// Load environment variables
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

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    console.log(`🌐 CORS check - Origin: ${origin}`);
    
    // Development mode - allow all localhost origins
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Development mode: Checking for localhost origins');
      if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        console.log('✅ CORS: Development mode - allowing localhost origin');
        return callback(null, true);
      }
    }
    
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) {
      console.log('✅ CORS: Allowing request with no origin');
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

    console.log(`📋 Allowed origins:`, allowedOrigins);
    console.log(`🔍 Checking if origin '${origin}' is in allowed list...`);

    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log('✅ CORS: Origin allowed');
      callback(null, true);
    } else {
      console.log('❌ CORS: Origin not allowed');
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Morgan logging - Place BEFORE rate limiting to log all requests
const filePath = path.join(__dirname, "logs", "request.log");
const accessLogStream = fs.createWriteStream(filePath, { flags: "a" });

// Custom Morgan format for better logging
morgan.token('timestamp', () => {
  return new Date().toISOString();
});

morgan.token('ip', (req) => {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
});

// Log to both console and file
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan(':timestamp :ip :method :url :status :res[content-length] :response-time ms')); // Console output

// Additional debugging middleware to catch all requests
app.use((req, res, next) => {
  console.log(`🔍 Request received: ${req.method} ${req.url} from ${req.ip}`);
  console.log(`📋 Headers:`, req.headers);
  next();
});

// Rate limiter per IP range (/24 subnet)
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  keyGenerator: (req, res) => {
    const clientIp =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    try {
      const addr = ipaddr.parse(clientIp);
      // For IPv4, use /24 subnet
      if (addr.kind() === "ipv4") {
        const octets = addr.octets;
        return `${octets[0]}.${octets[1]}.${octets[2]}.0/24`;
      }
      // For IPv6, you could use /64 subnet grouping
      if (addr.kind() === "ipv6") {
        return addr.range(); // e.g., 'uniqueLocal', 'unicast', etc.
      }
    } catch (e) {
      return clientIp; // fallback
    }
  },
  message: { error: "Too many requests from this IP range, try again later." },
});

app.use(limiter);

corn.schedule(
  process.env.PROFIT_CRON_SCHEDULE || "0 8 * * *",
  async () => {
    try {
      await paymentController.addProfit();
    } catch (error) {
      console.error("Error running addProfit cron:", error);
    }
  },
  {
    timezone: process.env.CRON_TIMEZONE || "Asia/Kolkata", // IST
  }
);

// Morgan logging is now configured above before rate limiting

app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Test endpoint to verify logging
app.get("/test", (req, res) => {
  console.log("Test endpoint hit - this should appear in logs");
  res.json({ 
    message: "API working with IP range rate limit",
    timestamp: new Date().toISOString(),
    ip: req.ip
  });
});

// CORS test endpoint
app.get("/cors-test", (req, res) => {
  console.log("CORS test endpoint hit");
  res.json({ 
    message: "CORS test successful",
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// routes
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

// end points
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

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
