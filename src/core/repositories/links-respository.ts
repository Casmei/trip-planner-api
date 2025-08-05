import type {
  Link,
  Prisma,
} from "../../infrastructure/database/generated/prisma";

export interface LinksRepository {
  create(data: Prisma.LinkUncheckedCreateInput): Promise<Link>;
  findManyByTripId(tripId: string): Promise<Link[]>;
}
