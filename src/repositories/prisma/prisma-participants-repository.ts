import type { Prisma } from "../../generated/prisma";
import { prisma } from "../../libs/prisma";
import type { ParticipantsRepository } from "../participants-respository";

export class PrismaParticipantsRepository implements ParticipantsRepository {
  async findById(participantId: string) {
    return await prisma.participant.findUnique({
      where: { id: participantId },
    });
  }

  async confirm(participantId: string) {
    return await prisma.participant.update({
      where: { id: participantId },
      data: { is_confirmed: true },
    });
  }

  async create(data: Prisma.ParticipantUncheckedCreateInput) {
    return await prisma.participant.create({
      data,
    });
  }

  async existsByEmailAndTripId(data: { email: string; tripId: string }) {
    return !!(await prisma.participant.count({
      where: {
        email: data.email,
        trip_id: data.tripId,
      },
    }));
  }

  async findManyByTripId(tripId: string) {
    return await prisma.participant.findMany({
      where: {
        trip_id: tripId,
        is_owner: false,
      },
    });
  }
}
