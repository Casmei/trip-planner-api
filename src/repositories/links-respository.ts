import type { Link, Prisma } from "../generated/prisma";

export interface LinksRepository {
  create(data: Prisma.LinkUncheckedCreateInput): Promise<Link>;
}
