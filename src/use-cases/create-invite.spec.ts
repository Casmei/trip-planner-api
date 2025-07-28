import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FakeMailQueue } from "../jobs/fake-mail-queue";
import { InMemoryParticipantsRespository } from "../repositories/in-memory/in-memory-participants-repository";
import { InMemoryTripsRespository } from "../repositories/in-memory/in-memory-trips-repository";
import { CreateInviteUseCase } from "./create-invite";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let tripsRepository: InMemoryTripsRespository;
let participantsRepository: InMemoryParticipantsRespository;
let fakeMailQueue: FakeMailQueue;
let sut: CreateInviteUseCase;

describe("Create Invite Use Case", () => {
  beforeEach(async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 6, 20, 8, 0, 0));

    tripsRepository = new InMemoryTripsRespository();
    participantsRepository = new InMemoryParticipantsRespository();
    fakeMailQueue = new FakeMailQueue();
    sut = new CreateInviteUseCase(
      participantsRepository,
      tripsRepository,
      fakeMailQueue,
    );

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

  it("should be able to create a invite for trip", async () => {
    const { participant } = await sut.execute({
      participantEmail: "fulano@detal.com",
      tripId: "trip-01",
    });

    expect(participant.email).toEqual("fulano@detal.com");
    expect(participant.is_confirmed).toEqual(false);
  });

  it("should not be able to invite an inexistent trip", async () => {
    const sutPromise = sut.execute({
      participantEmail: "fulano@detal.com",
      tripId: "inexistent-trip",
    });

    await expect(sutPromise).rejects.instanceOf(ResourceNotFoundError);
  });
});
