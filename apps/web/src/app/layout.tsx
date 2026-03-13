import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";

import { GridBackground } from "@/components/background/grid-background";

import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Decision Intelligence OS",
  description:
    "Assess startup ideas, simulate 100 virtual companies, and turn uncertainty into experiments and execution plans.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} min-h-screen bg-background font-sans text-foreground antialiased`}
      >
        <GridBackground />
        <div className="relative isolate">{children}</div>
      </body>
    </html>
  );
}
