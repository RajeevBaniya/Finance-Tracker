# FinanceTracker

A modern full-stack personal finance management application that helps users track their expenses, manage budgets, and gain insights into their spending patterns.

## 🚀 Live Demo

- **Frontend**: Deploy to [Vercel](https://vercel.com)
- **Backend**: Deploy to [Render](https://render.com)

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
   cp env.example .env
   # Fill in your environment variables in .env
   npm run dev
   ```

3. **Set up the client:**

   ```bash
   cd ../client
   npm install
   cp env.example .env.local
   # Fill in your environment variables in .env.local
   npm run dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:4001

## 🌐 Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### Quick Deployment Summary

1. **Deploy Server to Render**

   - Connect GitHub repository
   - Set root directory to `server`
   - Configure environment variables
   - Deploy

2. **Deploy Client to Vercel**

   - Connect GitHub repository
   - Set root directory to `client`
   - Configure environment variables
   - Deploy

3. **Update Environment Variables**
   - Update client's `NEXT_PUBLIC_API_URL` to point to Render URL
   - Update server's `FRONTEND_URL` to point to Vercel URL

## 🔧 Environment Variables

### Client (.env.local)

```env
NEXT_PUBLIC_API_URL=https://your-render-app.onrender.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### Server (.env)

```env
MONGODB_URI=your_mongodb_connection_string
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
PORT=4001
FRONTEND_URL=https://your-vercel-app.vercel.app
NODE_ENV=production
```

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 15
- **UI Library**: React 19
- **Styling**: TailwindCSS
- **Components**: Shadcn/ui
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **Authentication**: Clerk

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Clerk
- **Validation**: Built-in middleware

## 📝 API Endpoints

- `GET/POST /financial-records` - Transaction management
- `GET/POST /budgets` - Budget management
- `GET /health` - Health check
- `GET /` - API info

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Push to your fork
5. Create a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues during deployment or development, please:

1. Check the [DEPLOYMENT.md](./DEPLOYMENT.md) guide
2. Verify your environment variables
3. Check the logs in Vercel/Render dashboards
4. Open an issue in this repository
