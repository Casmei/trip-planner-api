import { PrismaLinksRepository } from "../../../infrastructure/database/repositories/prisma/prisma-links-repository";
import { PrismaTripsRepository } from "../../../infrastructure/database/repositories/prisma/prisma-trips-repository";
import { FetchLinksUseCase } from "../fetch-links";

export function makeFetchLinksUseCase() {
  const prismaTripRepository = new PrismaTripsRepository();
  const prismaLinksRepository = new PrismaLinksRepository();

  return new FetchLinksUseCase(prismaTripRepository, prismaLinksRepository);
}
