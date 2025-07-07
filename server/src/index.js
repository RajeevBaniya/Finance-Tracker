import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import financialRecordRouter from "./routes/financial-records.js";
import budgetRouter from "./routes/budgets.js";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

const mongoURI = process.env.MONGODB_URI || "";

mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to Connect to MongoDB:", err));

app.use("/financial-records", financialRecordRouter);
app.use("/budgets", budgetRouter);

app.get("/", (req, res) => {
  res.send("Finance Tracker API is running!");
});

app.listen(port, () => {
  console.log(`Server Running on Port ${port}`);
});
