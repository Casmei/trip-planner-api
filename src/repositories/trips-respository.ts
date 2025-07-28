import type { Prisma, Trip } from "../generated/prisma";

export type SimpleTripUpdateInput = {
  destination?: string;
  starts_at?: Date | string;
  ends_at?: Date | string;
};

export interface TripsRepository {
  confirm(tripId: string): Promise<Trip | null>;
  findById(tripId: string): Promise<Trip | null>;
  create(data: Prisma.TripCreateInput): Promise<Trip>;
  update(where: { id: string }, data: SimpleTripUpdateInput): Promise<Trip>;
}

// import { PrismaClient, type Trip } from "@prisma/client";
// import type { TripsRepository } from "../trips-repository";
// import type { SimpleTripUpdateInput } from "../../tipos/trip";

// const prisma = new PrismaClient();

// export class PrismaTripsRepository implements TripsRepository {
//   async update(where: { id: string }, data: SimpleTripUpdateInput): Promise<Trip> {
//     const prismaData: any = {};

//     if (data.destination !== undefined) {
//       prismaData.destination = { set: data.destination };
//     }
//     if (data.starts_at !== undefined) {
//       prismaData.starts_at = { set: new Date(data.starts_at) };
//     }
//     if (data.ends_at !== undefined) {
//       prismaData.ends_at = { set: new Date(data.ends_at) };
//     }

//     return prisma.trip.update({
//       where,
//       data: prismaData,
//     });
//   }
// }
