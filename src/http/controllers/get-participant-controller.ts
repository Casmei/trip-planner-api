import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { makeGetParticipantUseCase } from "../../use-cases/factories/make-get-participant-use-case";
import { errorMap } from "../error-map";

export async function getParticipant(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const confirmParticipantParamSchema = z.object({
    participantId: z.uuid(),
    tripId: z.uuid(),
  });

  const { participantId, tripId } = confirmParticipantParamSchema.parse(
    request.params,
  );

  const useCase = makeGetParticipantUseCase();

  try {
    const { participant } = await useCase.execute({ participantId, tripId });

    return reply.status(StatusCodes.OK).send(participant);
  } catch (error) {
    for (const [ErrorClass, { status, message }] of errorMap.entries()) {
      if (error instanceof ErrorClass) {
        return reply.status(status).send({ message });
      }
    }

    throw error;
  }
}
