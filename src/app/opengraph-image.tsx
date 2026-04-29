import { ImageResponse } from "next/og"

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

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
          background:
            "linear-gradient(120deg, rgb(10, 10, 10) 0%, rgb(44, 44, 44) 55%, rgb(117, 117, 117) 100%)",
          color: "white",
          padding: "72px",
        }}
      >
        <div style={{ fontSize: 36, letterSpacing: 4, opacity: 0.9 }}>NAIROBI EATS</div>
        <div style={{ fontSize: 80, fontWeight: 700, marginTop: 24, lineHeight: 1.1 }}>
          Restaurant Reviews
        </div>
        <div style={{ fontSize: 40, marginTop: 18, opacity: 0.9 }}>Nairobi and beyond</div>
      </div>
    ),
    {
      ...size,
    },
  )
}
