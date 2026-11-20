import { ImageResponse } from "next/og";

export const alt = "Vaishnavi Tikke — Technical creator, FDE & growth";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadFont(family: string, italic: boolean): Promise<ArrayBuffer | null> {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=${family}:ital@${italic ? 1 : 0}`, {
        headers: { "User-Agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 Version/5.0.5 Safari/533.21.1" },
      })
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    return await (await fetch(url)).arrayBuffer();
  } catch {
    return null;
  }
}

export default async function Image() {
  const [regular, italic] = await Promise.all([loadFont("Instrument+Serif", false), loadFont("Instrument+Serif", true)]);
  const fonts = [
    regular && { name: "Instrument Serif", data: regular, style: "normal" as const, weight: 400 as const },
    italic && { name: "Instrument Serif", data: italic, style: "italic" as const, weight: 400 as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; style: "normal" | "italic"; weight: 400 }[];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#F7F6F2",
          color: "#171717",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 72px",
          fontFamily: "Instrument Serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 22, letterSpacing: 2, color: "#77736D", fontFamily: "sans-serif" }}>
          <div style={{ width: 12, height: 12, background: "#263653", marginRight: 14 }} />
          TECHNICAL CREATOR · FDE · GROWTH
        </div>
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 0.85, letterSpacing: -6 }}>
          <div style={{ fontSize: 230 }}>Vaishnavi</div>
          <div style={{ fontSize: 230, fontStyle: "italic", color: "#263653", marginLeft: 120 }}>Tikke</div>
        </div>
        <div style={{ display: "flex", borderTop: "2px solid #171717", paddingTop: 18, fontSize: 36, fontStyle: "italic", color: "#263653" }}>
          AI × Developer Tools × GTM
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
