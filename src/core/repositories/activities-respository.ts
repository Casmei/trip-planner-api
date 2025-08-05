import type {
  Activity,
  Prisma,
} from "../../infrastructure/database/generated/prisma";

export interface ActivitiesRepository {
  create(data: Prisma.ActivityUncheckedCreateInput): Promise<Activity>;
  findManyByTripId(tripId: string): Promise<Activity[]>;
}
