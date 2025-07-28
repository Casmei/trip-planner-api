import type { ParticipantsRepository } from "../repositories/participants-respository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface ConfirmParticipantUseCaseRequest {
  participantId: string;
}

type ConfirmParticipantUseCaseResponse = boolean;

export class ConfirmParticipantUseCase {
  constructor(private participantsRepository: ParticipantsRepository) {}

  async execute({
    participantId,
  }: ConfirmParticipantUseCaseRequest): Promise<ConfirmParticipantUseCaseResponse> {
    const participant =
      await this.participantsRepository.findById(participantId);

    if (!participant) {
      throw new ResourceNotFoundError();
    }

    if (participant.is_confirmed) {
      return true;
    }

    await this.participantsRepository.confirm(participantId);

    return true;
  }
}
