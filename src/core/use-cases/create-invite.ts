import type { Participant } from "../../infrastructure/database/generated/prisma";
import type { MailQueue } from "../contracts/mail-queue-interface";
import type { ParticipantsRepository } from "../repositories/participants-respository";
import type { TripsRepository } from "../repositories/trips-respository";
import { ParticipantAlreadyInTripError } from "./errors/participant-already-in-trip-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface CreateInviteUseCaseRequest {
  tripId: string;
  participantEmail: string;
}

type CreateInviteUseCaseResponse = { participant: Participant };

export class CreateInviteUseCase {
  constructor(
    private participantsRepository: ParticipantsRepository,
    private tripsRepository: TripsRepository,
    private mailQueue: MailQueue,
  ) {}

  async execute({
    participantEmail,
    tripId,
  }: CreateInviteUseCaseRequest): Promise<CreateInviteUseCaseResponse> {
    const trip = await this.tripsRepository.findById(tripId);

    if (!trip) {
      throw new ResourceNotFoundError();
    }

    const alreadyInTrip =
      await this.participantsRepository.existsByEmailAndTripId({
        email: participantEmail,
        tripId,
      });

    if (alreadyInTrip) {
      throw new ParticipantAlreadyInTripError();
    }

    const participant = await this.participantsRepository.create({
      email: participantEmail,
      trip_id: tripId,
    });

    //todo: Criar uma TripConfirmedEvent e enviar o e-mail lá dentro
    await this.mailQueue.sendTripParticipantsConfirmationMail({
      participants: [participant],
      trip,
    });

    return { participant };
  }
}
