import { z } from 'zod';

export const guestSchema = z.object({
  full_name: z.string().trim().min(2, 'Enter the guest’s full name.').max(120),
  designation: z.string().trim().max(120).optional().or(z.literal('')),
  table_number: z.string().trim().min(1, 'Table is required.').max(32),
  seat_number: z.string().trim().min(1, 'Seat is required.').max(32),
  email: z.string().trim().email('Enter a valid email address.').optional().or(z.literal('')),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  photo_path: z.string().max(300).optional().nullable(),
});
