import type { Participant, Prisma } from "../generated/prisma";

export interface ParticipantsRepository {
  findManyByTripId(tripId: string): Promise<Participant[]>;
  create(data: Prisma.ParticipantUncheckedCreateInput): Promise<Participant>;
}
