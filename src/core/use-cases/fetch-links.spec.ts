import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryLinksRespository } from "../../infrastructure/database/repositories/in-memory/in-memory-links-repository";
import { InMemoryTripsRespository } from "../../infrastructure/database/repositories/in-memory/in-memory-trips-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { FetchLinksUseCase } from "./fetch-links";

let tripsRepository: InMemoryTripsRespository;
let linksRepository: InMemoryLinksRespository;
let sut: FetchLinksUseCase;

describe("Fetch Links Use Case", () => {
  beforeEach(async () => {
    tripsRepository = new InMemoryTripsRespository();
    linksRepository = new InMemoryLinksRespository();
    sut = new FetchLinksUseCase(tripsRepository, linksRepository);

    await tripsRepository.create({
      id: "trip-01",
      destination: "Portugal",
      is_confirmed: true,
      starts_at: new Date("2025-08-01 18:00:00"),
      ends_at: new Date("2025-08-10 18:00:00"),
    });
  });

  it("should be able to list links", async () => {
    await linksRepository.create({
      title: "Passagem para porto",
      url: "http://some-random-link.com",
      trip_id: "trip-01",
    });

    await linksRepository.create({
      title: "Go to coffe shop",
      url: "http://some-random-link.com",
      trip_id: "trip-01",
    });

    const { links } = await sut.execute({ trip_id: "trip-01" });

    expect(links).toEqual(expect.any(Array));
    expect(links.length).toBe(2);

    expect(links[0].title).toBe("Passagem para porto");
  });

  it("should throw if trip does not exist", async () => {
    await expect(() =>
      sut.execute({ trip_id: "non-existent-trip" }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
