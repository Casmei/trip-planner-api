import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryTripsRespository } from "../repositories/in-memory/in-memory-trips-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { GetTripDetailsUseCase } from "./get-trip-details";

let tripsRepository: InMemoryTripsRespository;
let sut: GetTripDetailsUseCase;

describe("Fetch Links Use Case", () => {
  beforeEach(async () => {
    tripsRepository = new InMemoryTripsRespository();
    sut = new GetTripDetailsUseCase(tripsRepository);

    await tripsRepository.create({
      id: "trip-01",
      destination: "Portugal",
      is_confirmed: true,
      starts_at: new Date("2025-08-01 18:00:00"),
      ends_at: new Date("2025-08-10 18:00:00"),
    });
  });

  it("should be able to get a trip", async () => {
    const { trip } = await sut.execute({ tripId: "trip-01" });

    expect(trip.id).toEqual(expect.any(String));
    expect(trip.destination).toEqual("Portugal");
  });

  it("should throw if trip does not exist", async () => {
    await expect(() =>
      sut.execute({ tripId: "non-existent-trip" }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
