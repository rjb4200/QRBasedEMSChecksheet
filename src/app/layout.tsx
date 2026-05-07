import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "qrCheckoff | Winchester Fire Department",
  description: "QR-driven EMS asset and compliance tracker for Winchester Fire-EMS.",
  applicationName: "qrCheckoff",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.jpg",
    apple: "/icon.jpg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "qrCheckoff",
  },
};

export const viewport: Viewport = {
  themeColor: "#b91c1c",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
