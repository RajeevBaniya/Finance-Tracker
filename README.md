# FinanceTracker

A modern full-stack personal finance management application that helps users track their expenses, manage budgets, and gain insights into their spending patterns.

## 🚀 Live Demo

- **Live**: Demo [FinTrack](https://finance-tracker-apps.vercel.app/)

## 🏗️ Architecture

- **Frontend**: Next.js 15 with React 19, TailwindCSS, and Shadcn/ui
- **Backend**: Node.js with Express and MongoDB
- **Authentication**: Clerk
- **Database**: MongoDB Atlas
- **Deployment**: Vercel (client) + Render (server)

## Features

- 📊 Budget Management

  - Create and manage monthly budgets
  - Track spending against budget limits
  - Visual budget comparison charts
  - Spending insights and analytics

- 💰 Transaction Tracking

  - Record income and expenses
  - Categorize transactions
  - View transaction history
  - Monthly spending analysis

- 📈 Data Visualization

  - Monthly spending bar charts
  - Category-wise expense breakdown
  - Budget vs actual comparison charts

- 🔐 User Authentication

  - Secure sign-up and sign-in with Clerk
  - Protected routes and API endpoints
  - Multi-currency support

- 🌟 Modern UI
  - Responsive design with TailwindCSS
  - Clean, intuitive interface
  - Real-time data updates

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Clerk account

### Local Development

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/FinanceTracker.git
   cd FinanceTracker
   ```

2. **Set up the server:**

   ```bash
   cd server
   npm install
   setup .env with required key
   # Fill in your environment variables in .env
   npm run dev
   ```

3. **Set up the client:**

   ```bash
   cd ../client
   npm install
   setup .env with required key
   # Fill in your environment variables in .env
   npm run dev
   ```

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 15
- **UI Library**: React 19
- **Styling**: TailwindCSS
- **Components**: Shadcn/ui
- **Charts**: Recharts
- **Forms**: React Hook Form
- **Authentication**: Clerk

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Clerk
- **Validation**: Built-in middleware
