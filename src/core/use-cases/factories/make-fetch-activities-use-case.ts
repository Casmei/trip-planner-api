import { PrismaActivitiesRepository } from "../../../infrastructure/database/repositories/prisma/prisma-activities-repository";
import { PrismaTripsRepository } from "../../../infrastructure/database/repositories/prisma/prisma-trips-repository";
import { FetchActivitiesUseCase } from "../fetch-activities";

export function makeFetchActivitiesUseCase() {
  const prismaTripRepository = new PrismaTripsRepository();
  const prismaActivitiesRepository = new PrismaActivitiesRepository();

  return new FetchActivitiesUseCase(
    prismaTripRepository,
    prismaActivitiesRepository,
  );
}
