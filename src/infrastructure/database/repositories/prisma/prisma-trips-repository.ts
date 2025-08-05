import type {
  SimpleTripUpdateInput,
  TripsRepository,
} from "../../../../core/repositories/trips-respository";
import { prisma } from "../../../../libs/prisma";
import type { Prisma, Trip } from "../../generated/prisma";

export class PrismaTripsRepository implements TripsRepository {
  async confirm(tripId: string): Promise<Trip | null> {
    return await prisma.trip.update({
      where: { id: tripId },
      data: { is_confirmed: true },
    });
  }

  async update(
    where: { id: string },
    data: SimpleTripUpdateInput,
  ): Promise<Trip> {
    const prismaData: any = {};

    if (data.destination !== undefined) {
      prismaData.destination = { set: data.destination };
    }
    if (data.starts_at !== undefined) {
      prismaData.starts_at = { set: new Date(data.starts_at) };
    }
    if (data.ends_at !== undefined) {
      prismaData.ends_at = { set: new Date(data.ends_at) };
    }

    return prisma.trip.update({
      where,
      data: prismaData,
    });
  }

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
