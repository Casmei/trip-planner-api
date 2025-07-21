import { BullMQMailQueue } from "../../jobs/bullmq-mail-queue";
import { PrismaTripsRepository } from "../../repositories/prisma/prisma-trips-repository";
import { CreateTripUseCase } from "../create-trip";

export function makeCreateTripUseCase() {
  const prismaTripsRepository = new PrismaTripsRepository();
  const mailQueue = new BullMQMailQueue();

  const createTripUseCase = new CreateTripUseCase(
    prismaTripsRepository,
    mailQueue,
  );

  return createTripUseCase;
}
