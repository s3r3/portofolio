
import type { Metadata } from "next";
import { Fira_Code, } from "next/font/google";
import "./globals.css";

export const firaC = Fira_Code({
  weight: "400",
  style: "normal",
});


// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

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