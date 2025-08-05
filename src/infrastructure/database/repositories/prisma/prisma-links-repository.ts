import type { LinksRepository } from "../../../../core/repositories/links-respository";
import { prisma } from "../../../../libs/prisma";
import type { Prisma } from "../../generated/prisma";

export class PrismaLinksRepository implements LinksRepository {
  async create(data: Prisma.LinkUncheckedCreateInput) {
    return await prisma.link.create({ data });
  }
  async findManyByTripId(tripId: string) {
    return await prisma.link.findMany({ where: { trip_id: tripId } });
  }
}
