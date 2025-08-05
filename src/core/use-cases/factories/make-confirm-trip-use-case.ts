import { PrismaParticipantsRepository } from "../../../infrastructure/database/repositories/prisma/prisma-participants-repository";
import { PrismaTripsRepository } from "../../../infrastructure/database/repositories/prisma/prisma-trips-repository";
import { BullMQMailQueue } from "../../../infrastructure/queue/bullmq-mail-queue";
import { ConfirmTripUseCase } from "../confirm-trip";

export function makeConfirmTripUseCase() {
  const prismaTripsRepository = new PrismaTripsRepository();
  const prismaParticipantRepository = new PrismaParticipantsRepository();
  const mailQueue = new BullMQMailQueue();

  const confirmTripUseCase = new ConfirmTripUseCase(
    prismaTripsRepository,
    prismaParticipantRepository,
    mailQueue,
  );

  return confirmTripUseCase;
}
