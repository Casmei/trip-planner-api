import { PrismaLinksRepository } from "../../../infrastructure/database/repositories/prisma/prisma-links-repository";
import { PrismaTripsRepository } from "../../../infrastructure/database/repositories/prisma/prisma-trips-repository";
import { CreateLinkUseCase } from "../create-link";

export function makeCreateLinkUseCase() {
  const prismaTripRepository = new PrismaTripsRepository();
  const prismaLinksRepository = new PrismaLinksRepository();

  return new CreateLinkUseCase(prismaTripRepository, prismaLinksRepository);
}
