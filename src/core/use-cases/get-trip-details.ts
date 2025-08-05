import type { Trip } from "../../infrastructure/database/generated/prisma";
import type { TripsRepository } from "../repositories/trips-respository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface GetTripDetailsUseCaseRequest {
  tripId: string;
}

type GetTripDetailsUseCaseResponse = {
  trip: Trip;
};

export class GetTripDetailsUseCase {
  constructor(private tripsRepository: TripsRepository) {}

  async execute({
    tripId,
  }: GetTripDetailsUseCaseRequest): Promise<GetTripDetailsUseCaseResponse> {
    const trip = await this.tripsRepository.findById(tripId);

    if (!trip) {
      throw new ResourceNotFoundError();
    }

    return { trip };
  }
}
