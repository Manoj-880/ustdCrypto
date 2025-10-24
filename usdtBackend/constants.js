// Load environment variables
require('dotenv').config();

const PORT = process.env.PORT || 5002;
const dbURL = process.env.MONGODB_URI || "mongodb://localhost:27017/secureusdt";

module.exports = {
    PORT,
    dbURL,
}