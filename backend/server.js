const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(compression());
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

// tighter rate limit on auth routes to slow down brute force attempts
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { message: "Too many attempts, please try again later." },
});
app.use("/api/auth", authLimiter, require("./routes/auth"));

app.use("/api/properties", require("./routes/properties"));
app.use("/api/inquiries", require("./routes/inquiries"));

app.get("/", (req, res) => res.send("Real estate API running"));

app.use((req, res) => res.status(404).json({ message: "Route not found" }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;

// Only start a persistent server when run directly (local dev / traditional hosts
// like Railway or Render). On Vercel, this file is imported by api/index.js instead,
// and Vercel manages the request lifecycle itself.
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
