import { PrismaTripsRepository } from "../../../infrastructure/database/repositories/prisma/prisma-trips-repository";
import { BullMQMailQueue } from "../../../infrastructure/queue/bullmq-mail-queue";
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
