import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FakeMailQueue } from "../jobs/fake-mail-queue";
import { InMemoryTripsRespository } from "../repositories/in-memory/in-memory-trips-repository";
import { CreateTripUseCase } from "./create-trip";
import { InvalidTripEndDateError } from "./errors/invalid-trip-end-date-error";
import { InvalidTripStartDateError } from "./errors/invalid-trip-start-date-error";

let tripRepository: InMemoryTripsRespository;
let fakeMailQueue: FakeMailQueue;
let sut: CreateTripUseCase;

describe("Create Trip Use Case", () => {
  beforeEach(async () => {
    tripRepository = new InMemoryTripsRespository();
    fakeMailQueue = new FakeMailQueue();
    sut = new CreateTripUseCase(tripRepository, fakeMailQueue);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to create trip", async () => {
    vi.setSystemTime(new Date(2025, 6, 20, 8, 0, 0));

    const { trip } = await sut.execute({
      destination: "Portugal",
      starts_at: new Date("2025-08-01 18:00:00"),
      ends_at: new Date("2025-08-10 18:00:00"),
      owner_name: "Tiago de Castro Lima",
      owner_email: "casmei@protonmail.com",
      emails_to_invite: ["ana@planner.com"],
    });

    expect(trip.id).toEqual(expect.any(String));
    expect(trip.is_confirmed).toEqual(false);
  });

  it("should not be able to create trip with a start date in the past", async () => {
    vi.setSystemTime(new Date(2025, 6, 20, 8, 0, 0));

    const sutPromise = sut.execute({
      destination: "Portugal",
      starts_at: new Date("2025-07-10 18:00:00"),
      ends_at: new Date("2025-07-15 18:00:00"),
      owner_name: "Tiago de Castro Lima",
      owner_email: "casmei@protonmail.com",
      emails_to_invite: ["ana@planner.com"],
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
      owner_name: "Tiago de Castro Lima",
      owner_email: "casmei@protonmail.com",
      emails_to_invite: ["ana@planner.com"],
    });

    await expect(() => sutPromise).rejects.toBeInstanceOf(
      InvalidTripEndDateError,
    );
  });

  it("should call sendTripConfirmationMail when trip is created", async () => {
    vi.setSystemTime(new Date(2025, 6, 20, 8, 0, 0));

    const sendMailSpy = vi.spyOn(fakeMailQueue, "sendTripConfirmationMail");

    await sut.execute({
      destination: "Portugal",
      starts_at: new Date("2025-08-01 18:00:00"),
      ends_at: new Date("2025-08-10 18:00:00"),
      owner_name: "Tiago de Castro Lima",
      owner_email: "casmei@protonmail.com",
      emails_to_invite: ["ana@planner.com"],
    });

    expect(sendMailSpy).toHaveBeenCalled();
    expect(sendMailSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        tripId: expect.any(String),
        destination: "Portugal",
        owner_email: "casmei@protonmail.com",
      }),
    );
  });
});
