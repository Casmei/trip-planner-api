import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryActivitiesRespository } from "../../infrastructure/database/repositories/in-memory/in-memory-activities-repository";
import { InMemoryTripsRespository } from "../../infrastructure/database/repositories/in-memory/in-memory-trips-repository";
import { CreateActivityUseCase } from "./create-activity";
import { InvalidActivityEndDateError } from "./errors/invalid-activity-end-date-error";
import { InvalidActivityStartDateError } from "./errors/invalid-activity-start-date-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let tripsRepository: InMemoryTripsRespository;
let activitiesRepository: InMemoryActivitiesRespository;
let sut: CreateActivityUseCase;

describe("Create Activity Use Case", () => {
  beforeEach(async () => {
    tripsRepository = new InMemoryTripsRespository();
    activitiesRepository = new InMemoryActivitiesRespository();
    sut = new CreateActivityUseCase(tripsRepository, activitiesRepository);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to create activity", async () => {
    vi.setSystemTime(new Date(2025, 6, 20, 8, 0, 0));

    const trip = await tripsRepository.create({
      destination: "Portugal",
      is_confirmed: true,
      starts_at: new Date("2025-08-01 18:00:00"),
      ends_at: new Date("2025-08-10 18:00:00"),
    });

    const { activity } = await sut.execute({
      title: "Viajar para porto",
      occurs_at: new Date("2025-08-03 10:00:00"),
      trip_id: trip.id,
    });

    expect(activity.id).toEqual(expect.any(String));
    expect(activity.trip_id).toEqual(trip.id);
  });

  it("should not be able to create activity before the trip's start date", async () => {
    vi.setSystemTime(new Date(2025, 6, 20, 8, 0, 0));

    const trip = await tripsRepository.create({
      destination: "Portugal",
      is_confirmed: true,
      starts_at: new Date("2025-08-01 18:00:00"),
      ends_at: new Date("2025-08-10 18:00:00"),
    });

    const sutPromise = sut.execute({
      title: "Viajar para porto",
      occurs_at: new Date("2025-07-20 10:00:00"),
      trip_id: trip.id,
    });

    await expect(() => sutPromise).rejects.toBeInstanceOf(
      InvalidActivityStartDateError,
    );
  });

  it("should not be able to create activity after the trip's end date", async () => {
    vi.setSystemTime(new Date(2025, 6, 20, 8, 0, 0));

    const trip = await tripsRepository.create({
      destination: "Portugal",
      is_confirmed: true,
      starts_at: new Date("2025-08-01 18:00:00"),
      ends_at: new Date("2025-08-10 18:00:00"),
    });

    const sutPromise = sut.execute({
      title: "Viajar para porto",
      occurs_at: new Date("2025-08-20 10:00:00"),
      trip_id: trip.id,
    });

    await expect(() => sutPromise).rejects.toBeInstanceOf(
      InvalidActivityEndDateError,
    );
  });

  it("should not be able to create activity an inexistent trip", async () => {
    const sutPromise = sut.execute({
      title: "Viajar para porto",
      occurs_at: new Date("2025-08-03 10:00:00"),
      trip_id: "inexistent-trip",
    });

    await expect(sutPromise).rejects.instanceOf(ResourceNotFoundError);
  });
});
