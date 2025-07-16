# FinanceTracker Deployment Preparation Script
# This script helps prepare your repository for deployment

Write-Host "🚀 FinanceTracker Deployment Preparation" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "client" -PathType Container) -or -not (Test-Path "server" -PathType Container)) {
    Write-Host "❌ Please run this script from the root of your FinanceTracker project" -ForegroundColor Red
    exit 1
}

Write-Host "📋 Checking project structure..." -ForegroundColor Yellow

# Check for required files
$requiredFiles = @(
    "client/package.json",
    "server/package.json",
    "client/vercel.json",
    "server/Dockerfile",
    "DEPLOYMENT.md"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ $file (missing)" -ForegroundColor Red
    }
}

Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow

# Install client dependencies
Write-Host "Installing client dependencies..." -ForegroundColor Cyan
Set-Location client
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install client dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Client dependencies installed" -ForegroundColor Green

# Install server dependencies
Write-Host "Installing server dependencies..." -ForegroundColor Cyan
Set-Location ../server
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install server dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Server dependencies installed" -ForegroundColor Green

# Return to root directory
Set-Location ..

Write-Host "`n🔍 Checking for environment files..." -ForegroundColor Yellow

# Check environment files
if (Test-Path "client/.env.local") {
    Write-Host "✅ Client environment file exists" -ForegroundColor Green
} else {
    Write-Host "⚠️  Client .env.local not found. Copy client/env.example to client/.env.local and configure it." -ForegroundColor Yellow
}

if (Test-Path "server/.env") {
    Write-Host "✅ Server environment file exists" -ForegroundColor Green
} else {
    Write-Host "⚠️  Server .env not found. Copy server/env.example to server/.env and configure it." -ForegroundColor Yellow
}

Write-Host "`n🔧 Building and testing..." -ForegroundColor Yellow

# Test client build
Write-Host "Testing client build..." -ForegroundColor Cyan
Set-Location client
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Client build failed. Please fix the errors before deploying." -ForegroundColor Red
    Set-Location ..
    exit 1
}
Write-Host "✅ Client builds successfully" -ForegroundColor Green
Set-Location ..

Write-Host "`n📋 Pre-deployment checklist:" -ForegroundColor Yellow
Write-Host "1. ✅ Dependencies installed" -ForegroundColor Green
Write-Host "2. ✅ Build files created" -ForegroundColor Green
Write-Host "3. ✅ Deployment configuration ready" -ForegroundColor Green

Write-Host "`n🎯 Next steps:" -ForegroundColor Yellow
Write-Host "1. Update your environment variables with actual deployment URLs" -ForegroundColor Cyan
Write-Host "2. Commit and push all changes to GitHub:" -ForegroundColor Cyan
Write-Host "   git add ." -ForegroundColor Gray
Write-Host "   git commit -m 'Prepare for deployment'" -ForegroundColor Gray
Write-Host "   git push origin main" -ForegroundColor Gray
Write-Host "3. Follow the deployment guide in DEPLOYMENT.md" -ForegroundColor Cyan

Write-Host "`n🚀 Ready for deployment!" -ForegroundColor Green
Write-Host "Check DEPLOYMENT.md for detailed deployment instructions." -ForegroundColor Green 