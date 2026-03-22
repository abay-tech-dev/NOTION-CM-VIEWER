import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InstaGrid Viewer",
  description: "Instagram-style viewer powered by Notion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
