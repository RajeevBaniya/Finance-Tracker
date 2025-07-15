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
    origin: process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000",
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
