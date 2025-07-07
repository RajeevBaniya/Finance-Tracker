# FinanceTracker Client

This is the frontend for the FinanceTracker application, built with Next.js and React. It provides a modern, responsive UI for managing transactions, budgets, and financial insights.

## Features

- Add, edit, and delete transactions
- Create and manage budgets
- Visualize spending with charts (Recharts)
- Responsive design with TailwindCSS
- UI components from shadcn/ui

## Tech Stack

- Next.js
- React
- TailwindCSS
- shadcn/ui
- Recharts

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. The app will be available at `http://localhost:3000`.

## Configuration

- API endpoints are configured to connect to the backend server (see `src/lib/api-client.js`).

## Folder Structure

- `src/app/` - Next.js app routes
- `src/components/` - UI and feature components
- `src/context/` - React context providers
- `src/hooks/` - Custom React hooks
- `src/lib/` - API and utility functions

## License

MIT
