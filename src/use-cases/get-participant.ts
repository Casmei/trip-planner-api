import type { Participant } from "../generated/prisma";
import type { ParticipantsRepository } from "../repositories/participants-respository";
import type { TripsRepository } from "../repositories/trips-respository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface GetParticipantUseCaseRequest {
  tripId: string;
  participantId: string;
}

type GetParticipantUseCaseResponse = {
  participant: Participant;
};

export class GetParticipantUseCase {
  constructor(
    private tripsRepository: TripsRepository,
    private participantsRepository: ParticipantsRepository,
  ) {}

  async execute({
    tripId,
    participantId,
  }: GetParticipantUseCaseRequest): Promise<GetParticipantUseCaseResponse> {
    const trip = await this.tripsRepository.findById(tripId);

    if (!trip) {
      throw new ResourceNotFoundError();
    }

    const participant =
      await this.participantsRepository.findById(participantId);

    if (!participant) {
      throw new ResourceNotFoundError();
    }

    return { participant };
  }
}
