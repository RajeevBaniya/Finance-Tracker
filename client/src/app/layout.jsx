import "./globals.css";
import { AppLayout } from "@/components/layout/app-layout";

export const metadata = {
  title: "Finance Tracker",
  description: "Track your personal finances with ease",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
