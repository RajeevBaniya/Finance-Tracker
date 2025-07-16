import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import financialRecordRouter from "./routes/financial-records.js";
import budgetRouter from "./routes/budgets.js";
import cors from "cors";
import { requireAuth, extractUserId } from "./middleware/auth.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4001;

// Configure CORS before other middleware
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:3000",
      /\.vercel\.app$/, // Allow all Vercel deployments
      /\.onrender\.com$/, // Allow Render deployments
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

const mongoURI = process.env.MONGODB_URI || "";

mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to Connect to MongoDB:", err));

// Apply authentication middleware to all routes
app.use(
  "/financial-records",
  requireAuth,
  extractUserId,
  financialRecordRouter
);
app.use("/budgets", requireAuth, extractUserId, budgetRouter);

// Health check endpoint for deployment monitoring
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    message: "FinanceTracker API Server",
    version: "1.0.0",
    status: "running",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  if (err.name === "UnauthorizedError" || err.status === 401) {
    return res.status(401).json({ error: "Authentication failed" });
  }
  res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
