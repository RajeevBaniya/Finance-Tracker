# FinanceTracker Frontend

The frontend application for FinanceTracker built with Next.js, React, and TailwindCSS.

## Tech Stack

- Next.js
- React
- TailwindCSS
- shadcn/ui components
- Recharts for data visualization

## Directory Structure

```
client/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   │   ├── budgets/     # Budget-related components
│   │   ├── charts/      # Data visualization components
│   │   ├── layout/      # Layout components
│   │   ├── transactions/# Transaction components
│   │   └── ui/          # Reusable UI components
│   ├── context/         # React context providers
│   ├── hooks/           # Custom React hooks
│   └── lib/             # Utility functions and API clients
└── public/              # Static assets
```

## Features

### Budget Management

- Create and manage budgets
- Visual budget tracking
- Spending insights
- Budget comparison charts

### Transaction Tracking

- Add/Edit/Delete transactions
- Transaction history
- Category management
- Monthly analysis

### Data Visualization

- Monthly spending charts
- Category distribution charts
- Budget vs. actual comparisons

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file with:

   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```
