import Image from 'next/image';
import Link from 'next/link';

export function Brand({ compact = false }: { compact?: boolean }) {
  return <Link href="/" className="brand" aria-label="CoSh2026 home">
    <span className="brand-seal"><Image src="/wedding-logo.png" alt="Comfort Weds Shammah wedding logo" width={64} height={64} priority /></span>
    {!compact && <span><b>CoSh<span>2026</span></b><small>Comfort Weds Shammah</small></span>}
  </Link>;
}
