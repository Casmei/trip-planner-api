import type { Trip } from "../../infrastructure/database/generated/prisma";
import type { MailQueue } from "../contracts/mail-queue-interface";
import type { TripsRepository } from "../repositories/trips-respository";
import { InvalidTripEndDateError } from "./errors/invalid-trip-end-date-error";
import { InvalidTripStartDateError } from "./errors/invalid-trip-start-date-error";

interface CreateTripUseCaseRequest {
  destination: string;
  starts_at: Date;
  ends_at: Date;
  owner_name: string;
  owner_email: string;
  emails_to_invite: string[];
}

type CreateTripUseCaseResponse = { trip: Trip };

export class CreateTripUseCase {
  constructor(
    private tripsRepository: TripsRepository,
    private mailQueue: MailQueue,
  ) {}

  async execute({
    destination,
    starts_at,
    ends_at,
    owner_name,
    owner_email,
    emails_to_invite,
  }: CreateTripUseCaseRequest): Promise<CreateTripUseCaseResponse> {
    const TODAY = new Date();

    if (starts_at < TODAY) {
      throw new InvalidTripStartDateError();
    }
    if (ends_at <= starts_at) {
      throw new InvalidTripEndDateError();
    }

    const participants = this.buildParticipants(
      { name: owner_name, email: owner_email },
      emails_to_invite,
    );

    const trip = await this.tripsRepository.create({
      destination,
      starts_at,
      ends_at,
      participants,
    });

    //todo: Criar uma TripCreatedEvent e enviar o e-mail lá dentro
    await this.mailQueue.sendTripConfirmationMail({
      tripId: trip.id,
      destination,
      starts_at,
      ends_at,
      owner_name,
      owner_email,
    });

    return { trip };
  }

  private buildParticipants(
    owner: { name: string; email: string },
    invitees: string[],
  ) {
    const data = [
      {
        email: owner.email,
        name: owner.name,
        is_owner: true,
        is_confirmed: true,
      },
      ...invitees.map((email) => ({
        email,
        is_owner: false,
        is_confirmed: false,
      })),
    ];

    return {
      createMany: {
        data,
      },
    };
  }
}
