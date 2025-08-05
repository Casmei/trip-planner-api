import type {
  Prisma,
  Trip,
} from "../../infrastructure/database/generated/prisma";

export type SimpleTripUpdateInput = {
  destination?: string;
  starts_at?: Date | string;
  ends_at?: Date | string;
};

export interface TripsRepository {
  confirm(tripId: string): Promise<Trip | null>;
  findById(tripId: string): Promise<Trip | null>;
  create(data: Prisma.TripCreateInput): Promise<Trip>;
  update(where: { id: string }, data: SimpleTripUpdateInput): Promise<Trip>;
}
