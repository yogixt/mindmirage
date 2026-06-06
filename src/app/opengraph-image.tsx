import { ImageResponse } from "next/og";
import { SITE } from "@/lib/constants";

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FFFFFF",
          color: "#0A0A0A",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ width: 80, height: 2, backgroundColor: "#C9A227" }} />
          <div style={{ fontSize: 28, color: "#B7410E", letterSpacing: 6 }}>
            ADVAITA SADHANA KUTIR · RISHIKESH
          </div>
          <div style={{ width: 80, height: 2, backgroundColor: "#C9A227" }} />
        </div>
        <div style={{ fontSize: 110, marginTop: 36, fontStyle: "italic" }}>
          {SITE.name}
        </div>
        <div style={{ fontSize: 34, marginTop: 28, color: "#525252" }}>
          {SITE.tagline}
        </div>
      </div>
    ),
    { ...size },
  );
}
