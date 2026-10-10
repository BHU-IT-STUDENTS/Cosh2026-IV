export const appUrl = () => process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
export const verificationUrl = (token: string) => `${appUrl().replace(/\/$/, '')}/verify/${token}`;

export function displaySeat(value: string) { return value.padStart(2, '0'); }
