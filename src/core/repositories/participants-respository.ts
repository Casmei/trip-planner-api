import type {
  Participant,
  Prisma,
} from "../../infrastructure/database/generated/prisma";

export interface ParticipantsRepository {
  findManyByTripId(tripId: string): Promise<Participant[]>;
  findById(participantId: string): Promise<Participant | null>;
  confirm(participantId: string): Promise<Participant | null>;
  create(data: Prisma.ParticipantUncheckedCreateInput): Promise<Participant>;
  existsByEmailAndTripId(data: {
    email: string;
    tripId: string;
  }): Promise<boolean>;
}
