import { PrismaParticipantsRepository } from "../../../infrastructure/database/repositories/prisma/prisma-participants-repository";
import { PrismaTripsRepository } from "../../../infrastructure/database/repositories/prisma/prisma-trips-repository";
import { BullMQMailQueue } from "../../../infrastructure/queue/bullmq-mail-queue";
import { CreateInviteUseCase } from "../create-invite";

export function makeCreateInviteUseCase() {
  const prismaTripsRepository = new PrismaTripsRepository();
  const prismaParticipantsRepository = new PrismaParticipantsRepository();
  const mailQueue = new BullMQMailQueue();

  const createTripUseCase = new CreateInviteUseCase(
    prismaParticipantsRepository,
    prismaTripsRepository,
    mailQueue,
  );

  return createTripUseCase;
}
