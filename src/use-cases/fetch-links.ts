import type { Link } from "../generated/prisma";
import type { LinksRepository } from "../repositories/links-respository";
import type { TripsRepository } from "../repositories/trips-respository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface FetchLinksUseCaseRequest {
  trip_id: string;
}

type FetchLinksUseCaseResponse = {
  links: Link[];
};

export class FetchLinksUseCase {
  constructor(
    private tripsRepository: TripsRepository,
    private linksRepository: LinksRepository,
  ) {}

  async execute({
    trip_id,
  }: FetchLinksUseCaseRequest): Promise<FetchLinksUseCaseResponse> {
    const trip = await this.tripsRepository.findById(trip_id);

    if (!trip) {
      throw new ResourceNotFoundError();
    }

    const links = await this.linksRepository.findManyByTripId(trip_id);

    return { links };
  }
}
