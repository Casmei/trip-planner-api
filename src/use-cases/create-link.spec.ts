import { beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryLinksRespository } from "../repositories/in-memory/in-memory-links-repository";
import { InMemoryTripsRespository } from "../repositories/in-memory/in-memory-trips-repository";
import { CreateLinkUseCase } from "./create-link";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let tripsRepository: InMemoryTripsRespository;
let linksRepository: InMemoryLinksRespository;
let sut: CreateLinkUseCase;

describe("Create Activity Use Case", () => {
  beforeEach(async () => {
    tripsRepository = new InMemoryTripsRespository();
    linksRepository = new InMemoryLinksRespository();
    sut = new CreateLinkUseCase(tripsRepository, linksRepository);

    await tripsRepository.create({
      id: "trip-01",
      destination: "Portugal",
      is_confirmed: true,
      starts_at: new Date("2025-08-01 18:00:00"),
      ends_at: new Date("2025-08-10 18:00:00"),
    });
  });

  it("should be able to create link", async () => {
    const { link } = await sut.execute({
      title: "Compra de passagens",
      url: "https://portugal-passagens.com.br",
      trip_id: "trip-01",
    });

    expect(link.id).toEqual(expect.any(String));
    expect(link.trip_id).toEqual("trip-01");
    expect(link.title).toEqual("Compra de passagens");
  });

  it("should throw if trip does not exist", async () => {
    await expect(() =>
      sut.execute({
        title: "Compra de passagens",
        url: "https://portugal-passagens.com.br",
        trip_id: "non-existent-trip",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
