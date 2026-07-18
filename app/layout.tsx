import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./layout.scss";
import { SquadProvider } from "@/lib/squad-context";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { getAllPlayers } from "@/lib/db/players";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SAMURAI BLUE FAN HUB",
  description: "日本代表ファンのための非公式ファンサイト（UI/UXモックアップ）",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const players = await getAllPlayers();

  return (
    <html lang="ja" className={`${geistSans.variable} ${geistMono.variable} app-shell`}>
      <body className="app-shell__body">
        <SquadProvider players={players}>
          <TooltipProvider delayDuration={150}>
            <Header />
            <main className="app-shell__main">{children}</main>
            <BottomNav />
            <Toaster position="top-center" />
          </TooltipProvider>
        </SquadProvider>
      </body>
    </html>
  );
}
