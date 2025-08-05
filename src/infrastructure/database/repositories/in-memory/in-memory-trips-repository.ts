import { randomUUID } from "node:crypto";
import type {
  SimpleTripUpdateInput,
  TripsRepository,
} from "../../../../core/repositories/trips-respository";
import type { Prisma, Trip } from "../../generated/prisma";

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

  async update(
    where: { id: string },
    data: SimpleTripUpdateInput,
  ): Promise<Trip> {
    const index = this.items.findIndex((item) => item.id === where.id);
    if (index === -1) throw new Error("Trip not found");

    const existing = this.items[index];

    const updated: Trip = {
      ...existing,
      destination: data.destination ?? existing.destination,
      starts_at: data.starts_at ? new Date(data.starts_at) : existing.starts_at,
      ends_at: data.ends_at ? new Date(data.ends_at) : existing.ends_at,
    };

    this.items[index] = updated;
    return updated;
  }
}
