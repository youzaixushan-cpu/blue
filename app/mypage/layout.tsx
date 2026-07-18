import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "マイページ",
  description: "プロフィールや設定を確認できるマイページです。",
};

export default function MyPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
