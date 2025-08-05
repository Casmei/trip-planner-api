import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryParticipantsRespository } from "../../infrastructure/database/repositories/in-memory/in-memory-participants-repository";
import { ConfirmParticipantUseCase } from "./confirm-participant";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let participantsRepository: InMemoryParticipantsRespository;
let sut: ConfirmParticipantUseCase;

describe("Confirm Trip Use Case", () => {
  beforeEach(async () => {
    participantsRepository = new InMemoryParticipantsRespository();
    sut = new ConfirmParticipantUseCase(participantsRepository);
  });

  it("should be able to confirm a participant", async () => {
    const { id: participantId } = await participantsRepository.create({
      email: "fulano@detal.com",
      trip_id: "trip-01",
      name: "Fulano de tal",
    });

    const { participant } = await sut.execute({
      participantId: participantId,
    });

    expect(participant.is_confirmed).toBe(true);
  });

  it("should not be able to confirm an inexistent participant", async () => {
    const sutPromise = sut.execute({ participantId: "inexistent-participant" });
    await expect(sutPromise).rejects.instanceOf(ResourceNotFoundError);
  });

  it("should return true if participant is already confirmed", async () => {
    const { id: participantId } = await participantsRepository.create({
      email: "fulano@detal.com",
      trip_id: "trip-01",
      name: "Fulano de tal",
      is_confirmed: true,
    });

    const { participant } = await sut.execute({
      participantId: participantId,
    });

    expect(participant.is_confirmed).toBe(true);
  });
});
