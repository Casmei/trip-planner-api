import { PrismaTripsRepository } from "../../../infrastructure/database/repositories/prisma/prisma-trips-repository";
import { UpdateTripUseCase } from "../update-trip";

export function makeUpdateTripUseCase() {
  const prismaTripRepository = new PrismaTripsRepository();
  return new UpdateTripUseCase(prismaTripRepository);
}
