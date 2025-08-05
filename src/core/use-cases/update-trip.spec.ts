import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryTripsRespository } from "../../infrastructure/database/repositories/in-memory/in-memory-trips-repository";
import { InvalidTripEndDateError } from "./errors/invalid-trip-end-date-error";
import { InvalidTripStartDateError } from "./errors/invalid-trip-start-date-error";
import { UpdateTripUseCase } from "./update-trip";

let tripsRepository: InMemoryTripsRespository;
let sut: UpdateTripUseCase;

describe("Update Trip Use Case", () => {
  beforeEach(async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 6, 20, 8, 0, 0));

    tripsRepository = new InMemoryTripsRespository();
    sut = new UpdateTripUseCase(tripsRepository);

    await tripsRepository.create({
      id: "trip-01",
      destination: "Portugal",
      starts_at: new Date("2025-08-01 18:00:00"),
      ends_at: new Date("2025-08-10 18:00:00"),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to update trip", async () => {
    const { trip } = await sut.execute({
      destination: "Alemanha",
      starts_at: new Date("2025-08-01 18:00:00"),
      ends_at: new Date("2025-08-10 18:00:00"),
      trip_id: "trip-01",
    });

    expect(trip.id).toEqual("trip-01");
    expect(trip.destination).toEqual("Alemanha");
  });

  it("should not be able to create trip with a start date in the past", async () => {
    vi.setSystemTime(new Date(2025, 6, 20, 8, 0, 0));

    const sutPromise = sut.execute({
      destination: "Portugal",
      starts_at: new Date("2025-07-10 18:00:00"),
      ends_at: new Date("2025-07-15 18:00:00"),
      trip_id: "trip-01",
    });

    await expect(() => sutPromise).rejects.toBeInstanceOf(
      InvalidTripStartDateError,
    );
  });

  it("should not be able to create trip with an end date before or equal to the start date", async () => {
    vi.setSystemTime(new Date(2025, 6, 20, 8, 0, 0));

    const sutPromise = sut.execute({
      destination: "Portugal",
      starts_at: new Date("2025-08-10 18:00:00"),
      ends_at: new Date("2025-07-15 18:00:00"),
      trip_id: "trip-01",
    });

    await expect(() => sutPromise).rejects.toBeInstanceOf(
      InvalidTripEndDateError,
    );
  });
});
