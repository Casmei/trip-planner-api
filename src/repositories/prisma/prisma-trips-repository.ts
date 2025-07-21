import type { Prisma } from "../../generated/prisma";
import { prisma } from "../../libs/prisma";
import type { TripsRepository } from "../trips-respository";

export class PrismaTripsRepository implements TripsRepository {
  async updateById(
    tripId: string,
    data: Prisma.XOR<Prisma.TripUpdateInput, Prisma.TripUncheckedUpdateInput>,
  ) {
    await prisma.trip.update({ where: { id: tripId }, data });
  }

  async findById(tripId: string) {
    return await prisma.trip.findUnique({
      where: { id: tripId },
    });
  }
  async create(data: Prisma.TripCreateInput) {
    const trip = await prisma.trip.create({ data });

    return trip;
  }
}
