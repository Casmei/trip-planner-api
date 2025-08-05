import type { MailQueue } from "../contracts/mail-queue-interface";
import type { ParticipantsRepository } from "../repositories/participants-respository";
import type { TripsRepository } from "../repositories/trips-respository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface ConfirmTripUseCaseRequest {
  tripId: string;
}

type ConfirmTripUseCaseResponse = boolean;

export class ConfirmTripUseCase {
  constructor(
    private tripsRepository: TripsRepository,
    private participantsRepository: ParticipantsRepository,
    private mailQueue: MailQueue,
  ) {}

  async execute({
    tripId,
  }: ConfirmTripUseCaseRequest): Promise<ConfirmTripUseCaseResponse> {
    const trip = await this.tripsRepository.findById(tripId);

    if (!trip) {
      throw new ResourceNotFoundError();
    }

    if (trip.is_confirmed) {
      return true;
    }

    await this.tripsRepository.confirm(tripId);

    const participants =
      await this.participantsRepository.findManyByTripId(tripId);

    //todo: Criar uma TripConfirmedEvent e enviar o e-mail lá dentro
    await this.mailQueue.sendTripParticipantsConfirmationMail({
      participants,
      trip,
    });

    return true;
  }
}
