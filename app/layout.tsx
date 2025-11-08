import type React from "react";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { InsightsProvider } from "./providers";

export const metadata: Metadata = {
  title: "Brand Insights App",
  description: "Analyze your brand's marketing performance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <InsightsProvider>{children}</InsightsProvider>
        <Analytics />
      </body>
    </html>
  );
}
