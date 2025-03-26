import type { Metadata } from "next";
import { Fira_Code } from "next/font/google";
import "./globals.css";

const firaC = Fira_Code({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className={`${firaC.className} antialiased `}>{children}</body>
    </html>
  );
}