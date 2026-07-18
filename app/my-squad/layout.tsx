import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "あなたの26人",
  description: "登録選手に関係なく、自由にあなたの予想squadを組んでフォーメーションに配置できます。",
};

export default function MySquadLayout({ children }: { children: React.ReactNode }) {
  return children;
}
