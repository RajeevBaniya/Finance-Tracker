# FinanceTracker Deployment Guide

This guide will help you deploy the FinanceTracker application with the client on Vercel and the server on Render.

## Prerequisites

- GitHub repository with your code
- Vercel account
- Render account
- MongoDB Atlas account (for database)
- Clerk account (for authentication)

## Deployment Steps

### 1. Deploy Server to Render

1. **Connect GitHub Repository**

   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository containing your project

2. **Configure Build Settings**

   - **Name**: `financetracker-server` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. **Set Environment Variables**
   Add the following environment variables in Render:

   ```
   MONGODB_URI=your_mongodb_connection_string
   CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   PORT=4001
   FRONTEND_URL=https://your-app-name.vercel.app
   NODE_ENV=production
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your Render URL (e.g., `https://financetracker-server.onrender.com`)

### 2. Deploy Client to Vercel

1. **Connect GitHub Repository**

   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Project Settings**

   - **Framework Preset**: Next.js
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

3. **Set Environment Variables**
   Add the following environment variables in Vercel:

   ```
   NEXT_PUBLIC_API_URL=https://your-render-app.onrender.com
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Note your Vercel URL (e.g., `https://your-app-name.vercel.app`)

### 3. Update Server Environment

1. **Update Render Environment Variables**
   - Go back to your Render service
   - Update the `FRONTEND_URL` environment variable with your actual Vercel URL
   - Redeploy the service

### 4. Post-Deployment Configuration

1. **Update Clerk Settings**

   - Go to your Clerk Dashboard
   - Update allowed origins to include:
     - Your Vercel deployment URL
     - Your Render deployment URL

2. **Test the Deployment**
   - Visit your Vercel URL
   - Test user registration/login
   - Test API connectivity
   - Verify all features work correctly

## Environment Variables Reference

### Client Environment Variables (Vercel)

| Variable                              | Description            | Example                                      |
| ------------------------------------- | ---------------------- | -------------------------------------------- |
| `NEXT_PUBLIC_API_URL`                 | Backend API URL        | `https://financetracker-server.onrender.com` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`   | Clerk public key       | `pk_test_...`                                |
| `CLERK_SECRET_KEY`                    | Clerk secret key       | `sk_test_...`                                |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL`       | Sign in page path      | `/sign-in`                                   |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL`       | Sign up page path      | `/sign-up`                                   |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Redirect after sign in | `/`                                          |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Redirect after sign up | `/`                                          |

### Server Environment Variables (Render)

| Variable                | Description               | Example                       |
| ----------------------- | ------------------------- | ----------------------------- |
| `MONGODB_URI`           | MongoDB connection string | `mongodb+srv://...`           |
| `CLERK_PUBLISHABLE_KEY` | Clerk public key          | `pk_test_...`                 |
| `CLERK_SECRET_KEY`      | Clerk secret key          | `sk_test_...`                 |
| `PORT`                  | Server port               | `4001`                        |
| `FRONTEND_URL`          | Frontend URL for CORS     | `https://your-app.vercel.app` |
| `NODE_ENV`              | Environment mode          | `production`                  |

## Troubleshooting

### Common Issues

1. **CORS Errors**

   - Ensure `FRONTEND_URL` in server matches your Vercel URL
   - Check Clerk dashboard for correct origins

2. **Environment Variables**

   - All `NEXT_PUBLIC_*` variables must be set for client-side access
   - Ensure no trailing slashes in URLs

3. **Build Failures**

   - Check all dependencies are in `package.json`
   - Verify Node.js version compatibility

4. **API Connection Issues**
   - Verify `NEXT_PUBLIC_API_URL` points to correct Render URL
   - Check server logs in Render dashboard

## Monitoring

- **Render**: Check logs in Render dashboard
- **Vercel**: Monitor function logs and analytics
- **Database**: Monitor MongoDB Atlas metrics
- **Authentication**: Check Clerk dashboard for user activity

## Updates

To update your deployment:

1. Push changes to your GitHub repository
2. Vercel and Render will automatically redeploy
3. For environment variable changes, update them in respective dashboards and redeploy
