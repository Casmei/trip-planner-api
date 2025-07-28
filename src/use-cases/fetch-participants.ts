import type { Participant } from "../generated/prisma";
import type { ParticipantsRepository } from "../repositories/participants-respository";
import type { TripsRepository } from "../repositories/trips-respository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface FetchParticipantsUseCaseRequest {
  trip_id: string;
}

type FetchParticipantsUseCaseResponse = {
  participants: Participant[];
};

export class FetchParticipantsUseCase {
  constructor(
    private tripsRepository: TripsRepository,
    private participantsRepository: ParticipantsRepository,
  ) {}

  async execute({
    trip_id,
  }: FetchParticipantsUseCaseRequest): Promise<FetchParticipantsUseCaseResponse> {
    const trip = await this.tripsRepository.findById(trip_id);

    if (!trip) {
      throw new ResourceNotFoundError();
    }

    const participants =
      await this.participantsRepository.findManyByTripId(trip_id);

    return { participants };
  }
}
