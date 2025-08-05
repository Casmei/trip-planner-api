import type { Link } from "../../infrastructure/database/generated/prisma";
import type { LinksRepository } from "../repositories/links-respository";
import type { TripsRepository } from "../repositories/trips-respository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface CreateLinkUseCaseRequest {
  title: string;
  url: string;
  trip_id: string;
}

type CreateLinkUseCaseResponse = {
  link: Link;
};

export class CreateLinkUseCase {
  constructor(
    private tripsRepository: TripsRepository,
    private linksRepository: LinksRepository,
  ) {}

  async execute({
    trip_id,
    title,
    url,
  }: CreateLinkUseCaseRequest): Promise<CreateLinkUseCaseResponse> {
    const trip = await this.tripsRepository.findById(trip_id);

    if (!trip) {
      throw new ResourceNotFoundError();
    }

    const link = await this.linksRepository.create({
      title,
      url,
      trip_id,
    });

    return { link };
  }
}
