import { PrismaParticipantsRepository } from "../../repositories/prisma/prisma-participants-repository";
import { ConfirmParticipantUseCase } from "../confirm-participant";

export function makeConfirmParticipantUseCase() {
  const prismaParticipantsRepository = new PrismaParticipantsRepository();
  return new ConfirmParticipantUseCase(prismaParticipantsRepository);
}
