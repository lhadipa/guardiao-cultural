import { ImageResponse } from "next/og";

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
          justifyContent: "center",
          padding: "80px 96px",
          background: "linear-gradient(135deg, #2f0f07, #8a3010)",
          color: "#f6ede0",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(201,154,62,0.5)",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2 4 5v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V5l-8-3Z"
                fill="#e3b957"
              />
            </svg>
          </div>
          <div style={{ fontSize: 28, fontWeight: 600, display: "flex" }}>
            Guardião Cultural
          </div>
        </div>

        <div
          style={{
            marginTop: 56,
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.05,
            maxWidth: 900,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>Do esquecimento</span>
          <span>ao registro.</span>
        </div>

        <div
          style={{
            marginTop: 32,
            fontSize: 28,
            color: "rgba(246,237,224,0.75)",
            maxWidth: 760,
            display: "flex",
          }}
        >
          Sistema de proteção preventiva ao patrimônio cultural
        </div>

        <div
          style={{
            marginTop: 56,
            fontSize: 22,
            color: "#e3b957",
            letterSpacing: 4,
            textTransform: "uppercase",
            display: "flex",
          }}
        >
          Minas Gerais · Brasil
        </div>
      </div>
    ),
    { ...size }
  );
}
