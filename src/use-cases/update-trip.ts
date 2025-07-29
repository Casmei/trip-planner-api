import type { Trip } from "../generated/prisma";
import type { TripsRepository } from "../repositories/trips-respository";
import { InvalidTripEndDateError } from "./errors/invalid-trip-end-date-error";
import { InvalidTripStartDateError } from "./errors/invalid-trip-start-date-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface UpdateTripUseCaseRequest {
  trip_id: string;
  starts_at: Date;
  ends_at: Date;
  destination: string;
}

type UpdateTripUseCaseResponse = { trip: Trip };

export class UpdateTripUseCase {
  constructor(private tripsRepository: TripsRepository) {}

  async execute({
    destination,
    starts_at,
    ends_at,
    trip_id,
  }: UpdateTripUseCaseRequest): Promise<UpdateTripUseCaseResponse> {
    const trip = await this.tripsRepository.findById(trip_id);

    if (!trip) {
      throw new ResourceNotFoundError();
    }

    const TODAY = new Date();

    if (starts_at < TODAY) {
      throw new InvalidTripStartDateError();
    }
    if (ends_at <= starts_at) {
      throw new InvalidTripEndDateError();
    }

    const updatedTrip = await this.tripsRepository.update(
      { id: trip.id },
      {
        destination,
        starts_at,
        ends_at,
      },
    );

    return { trip: updatedTrip };
  }
}
