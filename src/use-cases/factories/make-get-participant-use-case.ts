import { PrismaParticipantsRepository } from "../../repositories/prisma/prisma-participants-repository";
import { PrismaTripsRepository } from "../../repositories/prisma/prisma-trips-repository";
import { GetParticipantUseCase } from "../get-participant";

export function makeGetParticipantUseCase() {
  const prismaTripRepository = new PrismaTripsRepository();
  const prismaParticipantsRepository = new PrismaParticipantsRepository();

  return new GetParticipantUseCase(
    prismaTripRepository,
    prismaParticipantsRepository,
  );
}
