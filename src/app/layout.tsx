import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Best First Date",
  description: "The best first date you never planned",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  );
}
