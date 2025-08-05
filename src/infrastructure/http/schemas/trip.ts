import { z } from "zod";

export const createTripSchema = z.object({
  destination: z.string().min(4),
  starts_at: z.coerce.date(),
  ends_at: z.coerce.date(),
  owner_name: z.string(),
  owner_email: z.email(),
  emails_to_invite: z.array(z.email()),
});

export const updateTripParamsSchema = z.object({
  tripId: z.uuid(),
});

export const updateTripBodySchema = z.object({
  destination: z.string().min(4),
  starts_at: z.coerce.date(),
  ends_at: z.coerce.date(),
});

export const confirmTripParamsSchema = z.object({
  tripId: z.uuid(),
});

export const getTripDetailsParamsSchema = z.object({
  tripId: z.uuid(),
});

export const tripSchema = z.object({
  id: z.uuid(),
  destination: z.string(),
  starts_at: z.date(),
  ends_at: z.date(),
  is_confirmed: z.boolean(),
  created_at: z.date(),
});

export const createInviteParamsSchema = z.object({
  tripId: z.string().uuid(),
});

export const createInviteBodySchema = z.object({
  email: z.string().email(),
});

export type CreateInviteParams = z.infer<typeof createInviteParamsSchema>;
export type CreateInviteBody = z.infer<typeof createInviteBodySchema>;
export type GetTripDetailsParams = z.infer<typeof getTripDetailsParamsSchema>;
export type Trip = z.infer<typeof tripSchema>;
export type ConfirmTripParams = z.infer<typeof confirmTripParamsSchema>;
export type CreateTripInput = z.infer<typeof createTripSchema>;
export type UpdateTripParams = z.infer<typeof updateTripParamsSchema>;
export type UpdateTripBody = z.infer<typeof updateTripBodySchema>;
