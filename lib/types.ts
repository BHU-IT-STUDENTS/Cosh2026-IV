export type Role = 'admin' | 'officer';
export type GuestStatus = 'not_checked_in' | 'checked_in';
export type Guest = {
  id: string; vip_id: string; full_name: string; designation: string | null; photo_path: string | null;
  table_number: string; seat_number: string; email?: string | null; phone?: string | null;
  status: GuestStatus; first_checked_in_at: string | null; created_at: string;
};

export type Profile = { id: string; full_name: string | null; role: Role };
