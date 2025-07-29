import dayjs from "dayjs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryActivitiesRespository } from "../repositories/in-memory/in-memory-activities-repository";
import { InMemoryTripsRespository } from "../repositories/in-memory/in-memory-trips-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { FetchActivitiesUseCase } from "./fetch-activities";

let tripsRepository: InMemoryTripsRespository;
let activitiesRepository: InMemoryActivitiesRespository;
let sut: FetchActivitiesUseCase;

describe("Fetch Activities Use Case", () => {
  beforeEach(async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 6, 20, 8, 0, 0));

    tripsRepository = new InMemoryTripsRespository();
    activitiesRepository = new InMemoryActivitiesRespository();
    sut = new FetchActivitiesUseCase(tripsRepository, activitiesRepository);

    await tripsRepository.create({
      id: "trip-01",
      destination: "Portugal",
      is_confirmed: true,
      starts_at: new Date("2025-08-01 18:00:00"),
      ends_at: new Date("2025-08-10 18:00:00"),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to list activities", async () => {
    await activitiesRepository.create({
      title: "Viajar para porto",
      occurs_at: new Date("2025-08-03 10:00:00"),
      trip_id: "trip-01",
    });

    const response = await sut.execute({ trip_id: "trip-01" });

    expect(response.activities).toEqual(expect.any(Array));
    expect(response.activities.length).toBe(10);

    const thirdDay = response.activities.find((item) =>
      dayjs(item.date).isSame("2025-08-03", "day"),
    );

    expect(thirdDay).toBeDefined();
    expect(thirdDay?.activities.length).toBe(1);
    expect(thirdDay?.activities[0].title).toBe("Viajar para porto");
  });

  it("should throw if trip does not exist", async () => {
    await expect(() =>
      sut.execute({ trip_id: "non-existent-trip" }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should return activities grouped by date in correct order and structure", async () => {
    await activitiesRepository.create({
      title: "Chegada em Lisboa",
      occurs_at: new Date("2025-08-01T12:00:00"),
      trip_id: "trip-01",
    });

    await activitiesRepository.create({
      title: "Passeio em Sintra",
      occurs_at: new Date("2025-08-02T09:00:00"),
      trip_id: "trip-01",
    });

    await activitiesRepository.create({
      title: "Dia livre",
      occurs_at: new Date("2025-08-02T15:00:00"),
      trip_id: "trip-01",
    });

    const response = await sut.execute({ trip_id: "trip-01" });

    expect(response.activities.length).toBe(10);

    const sorted = [...response.activities].sort(
      (a, b) => a.date.getTime() - b.date.getTime(),
    );
    expect(response.activities).toEqual(sorted);

    const day1 = response.activities[0];
    expect(dayjs(day1.date).isSame("2025-08-01", "day")).toBe(true);
    expect(day1.activities.length).toBe(1);
    expect(day1.activities[0].title).toBe("Chegada em Lisboa");

    const day2 = response.activities[1];
    expect(dayjs(day2.date).isSame("2025-08-02", "day")).toBe(true);
    expect(day2.activities.length).toBe(2);
    expect(day2.activities.map((a) => a.title)).toEqual(
      expect.arrayContaining(["Passeio em Sintra", "Dia livre"]),
    );
  });
});
