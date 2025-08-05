import { PrismaParticipantsRepository } from "../../../infrastructure/database/repositories/prisma/prisma-participants-repository";
import { PrismaTripsRepository } from "../../../infrastructure/database/repositories/prisma/prisma-trips-repository";
import { FetchParticipantsUseCase } from "../fetch-participants";

export function makeFetchParticipantsUseCase() {
  const prismaTripRepository = new PrismaTripsRepository();
  const prismaParticipantsRepository = new PrismaParticipantsRepository();

  return new FetchParticipantsUseCase(
    prismaTripRepository,
    prismaParticipantsRepository,
  );
}
