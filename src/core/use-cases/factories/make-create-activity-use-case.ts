import { PrismaActivitiesRepository } from "../../../infrastructure/database/repositories/prisma/prisma-activities-repository";
import { PrismaTripsRepository } from "../../../infrastructure/database/repositories/prisma/prisma-trips-repository";
import { CreateActivityUseCase } from "../create-activity";

export function makeCreateActivityUseCase() {
  const prismaTripRepository = new PrismaTripsRepository();
  const prismaActivitiesRepository = new PrismaActivitiesRepository();

  return new CreateActivityUseCase(
    prismaTripRepository,
    prismaActivitiesRepository,
  );
}
