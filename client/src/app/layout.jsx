import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { AppLayout } from "@/components/layout/app-layout";
import "./globals.css";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FinTrack",
  description: "Track your personal finances with ease",
};

function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full bg-finance-cardBg">
      <body className={`${inter.className} h-full`}>
        <ClerkProvider
          appearance={{
            elements: {
              modalContent: "bg-white/[0.97] shadow-2xl border border-gray-200/50 backdrop-blur-xl rounded-2xl",
              modalBackdrop: "bg-finance-cardBg/80 backdrop-blur-sm",
              formButtonPrimary:
                "bg-finance-primary hover:bg-finance-hover text-white normal-case font-semibold shadow-lg shadow-finance-primary/20 hover:shadow-xl hover:shadow-finance-primary/30 transition-all duration-300 rounded-xl py-3",
              formFieldLabel: "text-gray-700 font-medium text-sm",
              formFieldInput: "text-gray-900 bg-white border-gray-300 focus:border-finance-primary focus:ring-2 focus:ring-finance-primary/20 rounded-lg transition-all duration-200",
              footerActionText: "text-gray-600 text-sm",
              footerActionLink: "text-finance-primary hover:text-finance-hover font-semibold transition-colors",
              headerTitle: "text-gray-900 font-bold text-2xl",
              headerSubtitle: "text-gray-600 text-base",
              socialButtonsBlockButton: "text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 normal-case font-medium transition-all duration-200 rounded-lg",
              socialButtonsBlockButtonText: "text-gray-700 font-medium",
              dividerLine: "bg-gray-200",
              dividerText: "text-gray-500 text-sm font-medium",
              formFieldAction: "text-finance-primary hover:text-finance-hover font-medium transition-colors",
              formFieldErrorText: "text-red-600 text-sm",
              identityPreviewText: "text-gray-900",
              identityPreviewEditButton: "text-finance-primary hover:text-finance-hover transition-colors",
              formFieldInputShowPasswordButton: "text-gray-500 hover:text-gray-700 transition-colors",
              otpCodeFieldInput: "border-gray-300 text-gray-900 focus:border-finance-primary focus:ring-2 focus:ring-finance-primary/20 rounded-lg",
            },
          }}
        >
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
              </div>
            }
          >
            <AppLayout>{children}</AppLayout>
          </Suspense>
        </ClerkProvider>
      </body>
    </html>
  );
}

export default RootLayout;
