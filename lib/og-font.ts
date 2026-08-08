// next/og（satori）はwoff2に非対応でttf/otfのみ扱えるため、Google Fonts CSS APIに
// 古いブラウザのUser-Agentを送ってttf形式のレスポンスを引き出す（woff2は新しいUA向けにしか配信されない）。
// text= に必要な文字だけ渡すことで、Noto Sans JPフル書体を同梱せず軽量に済ませる。
const LEGACY_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.6; rv:2.0.1) Gecko/20100101 Firefox/4.0.1";

export async function loadNotoSansJP(text: string, weight: 400 | 700): Promise<ArrayBuffer | null> {
  const uniqueChars = Array.from(new Set(Array.from(text))).join("");
  if (!uniqueChars) return null;

  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@${weight}&text=${encodeURIComponent(uniqueChars)}`;
    const css = await fetch(cssUrl, { headers: { "User-Agent": LEGACY_UA } }).then((res) => res.text());
    const fontUrl = css.match(/src:\s*url\(([^)]+)\)\s*format\('(?:truetype|opentype)'\)/)?.[1];
    if (!fontUrl) return null;

    const fontRes = await fetch(fontUrl);
    return await fontRes.arrayBuffer();
  } catch {
    return null;
  }
}
