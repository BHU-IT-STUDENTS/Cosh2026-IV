import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default async function Icon() {
  const logoBytes = await fetch(new URL('../public/wedding-logo.png', import.meta.url)).then((response) => response.arrayBuffer());
  const logo = new Blob([logoBytes], { type: 'image/png' });
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', overflow: 'hidden', background: '#fffdf7' }}>
      <img src={logo} width="64" height="64" style={{ objectFit: 'cover' }} />
    </div>,
    { ...size },
  );
}
