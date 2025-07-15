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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full bg-finance-cardBg">
      <body className={`${inter.className} h-full`}>
        <ClerkProvider>
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
