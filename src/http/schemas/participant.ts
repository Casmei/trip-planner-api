import { z } from "zod";

export const confirmParticipantParamsSchema = z.object({
  participantId: z.uuid(),
});

export const getParticipantParamsSchema = z.object({
  tripId: z.uuid(),
  participantId: z.uuid(),
});

export const participantSchema = z.object({
  id: z.uuid(),
  trip_id: z.uuid(),
  email: z.email(),
  name: z.string().nullable(),
  is_confirmed: z.boolean(),
  created_at: z.date(),
});

export const fetchParticipantsParamsSchema = z.object({
  tripId: z.uuid(),
});

export const fetchParticipantsResponseSchema = z.array(participantSchema);

export type FetchParticipantsParams = z.infer<
  typeof fetchParticipantsParamsSchema
>;
export type GetParticipantParams = z.infer<typeof getParticipantParamsSchema>;
export type Participant = z.infer<typeof participantSchema>;
export type ConfirmParticipantParams = z.infer<
  typeof confirmParticipantParamsSchema
>;
