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

const constants = require("./constants");

const paymentController = require("./controllers/paymentController");

const app = express();
app.use(cors());

// Rate limiter per IP range (/24 subnet)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
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

corn.schedule("* * * * *", async () => {
  try {
    await paymentController.addProfit();
  } catch (error) {
    console.error("Error running addProfit cron:", error);
  }
});

// Logging API calls
const filePath = path.join(__dirname, "logs", "request.log");
const accessLogStream = fs.createWriteStream(filePath, { flags: "a" });

app.use(
  morgan(":method :url :status :res[content-length] :response-time ms", {
    stream: accessLogStream,
  })
);
app.use(morgan(":method :url :status :res[content-length] :response-time ms"));

app.use(bodyParser.json());

mongoose
  .connect(constants.dbURL)
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.get("/test", (req, res) => {
  res.send("API working with IP range rate limit");
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

const PORT = constants.PORT;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
