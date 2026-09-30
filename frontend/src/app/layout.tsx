import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Elicit Interview - Environment Check",
  description:
    "Verify your development environment is ready for the interview",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
