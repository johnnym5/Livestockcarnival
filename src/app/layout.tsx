import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: {
    default: "National Livestock Carnival 2026 | Abuja Pilot Expo & Trade Showcase",
    template: "%s | Livestock Carnival 2026",
  },
  description:
    "Official public portal for the 2026 Renewed Hope National Livestock Carnival. Hosted by the Federal Government of Nigeria at Old Parade Ground, Abuja. Featuring cattle, camels, goats, sheep, poultry, and aquaculture. November 21-23, 2026.",
  keywords: [
    "livestock carnival",
    "Nigeria",
    "agri-expo",
    "Abuja",
    "durbar",
    "livestock festival",
    "NHESICS",
    "cattle",
    "agri-export",
  ],
  icons: {
    icon: "/assets/logo.jpeg",
    shortcut: "/assets/logo.jpeg",
    apple: "/assets/logo.jpeg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen flex flex-col bg-canvas text-charcoal font-sans">
        <SmoothScroll>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
