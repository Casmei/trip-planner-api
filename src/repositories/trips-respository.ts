import type { Prisma, Trip } from "../generated/prisma";

export interface TripsRepository {
  confirm(tripId: string): Promise<Trip | null>;
  findById(tripId: string): Promise<Trip | null>;
  create(data: Prisma.TripCreateInput): Promise<Trip>;
}
