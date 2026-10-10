import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

// Keep this route self-contained: build-time relative image URLs do not resolve in Vercel.
export default function Icon() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: '#153d32', color: '#fffdf7', border: '3px solid #b79055', fontSize: 22, fontStyle: 'italic' }}>
      C♡S
    </div>,
    { ...size },
  );
}
