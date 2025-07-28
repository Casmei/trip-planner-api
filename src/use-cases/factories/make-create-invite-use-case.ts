import { BullMQMailQueue } from "../../jobs/bullmq-mail-queue";
import { PrismaParticipantsRepository } from "../../repositories/prisma/prisma-participants-repository";
import { PrismaTripsRepository } from "../../repositories/prisma/prisma-trips-repository";
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
