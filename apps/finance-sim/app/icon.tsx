import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "linear-gradient(135deg, #2F4538, #4A7C5F)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* 새싹 + 원화 기호 */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C8.5 2 6 5 6 8c0 2.5 1.5 4.5 3.5 5.5V22h5v-8.5C16.5 12.5 18 10.5 18 8c0-3-2.5-6-6-6z"
            fill="white"
            opacity="0.9"
          />
          <path
            d="M9.5 13.5C7 12 5 9.5 5 7c0-1 .2-2 .6-2.8C3.5 5.5 2 7.5 2 10c0 3 2 5.5 5 6.5l2.5-3z"
            fill="white"
            opacity="0.5"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
