import type { Activity, Prisma } from "../generated/prisma";

export interface ActivitiesRepository {
  create(data: Prisma.ActivityUncheckedCreateInput): Promise<Activity>;
}
