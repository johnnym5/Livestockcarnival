import type { Metadata } from "next";
import "./globals.css";
import SiteFrame from "@/components/SiteFrame";

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
    icon: "/assets/branding/carnival-logo-solid.jpeg",
    shortcut: "/assets/branding/carnival-logo-solid.jpeg",
    apple: "/assets/branding/carnival-logo-solid.jpeg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen flex flex-col bg-canvas text-charcoal font-sans">
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}
