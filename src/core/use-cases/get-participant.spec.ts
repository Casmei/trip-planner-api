import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryParticipantsRespository } from "../../infrastructure/database/repositories/in-memory/in-memory-participants-repository";
import { InMemoryTripsRespository } from "../../infrastructure/database/repositories/in-memory/in-memory-trips-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { GetParticipantUseCase } from "./get-participant";

let tripsRepository: InMemoryTripsRespository;
let participantsRepository: InMemoryParticipantsRespository;
let sut: GetParticipantUseCase;

describe("Get Participant Use Case", () => {
  beforeEach(async () => {
    tripsRepository = new InMemoryTripsRespository();
    participantsRepository = new InMemoryParticipantsRespository();
    sut = new GetParticipantUseCase(tripsRepository, participantsRepository);

    await tripsRepository.create({
      id: "trip-01",
      destination: "Portugal",
      is_confirmed: true,
      starts_at: new Date("2025-08-01 18:00:00"),
      ends_at: new Date("2025-08-10 18:00:00"),
    });
  });

  it("should be able to get a participant", async () => {
    const participantCreated = await participantsRepository.create({
      name: "Tiago de Castro Lima",
      email: "casmei@protonmail.com",
      is_confirmed: true,
      trip_id: "trip-01",
    });

    const { participant } = await sut.execute({
      tripId: "trip-01",
      participantId: participantCreated.id,
    });

    expect(participant.id).toEqual(expect.any(String));
    expect(participant.name).toEqual("Tiago de Castro Lima");
  });

  it("should throw if trip does not exist", async () => {
    const participantCreated = await participantsRepository.create({
      name: "Tiago de Castro Lima",
      email: "casmei@protonmail.com",
      is_confirmed: true,
      trip_id: "trip-01",
    });

    await expect(() =>
      sut.execute({
        tripId: "non-existent-trip",
        participantId: participantCreated.id,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should throw if participant does not exist", async () => {
    await expect(() =>
      sut.execute({
        tripId: "trip-01",
        participantId: "non-existent-participant",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
