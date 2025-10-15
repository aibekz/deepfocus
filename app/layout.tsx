import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://deepfocus.nvix.io"),
  title: "DeepFocus - Pomodoro Timer",
  description:
    "DeepFocus is a modern Pomodoro timer from Nvix I/O - boost your productivity with focused work sessions and strategic breaks. Free, fast, and effective.",
  keywords: [
    "pomodoro timer",
    "productivity timer",
    "focus timer",
    "work timer",
    "break timer",
    "time management",
    "pomodoro technique",
    "focus sessions",
    "productivity app",
    "work sessions",
    "study timer",
    "concentration timer",
  ],
  authors: [{ name: "Nvix I/O" }],
  creator: "Nvix I/O",
  publisher: "Nvix I/O",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://deepfocus.nvix.io",
    title: "DeepFocus - Pomodoro Timer",
    description:
      "Boost your productivity with DeepFocus - a modern Pomodoro timer from Nvix I/O. Focus, work, and achieve more with strategic time management.",
    siteName: "DeepFocus",
    images: [
      {
        url: "https://deepfocus.nvix.io/og-deepfocus.png",
        width: 1200,
        height: 630,
        alt: "DeepFocus - Pomodoro Timer Interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DeepFocus - Pomodoro Timer",
    description:
      "Boost your productivity with DeepFocus - a modern Pomodoro timer from Nvix I/O. Focus, work, and achieve more.",
    images: ["https://deepfocus.nvix.io/og-deepfocus.png"],
  },
    icons: {
      icon: "/favicon.svg",
      apple: "/apple-touch-icon.png",
    },
  category: "productivity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "DeepFocus",
    description:
      "A free Pomodoro timer application to boost productivity with focused work sessions and strategic breaks from Nvix I/O",
    url: "https://deepfocus.nvix.io",
    applicationCategory: "ProductivityApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    creator: {
      "@type": "Organization",
      name: "Nvix I/O",
      url: "https://nvix.io",
    },
    featureList: [
      "Pomodoro timer",
      "Focus sessions",
      "Break timers",
      "Productivity tracking",
      "Custom durations",
      "Mobile-friendly design",
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Safe - using JSON.stringify on controlled data
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} antialiased`}
      >
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
