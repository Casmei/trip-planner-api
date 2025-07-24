import { beforeEach, describe, expect, it } from "vitest";
import { FakeMailQueue } from "../jobs/fake-mail-queue";
import { InMemoryParticipantsRespository } from "../repositories/in-memory/in-memory-participants-repository";
import { ConfirmParticipantUseCase } from "./confirm-participant";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let participantsRepository: InMemoryParticipantsRespository;
let fakeMailQueue: FakeMailQueue;
let sut: ConfirmParticipantUseCase;

describe("Confirm Trip Use Case", () => {
  beforeEach(async () => {
    participantsRepository = new InMemoryParticipantsRespository();
    fakeMailQueue = new FakeMailQueue();
    sut = new ConfirmParticipantUseCase(participantsRepository, fakeMailQueue);
  });

  it("should be able to confirm a participant", async () => {
    const participant = await participantsRepository.create({
      email: "fulano@detal.com",
      trip_id: "trip-01",
      name: "Fulano de tal",
    });

    const participantIsConfirmed = await sut.execute({
      participantId: participant.id,
    });

    const confirmation = await participantsRepository.findById(participant.id);

    expect(participantIsConfirmed).toBe(true);
    expect(confirmation?.is_confirmed).toEqual(true);
  });

  it("should not be able to confirm an inexistent participant", async () => {
    const sutPromise = sut.execute({ participantId: "inexistent-participant" });
    await expect(sutPromise).rejects.instanceOf(ResourceNotFoundError);
  });

  it("should return true if participant is already confirmed", async () => {
    const participant = await participantsRepository.create({
      email: "fulano@detal.com",
      trip_id: "trip-01",
      name: "Fulano de tal",
      is_confirmed: true,
    });

    const participantAlreadyConfirmated = await sut.execute({
      participantId: participant.id,
    });

    expect(participantAlreadyConfirmated).toBe(true);
  });
});
