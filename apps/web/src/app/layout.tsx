import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Loop — UQ events, one place",
  description:
    "Every UQ society, department, careers, and cultural event in one feed. Stop finding out about it after it happened.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}