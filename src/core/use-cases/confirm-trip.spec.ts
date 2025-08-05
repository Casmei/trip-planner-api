import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryParticipantsRespository } from "../../infrastructure/database/repositories/in-memory/in-memory-participants-repository";
import { InMemoryTripsRespository } from "../../infrastructure/database/repositories/in-memory/in-memory-trips-repository";
import { FakeMailQueue } from "../../infrastructure/queue/fake-mail-queue";
import { ConfirmTripUseCase } from "./confirm-trip";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let tripsRepository: InMemoryTripsRespository;
let participantsRepository: InMemoryParticipantsRespository;
let fakeMailQueue: FakeMailQueue;
let sut: ConfirmTripUseCase;

describe("Confirm Trip Use Case", () => {
  beforeEach(async () => {
    tripsRepository = new InMemoryTripsRespository();
    participantsRepository = new InMemoryParticipantsRespository();
    fakeMailQueue = new FakeMailQueue();
    sut = new ConfirmTripUseCase(
      tripsRepository,
      participantsRepository,
      fakeMailQueue,
    );

    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 6, 20, 8, 0, 0));

    await tripsRepository.create({
      id: "trip-01",
      destination: "Portugal",
      starts_at: new Date("2025-08-01 18:00:00"),
      ends_at: new Date("2025-08-10 18:00:00"),
    });

    await participantsRepository.create({
      email: "fulano@detal.com",
      trip_id: "trip-01",
      name: "Fulano de tal",
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to confirm a trip", async () => {
    const tripIsConfirmed = await sut.execute({ tripId: "trip-01" });

    const trip = await tripsRepository.findById("trip-01");
    expect(trip?.is_confirmed).toBe(true);
    expect(tripIsConfirmed).toEqual(true);
  });

  it("should not be able to confirm an inexistent trip", async () => {
    const sutPromise = sut.execute({ tripId: "inexistent-trip" });
    await expect(sutPromise).rejects.instanceOf(ResourceNotFoundError);
  });

  it("should not send email again if the trip is already confirmed", async () => {
    //twice confirmation
    await tripsRepository.confirm("trip-01");

    const sendSpy = vi.spyOn(
      fakeMailQueue,
      "sendTripParticipantsConfirmationMail",
    );

    await sut.execute({ tripId: "trip-01" });

    expect(sendSpy).not.toHaveBeenCalled();
  });
});
