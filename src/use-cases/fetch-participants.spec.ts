import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryParticipantsRespository } from "../repositories/in-memory/in-memory-participants-repository";
import { InMemoryTripsRespository } from "../repositories/in-memory/in-memory-trips-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { FetchParticipantsUseCase } from "./fetch-participants";

let tripsRepository: InMemoryTripsRespository;
let participantsRepository: InMemoryParticipantsRespository;
let sut: FetchParticipantsUseCase;

describe("Fetch Participants Use Case", () => {
  beforeEach(async () => {
    tripsRepository = new InMemoryTripsRespository();
    participantsRepository = new InMemoryParticipantsRespository();
    sut = new FetchParticipantsUseCase(tripsRepository, participantsRepository);

    await tripsRepository.create({
      id: "trip-01",
      destination: "Portugal",
      is_confirmed: true,
      starts_at: new Date("2025-08-01 18:00:00"),
      ends_at: new Date("2025-08-10 18:00:00"),
    });
  });

  it("should be able to list participants", async () => {
    await participantsRepository.create({
      name: "Tiago de Castro Lima",
      email: "casmei@protonmail.com",
      is_confirmed: true,
      trip_id: "trip-01",
    });

    await participantsRepository.create({
      name: "Fulano de Tal",
      email: "fulano@detal.com",
      is_confirmed: false,
      trip_id: "trip-01",
    });

    await participantsRepository.create({
      name: "Deltrano",
      email: "deltrano@detal.com",
      is_confirmed: true,
      trip_id: "trip-02",
    });

    const { participants } = await sut.execute({ trip_id: "trip-01" });

    expect(participants.length).toEqual(2);
    expect(participants).toEqual([
      expect.objectContaining({ name: "Tiago de Castro Lima" }),
      expect.objectContaining({ name: "Fulano de Tal" }),
    ]);
  });

  it("should throw if trip does not exist", async () => {
    await expect(() =>
      sut.execute({ trip_id: "non-existent-trip" }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
