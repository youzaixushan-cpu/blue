import type { Metadata } from "next";
import { Geist, Geist_Mono, Anton } from "next/font/google";
import "./globals.css";
import "./layout.scss";
import { SessionProvider } from "next-auth/react";
import { SquadProvider } from "@/lib/squad-context";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Footer } from "@/components/layout/footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { getAllPlayers } from "@/lib/db/players";
import { auth } from "@/lib/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ホームページの見出し・数字用の太く角ばった見出し書体（まずホームだけの試験導入）。
// 和文グリフは持たないため、CSS側でGeist Sansへのフォールバックを必ず併記する。
const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "BlueScout",
    template: "%s | BlueScout",
  },
  description:
    "日本代表ファンのための非公式ファンサイト。選手情報・試合結果・あなたの26人・AI代表予想・みんなの代表を発信しています。",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [players, session] = await Promise.all([getAllPlayers(), auth()]);

  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} app-shell`}
    >
      <body className="app-shell__body">
        <SessionProvider session={session}>
          <SquadProvider players={players}>
            <TooltipProvider delayDuration={150}>
              <Header />
              <main className="app-shell__main">
                {children}
                <Footer />
              </main>
              <BottomNav />
              <Toaster position="top-center" />
            </TooltipProvider>
          </SquadProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
