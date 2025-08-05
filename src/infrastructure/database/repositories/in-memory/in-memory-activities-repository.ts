import { randomUUID } from "node:crypto";
import type { ActivitiesRepository } from "../../../../core/repositories/activities-respository";
import type { Activity, Prisma } from "../../generated/prisma";

export class InMemoryActivitiesRespository implements ActivitiesRepository {
  public items: Activity[] = [];

  async create(data: Prisma.ActivityUncheckedCreateInput) {
    const activity = {
      id: data.id ?? randomUUID(),
      title: data.title ?? null,
      occurs_at: new Date(data.occurs_at),
      trip_id: data.trip_id,
    };

    this.items.push(activity);

    return activity;
  }

  async findManyByTripId(tripId: string) {
    return this.items
      .filter((item) => item.trip_id === tripId)
      .sort((a, b) => {
        return a.occurs_at.getTime() - b.occurs_at.getTime();
      });
  }
}
