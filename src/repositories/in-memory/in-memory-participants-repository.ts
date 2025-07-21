import { randomUUID } from "node:crypto";
import type { Participant, Prisma } from "../../generated/prisma";
import type { ParticipantsRepository } from "../participants-respository";

export class InMemoryParticipantsRespository implements ParticipantsRepository {
  public items: Participant[] = [];

  async findManyByTripId(tripId: string): Promise<Participant[]> {
    return this.items.filter((item) => item.trip_id === tripId);
  }

  async create(data: Prisma.ParticipantUncheckedCreateInput) {
    const participant = {
      id: data.id ?? randomUUID(),
      name: data.name ?? null,
      email: data.email,
      is_confirmed: data?.is_confirmed ?? false,
      is_owner: data?.is_owner ?? false,
      trip_id: data.trip_id,
    };

    this.items.push(participant);

    return participant;
  }
}
