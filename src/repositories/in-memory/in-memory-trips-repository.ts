import { randomUUID } from "node:crypto";
import type { Prisma, Trip } from "../../generated/prisma";
import type { TripsRepository } from "../trips-respository";

export class InMemoryTripsRespository implements TripsRepository {
  public items: Trip[] = [];

  async findById(id: string) {
    const trip = this.items.find((item) => item.id === id);

    if (!trip) {
      return null;
    }

    return trip;
  }

  async create(data: Prisma.TripCreateInput) {
    const trip = {
      id: data.id ?? randomUUID(),
      destination: data.destination,
      is_confirmed: data.is_confirmed ?? false,
      starts_at: new Date(data.starts_at),
      ends_at: new Date(data.ends_at),
      created_at: new Date(),
      participants: data.participants?.createMany?.data,
    };

    this.items.push(trip);

    return trip;
  }

  async confirm(tripId: string): Promise<Trip | null> {
    const tripIndex = this.items.findIndex((item) => item.id === tripId);

    if (tripIndex >= 0) {
      this.items[tripIndex].is_confirmed = true;

      return this.items[tripIndex];
    }

    return null;
  }
}
