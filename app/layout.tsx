import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["500", "600", "700"],
  display: "swap",
});

const SITE_URL = "https://yourapp.com"; // TODO: replace with real domain
const SITE_NAME = "Baseman";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Find your next role, matched by AI`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Browse jobs, see your real match score, and get your resume tailored by AI before you apply. Stop guessing if you're qualified.",
  keywords: [
    "job search",
    "AI resume optimization",
    "job matching",
    "resume builder",
    "interview practice",
    "career platform",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  applicationName: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Find your next role, matched by AI`,
    description:
      "Browse jobs, see your real match score, and get your resume tailored by AI before you apply.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Find your next role, matched by AI`,
    description:
      "Browse jobs, see your real match score, and get your resume tailored by AI before you apply.",
    images: ["/og-image.png"],
    creator: "@yourhandle", // TODO
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#134544",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-white text-ink antialiased">{children}</body>
    </html>
  );
}