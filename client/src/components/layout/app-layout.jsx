"use client";

import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import { Sidebar, MobileMenuButton } from "./sidebar";
import { FinancialProvider } from "@/features/financial/context/financial-context";
import { BudgetProvider } from "@/features/budget/context/budget-context";
import { UserProvider } from "@/context/user-context.jsx";
import { clearTokenCache } from "@/lib/api/api-client";
import { useEffect, Suspense, memo, useState } from "react";
import {
  DollarSign,
  PiggyBank,
  TrendingUp,
  ChartBar,
  Globe,
  LineChart,
  Calculator,
  Clock,
  Calendar,
  CircleDollarSign,
  Sparkles,
} from "lucide-react";
import { PageLoadingSpinner } from "@/components/ui/loading-spinner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Memoize the main content wrapper to prevent unnecessary re-renders
const MainContent = memo(function MainContent({ children }) {
  return (
    <main className="py-4 sm:py-6">
      <div className="px-3 sm:px-4 lg:px-8 max-w-7xl mx-auto">
        <Suspense fallback={<PageLoadingSpinner />}>{children}</Suspense>
      </div>
    </main>
  );
});

export function AppLayout({ children }) {
  const { isSignedIn, isLoaded, user } = useUser();

  // Clear token cache when user changes or signs out
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      clearTokenCache();
    }
  }, [isSignedIn, isLoaded]);

  // Show loading state while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-finance-cardBg flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Show sign-in page if user is not authenticated
  if (!isSignedIn) {
    return <SignInPage />;
  }

  return (
    <UserProvider>
      <FinancialProvider>
        <BudgetProvider>
          <div className="min-h-screen bg-finance-cardBg">
            <Sidebar />

            {/* Main content area */}
            <div className="lg:pl-64">
              {/* Mobile header */}
              <div className="sticky top-0 z-40 flex h-14 sm:h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-finance-cardBg px-4 shadow-sm lg:hidden">
                <MobileMenuButton />
                <div className="flex-1"></div>
                <UserButton />
              </div>

              {/* Desktop header with user button */}
              <div className="hidden lg:flex lg:items-center lg:justify-end lg:px-6 lg:py-4">
                <UserButton />
              </div>

              {/* Main content with Suspense boundary */}
              <MainContent>{children}</MainContent>
            </div>
          </div>
        </BudgetProvider>
      </FinancialProvider>
    </UserProvider>
  );
}

const SignInPage = memo(function SignInPage() {
  return (
    <div className="h-screen bg-finance-cardBg flex flex-col relative overflow-hidden">
      {/* Subtle geometric background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, #3B7DF1 1px, transparent 1px),
            linear-gradient(to bottom, #3B7DF1 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* Animated floating elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-finance-primary/30 rounded-full animate-float"></div>
      <div className="absolute top-40 right-20 w-3 h-3 bg-finance-primary/20 rounded-full animate-float-delayed"></div>
      <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-finance-primary/25 rounded-full animate-float-slow"></div>
      <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-finance-primary/20 rounded-full animate-float"></div>

      {/* Header */}
      <header className="relative z-10 w-full flex justify-between items-center px-6 py-4 sm:px-8 lg:px-12">
        <div className="flex items-center gap-3">
          <div className="relative">
            <LineChart className="h-7 w-7 sm:h-8 sm:w-8 text-finance-primary" strokeWidth={2.5} />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-finance-primary rounded-full"></div>
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            FinTrack
          </span>
        </div>

        <SignInButton mode="modal">
          <button className="lg:hidden bg-finance-primary hover:bg-finance-hover text-white px-5 py-2.5 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base shadow-lg shadow-finance-primary/20 hover:shadow-xl hover:shadow-finance-primary/30">
            Sign In
          </button>
        </SignInButton>
      </header>

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left side - Hero content */}
          <div className="space-y-6 lg:space-y-8">
            <div className="space-y-4">
              <div className="inline-block">
                <span className="text-finance-primary text-sm font-semibold tracking-wider uppercase px-3 py-1 bg-finance-primary/10 rounded-full border border-finance-primary/20">
                  Financial Management
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Take Control of
                <br />
                <span className="text-finance-primary">Your Finances</span>
              </h1>
              <p className="text-finance-secondary text-lg sm:text-xl max-w-xl leading-relaxed">
                Track your Finances with powerful insights, 
                budgeting tools and multi-currency support.
              </p>
            </div>

            {/* Feature grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FeatureCard 
                icon={<Calculator className="h-5 w-5" />}
                title="Smart Budgeting"
                description="Track budgets across categories"
              />
              <FeatureCard 
                icon={<ChartBar className="h-5 w-5" />}
                title="Visual Analytics"
                description="Interactive spending charts"
              />
              <FeatureCard 
                icon={<CircleDollarSign className="h-5 w-5" />}
                title="Savings Goals"
                description="Achieve financial milestones"
              />
              <FeatureCard 
                icon={<Globe className="h-5 w-5" />}
                title="Multi-Currency - 2"
                description="Support for global transactions"
              />
            </div>
          </div>

          {/* Right side - Auth card */}
          <div className="hidden lg:flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              <div className="bg-white/[0.03] backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl relative group hover:border-white/20 transition-all duration-500">
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-finance-primary/5 rounded-2xl blur-xl group-hover:bg-finance-primary/10 transition-all duration-500"></div>
                
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-finance-primary/30 rounded-tl-2xl"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-finance-primary/30 rounded-br-2xl"></div>
                
                <div className="relative space-y-6">
                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-finance-primary/10 rounded-xl mb-2 border border-finance-primary/20">
                      <LineChart className="h-7 w-7 text-finance-primary" strokeWidth={2.5} />
                    </div>
                    <h2 className="text-3xl font-bold text-white">
                      Get Started
                    </h2>
                    <p className="text-finance-secondary">
                      Begin your financial journey today
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <SignInButton mode="modal">
                      <button className="w-full bg-finance-primary hover:bg-finance-hover text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-finance-primary/20 hover:shadow-xl hover:shadow-finance-primary/30 hover:-translate-y-0.5">
                        Sign In / Sign Up
                      </button>
                    </SignInButton>

                    <div className="pt-4 border-t border-white/10">
                      <blockquote className="text-center">
                        <p className="text-finance-secondary italic text-sm leading-relaxed">
                          "A budget is telling your money where to go instead of wondering where it went."
                        </p>
                      </blockquote>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 px-6 sm:px-8 lg:px-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-finance-secondary text-sm">
          <p>FinTrack. Smart finance management.</p>
          <div className="flex gap-6">
            <button className="hover:text-white transition-colors">Privacy</button>
            <button className="hover:text-white transition-colors">Terms</button>
            <button className="hover:text-white transition-colors">Support</button>
          </div>
        </div>
      </footer>
    </div>
  );
});

const FeatureCard = memo(function FeatureCard({ icon, title, description }) {
  return (
    <div className="group bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-sm p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 p-2 bg-finance-primary/10 text-finance-primary rounded-lg group-hover:bg-finance-primary/20 transition-colors">
          {icon}
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-white text-sm">
            {title}
          </h3>
          <p className="text-finance-secondary text-xs leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
});
