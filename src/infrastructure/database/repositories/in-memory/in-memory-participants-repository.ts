import { randomUUID } from "node:crypto";
import type { ParticipantsRepository } from "../../../../core/repositories/participants-respository";
import type { Participant, Prisma } from "../../generated/prisma";

export class InMemoryParticipantsRespository implements ParticipantsRepository {
  public items: Participant[] = [];

  async findManyByTripId(tripId: string) {
    return this.items.filter((item) => item.trip_id === tripId);
  }

  async confirm(participantId: string) {
    const participantIndex = this.items.findIndex(
      (item) => item.id === participantId,
    );

    if (participantIndex >= 0) {
      this.items[participantIndex].is_confirmed = true;

      return this.items[participantIndex];
    }

    return null;
  }

  async findById(participantId: string) {
    const participant = this.items.find((item) => item.id === participantId);

    if (!participant) {
      return null;
    }

    return participant;
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

  async existsByEmailAndTripId(data: { email: string; tripId: string }) {
    return this.items.some(
      (item) => item.email === data.email && item.trip_id === data.tripId,
    );
  }
}
