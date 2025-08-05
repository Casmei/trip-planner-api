import { PrismaTripsRepository } from "../../../infrastructure/database/repositories/prisma/prisma-trips-repository";
import { GetTripDetailsUseCase } from "../get-trip-details";

export function makeGetTripDetailsUseCase() {
  const prismaTripRepository = new PrismaTripsRepository();
  return new GetTripDetailsUseCase(prismaTripRepository);
}
