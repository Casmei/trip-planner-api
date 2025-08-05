import type { ActivitiesRepository } from "../../../../core/repositories/activities-respository";
import { prisma } from "../../../../libs/prisma";
import type { Prisma } from "../../generated/prisma";

export class PrismaActivitiesRepository implements ActivitiesRepository {
  async create(data: Prisma.ActivityUncheckedCreateInput) {
    return await prisma.activity.create({ data });
  }
  async findManyByTripId(tripId: string) {
    return await prisma.activity.findMany({ where: { trip_id: tripId } });
  }
}
