import { randomUUID } from "node:crypto";
import type { Link, Prisma } from "../../generated/prisma";
import type { LinksRepository } from "../links-respository";

export class InMemoryLinksRespository implements LinksRepository {
  public items: Link[] = [];

  async create(data: Prisma.LinkUncheckedCreateInput) {
    const link = {
      id: data.id ?? randomUUID(),
      title: data.title ?? null,
      url: data.url ?? null,
      trip_id: data.trip_id,
    };

    this.items.push(link);
    return link;
  }
}
