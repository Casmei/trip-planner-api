import { BullMQMailQueue } from "../../jobs/bullmq-mail-queue";
import { PrismaParticipantRepository } from "../../repositories/prisma/prisma-participant-repository";
import { PrismaTripsRepository } from "../../repositories/prisma/prisma-trips-repository";
import { ConfirmTripUseCase } from "../confirm-trip";

export function makeConfirmTripUseCase() {
  const prismaTripsRepository = new PrismaTripsRepository();
  const prismaParticipantRepository = new PrismaParticipantRepository();
  const mailQueue = new BullMQMailQueue();

  const confirmTripUseCase = new ConfirmTripUseCase(
    prismaTripsRepository,
    prismaParticipantRepository,
    mailQueue,
  );

  return confirmTripUseCase;
}
