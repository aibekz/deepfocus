import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { ibmPlexMono, lora } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Simpli Focus - A Simple Pomodoro Timer",
  description:
    "Simpli Focus is a lightweight and user-friendly Pomodoro timer application designed to enhance your productivity.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${ibmPlexMono.variable} ${lora.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
