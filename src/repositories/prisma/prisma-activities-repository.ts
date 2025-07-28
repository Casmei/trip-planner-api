import type { Prisma } from "../../generated/prisma";
import { prisma } from "../../libs/prisma";
import type { ActivitiesRepository } from "../activities-respository";

export class PrismaActivitiesRepository implements ActivitiesRepository {
  async create(data: Prisma.ActivityUncheckedCreateInput) {
    return await prisma.activity.create({ data });
  }
  async findManyByTripId(tripId: string) {
    return await prisma.activity.findMany({ where: { trip_id: tripId } });
  }
}
