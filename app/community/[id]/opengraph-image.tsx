import { ImageResponse } from "next/og";
import { getCommunitySquadDetail } from "@/lib/db/community";
import { getFormationById } from "@/lib/data/formations";
import { squadTargetShortLabel } from "@/lib/squad-target";
import { loadNotoSansJP } from "@/lib/og-font";

export const alt = "予想布陣";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BRAND = "BlueScout";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await getCommunitySquadDetail(id);
  const formation = detail ? getFormationById(detail.formationId) : undefined;

  if (!detail || !formation) {
    return renderFallback();
  }

  const targetLabel = squadTargetShortLabel(detail.target);
  const slotById = new Map(formation.slots.map((s) => [s.id, s]));

  const text = [BRAND, targetLabel, formation.name, detail.title, detail.authorName, ...detail.members.map((m) => m.name)].join("");
  const [regular, bold] = await Promise.all([loadNotoSansJP(text, 400), loadNotoSansJP(text, 700)]);

  const fonts = [
    regular && { name: "Noto Sans JP", data: regular, weight: 400 as const, style: "normal" as const },
    bold && { name: "Noto Sans JP", data: bold, weight: 700 as const, style: "normal" as const },
  ].filter((f): f is NonNullable<typeof f> => Boolean(f));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px",
          background: "linear-gradient(135deg, #1e3a8a 0%, #0b1220 100%)",
          fontFamily: "Noto Sans JP",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", fontSize: 24, fontWeight: 700, color: "#93c5fd" }}>
            {targetLabel} ・ {formation.name}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 50,
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.2,
              maxWidth: "1000px",
            }}
          >
            {detail.title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            position: "relative",
            width: "100%",
            height: "320px",
            borderRadius: "20px",
            background: "#15803d",
          }}
        >
          {detail.members.map((member) => {
            const slot = slotById.get(member.slotId);
            if (!slot) return null;
            return (
              <div
                key={member.slotId}
                style={{
                  position: "absolute",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  left: `${slot.x}%`,
                  top: `${slot.y}%`,
                  marginLeft: "-60px",
                  marginTop: "-20px",
                  width: "120px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    width: "14px",
                    height: "14px",
                    borderRadius: "9999px",
                    background: "#ffffff",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    marginTop: "4px",
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#ffffff",
                    textAlign: "center",
                  }}
                >
                  {member.name}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                borderRadius: "9999px",
                background: "#3b82f6",
                color: "#ffffff",
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              {detail.authorName.slice(0, 1)}
            </div>
            <div style={{ display: "flex", fontSize: 20, color: "#e2e8f0" }}>{detail.authorName}</div>
          </div>
          <div style={{ display: "flex", fontSize: 26, fontWeight: 700, color: "#ffffff", letterSpacing: "1px" }}>
            {BRAND}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length > 0 ? fonts : undefined },
  );
}

function renderFallback() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1e3a8a 0%, #0b1220 100%)",
          fontSize: 64,
          fontWeight: 700,
          color: "#ffffff",
          letterSpacing: "2px",
        }}
      >
        {BRAND}
      </div>
    ),
    size,
  );
}
