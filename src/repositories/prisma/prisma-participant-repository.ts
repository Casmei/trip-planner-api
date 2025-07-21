import { prisma } from "../../libs/prisma";
import type { ParticipantsRepository } from "../participants-respository";

export class PrismaParticipantRepository implements ParticipantsRepository {
  async findManyByTripId(tripId: string) {
    return await prisma.participant.findMany({
      where: {
        trip_id: tripId,
        is_owner: false,
      },
    });
  }
}
